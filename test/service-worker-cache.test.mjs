import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';
const CURRENT_CACHE = 'ynx-web-shell-v10-resource-mime';
const page = (body, headers = {}) => new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8', ...headers } });
const resource = (body, type = 'application/javascript', headers = {}) => new Response(body, { headers: { 'content-type': type, ...headers } });
const source = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
function worker(fetcher, { putFails = false } = {}) {
  const handlers = {}, stored = new Map();
  const context = {
    URL, Response, fetch: fetcher,
    self: { location: { origin: 'https://ynxweb4.com' }, addEventListener: (name, fn) => { handlers[name] = fn; } },
    caches: {
      open: async (name) => {
        assert.equal(name, CURRENT_CACHE, 'fetch must only read/write this website cache');
        return {
          match: async (req) => stored.get(req.url)?.clone(),
          delete: async (req) => stored.delete(req.url),
          put: async (req, res) => { if (putFails) throw Error('quota'); stored.set(req.url, res); },
        };
      },
      match: async () => { assert.fail('cross-DApp CacheStorage.match must never be used'); },
    },
  };
  vm.runInNewContext(source,context);
  const dispatch = (path, extras={}) => {
    let promise;
    handlers.fetch({request:{method:'GET',url:`https://ynxweb4.com${path}`,mode:'navigate',destination:'document',...extras},respondWith:(value)=>{promise=value;}});
    return promise;
  };
  return {dispatch,stored};
}
test('activation deletes only old website shell caches and preserves current and unrelated caches', async () => {
  const current = 'ynx-web-shell-v10-resource-mime';
  const old = ['ynx-web-shell-v6-faucet-runtime-recovery', 'ynx-web-shell-v8-static-performance', 'ynx-web-shell-v9-scoped-cleanup'];
  const unrelated = ['ynx-wallet-offline-v1', 'square-cache-v2', 'unknown-cache', 'ynx-web-shell', 'other-ynx-web-shell-v8'];
  const remaining = new Set([...old, current, ...unrelated]);
  const handlers = {};
  const deleted = [];
  let claimed = false;
  vm.runInNewContext(source, {
    self: {
      addEventListener: (name, handler) => { handlers[name] = handler; },
      clients: { claim: async () => {
        assert.deepEqual(deleted.sort(), old.slice().sort());
        claimed = true;
      } },
    },
    caches: {
      keys: async () => [...remaining],
      delete: async (key) => {
        // Make cleanup asynchronous so claim must await completed deletions.
        await Promise.resolve();
        deleted.push(key);
        return remaining.delete(key);
      },
    },
  });
  let activation;
  handlers.activate({ waitUntil: (promise) => { activation = promise; } });
  assert.ok(activation, 'activation must keep cleanup alive');
  await activation;
  assert.equal(claimed, true);
  assert.deepEqual([...remaining].sort(), [current, ...unrelated].sort());
});
test('runtime identity, API and explicit no-store requests always bypass the shell cache',()=>{
 const w=worker(()=>{throw Error('must bypass');});
 for(const [path,extras] of [['/build-identity.json',{}],['/api/network/status',{}],['/',{cache:'no-store'}]]) assert.equal(w.dispatch(path,extras),undefined);
});
test('cacheable shell navigation is network first and retains an offline shell fallback',async()=>{
 let offline=false;
 const w=worker(async()=>{if(offline) throw Error('offline'); return page('new homepage');});
 assert.equal(await (await w.dispatch('/')).text(),'new homepage');
 offline=true;
 assert.equal(await (await w.dispatch('/')).text(),'new homepage');
});
test('no-store response is served but never written to CacheStorage',async()=>{
 const w=worker(async()=>page('private response',{'cache-control':'no-store, max-age=0'}));
 assert.equal(await (await w.dispatch('/auth/callback')).text(),'private response');
 assert.equal(w.stored.size,0);
});

test('cache quota failure never replaces fresh network HTML with a stale fallback',async()=>{
 const w=worker(async()=>page('fresh network HTML'),{putFails:true});
 w.stored.set('https://ynxweb4.com/',page('stale cached HTML'));
 assert.equal(await (await w.dispatch('/')).text(),'fresh network HTML');
});

test('content-hashed assets reuse validated bytes under HTTP revalidation while new URLs and navigation fetch fresh bytes',async()=>{
 let reads=0;
 const w=worker(async(request)=>request.mode === 'navigate' ? page(`response-${++reads}`) : resource(`response-${++reads}`, 'application/javascript', { 'cache-control': 'public, max-age=0, must-revalidate' }));
 const asset={mode:'cors',destination:'script'};
 assert.equal(await (await w.dispatch('/assets/app-Abc12345.js',asset)).text(),'response-1');
 assert.equal(await (await w.dispatch('/assets/app-Abc12345.js',asset)).text(),'response-1');
 assert.equal(reads,1);
 assert.equal(await (await w.dispatch('/assets/app-New12345.js',asset)).text(),'response-2');
 assert.equal(await (await w.dispatch('/')).text(),'response-3');
 assert.equal(await (await w.dispatch('/')).text(),'response-4');
});

