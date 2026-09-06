import React from "react";
import { Activity, ArrowUpRight, BookOpen, Code2, Coins, Droplets, Search } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";
import { getHomeRedesignCopy } from "../content/homeRedesignContent.js";

const links = [
  { href: apiConfig.explorerUrl, icon: Search },
  { href: apiConfig.monitorUrl, icon: Activity },
  { href: apiConfig.faucetUrl, icon: Droplets },
  { href: apiConfig.docsUrl, icon: BookOpen },
  { href: "https://github.com/JiahaoAlbus/YNX-Chain", icon: Code2 },
  { href: apiConfig.ecosystemUrl, icon: Coins }
];

export function LinkGrid() {
  const { locale } = useLocale();
  const { resourceItems } = getHomeRedesignCopy(locale);
  return (
    <div className="linkGrid">
      {links.map(({ href, icon: Icon }, index) => (
        <a key={href} href={href} className="resourceLink" data-reveal>
          <Icon size={20} />
          <span><strong>{resourceItems[index].label}</strong><small>{resourceItems[index].detail}</small></span>
          <ArrowUpRight size={17} />
        </a>
      ))}
    </div>
  );
}
