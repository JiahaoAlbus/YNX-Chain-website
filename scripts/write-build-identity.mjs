import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readWebsiteBuildIdentity } from "../lib/build-identity.mjs";

export async function writeBuildIdentity({
  environment = process.env,
  outputPath = fileURLToPath(new URL("../dist/build-identity.json", import.meta.url)),
} = {}) {
  const identity = readWebsiteBuildIdentity(environment);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(identity, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o644,
  });
  return identity;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await writeBuildIdentity();
}
