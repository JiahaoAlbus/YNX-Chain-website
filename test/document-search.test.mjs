import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { documentSearchEntries } from "../src/lib/documentSearch.js";
import { DOCUMENT_LIBRARY } from "../src/content/documentLibrary.js";
import { getDocumentLibraryCopy } from "../src/content/documentLibraryCopy.js";
import { LEARNING_PATHS } from "../src/content/learningContent.js";
const locales=["en","zh-CN","zh-TW","ja","ko","es","fr","de","pt","ru","ar","id"];
test("document search uses translated titles and links to the same document and language",()=>{
  for(const locale of locales){const copy=getDocumentLibraryCopy(locale),entries=documentSearchEntries(DOCUMENT_LIBRARY,copy,locale);assert.equal(entries.length,47);
    entries.forEach((entry,index)=>{const url=new URL(entry.href,"https://ynxweb4.com");assert.equal(url.pathname,"/docs");assert.equal(url.searchParams.get("lang"),locale);assert.equal(url.searchParams.get("doc"),DOCUMENT_LIBRARY[index].id);assert.equal(entry.title,copy.documents[DOCUMENT_LIBRARY[index].id].title);assert.ok(entry.description);assert.equal(Object.hasOwn(entry,"html"),false);assert.equal(Object.hasOwn(entry,"markdown"),false);});
  }
});
test("every translated learning search result opens an existing path and step without loading full documents",()=>{
  for(const locale of locales){const entries=JSON.parse(fs.readFileSync(new URL(`../public/learning-search/${locale}.json`,import.meta.url),"utf8"));assert.equal(entries.length,24);
    for(const entry of entries){const url=new URL(entry.href,"https://ynxweb4.com"),path=LEARNING_PATHS.find(path=>path.id===url.searchParams.get("path"));assert.ok(path);assert.equal(url.searchParams.get("lang"),locale);assert.ok(entry.title&&entry.description);if(url.hash)assert.ok(path.steps.some(step=>url.hash===`#step-${path.id}-${step.id}`));assert.equal(Object.hasOwn(entry,"html"),false);}
  }
});
