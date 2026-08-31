import React from "react";
import { ExternalLink, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { CommandPalette } from "./CommandPalette.jsx";
import { useLocale } from "../lib/i18n.jsx";

const navigation = [
  ["blockchain", "/blockchain"], ["tokens", "/tokens"], ["data", "/data"],
  ["governance", "/governance"], ["ecosystem", "/ecosystem"], ["developers", "/developers"],
  ["downloads", "/downloads"], ["docs", "/docs"], ["more", "/more"]
];

export function SiteHeader({ scrollProgress = 0 }) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("ynx-theme");
    return saved === "dark" || saved === "light"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("ynx-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.removeItem("ynx-direction");
  }, []);

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
      <a className="skipLink" href="#main-content">{t("skip")}</a>
      <header className="siteHeader">
        <span className="scrollProgress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
        <a className="brand" href="/" aria-label={t("home")}><img src="/ynx-logo.png" alt="" /><small>CHAIN</small></a>
        <nav className={open ? "open" : ""} aria-label={t("primaryNav")}>
          {navigation.map(([key, href]) => <a key={key} href={href} onClick={() => setOpen(false)}>{t(key)}</a>)}
          <a className="navExplorer" href={apiConfig.explorerUrl} aria-label={`${t("explorer")} — external site`}>{t("openExplorer")} <ExternalLink size={14} /></a>
        </nav>
        <div className="headerTools">
          <button type="button" className="toolButton searchButton" onClick={() => setCommandOpen(true)} aria-label={t("searchOpen")}>
            <Search /><span>{t("search")}</span><kbd>⌘K</kbd>
          </button>
          <label className="localeSelect" aria-label={t("language")}>
            <span className="visuallyHidden">{t("language")}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value)}>
              <option value="en">EN</option><option value="zh-CN">简体</option><option value="zh-TW">繁體</option><option value="ja">日本語</option><option value="ko">한국어</option>
            </select>
          </label>
          <button type="button" className="toolButton" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button type="button" className="menuButton" aria-expanded={open} aria-label={t(open ? "closeNav" : "openNav")} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
