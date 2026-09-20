export const YNX_EVM_CHAIN_ID = "0x1917";

export const LEGACY_LOCAL_SIGNER_KEYS = Object.freeze([
  "ynx.browser-signer.v1",
  "ynx.browser-signer.backup-confirmed.v1",
]);

const canonicalKinds = Object.freeze({
  ynx: Object.freeze({ label: "YNX Wallet", rdns: "com.ynx.wallet" }),
  metamask: Object.freeze({ label: "MetaMask", rdns: "io.metamask" }),
});

export function walletIdentity(provider, info = {}) {
  const ynx = provider?.isYNXWallet === true;
  const metamask = provider?.isMetaMask === true;
  const rdns = typeof info?.rdns === "string" ? info.rdns.toLowerCase() : "";
  if (ynx && !metamask && (!rdns || rdns === canonicalKinds.ynx.rdns)) {
    return Object.freeze({ accepted: true, kind: "ynx", label: canonicalKinds.ynx.label, rdns: rdns || canonicalKinds.ynx.rdns });
  }
  if (metamask && !ynx && (!rdns || rdns === canonicalKinds.metamask.rdns)) {
    return Object.freeze({ accepted: true, kind: "metamask", label: canonicalKinds.metamask.label, rdns: rdns || canonicalKinds.metamask.rdns });
  }
  return Object.freeze({
    accepted: false,
    kind: "unsupported",
    label: typeof info?.name === "string" && info.name.trim() ? info.name.trim() : "Unsupported EIP-1193 provider",
    rdns,
  });
}

export function walletKind(provider, info = {}) {
  return walletIdentity(provider, info).label;
}

export function canonicalProviderEntry(provider, info = {}) {
  if (!provider || typeof provider.request !== "function") return null;
  const identity = walletIdentity(provider, info);
  return identity.accepted ? Object.freeze({ provider, info: Object.freeze({ ...info }), identity }) : null;
}

export function collectCanonicalInjectedProviders(target = globalThis.window, { includeExternal = false } = {}) {
  const injected = target?.ethereum;
  if (!injected) return [];
  const candidates = Array.isArray(injected.providers) && injected.providers.length ? injected.providers : [injected];
  return uniqueProviders(candidates.map((provider) => canonicalProviderEntry(provider)).filter(entry => entry && (includeExternal || entry.identity.kind === "ynx")));
}

export function discoverCanonicalProviders({ target = globalThis.window, onChange = () => {}, fallbackDelay = 160, includeExternal = false } = {}) {
  if (!target?.addEventListener || !target?.dispatchEvent) return () => {};
  let providers = [];
  const publish = (entry) => {
    if (!entry || (!includeExternal && entry.identity.kind !== "ynx") || providers.some((candidate) => candidate.provider === entry.provider)) return;
    providers = [...providers, entry];
    onChange([...providers]);
  };
  const onAnnounce = ({ detail }) => publish(canonicalProviderEntry(detail?.provider, detail?.info));
  target.addEventListener("eip6963:announceProvider", onAnnounce);
  target.dispatchEvent(new Event("eip6963:requestProvider"));
  const timer = target.setTimeout?.(() => {
    for (const entry of collectCanonicalInjectedProviders(target, { includeExternal })) publish(entry);
    onChange([...providers]);
  }, fallbackDelay);
  return () => {
    target.removeEventListener("eip6963:announceProvider", onAnnounce);
    if (timer !== undefined) target.clearTimeout?.(timer);
  };
}

export async function connectCanonicalProvider(entry, { basicConnection = false } = {}) {
  const provider = requireCanonicalProvider(entry, basicConnection);
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  const account = Array.isArray(accounts) ? accounts[0] : undefined;
  if (!isEVMAccount(account)) throw new Error("The selected wallet did not return a canonical EVM account.");
  const chainId = normalizeChainId(await provider.request({ method: "eth_chainId" }));
  return Object.freeze({ account: account.toLowerCase(), chainId, identity: entry.identity, provider });
}

export async function switchCanonicalProviderToYNX(entry, networkParams, { basicConnection = false } = {}) {
  const provider = requireCanonicalProvider(entry, basicConnection);
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: YNX_EVM_CHAIN_ID }] });
  } catch (error) {
    if (error?.code !== 4902 || !networkParams || networkParams.chainId !== YNX_EVM_CHAIN_ID) throw error;
    await provider.request({ method: "wallet_addEthereumChain", params: [networkParams] });
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: YNX_EVM_CHAIN_ID }] });
  }
  const chainId = normalizeChainId(await provider.request({ method: "eth_chainId" }));
  if (chainId !== YNX_EVM_CHAIN_ID) throw new Error("Wallet network readback did not confirm YNX 6423 / 0x1917.");
  return chainId;
}

