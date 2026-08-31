import React from "react";
import { ExternalLink, Menu, Moon, Search, Sun, WalletCards, X } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { apiConfig, networkParams, YNX_6423 } from "../lib/api/ynxApi.js";
import { SUPPORTED_LOCALES, useLocale } from "../lib/i18n.jsx";
import { connectCanonicalProvider, discoverCanonicalProviders, switchCanonicalProviderToYNX } from "../lib/walletProvider.js";

const CommandPalette = lazy(() => import("./CommandPalette.jsx").then((module) => ({ default: module.CommandPalette })));

const navigation = [
  ["blockchain", "/blockchain"], ["tokens", "/tokens"], ["data", "/data"],
  ["governance", "/governance"], ["ecosystem", "/ecosystem"], ["developers", "/developers"],
  ["downloads", "/downloads"], ["docs", "/docs"], ["more", "/more"]
];

const localeLabels = {
  en: "EN", "zh-CN": "简体", "zh-TW": "繁體", ja: "日本語", ko: "한국어",
  es: "Español", fr: "Français", de: "Deutsch", pt: "Português", ru: "Русский",
  ar: "العربية", id: "Bahasa Indonesia"
};

export function SiteHeader({ scrollProgress = 0 }) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [wallet, setWallet] = useState({ state: "idle" });
  const [providers, setProviders] = useState([]);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const commandReturnFocusRef = useRef(null);
  const walletButtonRef = useRef(null);
  const walletMenuRef = useRef(null);
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
    if (!open) return undefined;
    const frame = window.requestAnimationFrame(() => navRef.current?.querySelector("a")?.focus());
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!walletMenuOpen) return undefined;
    const frame = window.requestAnimationFrame(() => walletMenuRef.current?.querySelector("button")?.focus());
    const onPointerDown = (event) => {
      if (walletMenuRef.current?.contains(event.target) || walletButtonRef.current?.contains(event.target)) return;
      setWalletMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [walletMenuOpen]);

  useEffect(() => discoverCanonicalProviders({ onChange: setProviders }), []);

  const connectWallet = async (entry) => {
    if (!entry?.provider?.request || !entry?.identity?.accepted) {
      setWallet({ state: "unavailable" });
      return;
    }
    setWallet({ state: "connecting" });
    try {
      // Account access is requested only after the visitor explicitly presses this button.
      const { account, chainId } = await connectCanonicalProvider(entry);
      setWallet({
        state: "connected",
        account,
        chainId,
        provider: entry.identity.label,
        walletProvider: entry
      });
      setWalletMenuOpen(true);
    } catch (error) {
      setWallet({ state: "error", message: error?.code === 4001 ? t("walletRequestRejected") : t("walletConnectionFailed") });
    }
  };

  const activateWallet = () => {
    if (wallet.state === "connected") {
      setWalletMenuOpen((openState) => !openState);
      return;
    }
    if (providers.length === 1) {
      connectWallet(providers[0]);
      return;
    }
    if (providers.length > 1) {
      setWalletMenuOpen((openState) => !openState);
      return;
    }
    setWallet({ state: "unavailable" });
  };

  const closeWalletMenu = (returnFocus = false) => {
    setWalletMenuOpen(false);
    if (returnFocus) window.requestAnimationFrame(() => walletButtonRef.current?.focus());
  };

  const onWalletMenuKeyDown = (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeWalletMenu(true);
  };

  const switchToYNX = async () => {
    const entry = wallet.walletProvider;
    if (!entry?.provider?.request) return;
    try {
      await switchCanonicalProviderToYNX(entry, networkParams());
    } catch {
      setWallet((current) => ({ ...current, state: "error", message: t("walletNetworkFailed") }));
      return;
    }
    setWallet((current) => ({ ...current, chainId: YNX_6423.evmChainId, state: "connected" }));
  };

  const walletLabel = wallet.state === "connected"
    ? `${wallet.provider} · ${wallet.account.slice(0, 6)}…${wallet.account.slice(-4)}`
    : wallet.state === "connecting" ? t("connectingWallet")
      : wallet.state === "unavailable" ? t("walletUnavailable")
        : wallet.state === "error" ? wallet.message : t("connectWallet");

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => {
          if (!value) commandReturnFocusRef.current = document.activeElement;
          return !value;
        });
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
        <nav ref={navRef} id="primary-navigation" className={open ? "open" : ""} aria-label={t("primaryNav")}>
          {navigation.map(([key, href]) => <a key={key} href={href} onClick={() => setOpen(false)}>{t(key)}</a>)}
          <a className="navExplorer" href={apiConfig.explorerUrl} aria-label={`${t("explorer")} — external site`}>{t("openExplorer")} <ExternalLink size={14} /></a>
        </nav>
        <div className="headerTools">
          <button ref={searchButtonRef} type="button" className="toolButton searchButton" onClick={() => { commandReturnFocusRef.current = searchButtonRef.current; setCommandOpen(true); }} aria-label={t("searchOpen")} aria-haspopup="dialog" aria-expanded={commandOpen} aria-controls="command-palette">
            <Search /><span>{t("search")}</span><kbd>⌘K</kbd>
          </button>
          <button ref={walletButtonRef} type="button" className={`walletConnect ${wallet.state}`} onClick={activateWallet} aria-haspopup="dialog" aria-expanded={walletMenuOpen} aria-controls="wallet-connection-dialog" aria-label={walletLabel} title={walletLabel}>
            <WalletCards /><span>{walletLabel}</span>
          </button>
          <span className="visuallyHidden" role="status" aria-live="polite">{walletLabel}</span>
          {walletMenuOpen ? <div ref={walletMenuRef} id="wallet-connection-dialog" className="walletMenu" role="dialog" aria-label={t("walletMenu")} onKeyDown={onWalletMenuKeyDown}>
            <div className="walletMenuHeader"><strong>{t("walletMenu")}</strong><button type="button" className="walletMenuClose" onClick={() => closeWalletMenu(true)} aria-label={t("commandClose")}><X /></button></div>
            {wallet.state === "connected" ? <>
              <p><strong>{wallet.provider}</strong><span>{wallet.account}</span></p>
              <p className={wallet.chainId === YNX_6423.evmChainId ? "walletNetwork ready" : "walletNetwork"}>{t("walletNetwork")}: {wallet.chainId || t("unavailable")}</p>
              {wallet.chainId !== YNX_6423.evmChainId ? <button type="button" onClick={switchToYNX}>{t("switchTo6423")}</button> : null}
              <button type="button" className="quiet" onClick={() => { setWallet({ state: "idle" }); closeWalletMenu(true); }}>{t("disconnectWallet")}</button>
            </> : providers.map((entry, index) => <button type="button" key={`${entry.info.uuid || entry.identity.rdns}-${index}`} onClick={() => connectWallet(entry)}>{entry.identity.label}</button>)}
          </div> : null}
          <label className="localeSelect" aria-label={t("language")}>
            <span className="visuallyHidden">{t("language")}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value)}>
              {SUPPORTED_LOCALES.map((value) => <option value={value} key={value}>{localeLabels[value] || value}</option>)}
            </select>
          </label>
          <button type="button" className="toolButton" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button ref={menuButtonRef} type="button" className="menuButton" aria-expanded={open} aria-controls="primary-navigation" aria-label={t(open ? "closeNav" : "openNav")} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {commandOpen && <Suspense fallback={<div className="commandLoading" role="status">Loading search…</div>}><CommandPalette open onClose={() => setCommandOpen(false)} returnFocusRef={commandReturnFocusRef} /></Suspense>}
    </>
  );
}
