import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createStandaloneServer } from '../server/standalone.mjs';
import { readWebsiteBuildIdentity } from '../lib/build-identity.mjs';

const configuration = JSON.parse(await fs.readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const fallbacks = configuration.rewrites.filter((rewrite) => rewrite.destination === '/');
// Vercel's documented rewrite syntax wraps negative lookahead in a capture group:
// https://vercel.com/docs/project-configuration/vercel-json#negative-lookahead
// These tests cover path semantics and local HTTP behavior; public Vercel headers
// and filesystem precedence must still be checked against the deployed release.
const fallback = fallbacks[0];
const matchesFallback = (target) => new RegExp(`^${fallback.source}$`).test(new URL(target, 'https://ynxweb4.com').pathname);
const missing = [
  '/assets/missing-AbCdEf12.js', '/assets/missing-AbCdEf12.css', '/assets/font-AbCdEf12.woff2',
  '/assets/missing', '/assets', '/releases/missing', '/docs-authority/packages/missing',
  '/document-library/rendered/missing.en.json', '/document-library/missing',
  '/learning-search/missing', '/third-party/missing', '/downloads/missing',
  '/api/missing', '/missing.js', '/favicon-missing.ico', '/missing.webmanifest',
];
const pages = ['/', '/manual?path=wallet&lang=ja', '/docs?doc=example.en', '/api', '/downloads',
  '/dapp/wallet/open-download', '/dapp/wallet/auth/callback', '/whitepaper', '/assets-explained'];
const identity = readWebsiteBuildIdentity({ YNX_WEBSITE_SOURCE_COMMIT: 'a'.repeat(40), YNX_WEBSITE_SOURCE_TREE: 'b'.repeat(40), YNX_WEBSITE_RELEASE: 'routing-test' });

test('the final Vercel fallback excludes missing static resources while preserving business page routes', async () => {
  assert.equal(fallbacks.length, 1);
  assert.equal(configuration.rewrites.at(-1), fallback);
  assert.ok(fallback.source.startsWith('/((?!'), 'use the documented capture-group lookahead syntax');
  assert.equal(configuration.cleanUrls, true);
  for (const target of missing) assert.equal(matchesFallback(target), false, target);
  for (const target of pages) assert.equal(matchesFallback(target), true, target);
  for (const entry of await fs.readdir(new URL('../public/', import.meta.url), { withFileTypes: true })) {
    if (entry.isDirectory()) assert.equal(matchesFallback(`/${entry.name}/missing`), false, `public directory ${entry.name}`);
    else assert.equal(matchesFallback(`/${entry.name}`), false, `public file ${entry.name}`);
  }
  assert.equal(matchesFallback('/build-identity.json'), false);
  assert.ok(configuration.rewrites.slice(0, -1).every((rewrite) => !matchesFallback(rewrite.source)), 'exact download and identity rewrites cannot be caught by the SPA fallback');
});

async function fixture(t) {
  const distRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ynx-static-routing-'));
  for (const [file, body] of Object.entries({
    'index.html': '<!doctype html><title>SPA homepage</title>',
    'docs.html': '<!doctype html><title>Prerendered docs</title>',
    '404.html': '<!doctype html><title>Resource not found</title>',
    'assets/existing-AbCdEf12.js': 'export const existing = true;',
    'assets/existing-AbCdEf12.css': 'body{color:blue}',
    'document-library/rendered/existing.en.json': '{"documentId":"existing"}',
    'releases/existing.zip': 'archive-fixture',
  })) {
    const target = path.join(distRoot, file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, body);
  }
  const server = await createStandaloneServer({ distRoot, sourceIdentity: identity, environment: {}, routingConfig: configuration });
  await server.listenStandalone(0);
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(distRoot, { recursive: true, force: true });
  });
  const request = (target, method = 'GET') => new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: server.address().port, path: target, method, agent: false }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.end();
  });
  return { request, distRoot };
}

test('actual standalone HTTP serves existing files and prerenders but returns no-store 404 for missing resources', async (t) => {
  const { request } = await fixture(t);
  for (const target of missing) {
    for (const method of ['GET', 'HEAD']) {
      const response = await request(target, method);
      assert.equal(response.status, 404, `${method} ${target}`);
      assert.match(response.headers['cache-control'], /no-store/, target);
      assert.doesNotMatch(response.body, /SPA homepage/, target);
      if (method === 'HEAD') assert.equal(response.body, '');
    }
  }
  for (const target of pages) assert.equal((await request(target)).status, 200, target);
  assert.match((await request('/docs')).body, /Prerendered docs/);
  for (const [target, mime, body] of [
    ['/assets/existing-AbCdEf12.js', /javascript/, 'export const existing = true;'],
    ['/assets/existing-AbCdEf12.css', /text\/css/, 'body{color:blue}'],
    ['/document-library/rendered/existing.en.json', /application\/json/, '{"documentId":"existing"}'],
    ['/releases/existing.zip', /application\/zip/, 'archive-fixture'],
  ]) {
    const response = await request(target);
    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'], mime);
    assert.equal(response.body, body);
  }
  assert.match((await request('/assets/existing-AbCdEf12.js')).headers['cache-control'], /immutable/);
});

test('exact remote downloads, retired 410, identity and redirects keep their configured behavior', async (t) => {
  const { request } = await fixture(t);
  for (const rewrite of configuration.rewrites.filter((entry) => entry.destination.startsWith('https://'))) {
    const response = await request(`${rewrite.source}?url=https://untrusted.invalid`);
    assert.equal(response.status, 302, rewrite.source);
    assert.equal(response.headers.location, rewrite.destination);
  }
  const retired = configuration.rewrites.find((entry) => entry.destination === '/api/retired-download');
  assert.ok(retired);
  assert.equal((await request(retired.source)).status, 410);
  const actualIdentity = await request('/build-identity.json');
  assert.deepEqual(JSON.parse(actualIdentity.body), identity);
  assert.match(actualIdentity.headers['cache-control'], /no-store/);
  const redirect = await request('/wallet?lang=ja');
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.location, '/dapp/wallet?lang=ja');
});

test('standalone still rejects arbitrary rewrite patterns and non-root use of the approved fallback pattern', async (t) => {
  const { distRoot } = await fixture(t);
  for (const rewrite of [{ source: '/((?!unsafe).*)', destination: '/' }, { source: fallback.source, destination: '/api/arbitrary' }]) {
    await assert.rejects(createStandaloneServer({ distRoot, sourceIdentity: identity, environment: {}, routingConfig: { rewrites: [rewrite] } }), /Rewrite sources must be exact paths/);
  }
});
