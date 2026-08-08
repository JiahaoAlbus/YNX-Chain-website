import { createHash } from "node:crypto";
import { open, readFile } from "node:fs/promises";

const [url, expectedBytesText, expectedDigest, outputPath] = process.argv.slice(2);
const expectedBytes = Number(expectedBytesText);
if (
  !/^https:\/\//.test(url || "") ||
  !Number.isSafeInteger(expectedBytes) ||
  expectedBytes < 1 ||
  !/^[0-9a-f]{64}$/.test(expectedDigest || "") ||
  !outputPath
) {
  throw new Error("Usage: url expectedBytes sha256 outputPath");
}

const chunkBytes = 4 * 1024 * 1024;
const ranges = [];
for (let start = 0; start < expectedBytes; start += chunkBytes) {
  ranges.push({ start, end: Math.min(expectedBytes - 1, start + chunkBytes - 1) });
}

const file = await open(outputPath, "w", 0o600);
await file.truncate(expectedBytes);
let cursor = 0;
let completed = 0;

async function worker() {
  while (true) {
    const index = cursor++;
    if (index >= ranges.length) return;
    const { start, end } = ranges[index];
    let lastError;
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        const response = await fetch(url, {
          headers: { range: `bytes=${start}-${end}` },
          redirect: "follow",
          signal: AbortSignal.timeout(180_000)
        });
        if (response.status !== 206) throw new Error(`range ${start}-${end} returned HTTP ${response.status}`);
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.byteLength !== end - start + 1) {
          throw new Error(`range ${start}-${end} returned ${bytes.byteLength} bytes`);
        }
        await file.write(bytes, 0, bytes.byteLength, start);
        completed += 1;
        process.stdout.write(`completed ${completed}/${ranges.length}\n`);
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < 5) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
    if (lastError) throw lastError;
  }
}

try {
  await Promise.all(Array.from({ length: Math.min(12, ranges.length) }, () => worker()));
} finally {
  await file.close();
}

const contents = await readFile(outputPath);
if (contents.byteLength !== expectedBytes) throw new Error(`download byte count mismatch: ${contents.byteLength}`);
const digest = createHash("sha256").update(contents).digest("hex");
if (digest !== expectedDigest) throw new Error(`download digest mismatch: ${digest}`);
console.log(JSON.stringify({ ok: true, bytes: contents.byteLength, digest, outputPath }, null, 2));
