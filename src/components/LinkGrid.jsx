import React from "react";
import { ArrowUpRight, BookOpen, Code2, Coins, Droplets, Search } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

const links = [
  { label: "Explorer", detail: "Blocks, transactions and validators", href: apiConfig.explorerUrl, icon: Search },
  { label: "Faucet", detail: "Request testnet YNXT", href: apiConfig.faucetUrl, icon: Droplets },
  { label: "Developer docs", detail: "RPC, SDK and integration paths", href: apiConfig.docsUrl, icon: BookOpen },
  { label: "Chain source", detail: "Runtime and verification code", href: "https://github.com/JiahaoAlbus/YNX-Chain", icon: Code2 },
  { label: "Ecosystem readiness", detail: "External review package", href: apiConfig.ecosystemUrl, icon: Coins }
];

export function LinkGrid() {
  return (
    <div className="linkGrid">
      {links.map(({ label, detail, href, icon: Icon }) => (
        <a key={label} href={href} className="resourceLink" data-reveal>
          <Icon size={20} />
          <span><strong>{label}</strong><small>{detail}</small></span>
          <ArrowUpRight size={17} />
        </a>
      ))}
    </div>
  );
}
