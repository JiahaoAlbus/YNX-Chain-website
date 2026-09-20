import React from "react";
import { ExternalLink, Menu, Search, WalletCards, X } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { apiConfig, networkParams, YNX_6423 } from "../lib/api/ynxApi.js";
import { SUPPORTED_LOCALES, useLocale } from "../lib/i18n.jsx";
import { connectCanonicalProvider, discoverCanonicalProviders, subscribeCanonicalProvider, switchCanonicalProviderToYNX } from "../lib/walletProvider.js";
import { getWalletEntryCopy } from "../content/walletEntryContent.js";
import { getContactCopy } from "../content/contactLocaleContent.js";
import { normalizeYNXAddress } from "../lib/addressCodec.js";
import { getAddressCopy } from "../content/addressCopy.js";

const CommandPalette = lazy(() => import("./CommandPalette.jsx").then((module) => ({ default: module.CommandPalette })));

const navigation = [
  ["blockchain", "/blockchain"], ["tokens", "/tokens"], ["data", "/data"],
  ["governance", "/governance"], ["ecosystem", "/ecosystem"], ["developers", "/developers"],
  ["downloads", "/downloads"], ["docs", "/docs"], ["manual", "/manual"], ["api", "/api"], ["contact", "/contact"], ["more", "/more"]
];

const localeLabels = {
  en: "EN", "zh-CN": "简体", "zh-TW": "繁體", ja: "日本語", ko: "한국어",
  es: "Español", fr: "Français", de: "Deutsch", pt: "Português", ru: "Русский",
  ar: "العربية", id: "Bahasa Indonesia"
};

