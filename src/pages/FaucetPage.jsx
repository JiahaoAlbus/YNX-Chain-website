import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleAlert, Droplets, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { normalizeAddress } from "../lib/address.js";
import { validateFaucetRuntime } from "../lib/faucetRuntime.js";
import { useLocale } from "../lib/i18n.jsx";

const DEFAULT_AMOUNT = 100;

export function FaucetPage() {
  const { locale } = useLocale();
  const zh = locale === "zh-CN";
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
      setHealth({ state: "error", error: error.name === "TypeError" ? "Faucet connection unavailable. Retry after the public service is reachable." : error.message });
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
        body: JSON.stringify({ address: normalized.ynxAddress, amount: DEFAULT_AMOUNT }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Request failed with HTTP ${response.status}`);
      const hash = payload.transaction?.hash || payload.txHash;
      if (!hash) throw new Error("The Faucet returned no transaction hash. No success is claimed.");
      setRequest({ state: "success", payload, hash });
      refreshHealth();
    } catch (error) {
      const message = /rate limit/i.test(error.message)
        ? (zh ? "该 IP 或地址在一小时内已经领取过，请稍后再试。" : "This IP or address has already claimed during the one-hour window.")
        : error.message;
      setRequest({ state: "error", error: message });
    }
  };

  const reset = () => { setAddress(""); setRequest({ state: "idle" }); };

  return (
    <main className="faucetPage">
      <header className="faucetHero">
        <div className="faucetHeroCopy">
          <p className="sectionEyebrow">YNX Testnet Faucet</p>
          <h1>{zh ? "领取测试币，然后验证真实交易。" : "Claim test coins. Verify the real transaction."}</h1>
          <p>{zh ? "输入你的 YNX 或兼容 0x 地址。水龙头会发送 100 YNXT 测试币，并返回可在 Explorer 中核对的交易哈希。" : "Enter your YNX or compatible 0x address. The Faucet sends 100 Testnet YNXT and returns a transaction hash you can verify in Explorer."}</p>
        </div>
        <ServiceState health={health} onRetry={refreshHealth} zh={zh} />
      </header>

      <section className="faucetLayout" aria-label={zh ? "领取 YNXT 测试币" : "Claim YNXT Testnet coins"}>
        <div className="faucetFormPanel">
          <div className="faucetAmount"><span><Droplets /><small>{zh ? "本次领取" : "Claim amount"}</small></span><strong>{DEFAULT_AMOUNT} <em>YNXT</em></strong></div>
          <form onSubmit={submit}>
            <label htmlFor="faucet-address">{zh ? "收款地址" : "Receiving address"}</label>
            <div className={`faucetInput ${normalized?.error ? "invalid" : normalized?.ynxAddress ? "valid" : ""}`}>
              <input id="faucet-address" value={address} onChange={(event) => { setAddress(event.target.value); if (request.state !== "idle") setRequest({ state: "idle" }); }} placeholder="ynx1… or 0x…" autoComplete="off" spellCheck="false" disabled={request.state === "submitting"} />
              {normalized?.ynxAddress ? <CheckCircle2 aria-label="Valid address" /> : null}
            </div>
            {normalized?.error ? <p className="faucetFieldError"><CircleAlert />{normalized.error}</p> : null}
            {normalized?.ynxAddress ? <div className="faucetCanonical"><small>{zh ? "链上将使用" : "Will be sent on-chain to"}</small><code>{normalized.ynxAddress}</code></div> : null}

            <label className="faucetConsent"><input type="checkbox" required disabled={request.state === "submitting"} /><span>{zh ? "我理解这是没有货币价值的测试网资产，并且不会输入助记词或私钥。" : "I understand this is a Testnet asset with no represented monetary value, and I will never enter a seed phrase or private key."}</span></label>
            <button className="button primary faucetSubmit" type="submit" disabled={!normalized?.ynxAddress || request.state === "submitting" || health.state !== "ready"}>
              {request.state === "submitting" ? <><RefreshCw className="spin" />{zh ? "正在提交真实交易…" : "Submitting real transaction…"}</> : <>{zh ? `领取 ${DEFAULT_AMOUNT} YNXT` : `Claim ${DEFAULT_AMOUNT} YNXT`}<ArrowRight /></>}
            </button>
          </form>

          {request.state === "error" ? <div className="faucetResult error" role="alert"><CircleAlert /><div><strong>{zh ? "未发送" : "Nothing was sent"}</strong><p>{request.error}</p><button type="button" onClick={() => setRequest({ state: "idle" })}>{zh ? "返回重试" : "Try again"}</button></div></div> : null}
          {request.state === "success" ? <div className="faucetResult success" role="status"><CheckCircle2 /><div><strong>{zh ? "测试币交易已提交" : "Testnet transfer submitted"}</strong><p>{request.payload.amount} {request.payload.nativeSymbol || "YNXT"} → <code>{request.payload.address}</code></p><code className="faucetHash">{request.hash}</code><div className="faucetResultActions"><a href={`${apiConfig.explorerUrl}/tx/${request.hash}`}>{zh ? "在 Explorer 查看" : "View in Explorer"}<ExternalLink /></a><button type="button" onClick={reset}>{zh ? "完成" : "Done"}</button></div></div></div> : null}
        </div>

        <aside className="faucetRules">
          <p className="sectionEyebrow">{zh ? "领取规则" : "Claim rules"}</p>
          <h2>{zh ? "四步完成" : "Four clear steps"}</h2>
          <ol>
            <li><span>1</span><div><strong>{zh ? "复制地址" : "Copy an address"}</strong><p>{zh ? "只使用你控制的钱包地址。" : "Use only an address controlled by your Wallet."}</p></div></li>
            <li><span>2</span><div><strong>{zh ? "验证并领取" : "Validate and claim"}</strong><p>{zh ? "每个 IP/地址每小时一次，固定 100 YNXT。" : "One claim per IP/address per hour, fixed at 100 YNXT."}</p></div></li>
            <li><span>3</span><div><strong>{zh ? "等待最终确认" : "Wait for finality"}</strong><p>{zh ? "超时属于未知状态，不会显示虚假成功。" : "A timeout stays unknown; it never becomes fake success."}</p></div></li>
            <li><span>4</span><div><strong>{zh ? "核对交易" : "Verify the transfer"}</strong><p>{zh ? "在 Explorer 对比 From、To、金额、手续费和区块。" : "Compare From, To, amount, fee and block in Explorer."}</p></div></li>
          </ol>
          <div className="faucetSecurity"><ShieldCheck /><p><strong>{zh ? "安全边界" : "Security boundary"}</strong><span>{zh ? "水龙头只需要公开地址，绝不会要求助记词、私钥、付款或授权。" : "The Faucet needs only a public address. It never asks for a seed phrase, private key, payment or Wallet approval."}</span></p></div>
          <a className="faucetEvidenceLink" href="/releases/faucet-runtime/ea0e068becd9103f5f0a2a6c3a0d20ab7932d006/runtime-publication.json">{zh ? "查看运行版本与验证记录" : "View runtime identity and evidence"}<ExternalLink /></a>
        </aside>
      </section>
    </main>
  );
}

function ServiceState({ health, onRetry, zh }) {
  if (health.state === "ready") return <div className="faucetService ready"><span /><div><small>{zh ? "水龙头状态" : "Faucet status"}</small><strong>{zh ? "已验证 · RPC 支持" : "Verified · RPC backed"}</strong><em>{health.version.build.commit} · {zh ? "每个 IP/地址每小时一次" : "one claim per IP/address per hour"}</em></div></div>;
  if (health.state === "error") return <div className="faucetService error"><CircleAlert /><div><small>{zh ? "水龙头状态" : "Faucet status"}</small><strong>{zh ? "暂时不可用" : "Temporarily unavailable"}</strong><button type="button" onClick={onRetry}>{zh ? "重试连接" : "Retry connection"}</button></div></div>;
  return <div className="faucetService loading"><RefreshCw className="spin" /><div><small>{zh ? "水龙头状态" : "Faucet status"}</small><strong>{zh ? "正在连接…" : "Connecting…"}</strong></div></div>;
}
