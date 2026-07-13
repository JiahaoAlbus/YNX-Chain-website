import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { collectNetworkStatus } from "./server/network-status.mjs";

export default defineConfig({
  plugins: [
    react(),
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
      }
    }
  ]
});
