import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transform } from 'esbuild';
import { DOCUMENT_LIBRARY, getDocumentById } from '../src/content/documentLibrary.js';
import * as bodyHelpers from '../src/lib/documentBody.js';
import * as libraryCopy from '../src/content/documentLibraryCopy.js';
import * as translationCopy from '../src/content/documentTranslationCopy.js';
import { renderDocumentMarkdown } from '../scripts/lib/document-markdown.mjs';

const root = new URL('../', import.meta.url);
const readBody = selection => JSON.parse(fs.readFileSync(new URL(`public${selection.url}`, root), 'utf8'));
const outline = headings => headings.map(({id, level}) => [id, level]);
const codeBlocks = markdown => [...markdown.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(match => match[1]);

test('published translations retain complete chapters and executable examples without loading other languages', async () => {
  let bodies = 0;
  for (const source of DOCUMENT_LIBRARY) {
    const original = readBody(bodyHelpers.selectDocumentBody(source, 'en'));
    const originalBytes = fs.readFileSync(new URL(`public${source.downloadUrl}`, root));
    assert.equal(crypto.createHash('sha256').update(originalBytes).digest('hex'), source.sha256);
    assert.equal(originalBytes.length, source.bytes);
    for (const locale of source.translatedBodyLocales) {
      const selection = bodyHelpers.selectDocumentBody(source, locale);
      assert.equal(selection.locale, locale);
      assert.equal(selection.isFallback, false);
      assert.equal(selection.isTranslated, true);
      assert.ok(selection.url.endsWith(`.${locale}.json`));
      const body = readBody(selection);
      await bodyHelpers.validateDocumentBody(body, source, selection, crypto.webcrypto.subtle);
      assert.deepEqual(outline(body.headings), outline(original.headings));
      assert.deepEqual(codeBlocks(body.markdown), codeBlocks(original.markdown));
      assert.equal(body.html, renderDocumentMarkdown(body.markdown, source.sourcePath, source.id, DOCUMENT_LIBRARY).html);
      assert.equal(Object.hasOwn(source, 'html'), false);
      assert.equal(Object.hasOwn(source.translations[locale], 'markdown'), false);
      bodies++;
    }
  }
  assert.ok(bodies >= 33);
});

test('untranslated selections explicitly resolve to the original and translation cache keys bind the translated digest', () => {
  const source = getDocumentById('whitepaper-ynx-chain-whitepaper');
  const selected = bodyHelpers.selectDocumentBody(source, 'zh-CN');
  const fallback = bodyHelpers.selectDocumentBody(source, 'not-a-locale');
  assert.equal(fallback.locale, 'en');
  assert.equal(fallback.url, source.bodyUrls.en);
  assert.equal(fallback.isFallback, true);
  assert.equal(fallback.isTranslated, false);
  const updated = structuredClone(source);
  updated.translations['zh-CN'].sha256 = 'f'.repeat(64);
  assert.notEqual(bodyHelpers.selectDocumentBody(updated, 'zh-CN').key, selected.key);
});

test('reader rejects altered translation bytes, wrong source identity and duplicate chapter ids', async () => {
  const source = getDocumentById('whitepaper-ynx-chain-whitepaper');
  const selection = bodyHelpers.selectDocumentBody(source, 'zh-CN');
  const body = readBody(selection);
  const changed = structuredClone(body);
  changed.markdown = changed.markdown.replace('2026-07-22', '2026-07-23');
  await assert.rejects(bodyHelpers.validateDocumentBody(changed, source, selection, crypto.webcrypto.subtle), /integrity/);
  await assert.rejects(bodyHelpers.validateDocumentBody({...body, html:body.html+'<p>Changed</p>'}, source, selection, crypto.webcrypto.subtle), /HTML integrity/);
  await assert.rejects(bodyHelpers.validateDocumentBody({...body, sourceSha256:'0'.repeat(64)}, source, selection), /identity/);
  await assert.rejects(bodyHelpers.validateDocumentBody({...body, locale:'en'}, source, selection), /identity/);
  await assert.rejects(bodyHelpers.validateDocumentBody({...body, headings:[body.headings[0],body.headings[0]]}, source, selection), /chapter/);
});

const source = fs.readFileSync(new URL('src/components/DocumentReader.jsx',root), 'utf8');
const transformed = (await transform(source,{loader:'jsx',format:'cjs'})).code;
const modules = {
  react:React,
  'lucide-react':Object.fromEntries(['ArrowDownToLine','BookOpen','ChevronDown','FileText'].map(name=>[name,()=>null])),
  '../lib/i18n.jsx':{useLocale:()=>({locale:'en'})},
  '../content/documentLibraryCopy.js':libraryCopy,
  '../content/documentTranslationCopy.js':translationCopy,
  '../lib/documentBody.js':bodyHelpers,
  '../pages/document-library.css':{},
};
const module={exports:{}};
vm.runInNewContext(transformed,{module,exports:module.exports,require:name=>{assert.ok(Object.hasOwn(modules,name),name);return modules[name];}});
const render=(id,locale)=>renderToStaticMarkup(React.createElement(module.exports.DocumentReader,{document:getDocumentById(id),locale}));

test('visible reader labels distinguish translated text from pending English and retain current operator guidance',()=>{
  for(const locale of ['zh-CN','zh-TW']){
    const html=render('whitepaper-ynx-chain-whitepaper',locale);
    const copy=libraryCopy.getDocumentLibraryCopy(locale),translated=translationCopy.getDocumentTranslationCopy(locale);
    assert.ok(html.includes(translated.translated));
    assert.ok(html.includes(translated.translationChecksum));
    assert.equal(html.includes(copy.translationPending),false);
  }
  const pending=render('guides-validator-guide','zh-CN');
  assert.ok(pending.includes(libraryCopy.getDocumentLibraryCopy('zh-CN').translationPending));
  assert.ok(pending.includes(translationCopy.getDocumentTranslationCopy('zh-CN').operatorNotice));
  assert.ok(pending.includes('/manual?path=participate&amp;lang=zh-CN'));
  for(const locale of ['en','zh-CN','zh-TW','ja','ko','es','fr','de','pt','ru','ar','id'])assert.equal(Object.values(translationCopy.getDocumentTranslationCopy(locale)).every(text=>typeof text==='string'&&text.trim()),true);
});
