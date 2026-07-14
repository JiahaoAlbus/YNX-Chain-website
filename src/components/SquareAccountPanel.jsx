import React, { useEffect, useRef, useState } from "react";
import { Check, Download, KeyRound, LockKeyhole, LogOut, ShieldCheck, Trash2, Upload, WalletCards } from "lucide-react";
import {
  YNXSquareAppClient,
  accountIdentity,
  generateAccountSecret,
  generateDeviceSecret,
  importAccountSecret,
  openSignerVault,
  sealSignerVault,
  zeroize,
} from "../lib/ynx-signer/index.js";

const VAULT_KEY = "ynx.browser-signer.v1";
const BACKUP_KEY = "ynx.browser-signer.backup-confirmed.v1";
const APP_GATEWAY = "https://api.ynxweb4.com";

export function SquareAccountPanel({ onPublished }) {
  const clientRef = useRef(null);
  const fileRef = useRef(null);
  const [hasVault, setHasVault] = useState(() => Boolean(readVault()));
  const [backupConfirmed, setBackupConfirmed] = useState(() => localStorage.getItem(BACKUP_KEY) === "true");
  const [mode, setMode] = useState(() => hasVault ? "locked" : "create");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [identity, setIdentity] = useState(null);
  const [session, setSession] = useState({ connected: false, expiresAt: null });
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => clientRef.current?.lock(), []);

  const createVault = async (event) => {
    event.preventDefault();
    if (password !== confirmation) return setError("Passwords do not match.");
    await withBusy("creating", async () => {
      const accountSecret = mode === "import-key" ? importAccountSecret(privateKey) : generateAccountSecret();
      const deviceSecret = generateDeviceSecret();
      try {
        const vault = await sealSignerVault({ accountSecret, deviceSecret }, password);
        localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
        localStorage.removeItem(BACKUP_KEY);
        setBackupConfirmed(false);
        setHasVault(true);
        activateClient(accountSecret, deviceSecret);
        setNotice("YNX account created locally. Save the encrypted backup before connecting.");
        setPassword(""); setConfirmation(""); setPrivateKey("");
      } finally {
        zeroize(accountSecret, deviceSecret);
      }
    });
  };

  const unlock = async (event) => {
    event.preventDefault();
    await withBusy("unlocking", async () => {
      const vault = readVault();
      if (!vault) throw new Error("Encrypted YNX vault is not available.");
      const secrets = await openSignerVault(vault, password);
      try {
        activateClient(secrets.accountSecret, secrets.deviceSecret);
        setNotice("Vault unlocked locally.");
        setPassword("");
      } finally {
        zeroize(secrets.accountSecret, secrets.deviceSecret);
      }
    });
  };

  const importVault = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await withBusy("importing", async () => {
      const parsed = JSON.parse(await file.text());
      await openSignerVault(parsed, password).then((secrets) => zeroize(secrets.accountSecret, secrets.deviceSecret));
      localStorage.setItem(VAULT_KEY, JSON.stringify(parsed));
      localStorage.removeItem(BACKUP_KEY);
      setBackupConfirmed(false);
      setHasVault(true);
      setMode("locked");
      setNotice("Encrypted YNX vault imported. Unlock it to continue.");
      setPassword("");
    });
  };

  const connect = async () => {
    await withBusy("connecting", async () => {
      const status = await clientRef.current.connect();
      setSession(status);
      setNotice("Account ownership and device session verified.");
    });
  };

  const publish = async (event) => {
    event.preventDefault();
    await withBusy("publishing", async () => {
      const normalizedTags = tags.split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean);
      await clientRef.current.createPost({ content, tags: normalizedTags });
      setContent(""); setTags("");
      setNotice("Signed post persisted on YNX Square.");
      await onPublished?.();
    });
  };

  const lock = async () => {
    await withBusy("locking", async () => {
      const client = clientRef.current;
      try {
        await client?.disconnect();
      } finally {
        client?.lock();
        clientRef.current = null;
        setIdentity(null);
        setSession({ connected: false, expiresAt: null });
        setMode("locked");
        setNotice("Vault locked and local signing keys cleared.");
      }
    });
  };

  const removeDevice = async () => {
    if (!session.connected || !window.confirm("Remove this signed device and delete its local encrypted vault?")) return;
    await withBusy("removing", async () => {
      await clientRef.current.disconnect({ revokeDevice: true });
      clientRef.current.lock();
      clientRef.current = null;
      localStorage.removeItem(VAULT_KEY);
      localStorage.removeItem(BACKUP_KEY);
      setHasVault(false); setBackupConfirmed(false); setIdentity(null);
      setSession({ connected: false, expiresAt: null });
      setMode("create");
      setNotice("Device revoked and local encrypted vault removed.");
    });
  };

  const removeLocalVault = () => {
    if (!backupConfirmed || !window.confirm("Delete this local encrypted vault copy? This does not change remote device state.")) return;
    clientRef.current?.lock();
    clientRef.current = null;
    localStorage.removeItem(VAULT_KEY);
    localStorage.removeItem(BACKUP_KEY);
    setHasVault(false); setBackupConfirmed(false); setIdentity(null);
    setSession({ connected: false, expiresAt: null });
    setPassword(""); setMode("create");
    setNotice("Local encrypted vault copy removed. Remote device state was not changed.");
  };

  const saveBackup = () => {
    const vault = readVault();
    if (!vault) return;
    const blob = new Blob([JSON.stringify(vault, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ynx-vault-${identity?.account?.slice(0, 14) || "encrypted"}.json`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const confirmBackup = (checked) => {
    setBackupConfirmed(checked);
    if (checked) localStorage.setItem(BACKUP_KEY, "true"); else localStorage.removeItem(BACKUP_KEY);
  };

  const activateClient = (accountSecret, deviceSecret) => {
    clientRef.current?.lock();
    const client = new YNXSquareAppClient({ baseURL: APP_GATEWAY, accountSecret, deviceSecret });
    clientRef.current = client;
    setIdentity(accountIdentity(accountSecret));
    setSession(client.sessionStatus);
    setMode("unlocked");
  };

  const withBusy = async (name, operation) => {
    setBusy(name); setError(""); setNotice("");
    try { await operation(); } catch (nextError) { setError(safeMessage(nextError)); }
    finally { setBusy(""); }
  };

  return (
    <section className="squareWorkspace" aria-label="YNX Square account workspace">
      <div className="squareAccountPane">
        <div className="workspaceTitle"><WalletCards /><span><small>YNX-native account</small><strong>{identity ? shortAccount(identity.account) : hasVault ? "Encrypted vault locked" : "Create or import"}</strong></span></div>

        {!hasVault && (
          <form className="vaultForm" onSubmit={createVault}>
            <div className="modeSwitch" aria-label="Account setup mode">
              <button type="button" className={mode === "create" ? "active" : ""} onClick={() => setMode("create")}>Create</button>
              <button type="button" className={mode === "import-key" ? "active" : ""} onClick={() => setMode("import-key")}>Import key</button>
            </div>
            {mode === "import-key" && <Field label="Account private key" type="password" value={privateKey} onChange={setPrivateKey} autoComplete="off" />}
            <Field label="Vault password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
            <Field label="Confirm password" type="password" value={confirmation} onChange={setConfirmation} autoComplete="new-password" />
            <button className="button primary" disabled={Boolean(busy)}><KeyRound size={17} />{busy === "creating" ? "Creating" : "Create encrypted vault"}</button>
            <div className="vaultActions">
              <button type="button" onClick={() => fileRef.current?.click()}><Upload />Import encrypted vault</button>
            </div>
          </form>
        )}

        {hasVault && mode === "locked" && (
          <form className="vaultForm" onSubmit={unlock}>
            <Field label="Vault password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
            <button className="button primary" disabled={Boolean(busy)}><LockKeyhole size={17} />{busy === "unlocking" ? "Unlocking" : "Unlock"}</button>
            <div className="vaultActions">
              <button type="button" onClick={() => fileRef.current?.click()}><Upload />Import encrypted vault</button>
              <button type="button" className="danger" onClick={removeLocalVault} disabled={!backupConfirmed}><Trash2 />Delete local copy</button>
            </div>
          </form>
        )}

        {identity && (
          <div className="accountStatus">
            <code>{identity.account}</code>
            <div className="vaultActions">
              <button type="button" onClick={saveBackup}><Download />Encrypted backup</button>
              <button type="button" onClick={lock}><LogOut />Lock</button>
              <button type="button" className="danger" onClick={removeDevice} disabled={!session.connected}><Trash2 />Remove device</button>
            </div>
            <label className="backupCheck"><input type="checkbox" checked={backupConfirmed} onChange={(event) => confirmBackup(event.target.checked)} /><span><Check />Encrypted backup stored</span></label>
          </div>
        )}

        {identity && !session.connected && <button className="button primary connectButton" onClick={connect} disabled={!backupConfirmed || Boolean(busy)}><ShieldCheck size={17} />{busy === "connecting" ? "Verifying" : "Connect signed session"}</button>}
        {session.connected && <div className="sessionReady"><i /><span><strong>Signed session active</strong><small>Expires {formatTime(session.expiresAt)}</small></span></div>}
        <input ref={fileRef} className="visuallyHidden" type="file" accept="application/json" onChange={importVault} />
      </div>

      <form className="squareComposer" onSubmit={publish}>
        <div className="workspaceTitle"><ShieldCheck /><span><small>Ownership-bound publishing</small><strong>{session.connected ? "Compose post" : "Connect to publish"}</strong></span></div>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={2000} placeholder="Share with YNX Square" disabled={!session.connected} />
        <div className="composerFooter">
          <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags, comma separated" disabled={!session.connected} />
          <span>{content.length}/2000</span>
          <button className="button primary" disabled={!session.connected || !content.trim() || Boolean(busy)}>{busy === "publishing" ? "Publishing" : "Publish"}</button>
        </div>
      </form>

      {(error || notice) && <div className={`workspaceNotice ${error ? "error" : "success"}`} role="status">{error || notice}</div>}
    </section>
  );
}

function Field({ label, type, value, onChange, autoComplete }) {
  return <label className="vaultField"><span>{label}</span><input required type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} /></label>;
}

function readVault() {
  try { return JSON.parse(localStorage.getItem(VAULT_KEY) || "null"); } catch { return null; }
}

function safeMessage(error) {
  const message = String(error?.message || "YNX account operation failed.");
  if (/private|secret|token/i.test(message)) return "YNX account operation failed safely.";
  return message.slice(0, 180);
}

function shortAccount(value) { return `${value.slice(0, 12)}…${value.slice(-7)}`; }
function formatTime(value) { return value ? new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "soon"; }
