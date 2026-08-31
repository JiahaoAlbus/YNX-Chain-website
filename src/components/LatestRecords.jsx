import React from "react";
import { ArrowUpRight, Blocks, ReceiptText } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";

const compact = (value, start = 10, end = 8) => value?.length > start + end ? `${value.slice(0, start)}…${value.slice(-end)}` : value || "—";

export function LatestRecords({ snapshot, copy }) {
  const { locale } = useLocale();
  const blocks = snapshot.latestBlocks?.blocks || [];
  const transactions = snapshot.latestTransactions?.transactions || [];
  return <section className="latestRecords" aria-label={copy.aria} data-reveal>
    <article className="recordPanel"><header><div><span className="recordIcon"><Blocks /></span><p className="sectionEyebrow">{copy.blocks[0]}</p><h2>{copy.blocks[1]}</h2></div><a href={apiConfig.explorerUrl}>{copy.blocks[2]}<ArrowUpRight /></a></header>{blocks.length ? <div className="recordList">{blocks.slice(0, 5).map((block) => <a key={block.hash} href={`${apiConfig.explorerUrl}/block/${block.height}`}><strong>#{Number(block.height).toLocaleString(locale)}</strong><span>{compact(block.hash)}</span><time>{new Date(block.time).toLocaleString(locale)}</time></a>)}</div> : <div className="recordEmpty">{copy.blocks[3]}</div>}</article>
    <article className="recordPanel"><header><div><span className="recordIcon"><ReceiptText /></span><p className="sectionEyebrow">{copy.transactions[0]}</p><h2>{copy.transactions[1]}</h2></div><a href={apiConfig.explorerUrl}>{copy.transactions[2]}<ArrowUpRight /></a></header>{transactions.length ? <div className="recordList">{transactions.slice(0, 5).map((transaction) => <a key={transaction.hash} href={`${apiConfig.explorerUrl}/tx/${transaction.hash}`}><strong>{compact(transaction.hash, 12, 8)}</strong><span>{transaction.type || copy.transactions[3]} · {transaction.amount ?? "—"} YNXT</span><time>{new Date(transaction.timestamp).toLocaleString(locale)}</time></a>)}</div> : <div className="recordEmpty">{copy.transactions[4]}</div>}</article>
  </section>;
}
