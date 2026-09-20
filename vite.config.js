import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { collectNetworkStatus, collectServiceHealth } from "./server/network-status.mjs";
import { createHostedArtifactManifest, loadDocsAuthority } from "./scripts/lib/docs-authority.mjs";
import { loadDocsLocales } from "./scripts/lib/docs-locales.mjs";

export default defineConfig({
  build: { manifest: true },
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
          response.end(JSON.stringify(await collectNetworkStatus({ detailed: new URL(request.url, "http://localhost").searchParams.get("view") !== "summary" })));
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
  const locales = loadDocsLocales(process.cwd(), authority.articles);
  const moduleId = "virtual:ynx-docs-authority";
  const resolvedId = `\0${moduleId}`;
  const localesModuleId = "virtual:ynx-docs-locales";
  const localesResolvedId = `\0${localesModuleId}`;
  const publicAuthority = {
    artifact: createHostedArtifactManifest(authority),
    // Route matching and search need metadata; full bodies remain in the
    // existing dynamic locale modules, including the English source locale.
    articles: authority.articles.map(({ markdown, html, ...metadata }) => metadata),
    productMetadata: authority.productMetadata,
    sourceLocale: locales.sourceLocale,
    requestedLocales: locales.requestedLocales,
    publishedLocales: locales.publishedLocales,
    direction: locales.direction,
    missingMatrix: locales.missingMatrix,
  };
  const localeModulePrefix = "virtual:ynx-docs-locale/";
  return {
    name: "ynx-docs-authority",
    resolveId(id) {
      if (id === moduleId) return resolvedId;
      if (id === localesModuleId) return localesResolvedId;
      if (id.startsWith(localeModulePrefix) && locales.byLocale[id.slice(localeModulePrefix.length)]) return `\0${id}`;
      return null;
    },
    load(id) {
      if (id === resolvedId) return `export default ${JSON.stringify(publicAuthority)};`;
      if (id === localesResolvedId) return `export default {${Object.keys(locales.byLocale).map((locale) => `${JSON.stringify(locale)}: () => import(${JSON.stringify(localeModulePrefix + locale)})`).join(",")}};`;
      if (id.startsWith(`\0${localeModulePrefix}`)) return `export default ${JSON.stringify(locales.byLocale[id.slice(localeModulePrefix.length + 1)])};`;
      return null;
    },
  };
}
