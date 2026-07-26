import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const vendorRoot = "vendor/ynx-docs";
const requiredEntries = [
  "bundle-manifest.json",
  "docs/public/FAQ.md",
  "docs/public/PUBLIC_BRAND_FACTS.md",
  "docs/public/search/WHAT_IS_YNX_CHAIN.md",
  "docs/public/search/WHAT_IS_YNX_WEB4.md",
  "docs/public/search/WHAT_IS_YNXT.md",
  "docs/public/search/YNX_TESTNET_GUIDE.md",
  "release/facts/brand.json",
  "release/facts/faq.json",
  "release/public-product-metadata.json",
  "release/structured-data-suggestions.json",
];

export function loadDocsAuthority(root = websiteRoot) {
  const artifactPath = path.join(root, vendorRoot, "artifact-manifest.json");
  const artifact = readJson(artifactPath);
  if (artifact.schema !== "ynx-public-docs-artifact/v1") {
    throw new Error("unsupported YNX docs artifact schema");
  }
  if (artifact.productionSigned !== false || artifact.downloadHosted !== false) {
    throw new Error("vendored candidate overstates signing or hosted-download status");
  }

  const archivePath = path.join(root, vendorRoot, artifact.archive);
  const archive = fs.readFileSync(archivePath);
  if (archive.length !== artifact.bytes) throw new Error("YNX docs artifact byte count mismatch");
  if (sha256(archive) !== artifact.sha256) throw new Error("YNX docs artifact SHA-256 mismatch");

  const entries = readStoredZip(archive);
  const byName = new Map(entries.map((entry) => [entry.name, entry.data]));
  if (byName.size !== entries.length) throw new Error("YNX docs artifact has duplicate entries");
  for (const required of requiredEntries) {
    if (!byName.has(required)) throw new Error(`YNX docs artifact is missing ${required}`);
  }

  const bundle = JSON.parse(byName.get("bundle-manifest.json").toString("utf8"));
  if (bundle.schema !== "ynx-public-docs-bundle/v1") throw new Error("unsupported YNX docs bundle schema");
  if (bundle.sourceCommit !== artifact.sourceCommit) throw new Error("YNX docs source commit mismatch");
  const recorded = new Map(bundle.files.map((entry) => [entry.path, entry]));
  for (const [name, data] of byName) {
    if (name === "bundle-manifest.json") continue;
    const expected = recorded.get(name);
    if (!expected) throw new Error(`YNX docs bundle manifest omits ${name}`);
    if (expected.bytes !== data.length || expected.sha256 !== sha256(data)) {
      throw new Error(`YNX docs bundle entry mismatch: ${name}`);
    }
    recorded.delete(name);
  }
  if (recorded.size) throw new Error(`YNX docs bundle file is missing: ${recorded.keys().next().value}`);

  const articleEntries = entries
    .filter((entry) => entry.name.startsWith("docs/public/search/") && entry.name.endsWith(".md"))
    .sort((left, right) => left.name.localeCompare(right.name));
  articleEntries.push({ name: "docs/public/FAQ.md", data: byName.get("docs/public/FAQ.md") });
  const articles = articleEntries.map(({ name, data }) => parseArticle(name, data.toString("utf8")));

  return {
    artifact,
    bundle,
    articles,
    productMetadata: JSON.parse(byName.get("release/public-product-metadata.json").toString("utf8")),
    structuredData: JSON.parse(byName.get("release/structured-data-suggestions.json").toString("utf8")),
    entries,
  };
}

export function emitDocsAuthority(outputDirectory, root = websiteRoot) {
  const authority = loadDocsAuthority(root);
  fs.mkdirSync(outputDirectory, { recursive: true });
  for (const { name, data } of authority.entries) {
    const target = safeOutputPath(outputDirectory, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, data);
  }
  fs.copyFileSync(
    path.join(root, vendorRoot, "artifact-manifest.json"),
    path.join(outputDirectory, "artifact-manifest.json"),
  );
  return authority;
}

