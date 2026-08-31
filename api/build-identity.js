import {
  BuildIdentityUnavailableError,
  readWebsiteBuildIdentity,
} from "../lib/build-identity.mjs";

function setIdentityHeaders(response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("X-Content-Type-Options", "nosniff");
}

export function createBuildIdentityHandler(environmentSource = () => process.env) {
  return function buildIdentityHandler(request, response) {
    setIdentityHeaders(response);

    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      return response.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    try {
      return response.status(200).json(readWebsiteBuildIdentity(environmentSource()));
    } catch (error) {
      if (error instanceof BuildIdentityUnavailableError) {
        return response.status(503).json({
          error: "BUILD_IDENTITY_UNAVAILABLE",
          issues: error.issues,
        });
      }
      return response.status(503).json({ error: "BUILD_IDENTITY_UNAVAILABLE" });
    }
  };
}

export default createBuildIdentityHandler();