test('typed scripts, styles, fonts and images are cached; HTML under each resource URL is rejected', async () => {
  for (const [destination, path, mime] of [
    ['script', '/assets/chunk-AbCdEf12.js', 'text/javascript; charset=UTF-8'],
    ['style', '/assets/theme-AbCdEf12.css', 'text/css'],
    ['font', '/assets/font-AbCdEf12.woff2', 'font/woff2'],
    ['image', '/ynx-logo.png', 'image/png'],
  ]) {
    const request = { mode: 'cors', destination };
    const good = worker(async () => resource('valid resource', mime));
    assert.equal(await (await good.dispatch(path, request)).text(), 'valid resource');
    assert.equal(good.stored.size, 1, destination);
    let calls = 0;
    const wrong = worker(async (_, options) => {
      assert.equal(options?.cache, calls++ ? 'reload' : undefined);
      return page('<!doctype html>old homepage', { 'cache-control': 'public, max-age=31536000, immutable' });
    });
    assert.equal((await wrong.dispatch(path, request)).type, 'error', destination);
    assert.equal(calls, 2, 'one HTTP-cache bypass only');
    assert.equal(wrong.stored.size, 0);
  }
});

test('an HTTP-cached HTML chunk is retried once with reload and only valid JavaScript is stored', async () => {
  const optionsSeen = [];
  const w = worker(async (_, options) => {
    optionsSeen.push(options?.cache);
    return options?.cache === 'reload' ? resource('export const recovered = true;') : page('old homepage');
  });
  const path = '/assets/HomeExperience-AbCdEf12.js';
  const request = { mode: 'cors', destination: 'script' };
  assert.equal(await (await w.dispatch(path, request)).text(), 'export const recovered = true;');
  assert.deepEqual(optionsSeen, [undefined, 'reload']);
  assert.equal(await (await w.dispatch(path, request)).text(), 'export const recovered = true;');
  assert.equal(optionsSeen.length, 2, 'the corrected immutable resource is reused');
});

test('a poisoned current-cache chunk is evicted and starts with reload, with no retry loop', async () => {
  for (const recovered of [false, true]) {
    const path = '/assets/HomeExperience-AbCdEf12.js';
    let calls = 0;
    const w = worker(async (_, options) => {
      calls++;
      assert.equal(options?.cache, 'reload');
      return recovered ? resource('fixed JavaScript') : page('still the wrong homepage');
    });
    w.stored.set(`https://ynxweb4.com${path}`, page('poisoned HTML'));
    const response = await w.dispatch(path, { mode: 'cors', destination: 'script' });
    assert.equal(calls, 1);
    if (recovered) assert.equal(await response.text(), 'fixed JavaScript');
    else {
      assert.equal(response.type, 'error');
      assert.equal(w.stored.size, 0);
    }
  }
});

test('an offline fallback never returns poisoned MIME or another DApp cache entry', async () => {
  for (const [path, destination] of [['/assets/chunk-AbCdEf12.js', 'script'], ['/logo.png', 'image']]) {
    const w = worker(async () => { throw Error('offline'); });
    w.stored.set(`https://ynxweb4.com${path}`, page('wrong HTML'));
    assert.equal((await w.dispatch(path, { mode: 'cors', destination })).type, 'error');
    assert.equal(w.stored.size, 0);
    assert.equal((await w.dispatch('/not-in-own-cache', { mode: 'cors', destination })).type, 'error');
  }
});

test('missing MIME, wrong resource MIME, no-store and error-status entries are never cache hits', async () => {
  const path = '/assets/chunk-AbCdEf12.js';
  for (const cached of [
    new Response('missing MIME', { headers: { 'content-type': '' } }),
    resource('body{}', 'text/css'),
    resource('private JavaScript', 'application/javascript', { 'cache-control': 'no-store' }),
    new Response('missing', { status: 404, headers: { 'content-type': 'application/javascript' } }),
  ]) {
    const w = worker(async (_, options) => {
      assert.equal(options?.cache, 'reload');
      return resource('recovered');
    });
    w.stored.set(`https://ynxweb4.com${path}`, cached);
    assert.equal(await (await w.dispatch(path, { mode: 'cors', destination: 'script' })).text(), 'recovered');
  }
});

test('a correctly typed 404 or no-store network resource is served without being cached', async () => {
  for (const response of [
    new Response('missing', { status: 404, headers: { 'content-type': 'application/javascript', 'cache-control': 'public, max-age=31536000, immutable' } }),
    resource('private resource', 'application/javascript', { 'cache-control': 'no-store' }),
  ]) {
    const w = worker(async () => response);
    assert.equal((await w.dispatch('/assets/missing-AbCdEf12.js', { mode: 'cors', destination: 'script' })).status, response.status);
    assert.equal(w.stored.size, 0);
  }
});

test('direct static, evidence and download navigation bypasses the HTML shell worker', () => {
  const w = worker(() => { assert.fail('the browser must handle direct resource navigation'); });
  for (const path of [
    '/releases/ecosystem-release-registry.json', '/releases/public-runtime',
    '/document-library/rendered/example.en.json', '/docs-authority/packages/docs.zip',
    '/downloads/wallet/preview.apk', '/assets/main-AbCdEf12.js', '/ynx-logo.png',
    '/manifest.webmanifest', '/learning-search/index.json', '/third-party/LICENSE',
  ]) assert.equal(w.dispatch(path), undefined, path);
});
