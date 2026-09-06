
export const LEARNING_SOURCE = "90643ffd38d970f526df99e96e818220330710f8";
export const LEARNING_SOURCE_DOWNLOAD = {
  url: "https://codeload.github.com/JiahaoAlbus/YNX-Chain/zip/90643ffd38d970f526df99e96e818220330710f8",
  filename: "YNX-Chain-90643ffd38d970f526df99e96e818220330710f8.zip",
  bytes: 107189776,
  sha256: "e761018c18a00b51d1e9f062a4ad2b93e9ea0cd093b9c68ebc371d47576ad7e7",
  verifiedAt: "2026-09-06T14:00:25.349609+00:00",
};
export const LEARNING_HASH_COMMANDS = {
  windows: 'Get-FileHash -Path "./' + LEARNING_SOURCE_DOWNLOAD.filename + '" -Algorithm SHA256',
  macos: 'shasum -a 256 "./' + LEARNING_SOURCE_DOWNLOAD.filename + '"',
  linux: 'sha256sum "./' + LEARNING_SOURCE_DOWNLOAD.filename + '"',
};
export function learningCommandFor(platform, key) { return platform === "windows" && LEARNING_WINDOWS_COMMANDS[key] ? LEARNING_WINDOWS_COMMANDS[key] : LEARNING_COMMANDS[key]; }
export const LEARNING_COMMANDS = {
  tools: "go version\ngit --version",
  source: `git clone https://github.com/JiahaoAlbus/YNX-Chain.git ynx-learning\ncd ynx-learning\ngit checkout --detach ${LEARNING_SOURCE}`,
  node: "go run ./cmd/ynx-chaind -network devnet -http 127.0.0.1:16420 -data-dir ./.local/learning-node",
  localStatus: "curl --connect-timeout 5 --max-time 12 --fail --show-error http://127.0.0.1:16420/status",
  publicStatus: "curl --connect-timeout 5 --max-time 12 --fail --show-error https://rpc.ynxweb4.com/status",
  chainId: `curl --connect-timeout 5 --max-time 12 --fail --show-error https://evm.ynxweb4.com -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'`,
  sdk: `node --input-type=module -e 'import {YNXClient, assertYNXTestnetSnapshot} from "./sdk/js/index.js"; const c = new YNXClient({restUrl:"https://rpc.ynxweb4.com",evmUrl:"https://evm.ynxweb4.com"}); const s = assertYNXTestnetSnapshot(await c.getChainSnapshot()); console.log(s.status.height, s.evmChainId);'`,
  sdkTest: "make sdk-check",
  consensus: "make -n consensus-quorum-check",
};

export const LEARNING_WINDOWS_COMMANDS = {
  localStatus: "Invoke-RestMethod -TimeoutSec 12 -Uri 'http://127.0.0.1:16420/status'",
  publicStatus: "Invoke-RestMethod -TimeoutSec 12 -Uri 'https://rpc.ynxweb4.com/status'",
  chainId: `$body = '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'\nInvoke-RestMethod -TimeoutSec 12 -Method Post -Uri 'https://evm.ynxweb4.com' -ContentType 'application/json' -Body $body`,
};

export const LEARNING_PATHS = [
  { id: "wallet", minutes: "15–25", steps: [
    { id: "install", href: "/dapp/wallet/open-download" }, { id: "account", href: "/dapp/wallet" },
    { id: "network", network: true }, { id: "faucet", href: "https://faucet.ynxweb4.com" },
    { id: "transaction", href: "https://explorer.ynxweb4.com" }, { id: "disconnect", href: "/dapp" },
  ] },
  { id: "node", minutes: "30–45", steps: [
    { id: "prepare", command: "tools", href: "https://go.dev/dl/" },
    { id: "source", command: "source", href: `https://github.com/JiahaoAlbus/YNX-Chain/tree/${LEARNING_SOURCE}` },
    { id: "start", command: "node" }, { id: "inspect", command: "localStatus" }, { id: "restart", command: "node" },
  ] },
  { id: "participate", minutes: "5–10", steps: [
    { id: "roles", href: "/status" }, { id: "access", href: "/support" }, { id: "lab", command: "consensus" },
  ] },
  { id: "develop", minutes: "20–40", steps: [
    { id: "workspace", href: "/dapp/code" }, { id: "read", command: "chainId" },
    { id: "sdk", command: "sdk" }, { id: "wallet", href: "/dapp/wallet" },
    { id: "test", command: "sdkTest" }, { id: "publish", href: "/docs" },
  ] },
];

export const GUIDE_UI_KEYS = ["eyebrow","choose","about","minutes","action","expected","help","mark","complete","reset","progressNote","next","previous","copy","copied","copyError","open","settings","networkName","networkId","rpc","symbol","decimals","explorer","localOnly","publicNetwork","source","docs","api","whitepapers","library","search","noResults","tryAgain","all","original","read","current","networkNotice","sourceNotice","readOnly","method","address","purpose","status","identity","inspect","assets","serviceStatus","clientRules","timeoutRule","identityRule","retryRule","evmRule","secretsRule","apiTitle","apiLead","interfaces","jsSdk","pySdk","sdkNotice","fullReference","platform","unavailable","local","network","learn","use","node","production","build","sourceZip","verifyPackage","zipHelp"];
export function guideUi(copy) { return Object.fromEntries(GUIDE_UI_KEYS.map((key,index)=>[key,copy.ui[index]])); }
