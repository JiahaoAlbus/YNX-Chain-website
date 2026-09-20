import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import test from 'node:test';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
import { getProductPublicContract } from '../src/lib/productPublicContract.js';

const verifier = fs.readFileSync('scripts/verify.mjs', 'utf8');
const start = verifier.indexOf('// Exact public Web snapshots:');
const end = verifier.indexOf('// End exact public Web snapshots.');
assert.ok(start >= 0 && end > start, 'production Web evidence verifier boundaries must exist');
const productionContract = verifier.slice(start, end);
const registry = JSON.parse(fs.readFileSync('public/releases/ecosystem-release-registry.json', 'utf8'));
const snapshots = ['video', 'developer', 'explorer', 'monitor'];

// Exercise the production verifier against in-memory mutations, without changing source or evidence files.
function verifySnapshot(mutate = () => {}) {
  const records = structuredClone(registry.products);
  const byKey = new Map(records.map(record => [record.key, record]));
  const runtimes = new Map(snapshots.map(key => {
    const record = byKey.get(key);
    return [key, JSON.parse(fs.readFileSync(`public${record.publicWebRelease}`, 'utf8'))];
  }));
  mutate({ records: byKey, runtimes });
  const fileMap = new Map(snapshots.map(key => [`public${registry.products.find(record => record.key === key).publicWebRelease}`, runtimes.get(key)]));
  const failures = [];
  vm.runInNewContext(productionContract, {
    registryByKey: byKey,
    crypto,
    fs: { readFileSync(filename) { assert.ok(fileMap.has(filename), `unexpected evidence read ${filename}`); return JSON.stringify(fileMap.get(filename)); } },
    console: { error(message) { failures.push(message); } },
    process: { exit(code) { throw new Error(`verification exit ${code}: ${failures.join('; ')}`); } },
  }, { timeout: 1000 });
}

test('exact published Web snapshots pass together with unchanged Viewer and Developer evidence', () => verifySnapshot());

const mutations = [
  ['Explorer source substituted', ({ runtimes }) => { runtimes.get('explorer').sourceCommit = 'a'.repeat(40); }],
  ['Explorer tree substituted', ({ runtimes }) => { runtimes.get('explorer').sourceTree = 'b'.repeat(40); }],
  ['Explorer root response invented as index.html', ({ runtimes }) => { runtimes.get('explorer').publicFiles[0].path = 'index.html'; }],
  ['Explorer asset removed', ({ runtimes }) => { runtimes.get('explorer').publicFiles.pop(); }],
  ['Explorer bytes forged even with recalculated self-digest', ({ runtimes }) => {
    const r = runtimes.get('explorer'); r.publicFiles[0].bytes++;
    r.publicFileListSha256 = crypto.createHash('sha256').update(JSON.stringify(r.publicFiles.map(({ path, bytes, sha256 }) => ({ path, bytes, sha256 })))).digest('hex');
  }],
  ['Explorer claimed as hosted download', ({ records }) => { records.get('explorer').downloadHosted = true; }],
  ['Explorer invented installer artifact', ({ runtimes }) => { runtimes.get('explorer').artifactBytes = 1234; runtimes.get('explorer').artifactSha256 = 'c'.repeat(64); }],
  ['Explorer clipboard stub promoted to native proof', ({ runtimes }) => { runtimes.get('explorer').browserVerification.nativeClipboardWriteVerified = true; }],
  ['Monitor older source restored', ({ records }) => { records.get('monitor').commit = '5ff75b2e5dd15928da728f17567a68b16e1801fa'; }],
  ['Monitor public file hash changed', ({ runtimes }) => { runtimes.get('monitor').publicFiles[0].sha256 = '0'.repeat(64); }],
  ['Monitor server package changed', ({ runtimes }) => { runtimes.get('monitor').artifactBytes++; }],
  ['Monitor Wallet ZIP mislabeled as Monitor installer', ({ runtimes }) => { runtimes.get('monitor').walletDownloadVerification.monitorInstaller = true; }],
  ['Monitor Wallet ZIP URL changed', ({ runtimes }) => { runtimes.get('monitor').walletDownloadVerification.url = 'https://example.com/monitor.zip'; }],
  ['Monitor Wallet installation promoted', ({ runtimes }) => { runtimes.get('monitor').walletDownloadVerification.installed = true; }],
  ['Monitor raw failed aggregate overwritten', ({ runtimes }) => { runtimes.get('monitor').browserVerification.rawSixContextAggregatePassed = true; }],
  ['Monitor earlier intermittent timeout declared resolved', ({ runtimes }) => { runtimes.get('monitor').browserVerification.previousIntermittentTimeoutResolved = true; }],
  ['Monitor Central acceptance promoted', ({ records }) => { records.get('monitor').centralAccepted = true; }],
  ['Monitor full product acceptance promoted', ({ runtimes }) => { runtimes.get('monitor').fullProductAccepted = true; }],
  ['Monitor store release promoted', ({ runtimes }) => { runtimes.get('monitor').storeReleased = true; }],
];
for (const [name, mutate] of mutations) test(`public Web evidence rejects ${name}`, () => assert.throws(() => verifySnapshot(mutate), /verification exit 1/));

test('Explorer and Monitor Web evidence cannot enable a product installer in the public contract', () => {
  for (const key of ['explorer', 'monitor']) {
    const record = registry.products.find(record => record.key === key);
    const product = getCatalog().find(product => product.key === key);
    const contract = getProductPublicContract(product);
    assert.equal(product.release.commit, record.commit);
    assert.equal(product.release.productRelease.href, record.productRelease);
    assert.equal(contract.publicWebVerified, true);
    assert.equal(contract.downloadHostedVerified, false);
    assert.equal(contract.downloads.status, 'unavailable');
    assert.equal(contract.downloads.items.length, 0);
    assert.equal(contract.centralAccepted, false);
  }
});

test('exported metadata contains only public file and source evidence, without deployment internals', () => {
  for (const key of ['explorer', 'monitor']) {
    const record = registry.products.find(record => record.key === key);
    const text = fs.readFileSync(`public${record.publicWebRelease}`, 'utf8');
    assert.doesNotMatch(text, /\/Users\/|\/etc\/|\/opt\/|\/var\/|MainPID|EnvironmentFiles|candidateEnvironment|backupPath|unitProfile|configHashes/);
    const runtime = JSON.parse(text);
    assert.ok(runtime.evidenceBasis.records.length >= 4);
    for (const evidence of runtime.evidenceBasis.records) assert.match(evidence.sha256, /^[0-9a-f]{64}$/);
  }
});
