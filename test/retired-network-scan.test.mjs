import assert from 'node:assert/strict';
import test from 'node:test';
import { findRetiredNetworkIdentity } from '../scripts/lib/retired-network.mjs';

const digest = '98f98129057544248c37a3df1615ba69c2d284997be59ae354b95910298f1f92';
test('complete SHA-256 values are not interpreted as retired network ids', () => {
  assert.equal(digest.length,64);
  for (const field of ['sha256','htmlSha256','sourceSha256']) assert.equal(findRetiredNetworkIdentity(JSON.stringify({[field]:digest})),null);
});
test('real retired identifiers remain rejected beside valid digests', () => {
  for (const identity of ['9102','0x238e','ynx_9102-1']) {
    assert.ok(findRetiredNetworkIdentity(JSON.stringify({sha256:digest,chainId:identity})));
    assert.ok(findRetiredNetworkIdentity(`const network = "${identity}";`));
  }
});
test('short, long, non-hex and unrelated fields do not receive the digest exemption', () => {
  for (const value of ['9102',digest.slice(1),digest+'0','z'+digest.slice(1)]) assert.equal(findRetiredNetworkIdentity(JSON.stringify({sha256:value})),'9102');
  assert.equal(findRetiredNetworkIdentity(JSON.stringify({description:digest})),'9102');
});
