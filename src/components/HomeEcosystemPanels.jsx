import React from "react";
import { Bot, Braces, CircleDollarSign, Coins, Gauge, Landmark, Layers3, Search, ShieldCheck, WalletCards } from "lucide-react";
import { homeEcosystemPanelDecision } from "../lib/homeEcosystemDecision.js";
import { ProductPanel } from "./ProductPanel.jsx";

const icons = [Layers3, Coins, Search, Bot, CircleDollarSign, ShieldCheck, Gauge, Braces, WalletCards, Landmark];

export function HomeEcosystemPanels({ items, networkStatus, services }) {
  return items.map((item, index) => {
    const Icon = icons[index];
    const decision = homeEcosystemPanelDecision(index, networkStatus, services);
    return <ProductPanel key={item.title} icon={<Icon />} {...item} {...decision} />;
  });
}
