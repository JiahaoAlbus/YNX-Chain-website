# Standalone website candidate

This directory contains a deployment template. It does not install a service, change a proxy, or publish a website. The coordinating owner controls SSH, candidate launch, public routing, and rollback.

Use Node.js 22 or newer. The server uses only Node built-ins and a fixed set of copied application modules; no `npm install` is needed on the host. Bind to `127.0.0.1:18880` behind the host's existing TLS reverse proxy. Any other `HOST` is rejected.

Freeze the release identity as the existing `ynx.website.build-identity.v1` JSON schema, with exact `sourceCommit`, `sourceTree`, `release`, `chainId: 6423`, `chainIdHex: "0x1917"`, and `nativeAsset: "YNXT"`. Alternatively provide `YNX_WEBSITE_SOURCE_COMMIT`, `YNX_WEBSITE_SOURCE_TREE`, and `YNX_WEBSITE_RELEASE`. The server validates and freezes these values at startup. Do not label dirty or unrelated files with an old source identity.

Package an already reviewed build into a **new** output directory:

```sh
YNX_WEBSITE_IDENTITY_FILE=/absolute/source-identity.json node scripts/package-standalone.mjs /absolute/existing-dist /absolute/new-candidate
```

The script does not build or modify the input dist. It streams copies and SHA-256 hashes, then creates Brotli and gzip sidecars sequentially for text files between 256 bytes and 8 MiB. It never compresses installers, archives, PDFs, or raster images. A failed package is incomplete; select a fresh output directory for a new attempt. `package-manifest.json` is written last. Preserve the entire package; source identity and asset manifests stay outside the public dist directory.

Start the package locally:

```sh
cd /absolute/new-candidate
HOST=127.0.0.1 PORT=18880 YNX_WEBSITE_IDENTITY_FILE=./source-identity.json node --max-old-space-size=256 server/standalone.mjs ./dist
```

The systemd template assumes the reviewed package is placed at `/opt/ynx-website/candidate` and Node is `/usr/bin/node`. The release must be readable by the service's dynamic user and remain read-only while running. The template enforces 512 MiB maximum memory, one CPU, 32 tasks, and 256 file descriptors. The application limits active requests to 32, active status collections to 4, connections to 128, and file-stream buffers to 64 KiB. Disconnected clients do not release a status-work slot until its collection ends. Collection concurrency and timeouts are separately bounded by the existing network-status module.

`/health` reports only server liveness. `/build-identity.json` reports the frozen release. Both status APIs remain uncached and use existing source collectors. The fixed App health, Square read, Explorer resolve and economics APIs reuse their original handlers; arbitrary proxy routes are not supported. `/api` remains the HTML reference page. HEAD does not trigger upstream status reads. There is no generic proxy: fixed external download rewrites from `vercel.json` become exact 302 redirects with the configured destination unchanged. Retired downloads return 410. Unknown API paths return JSON 404. Static HTML revalidates; hashed assets are immutable; identity/API/errors are `no-store`. Existing CSP and security headers are retained. Large files stream with HEAD, single byte ranges, ETag/304, and If-Range support. Compression is never performed in a request.

Before public routing changes, the coordinating owner should read back localhost health, identity, HTML, a nested prerendered route, SVG/ICO MIME, compressed JS, a small Range from a large installer, and both status APIs. Compare source identity and package SHA-256 records, then verify the same public paths after any authorized proxy change. Keep the prior upstream and package available for rollback. Local tests and a listening candidate do not establish public performance or usability.