export function SiteHeader({ networkRequest = 0 }) {
  const { locale, setLocale, t } = useLocale();
  const walletCopy = getWalletEntryCopy(locale);
  const contactCopy = getContactCopy(locale);
  const addressCopy = getAddressCopy(locale);
  const [open, setOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [wallet, setWallet] = useState({ state: "idle" });
  const [providers, setProviders] = useState([]);
  const ynxProviders = providers.filter(entry => entry.identity.kind === "ynx");
  const externalProviders = providers.filter(entry => entry.identity.kind !== "ynx");
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [walletIntent, setWalletIntent] = useState("connect");
  const connectionAttempt = useRef(0);
  const navRef = useRef(null);
  const menuButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const commandReturnFocusRef = useRef(null);
  const walletButtonRef = useRef(null);
  const walletMenuRef = useRef(null);
  const progressRef = useRef(null);
  const theme = "light";

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const progress = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    paint();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

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

  useEffect(() => discoverCanonicalProviders({ onChange: setProviders, includeExternal: true }), []);

  useEffect(() => {
    if (!networkRequest) return;
    setWalletIntent("network");
    setWalletMenuOpen(true);
  }, [networkRequest]);

  useEffect(() => {
    const entry = wallet.walletProvider;
    if (!entry) return;
    return subscribeCanonicalProvider(entry, (event) => {
      setWallet((current) => {
        if (current.walletProvider !== entry) return current;
        if (event.type === "disconnect" || (event.type === "accountsChanged" && !event.accounts.length)) {
          connectionAttempt.current += 1;
          return { state: "idle" };
        }
        if (event.type === "accountsChanged") return { ...current, account: event.accounts[0] };
        if (event.type === "chainChanged") return { ...current, chainId: event.chainId };
        return current;
      });
    }, { basicConnection: entry.identity.kind !== "ynx" });
  }, [wallet.walletProvider]);

  const connectWallet = async (entry) => {
    const attempt = ++connectionAttempt.current;
    if (!entry?.provider?.request || !entry?.identity?.accepted) {
      setWallet({ state: "unavailable" });
      return;
    }
    setWallet({ state: "connecting" });
    try {
      // Account access is requested only after the visitor explicitly presses this button.
      const { account, chainId } = await connectCanonicalProvider(entry, { basicConnection: entry.identity.kind !== "ynx" });
      if (attempt !== connectionAttempt.current) return;
      setWallet({
        state: "connected",
        account,
        chainId,
        provider: entry.identity.label,
        walletProvider: entry
      });
      setWalletMenuOpen(true);
    } catch (error) {
      if (attempt !== connectionAttempt.current) return;
      setWallet({ state: "error", message: error?.code === 4001 ? t("walletRequestRejected") : t("walletConnectionFailed") });
    }
  };

  const activateWallet = () => {
    setWalletIntent("connect");
    if (wallet.state === "connected") {
      setWalletMenuOpen((openState) => !openState);
      return;
    }
    if (ynxProviders.length === 1) {
      connectWallet(ynxProviders[0]);
      return;
    }
    if (ynxProviders.length > 1) {
      setWalletMenuOpen((openState) => !openState);
      return;
    }
    setWallet({ state: "unavailable" });
    setWalletMenuOpen(true);
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

  const switchToYNX = async (entry = wallet.walletProvider) => {
    if (!entry?.provider?.request) return;
    try {
      await switchCanonicalProviderToYNX(entry, networkParams(), { basicConnection: entry.identity.kind !== "ynx" });
    } catch {
      setWallet((current) => ({ ...current, state: "error", message: t("walletNetworkFailed") }));
      return;
    }
    setWallet((current) => current.walletProvider === entry ? { ...current, chainId: YNX_6423.evmChainId, state: "connected" } : { state: "idle" });
    setWalletIntent("connect");
    closeWalletMenu(true);
  };

  const walletAddress = useMemo(() => {
    if (wallet.state !== "connected") return null;
    try { return normalizeYNXAddress(wallet.account); } catch { return null; }
  }, [wallet.state, wallet.account]);
  const shortAddress = walletAddress ? `${walletAddress.ynxAddress.slice(0, 8)}…${walletAddress.ynxAddress.slice(-6)}` : addressCopy.unavailable;
  const connectedProviderLabel = `${wallet.provider}${wallet.walletProvider?.identity.kind !== "ynx" ? ` · ${walletCopy.basic}` : ""}`;
  const walletLabel = wallet.state === "connected"
    ? `${shortAddress} · ${connectedProviderLabel}`
    : wallet.state === "connecting" ? t("connectingWallet")
      : wallet.state === "unavailable" ? walletCopy.unavailable
        : wallet.state === "error" ? wallet.message : walletCopy.connect;
  const walletAccessibleLabel = wallet.state === "connected" && walletAddress
    ? `${connectedProviderLabel} · ${addressCopy.native}: ${walletAddress.ynxAddress}` : walletLabel;

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
        <span ref={progressRef} className="scrollProgress" aria-hidden="true" />
        <a className="brand" href="/" aria-label={t("home")}><img src="/ynx-logo.png" alt="" /><small>CHAIN</small></a>
        <nav ref={navRef} id="primary-navigation" className={open ? "open" : ""} aria-label={t("primaryNav")}>
          {navigation.map(([key, href]) => <a className={["ecosystem", "manual", "api", "docs", "downloads"].includes(key) ? "primaryNavItem" : "secondaryNavItem"} key={key} href={href} onClick={() => setOpen(false)}>{key === "contact" ? contactCopy.nav : key === "manual" ? contactCopy.manual : key === "api" ? contactCopy.api : t(key)}</a>)}
          <a className="navExplorer secondaryNavItem" href={apiConfig.explorerUrl} aria-label={`${t("explorer")} — external site`}>{t("openExplorer")} <ExternalLink size={14} /></a>
        </nav>
        <div className="headerTools">
          <button ref={searchButtonRef} type="button" className="toolButton searchButton" onClick={() => { commandReturnFocusRef.current = searchButtonRef.current; setCommandOpen(true); }} aria-label={t("searchOpen")} aria-haspopup="dialog" aria-expanded={commandOpen} aria-controls="command-palette">
            <Search /><span>{t("search")}</span><kbd>⌘K</kbd>
          </button>
          <button ref={walletButtonRef} type="button" className={`walletConnect ${wallet.state}`} onClick={activateWallet} aria-haspopup="dialog" aria-expanded={walletMenuOpen} aria-controls="wallet-connection-dialog" aria-label={walletAccessibleLabel} title={walletAccessibleLabel}>
            <WalletCards /><span>{wallet.state === "connected" && walletAddress ? <><bdi dir="ltr">{shortAddress}</bdi> · {connectedProviderLabel}</> : walletLabel}</span>
          </button>
          <span className="visuallyHidden" role="status" aria-live="polite">{walletAccessibleLabel}</span>
          {walletMenuOpen ? <div ref={walletMenuRef} id="wallet-connection-dialog" className="walletMenu" role="dialog" aria-label={t("walletMenu")} onKeyDown={onWalletMenuKeyDown}>
            <div className="walletMenuHeader"><strong>{t("walletMenu")}</strong><button type="button" className="walletMenuClose" onClick={() => closeWalletMenu(true)} aria-label={t("commandClose")}><X /></button></div>
            {wallet.state === "connected" && walletIntent !== "network" ? <>
              <p><strong>{wallet.provider}</strong></p>
              {walletAddress ? <>
                <p><strong>{addressCopy.native}</strong><span><bdi dir="ltr">{walletAddress.ynxAddress}</bdi></span></p>
                <details className="otherWallets"><summary>{addressCopy.details}</summary><p><strong>{addressCopy.evm}</strong><span><bdi dir="ltr">{walletAddress.evmAddress}</bdi></span></p><p>{addressCopy.sameAccount}</p></details>
              </> : <p role="status">{addressCopy.unavailable}</p>}
              {wallet.walletProvider.identity.kind !== "ynx" && <p>{walletCopy.limits}<a href={`/dapp/wallet/open-download?lang=${encodeURIComponent(locale)}`}>{walletCopy.download}</a></p>}
              <p className={wallet.chainId === YNX_6423.evmChainId ? "walletNetwork ready" : "walletNetwork"}>{t("walletNetwork")}: {wallet.chainId || t("unavailable")}</p>
              {wallet.chainId !== YNX_6423.evmChainId ? <button type="button" onClick={() => switchToYNX()}>{t("switchTo6423")}</button> : null}
              <button type="button" className="quiet" onClick={() => { connectionAttempt.current += 1; setWallet({ state: "idle" }); closeWalletMenu(true); }}>{t("disconnectWallet")}</button>
            </> : <>
              {!ynxProviders.length ? <><p>{walletCopy.help}</p><a href={`/dapp/wallet/open-download?lang=${encodeURIComponent(locale)}`}>{walletCopy.download}</a></> : ynxProviders.map((entry, index) => <button type="button" key={index} onClick={() => walletIntent === "network" ? switchToYNX(entry) : connectWallet(entry)}>{walletIntent === "network" ? t("switchTo6423") : walletCopy.connect}</button>)}
              {externalProviders.length > 0 && <details className="otherWallets"><summary>{walletCopy.other}</summary><p>{walletCopy.limits}</p>{externalProviders.map((entry, index) => <button type="button" className="quiet" key={index} onClick={() => walletIntent === "network" ? switchToYNX(entry) : connectWallet(entry)}>{entry.identity.label} · {walletCopy.basic}</button>)}</details>}
            </>}
          </div> : null}
          <label className="localeSelect" aria-label={t("language")}>
            <span className="visuallyHidden">{t("language")}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value)}>
              {SUPPORTED_LOCALES.map((value) => <option value={value} key={value}>{localeLabels[value] || value}</option>)}
            </select>
          </label>
          <button ref={menuButtonRef} type="button" className="menuButton" aria-expanded={open} aria-controls="primary-navigation" aria-label={t(open ? "closeNav" : "openNav")} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {commandOpen && <Suspense fallback={<div className="commandLoading" role="status">{t("checking")}</div>}><CommandPalette open onClose={() => setCommandOpen(false)} returnFocusRef={commandReturnFocusRef} /></Suspense>}
    </>
  );
}
