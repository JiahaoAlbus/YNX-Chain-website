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

test('Vercel uses the lockfile-exact install without bypassing source identity gates', async () => {
  assert.equal(configuration.installCommand, 'npm ci --no-audit --no-fund');
  assert.equal(configuration.buildCommand, 'npm run build');
  const [build, identityGate] = await Promise.all([
    fs.readFile(new URL('../deploy/production-build.sh', import.meta.url), 'utf8'),
    fs.readFile(new URL('../deploy/source-identity.sh', import.meta.url), 'utf8'),
  ]);
  assert.match(build, /source deploy\/source-identity\.sh/);
  assert.match(identityGate, /status --porcelain=v1 --untracked-files=normal/);
  assert.match(identityGate, /Website production build requires a clean Git worktree/);
  assert.match(identityGate, /VERCEL_GIT_COMMIT_SHA:-.*website_commit/);
  assert.match(identityGate, /website_dirty_paths.*== " M vercel\.json"/);
  assert.match(identityGate, /verify-vercel-config-equivalence\.mjs/);
  assert.doesNotMatch(identityGate, /git (?:reset|clean|checkout)/);
});

test('current Wallet Web paths promote only exact Chrome/Edge 0.1.2 and retain 0.1.1 rollback paths', () => {
  const current = [
    ['35a1755777ab0c7472c1a81910f9e127f81d19d5e387238a7e0ef6afc1f1cafb', 'ynx-wallet-chrome-edge-0.1.2.zip'],
  ];
  const retained = [
    ['6e7e6dd17e9e729a44ed915e46433124c1a3794e06a0d072c55097084cc45e13', 'ynx-wallet-web-pwa-0.1.1.zip'],
    ['09066d82a94cb6b8108120f980ab2cc40c42dc830ffce166529cbd570eb6a6b2', 'ynx-wallet-chrome-edge-0.1.1.zip'],
    ['6ac256415c34b4b492dc6094be8be8c9f0acf6a40653e2e18fde64dd20f801e0', 'ynx-wallet-firefox-0.1.1.zip']
  ];
  const previous = [
    ['ed841dd13d04d9fe3b335c040d6859cd59326432376d4390943b573920786186', 'ynx-wallet-web-pwa-0.1.1.zip'],
    ['6e8094cc4031aad706d930b09fcf8297cb6bd004a0352a4d9fbd984c3ad3a2bd', 'ynx-wallet-chrome-edge-0.1.1.zip'],
    ['ed5bdc6c195b1598900a175ff2e294c6529dbca9130ddffde980abdcf29711f5', 'ynx-wallet-firefox-0.1.1.zip'],
  ];
  const bySource = new Map(configuration.rewrites.map((rewrite) => [rewrite.source, rewrite.destination]));
  for (const [sha256, filename] of current) assert.equal(
    bySource.get(`/downloads/wallet-web/sha256-${sha256}/${filename}`),
    `https://github.com/JiahaoAlbus/YNX-Chain/releases/download/wallet-web-testnet-preview-0.1.2-767a05d56/${filename}`,
  );
  for (const [sha256, filename] of retained) assert.equal(
    bySource.get(`/downloads/wallet-web/sha256-${sha256}/${filename}`),
    `https://github.com/JiahaoAlbus/YNX-Chain/releases/download/wallet-web-testnet-preview-0.1.1-c93e16be8/${filename}`,
  );
  for (const [sha256, filename] of previous) assert.equal(
    bySource.get(`/downloads/wallet-web/sha256-${sha256}/${filename}`),
    `https://github.com/JiahaoAlbus/YNX-Chain/releases/download/wallet-web-testnet-preview-0.1.1-b04765f11/${filename}`,
  );
});

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
  for (const key of ['exchange', 'quant']) {
    const professional = await request(`/${key}?lang=ja`);
    assert.equal(professional.status, 307);
    assert.equal(professional.headers.location, `https://${key}.ynxweb4.com/?lang=ja`);
  }
});

test('standalone still rejects arbitrary rewrite patterns and non-root use of the approved fallback pattern', async (t) => {
  const { distRoot } = await fixture(t);
  for (const rewrite of [{ source: '/((?!unsafe).*)', destination: '/' }, { source: fallback.source, destination: '/api/arbitrary' }]) {
    await assert.rejects(createStandaloneServer({ distRoot, sourceIdentity: identity, environment: {}, routingConfig: { rewrites: [rewrite] } }), /Rewrite sources must be exact paths/);
  }
});

// Vercel applies this path rule to missing resources too, so it must not make a 404 immutable.
test('Vercel asset-path headers require revalidation for both existing and missing resources', () => {
  const rules = configuration.headers.filter((rule) => rule.source === '/assets/:path*');
  assert.equal(rules.length, 1);
  const controls = rules[0].headers.filter((header) => header.key.toLowerCase() === 'cache-control');
  assert.equal(controls.length, 1);
  assert.deepEqual(controls[0].value.split(',').map((value) => value.trim().toLowerCase()), ['public', 'max-age=0', 'must-revalidate']);
  assert.doesNotMatch(controls[0].value, /immutable/i);
});
