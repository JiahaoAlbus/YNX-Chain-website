import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';
const source = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
function worker(fetcher, { putFails = false } = {}) {
  const handlers = {}, stored = new Map();
  const context = { URL, Response, fetch: fetcher, self: { location: { origin:'https://ynxweb4.com' }, addEventListener:(name,fn)=>{handlers[name]=fn;} }, caches: { open:async()=>({put:async(req,res)=>{if(putFails) throw Error("quota"); stored.set(req.url,res);}}), match:async(req)=>stored.get(req.url) } };
  vm.runInNewContext(source,context);
  const dispatch = (path, extras={}) => {
    let promise;
    handlers.fetch({request:{method:'GET',url:`https://ynxweb4.com${path}`,mode:'navigate',destination:'document',...extras},respondWith:(value)=>{promise=value;}});
    return promise;
  };
  return {dispatch,stored};
}
test('runtime identity, API and explicit no-store requests always bypass the shell cache',()=>{
 const w=worker(()=>{throw Error('must bypass');});
 for(const [path,extras] of [['/build-identity.json',{}],['/api/network/status',{}],['/',{cache:'no-store'}]]) assert.equal(w.dispatch(path,extras),undefined);
});
test('cacheable shell navigation is network first and retains an offline shell fallback',async()=>{
 let offline=false;
 const w=worker(async()=>{if(offline) throw Error('offline'); return new Response('new homepage');});
 assert.equal(await (await w.dispatch('/')).text(),'new homepage');
 offline=true;
 assert.equal(await (await w.dispatch('/')).text(),'new homepage');
});
test('no-store response is served but never written to CacheStorage',async()=>{
 const w=worker(async()=>new Response('private response',{headers:{'cache-control':'no-store, max-age=0'}}));
 assert.equal(await (await w.dispatch('/auth/callback')).text(),'private response');
 assert.equal(w.stored.size,0);
});

test('cache quota failure never replaces fresh network HTML with a stale fallback',async()=>{
 const w=worker(async()=>new Response('fresh network HTML'),{putFails:true});
 w.stored.set('https://ynxweb4.com/',new Response('stale cached HTML'));
 assert.equal(await (await w.dispatch('/')).text(),'fresh network HTML');
});

test('content-hashed assets reuse immutable cache while new URLs and navigation fetch fresh bytes',async()=>{
 let reads=0;
 const w=worker(async()=>new Response(`response-${++reads}`));
 const asset={mode:'cors',destination:'script'};
 assert.equal(await (await w.dispatch('/assets/app-Abc12345.js',asset)).text(),'response-1');
 assert.equal(await (await w.dispatch('/assets/app-Abc12345.js',asset)).text(),'response-1');
 assert.equal(reads,1);
 assert.equal(await (await w.dispatch('/assets/app-New12345.js',asset)).text(),'response-2');
 assert.equal(await (await w.dispatch('/')).text(),'response-3');
 assert.equal(await (await w.dispatch('/')).text(),'response-4');
});