export function markdownToHtml(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const output = [];
  let index = 0;
  let inCode = false;
  let code = [];

  while (index < lines.length) {
    const line = lines[index];
    if (line.startsWith("```")) {
      if (inCode) {
        output.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      index += 1;
      continue;
    }
    if (inCode) {
      code.push(line);
      index += 1;
      continue;
    }
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      const text = line.slice(level).trim();
      output.push(`<h${level} id="${slugify(text)}">${inlineMarkdown(text)}</h${level}>`);
      index += 1;
      continue;
    }
    if (line.startsWith("|") && lines[index + 1]?.match(/^\|\s*:?-+/)) {
      const rows = [];
      rows.push(parseTableRow(line));
      index += 2;
      while (index < lines.length && lines[index].startsWith("|")) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      const [head, ...body] = rows;
      output.push(`<div class="authorityTableWrap"><table><thead><tr>${head.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^-\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^-\s+/, ""));
        index += 1;
      }
      output.push(`<ul>${items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      continue;
    }
    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{1,6}\s/.test(lines[index]) &&
      !/^-\s+/.test(lines[index]) &&
      !lines[index].startsWith("|") &&
      !lines[index].startsWith("```")
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    output.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
  }
  return output.join("\n");
}

function parseArticle(name, markdown) {
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (!title) throw new Error(`YNX docs article has no H1: ${name}`);
  const metadata = parseMetadataTable(markdown);
  const canonical = metadata.canonical || metadata["canonical route"];
  const route = canonical ? new URL(canonical).pathname : `/${slugify(title)}`;
  const description = metadata["meta description"] || firstParagraphAfterHeading(markdown, "Direct answer") || firstAnswer(markdown);
  return {
    sourcePath: name,
    route,
    title: metadata.title || title,
    h1: metadata.h1 || title,
    description,
    version: metadata.version || "candidate",
    effectiveDate: metadata["effective date"] || null,
    lastReviewed: metadata["last reviewed"] || null,
    evidenceSourceCommit: metadata["evidence source commit"] || null,
    markdown,
    html: markdownToHtml(markdown),
  };
}

function parseMetadataTable(markdown) {
  const result = {};
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = parseTableRow(line);
    if (cells.length !== 2 || /^-+$/.test(cells[0].replaceAll(":", "").trim())) continue;
    const key = cells[0].toLowerCase();
    if (key === "field" || key === "metadata") continue;
    result[key] = cells[1].replace(/^`|`$/g, "");
  }
  return result;
}

function firstParagraphAfterHeading(markdown, heading) {
  const match = markdown.match(new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$([\\s\\S]*?)(?=^##\\s|$)`, "mi"));
  return match?.[1]?.split(/\n\s*\n/).map((value) => value.replace(/\n/g, " ").trim()).find((value) => value && !value.startsWith("|")) || null;
}

function firstAnswer(markdown) {
  const body = markdown.replace(/^#.+$/m, "").replace(/\|[\s\S]*?\n\s*\n/, "");
  return body.split(/\n\s*\n/).map((value) => value.replace(/^#+\s+.*$/gm, "").replace(/\n/g, " ").trim()).find(Boolean) || "";
}

function inlineMarkdown(value) {
  let text = escapeHtml(value);
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const safeHref = href.startsWith("/") || href.startsWith("https://") ? href : "#";
    return `<a href="${escapeAttribute(safeHref)}">${label}</a>`;
  });
  return text;
}

function parseTableRow(line) {
  return line.split("|").slice(1, -1).map((cell) => cell.trim());
}

function readStoredZip(body) {
  const entries = [];
  let offset = 0;
  while (offset + 4 <= body.length && body.readUInt32LE(offset) === 0x04034b50) {
    if (offset + 30 > body.length) throw new Error("truncated YNX docs ZIP header");
    const flags = body.readUInt16LE(offset + 6);
    const method = body.readUInt16LE(offset + 8);
    const compressedSize = body.readUInt32LE(offset + 18);
    const uncompressedSize = body.readUInt32LE(offset + 22);
    const nameLength = body.readUInt16LE(offset + 26);
    const extraLength = body.readUInt16LE(offset + 28);
    if (flags !== 0x0800 || method !== 0 || compressedSize !== uncompressedSize) {
      throw new Error("YNX docs ZIP must use deterministic UTF-8 store mode");
    }
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataEnd > body.length) throw new Error("truncated YNX docs ZIP entry");
    const name = body.subarray(nameStart, nameStart + nameLength).toString("utf8");
    assertSafePath(name);
    entries.push({ name, data: Buffer.from(body.subarray(dataStart, dataEnd)) });
    offset = dataEnd;
  }
  if (!entries.length) throw new Error("YNX docs ZIP contains no entries");
  return entries;
}

function safeOutputPath(root, name) {
  assertSafePath(name);
  const target = path.resolve(root, name);
  const prefix = `${path.resolve(root)}${path.sep}`;
  if (!target.startsWith(prefix)) throw new Error(`unsafe YNX docs output path: ${name}`);
  return target;
}

function assertSafePath(name) {
  if (!name || name.startsWith("/") || name.endsWith("/") || name.split("/").includes("..") || name.includes("\\")) {
    throw new Error(`unsafe YNX docs entry path: ${name}`);
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
