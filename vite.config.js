import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { collectNetworkStatus, collectServiceHealth } from "./server/network-status.mjs";
import { createHostedArtifactManifest, loadDocsAuthority } from "./scripts/lib/docs-authority.mjs";

export default defineConfig({
  plugins: [
    react(),
    docsAuthorityPlugin(),
    {
      name: "ynx-network-status",
      configureServer(server) {
        server.middlewares.use("/api/network/status", async (request, response, next) => {
          if (request.method !== "GET") return next();
          response.statusCode = 200;
          response.setHeader("content-type", "application/json; charset=utf-8");
          response.setHeader("cache-control", "no-store");
          response.end(JSON.stringify(await collectNetworkStatus()));
        });
        server.middlewares.use("/api/services/health", async (request, response, next) => {
          if (request.method !== "GET") return next();
          response.statusCode = 200;
          response.setHeader("content-type", "application/json; charset=utf-8");
          response.setHeader("cache-control", "no-store");
          response.end(JSON.stringify(await collectServiceHealth()));
        });
      }
    }
  ]
});

function docsAuthorityPlugin() {
  const authority = loadDocsAuthority();
  const moduleId = "virtual:ynx-docs-authority";
  const resolvedId = `\0${moduleId}`;
  const publicAuthority = {
    artifact: createHostedArtifactManifest(authority),
    articles: authority.articles,
    productMetadata: authority.productMetadata,
  };
  return {
    name: "ynx-docs-authority",
    resolveId(id) {
      return id === moduleId ? resolvedId : null;
    },
    load(id) {
      return id === resolvedId ? `export default ${JSON.stringify(publicAuthority)};` : null;
    },
  };
}
