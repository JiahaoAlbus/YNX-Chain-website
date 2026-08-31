import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleAlert, Droplets, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { normalizeAddress } from "../lib/address.js";
import { validateFaucetClaim, validateFaucetRuntime } from "../lib/faucetRuntime.js";
import { useLocale } from "../lib/i18n.jsx";
import { getFaucetCopy } from "../content/businessLocaleContent.js";

const DEFAULT_AMOUNT = 100;

export function FaucetPage() {
  const { locale } = useLocale();
  const copy = getFaucetCopy(locale);
  const [address, setAddress] = useState("");
  const [health, setHealth] = useState({ state: "loading" });
  const [request, setRequest] = useState({ state: "idle" });

  const normalized = useMemo(() => {
    if (!address.trim()) return null;
    try { return { ...normalizeAddress(address), error: null }; }
    catch (error) { return { error: error.message }; }
  }, [address]);

  const refreshHealth = async () => {
    setHealth({ state: "loading" });
    try {
      const [healthResponse, versionResponse] = await Promise.all([
        fetch(`${apiConfig.faucetUrl}/health`, { cache: "no-store" }),
        fetch(`${apiConfig.faucetUrl}/version`, { cache: "no-store" }),
      ]);
      const [payload, version] = await Promise.all([healthResponse.json(), versionResponse.json()]);
      if (!healthResponse.ok || !versionResponse.ok) throw new Error(`Faucet identity check returned HTTP ${healthResponse.status}/${versionResponse.status}`);
      validateFaucetRuntime(payload, version);
      setHealth({ state: "ready", payload, version });
    } catch (error) {
      setHealth({ state: "error", error: error.name === "TypeError" ? copy.connectionError : error.message });
    }
  };

  useEffect(() => { refreshHealth(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!normalized || normalized.error) return;
    setRequest({ state: "submitting" });
    try {
      const response = await fetch(`${apiConfig.faucetUrl}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: normalized.evmAddress, amount: DEFAULT_AMOUNT }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Request failed with HTTP ${response.status}`);
      const { hash } = validateFaucetClaim(payload, normalized.evmAddress, DEFAULT_AMOUNT);
      setRequest({ state: "success", payload, hash });
      refreshHealth();
    } catch (error) {
      const message = /rate limit/i.test(error.message) ? copy.rateLimit : error.message;
      setRequest({ state: "error", error: message });
    }
  };

  const reset = () => { setAddress(""); setRequest({ state: "idle" }); };

  return (
    <main className="faucetPage">
      <header className="faucetHero">
        <div className="faucetHeroCopy">
          <p className="sectionEyebrow">YNX Testnet Faucet</p>
          <h1>{copy.hero[0]}</h1>
          <p>{copy.hero[1]}</p>
        </div>
        <ServiceState health={health} onRetry={refreshHealth} copy={copy.service} />
      </header>

      <section className="faucetLayout" aria-label={copy.aria}>
        <div className="faucetFormPanel">
          <div className="faucetAmount"><span><Droplets /><small>{copy.amount}</small></span><strong>{DEFAULT_AMOUNT} <em>YNXT</em></strong></div>
          <form onSubmit={submit}>
            <label htmlFor="faucet-address">{copy.receiving}</label>
            <div className={`faucetInput ${normalized?.error ? "invalid" : normalized?.ynxAddress ? "valid" : ""}`}>
              <input id="faucet-address" value={address} onChange={(event) => { setAddress(event.target.value); if (request.state !== "idle") setRequest({ state: "idle" }); }} placeholder="ynx1… or 0x…" autoComplete="off" spellCheck="false" disabled={request.state === "submitting"} />
              {normalized?.ynxAddress ? <CheckCircle2 aria-label={copy.valid} /> : null}
            </div>
            {normalized?.error ? <p className="faucetFieldError"><CircleAlert />{normalized.error}</p> : null}
            {normalized?.ynxAddress ? <div className="faucetCanonical"><small>{copy.canonical}</small><code>{normalized.ynxAddress}</code></div> : null}

            <label className="faucetConsent"><input type="checkbox" required disabled={request.state === "submitting"} /><span>{copy.consent}</span></label>
            <button className="button primary faucetSubmit" type="submit" disabled={!normalized?.ynxAddress || request.state === "submitting" || health.state !== "ready"}>
              {request.state === "submitting" ? <><RefreshCw className="spin" />{copy.submitting}</> : <>{copy.claim} {DEFAULT_AMOUNT} YNXT<ArrowRight /></>}
            </button>
          </form>

          {request.state === "error" ? <div className="faucetResult error" role="alert"><CircleAlert /><div><strong>{copy.errorTitle}</strong><p>{request.error}</p><button type="button" onClick={() => setRequest({ state: "idle" })}>{copy.retry}</button></div></div> : null}
          {request.state === "success" ? <div className="faucetResult success" role="status"><CheckCircle2 /><div><strong>{copy.successTitle}</strong><p>{request.payload.amount} {request.payload.nativeSymbol || "YNXT"} → <code>{request.payload.address}</code></p><code className="faucetHash">{request.hash}</code><div className="faucetResultActions"><a href={`${apiConfig.apiBase}/txs/${request.hash}`}>{copy.rpc}<ExternalLink /></a><button type="button" onClick={reset}>{copy.done}</button></div></div></div> : null}
        </div>

        <aside className="faucetRules">
          <p className="sectionEyebrow">{copy.rulesEyebrow}</p>
          <h2>{copy.rulesTitle}</h2>
          <ol>
            {copy.steps.map(([title, lead], index) => <li key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{lead}</p></div></li>)}
          </ol>
          <div className="faucetSecurity"><ShieldCheck /><p><strong>{copy.securityTitle}</strong><span>{copy.security}</span></p></div>
          <a className="faucetEvidenceLink" href="/releases/faucet-runtime/64efa498fa9982e12ffda888391d67082dc898bb/runtime-publication.json">{copy.evidence}<ExternalLink /></a>
        </aside>
      </section>
    </main>
  );
}

function ServiceState({ health, onRetry, copy }) {
  if (health.state === "ready") return <div className="faucetService ready"><span /><div><small>{copy.label}</small><strong>{copy.ready}</strong><em>{health.version.build.commit} · {copy.limit}</em></div></div>;
  if (health.state === "error") return <div className="faucetService error"><CircleAlert /><div><small>{copy.label}</small><strong>{copy.unavailable}</strong><button type="button" onClick={onRetry}>{copy.retry}</button></div></div>;
  return <div className="faucetService loading"><RefreshCw className="spin" /><div><small>{copy.label}</small><strong>{copy.connecting}</strong></div></div>;
}
