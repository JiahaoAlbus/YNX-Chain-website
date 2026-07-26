#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { emitDocsAuthority, loadDocsAuthority } from "./lib/docs-authority.mjs";

const args = process.argv.slice(2);
const authority = loadDocsAuthority();

if (args.includes("--emit")) {
  const outputIndex = args.indexOf("--emit");
  const output = args[outputIndex + 1];
  if (!output) throw new Error("--emit requires an output directory");
  emitDocsAuthority(path.resolve(output));
}

if (args.includes("--verify-hosting")) {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "ynx-docs-hosting-"));
  try {
    emitDocsAuthority(output);
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
}

process.stdout.write(
  `YNX docs authority verified: ${authority.artifact.sourceCommit} (${authority.articles.length} public articles)\n`,
);
