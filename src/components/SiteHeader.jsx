import React from "react";
import { ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";
import { apiConfig } from "../lib/api/ynxApi.js";

const navigation = [
  ["Network", "/#network"],
  ["Ecosystem", "/#ecosystem"],
  ["Developers", "/#developers"],
  ["Readiness", "/#readiness"],
  ["Docs", "/docs"]
];

export function SiteHeader({ scrollProgress = 0 }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="siteHeader">
      <span className="scrollProgress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
      <a className="brand" href="/" aria-label="YNX Chain home"><span>YNX</span><small>CHAIN</small></a>
      <nav className={open ? "open" : ""} aria-label="Primary navigation">
        {navigation.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="navExplorer" href={apiConfig.explorerUrl}>Explorer <ExternalLink size={14} /></a>
      </nav>
      <button className="menuButton" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
