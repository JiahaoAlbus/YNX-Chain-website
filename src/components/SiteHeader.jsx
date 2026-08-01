import React from "react";
import { ExternalLink, Languages, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { CommandPalette } from "./CommandPalette.jsx";

const navigation = [
  ["Products", "/#ecosystem"],
  ["DApps", "/dapp"],
  ["Download", "/dapp/download"],
  ["Manual", "/manual"],
  ["Docs", "/docs"],
  ["Status", "/status"]
];

export function SiteHeader({ scrollProgress = 0 }) {
  const [open, setOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("ynx-theme");
    return saved === "dark" || saved === "light"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [direction, setDirection] = useState(() => window.localStorage.getItem("ynx-direction") === "rtl" ? "rtl" : "ltr");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("ynx-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = direction;
    window.localStorage.setItem("ynx-direction", direction);
  }, [direction]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <a className="skipLink" href="#main-content">Skip to content</a>
      <header className="siteHeader">
        <span className="scrollProgress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
        <a className="brand" href="/" aria-label="YNX Chain home"><img src="/ynx-logo.png" alt="" /><small>CHAIN</small></a>
        <nav className={open ? "open" : ""} aria-label="Primary navigation">
          {navigation.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="navExplorer" href={apiConfig.explorerUrl}>Explorer <ExternalLink size={14} /></a>
        </nav>
        <div className="headerTools">
          <button type="button" className="toolButton searchButton" onClick={() => setCommandOpen(true)} aria-label="Search and open command palette">
            <Search /><span>Search</span><kbd>⌘K</kbd>
          </button>
          <button type="button" className="toolButton" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Use ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button type="button" className="toolButton" onClick={() => setDirection(direction === "rtl" ? "ltr" : "rtl")} aria-label={`Use ${direction === "rtl" ? "left-to-right" : "right-to-left"} layout`}>
            <Languages />
          </button>
          <button type="button" className="menuButton" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