export function subscribeCanonicalProvider(entry, onState, { basicConnection = false } = {}) {
  const provider = requireCanonicalProvider(entry, basicConnection);
  if (typeof provider.on !== "function") return () => {};
  const onAccountsChanged = (accounts) => onState({ type: "accountsChanged", accounts: Array.isArray(accounts) ? accounts.filter(isEVMAccount).map((account) => account.toLowerCase()) : [] });
  const onChainChanged = (chainId) => {
    let normalized;
    try { normalized = normalizeChainId(chainId); }
    catch { onState({ type: "disconnect" }); return; }
    onState({ type: "chainChanged", chainId: normalized });
  };
  const onDisconnect = () => onState({ type: "disconnect" });
  provider.on("accountsChanged", onAccountsChanged);
  provider.on("chainChanged", onChainChanged);
  provider.on("disconnect", onDisconnect);
  return () => {
    if (typeof provider.removeListener !== "function") return;
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
  };
}

// These helpers never hold signing material. Callers must invoke them only from
// the immediate click/submit handler that explains the exact action to the user.
export async function requestCanonicalPersonalSignature(entry, { account, messageHex }) {
  const provider = requireCanonicalProvider(entry);
  if (!isEVMAccount(account) || !/^0x(?:[0-9a-f]{2})+$/i.test(messageHex || "")) throw new Error("Canonical signature request is invalid.");
  await assertCanonicalSession(provider, account);
  return provider.request({ method: "personal_sign", params: [messageHex, account] });
}

export async function sendCanonicalTransaction(entry, transaction) {
  const provider = requireCanonicalProvider(entry);
  if (!transaction || !isEVMAccount(transaction.from)) throw new Error("Canonical transaction request is invalid.");
  await assertCanonicalSession(provider, transaction.from);
  return provider.request({ method: "eth_sendTransaction", params: [{ ...transaction, from: transaction.from.toLowerCase() }] });
}

export function hasLegacyLocalSignerData(storage = globalThis.localStorage) {
  if (!storage || !Number.isInteger(storage.length)) return false;
  for (let index = 0; index < storage.length; index += 1) {
    if (LEGACY_LOCAL_SIGNER_KEYS.includes(storage.key(index))) return true;
  }
  return false;
}

export function clearLegacyLocalSignerData({ storage = globalThis.localStorage, target = globalThis.window } = {}) {
  if (!storage) return Object.freeze({ removed: false, event: "legacy-local-signer-clear" });
  let removed = false;
  for (const key of LEGACY_LOCAL_SIGNER_KEYS) {
    if (storageKeyExists(storage, key)) {
      storage.removeItem(key);
      removed = true;
    }
  }
  const detail = Object.freeze({ event: "legacy-local-signer-clear", removed, secretValuesRead: false });
  if (target?.dispatchEvent && typeof CustomEvent === "function") {
    target.dispatchEvent(new CustomEvent("ynx:legacy-local-signer-cleared", { detail }));
  }
  return detail;
}

function requireCanonicalProvider(entry, basicConnection = false) {
  const actual = walletIdentity(entry?.provider, entry?.info);
  if (!entry?.identity?.accepted || !actual.accepted || entry.identity.kind !== actual.kind || !entry.provider || typeof entry.provider.request !== "function" || (!basicConnection && actual.kind !== "ynx")) {
    throw new Error("YNX Wallet is required to connect this account.");
  }
  return entry.provider;
}

function normalizeChainId(value) {
  if (typeof value !== "string" || !/^0x[0-9a-f]+$/i.test(value)) throw new Error("Wallet returned an invalid chain ID.");
  return `0x${BigInt(value).toString(16)}`;
}

function isEVMAccount(value) {
  return typeof value === "string" && /^0x[0-9a-f]{40}$/i.test(value);
}

async function assertCanonicalSession(provider, account) {
  const chainId = normalizeChainId(await provider.request({ method: "eth_chainId" }));
  if (chainId !== YNX_EVM_CHAIN_ID) throw new Error("Wallet is not connected to YNX 6423 / 0x1917.");
  const accounts = await provider.request({ method: "eth_accounts" });
  if (!Array.isArray(accounts) || !accounts.some((candidate) => isEVMAccount(candidate) && candidate.toLowerCase() === account.toLowerCase())) {
    throw new Error("Wallet account readback does not match the requested account.");
  }
}

function storageKeyExists(storage, expected) {
  for (let index = 0; index < storage.length; index += 1) {
    if (storage.key(index) === expected) return true;
  }
  return false;
}

function uniqueProviders(entries) {
  return entries.filter((entry, index) => entries.findIndex((candidate) => candidate.provider === entry.provider) === index);
}
