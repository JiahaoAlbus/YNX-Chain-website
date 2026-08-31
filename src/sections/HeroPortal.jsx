import React from "react";
import { Activity, ArrowUpRight, CheckCircle2, Database, Network, WalletCards } from "lucide-react";
import { apiConfig, YNX_6423 } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";

export function HeroPortal({ snapshot, connectionState, onAddNetwork }) {
  const { locale } = useLocale();
  const zh = locale === "zh-CN";
  const status = snapshot.status || {};
  const explorer = snapshot.explorer || {};
  const verified = snapshot.ok === true && connectionState === "live";
  const state = verified ? (zh ? "已核验" : "Verified") : connectionState === "loading" ? (zh ? "正在核验" : "Checking") : (zh ? "暂不可用" : "Unavailable");
  const cards = [
    [zh ? "网络" : "Network", YNX_6423.networkName, <Network />],
    [zh ? "链 ID" : "Chain ID", "6423 · 0x1917", <CheckCircle2 />],
    [zh ? "原生资产" : "Native asset", "YNXT", <WalletCards />],
    [zh ? "索引器" : "Indexer", explorer.indexerOk === true ? (zh ? "已对齐" : "Aligned") : (zh ? "暂不可用" : "Unavailable"), <Database />]
  ];
  return <section className="hero portalHeroV2" aria-labelledby="hero-title">
    <div className="heroInner">
      <div className="heroCopy">
        <div className={`liveBadge ${verified ? "isLive" : ""}`}><span className="statusDot" />{zh ? "公开测试网" : "Public Testnet"} · {state}</div>
        <p className="heroEyebrow">YNX WEB4 LAYER-1</p>
        <h1 id="hero-title">{zh ? "让人、应用与 AI Agent 在可审计边界内协作。" : "Web4 execution with auditable boundaries for people, apps, and AI agents."}</h1>
        <p className="heroLead">{zh ? "YNX 是兼容 EVM 的 Web4 Layer-1。当前为 YNX Testnet，不是 Mainnet；使用 YNXT 完成 Gas、手续费与网络资源操作。" : "YNX is an EVM-compatible Web4 Layer-1. This is YNX Testnet, not Mainnet; YNXT is used for gas, fees, and network resources."}</p>
        <div className="heroActions">
          <a className="button primary" href={apiConfig.explorerUrl}>{zh ? "打开区块浏览器" : "Open Explorer"} <ArrowUpRight size={18} /></a>
          <a className="button secondary" href={apiConfig.faucetUrl}>{zh ? "领取 Testnet YNXT" : "Get Testnet YNXT"} <ArrowUpRight size={18} /></a>
          <button className="button secondary" onClick={onAddNetwork}><WalletCards size={18} /> {zh ? "将 6423 添加到钱包" : "Add 6423 to wallet"}</button>
        </div>
        <p className="heroBoundary">{zh ? "官网只提供网络摘要；区块、交易、地址、合约和 Token 查询在独立 Explorer 中完成。" : "This website provides the network summary; blocks, transactions, addresses, contracts, and Token lookup belong in the independent Explorer."}</p>
      </div>
      <aside className="heroStatus" aria-label={zh ? "6423 网络身份" : "6423 network identity"}>
        <div className="heroStatusHead"><div><p>{zh ? "网络身份" : "Network identity"}</p><strong>{YNX_6423.cosmosChainId}</strong></div><span>{verified ? <CheckCircle2 /> : <Activity />}</span></div>
        <div className="heroStatusGrid">{cards.map(([label, value, icon]) => <div key={label}><span>{icon}{label}</span><strong>{value}</strong></div>)}</div>
        <div className="heroStatusFoot"><span>{zh ? "最新高度" : "Latest height"}<strong>{status.height ?? (zh ? "暂不可用" : "Unavailable")}</strong></span><span>{zh ? "数据来源" : "Data source"}<strong>{verified ? "RPC + Explorer" : (zh ? "核验中" : "Checking")}</strong></span></div>
      </aside>
    </div>
  </section>;
}
