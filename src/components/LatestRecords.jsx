import React from "react";
import { ArrowUpRight, Blocks, ReceiptText } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";

const compact = (value, start = 10, end = 8) => value?.length > start + end ? `${value.slice(0, start)}…${value.slice(-end)}` : value || "—";

export function LatestRecords({ snapshot }) {
  const { locale } = useLocale();
  const zh = locale === "zh-CN";
  const blocks = snapshot.latestBlocks?.blocks || [];
  const transactions = snapshot.latestTransactions?.transactions || [];
  return <section className="latestRecords" aria-label={zh ? "最新网络记录" : "Latest network records"} data-reveal>
    <article className="recordPanel"><header><div><span className="recordIcon"><Blocks /></span><p className="sectionEyebrow">{zh ? "实时区块" : "Latest blocks"}</p><h2>{zh ? "来自当前 6423 索引器" : "From the current 6423 Indexer"}</h2></div><a href={apiConfig.explorerUrl}>{zh ? "全部区块" : "All blocks"}<ArrowUpRight /></a></header>{blocks.length ? <div className="recordList">{blocks.slice(0, 5).map((block) => <a key={block.hash} href={`${apiConfig.explorerUrl}/block/${block.height}`}><strong>#{Number(block.height).toLocaleString(locale)}</strong><span>{compact(block.hash)}</span><time>{new Date(block.time).toLocaleString(locale)}</time></a>)}</div> : <div className="recordEmpty">{zh ? "区块数据暂不可用。" : "Block data is unavailable."}</div>}</article>
    <article className="recordPanel"><header><div><span className="recordIcon"><ReceiptText /></span><p className="sectionEyebrow">{zh ? "已索引交易" : "Indexed transactions"}</p><h2>{zh ? "最近可验证的交易记录" : "Most recently indexed records"}</h2></div><a href={apiConfig.explorerUrl}>{zh ? "全部交易" : "All transactions"}<ArrowUpRight /></a></header>{transactions.length ? <div className="recordList">{transactions.slice(0, 5).map((transaction) => <a key={transaction.hash} href={`${apiConfig.explorerUrl}/tx/${transaction.hash}`}><strong>{compact(transaction.hash, 12, 8)}</strong><span>{transaction.type || (zh ? "交易" : "Transaction")} · {transaction.amount ?? "—"} YNXT</span><time>{new Date(transaction.timestamp).toLocaleString(locale)}</time></a>)}</div> : <div className="recordEmpty">{zh ? "交易索引暂不可用。" : "Indexed transactions are unavailable."}</div>}</article>
  </section>;
}
