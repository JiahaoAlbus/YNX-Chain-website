import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { DOCUMENT_LIBRARY } from '../src/content/documentLibrary.js';
import { renderDocumentMarkdown } from './lib/document-markdown.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const directory = path.join(root, 'public/document-library/translations');
const locales = new Set(['zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'id']);
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const codeBlocks = text => [...text.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(match => match[1]);
const outline = headings => headings.map(heading => [heading.id, heading.level]);
const locale = process.argv[2] === '--locale' ? process.argv[3] : null;
if (process.argv.length > 2 && !locales.has(locale)) throw new Error('Use --locale followed by a supported translation locale, or no arguments to index existing files.');

if (locale) {
  for (const source of DOCUMENT_LIBRARY) {
    const file = path.join(directory, `${source.id}.${locale}.md`);
    if (!fs.existsSync(file)) continue;
    const markdown = fs.readFileSync(file, 'utf8');
    const rendered = renderDocumentMarkdown(markdown, source.sourcePath, source.id, DOCUMENT_LIBRARY);
    const translated = {
      documentId: source.id, locale, sourceLocale: source.sourceLocale,
      sourceSha256: source.sha256, translationStatus: 'translated-draft',
      translationOfVersion: source.version, translatedSha256: digest(markdown), markdown, ...rendered,
    };
    fs.writeFileSync(path.join(directory, `${source.id}.${locale}.json`), JSON.stringify(translated) + '\n');
  }
}

const translations = {};
for (const filename of fs.readdirSync(directory).filter(name => name.endsWith('.json')).sort()) {
  const body = JSON.parse(fs.readFileSync(path.join(directory, filename), 'utf8'));
  const source = DOCUMENT_LIBRARY.find(document => document.id === body.documentId);
  assert.ok(source, `Unknown document: ${filename}`);
  assert.ok(locales.has(body.locale), `Unknown locale: ${filename}`);
  assert.equal(filename, `${source.id}.${body.locale}.json`);
  assert.equal(body.sourceSha256, source.sha256, `Source digest: ${filename}`);
  assert.equal(body.sourceLocale, source.sourceLocale, `Source language: ${filename}`);
  assert.equal(body.translationOfVersion, source.version, `Source version: ${filename}`);
  assert.equal(body.translationStatus, 'translated-draft', `Translation status: ${filename}`);
  assert.equal(body.translatedSha256, digest(body.markdown), `Translation digest: ${filename}`);
  const originalBytes = fs.readFileSync(path.join(root, 'public', source.downloadUrl));
  assert.equal(digest(originalBytes), source.sha256, `Original changed: ${filename}`);
  const original = JSON.parse(fs.readFileSync(path.join(root, 'public', source.bodyUrls.en), 'utf8'));
  assert.deepEqual(outline(body.headings), outline(original.headings), `Chapter identity: ${filename}`);
  assert.deepEqual(codeBlocks(body.markdown), codeBlocks(original.markdown), `Code examples: ${filename}`);
  const rendered = renderDocumentMarkdown(body.markdown, source.sourcePath, source.id, DOCUMENT_LIBRARY);
  assert.deepEqual(body.headings, rendered.headings, `Translated headings: ${filename}`);
  assert.equal(body.html, rendered.html, `Rendered document: ${filename}`);
  translations[source.id] ||= {};
  translations[source.id][body.locale] = {
    bodyUrl: `/document-library/translations/${filename}`,
    sha256: body.translatedSha256, htmlSha256: digest(body.html), bytes: Buffer.byteLength(body.markdown),
    sourceSha256: source.sha256, version: source.version, status: body.translationStatus,
  };
}
fs.writeFileSync(path.join(root, 'src/content/documentTranslations.js'), '// Translation body metadata only; each body is fetched on demand.\nexport const DOCUMENT_TRANSLATIONS = ' + JSON.stringify(translations, null, 2) + ';\n');
fs.writeFileSync(path.join(root, 'public/document-library/translations-manifest.json'), JSON.stringify({ schema: 'ynx-document-translations/v1', sourceLocale: 'en', translations }, null, 2) + '\n');
console.log(JSON.stringify({ documents: Object.keys(translations).length, bodies: Object.values(translations).reduce((sum, entries) => sum + Object.keys(entries).length, 0), locales: [...new Set(Object.values(translations).flatMap(entries => Object.keys(entries)))] }));
