import test from "node:test";
import assert from "node:assert/strict";
import { YNX_6423, networkParams } from "../src/lib/api/ynxApi.js";

test("one website configuration defines the only supported YNX Testnet identity", () => {
  assert.deepEqual({
    cosmos: YNX_6423.cosmosChainId,
    numeric: YNX_6423.chainId,
    evm: YNX_6423.evmChainId,
    asset: YNX_6423.nativeCurrency.symbol,
    name: YNX_6423.networkName
  }, {
    cosmos: "ynx_6423-1",
    numeric: 6423,
    evm: "0x1917",
    asset: "YNXT",
    name: "YNX Testnet"
  });
  assert.equal(YNX_6423.mainnet, false);
});

test("wallet add-network parameters derive from the canonical 6423 source", () => {
  const params = networkParams();
  assert.equal(params.chainId, YNX_6423.evmChainId);
  assert.equal(params.chainName, YNX_6423.networkName);
  assert.equal(params.nativeCurrency.symbol, "YNXT");
  assert.equal(params.blockExplorerUrls[0], YNX_6423.services.explorer);
});
