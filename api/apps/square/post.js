import { getSquarePost, PublicError } from "../../../server/app-gateway.mjs";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "method not allowed" });
  }
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("X-Content-Type-Options", "nosniff");
  try {
    return response.status(200).json(await getSquarePost(request.query?.id));
  } catch (error) {
    const status = error instanceof PublicError ? error.status : 502;
    return response.status(status).json({ error: error.message || "Square unavailable" });
  }
}
