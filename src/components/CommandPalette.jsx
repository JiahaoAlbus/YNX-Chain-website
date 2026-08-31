import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppWindow, BookOpen, Braces, CircleHelp, FileText, Search, ShieldCheck,
  X
} from "lucide-react";
import docsAuthority from "virtual:ynx-docs-authority";
import { getCatalog } from "../lib/ecosystemCatalog.js";
import { PRODUCT_PUBLIC_SECTIONS, productSectionRoute } from "../lib/productPublicContract.js";
import { apiConfig } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";
import { ECONOMIC_COMMANDS } from "../lib/economicsEvidence.js";

const coreCommands = (t) => [
  { title: "DApps", description: "Browse every evidence-backed YNX software product", href: "/dapp", icon: AppWindow, keywords: "dapp apps software ecosystem product" },
  { title: "User manual", description: "Connect, inspect, build, and recover safely", href: "/manual", icon: BookOpen, keywords: "guide help onboarding wallet testnet" },
  { title: "Developer documentation", description: "SDK, integration, and technical references", href: "/docs", icon: Braces, keywords: "developer sdk code docs" },
  { title: "API reference", description: "REST, EVM JSON-RPC, status, and service endpoints", href: "/api", icon: FileText, keywords: "rpc endpoint api reference" },
  { title: "FAQ", description: "Answers with evidence and claim boundaries", href: "/faq", icon: CircleHelp, keywords: "questions support help" },
  { title: "Security", description: "Controls, limitations, and responsible reporting", href: "/security", icon: ShieldCheck, keywords: "security audit risk report vulnerability" },
  { title: "Status", description: "Public testnet state and release boundaries", href: "/status", icon: Search, keywords: "network live health recovery" },
  { title: "Support", description: "Safe support paths and self-service checks", href: "/support", icon: CircleHelp, keywords: "support issue recovery contact" },
];

export function CommandPalette({ open, onClose, returnFocusRef: preferredReturnFocusRef }) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchError, setSearchError] = useState("");
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);

  const commands = useMemo(() => {
    const articleCommands = docsAuthority.articles.map((article) => ({
      title: article.h1,
      description: article.description,
      href: article.route,
      icon: FileText,
      keywords: `authority ${article.route}`,
    }));
    const productCommands = getCatalog().flatMap((product) => PRODUCT_PUBLIC_SECTIONS.map((section) => ({
      title: section.id === "overview" ? product.name : `${product.name} · ${section.label}`,
      description: section.id === "overview" ? product.detail : section.description,
      href: productSectionRoute(product.route, section.id),
      icon: product.icon,
      keywords: `product ${product.key} ${product.status} ${section.id} ${section.label}`,
    })));
    const seen = new Set();
    const economicCommands = ECONOMIC_COMMANDS.map((command) => ({ ...command, icon: CircleHelp }));
    return [...coreCommands(t), ...economicCommands, ...articleCommands, ...productCommands].filter((command) => {
      if (seen.has(command.href)) return false;
      seen.add(command.href);
      return true;
    });
  }, [t]);

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return commands.slice(0, 12);
    return commands.filter((command) =>
      `${command.title} ${command.description} ${command.keywords || ""}`.toLocaleLowerCase().includes(needle)
    ).slice(0, 12);
  }, [commands, query]);

  useEffect(() => {
    if (!open) return undefined;
    returnFocusRef.current = preferredReturnFocusRef?.current || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setQuery("");
    setActiveIndex(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      const target = returnFocusRef.current;
      window.requestAnimationFrame(() => target?.isConnected && target.focus());
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(results.length - 1, 0)));
  }, [results.length]);

  if (!open) return null;

  const openResult = async (command) => {
    if (!command) return;
    window.location.assign(command.href);
  };

  const searchExplorer = async () => {
    const q = query.trim();
    if (!q) return;
    setSearchError("");
    try {
      const response = await fetch(`/api/explorer/resolve?q=${encodeURIComponent(q)}`, { cache: "no-store" });
      const resolved = await response.json();
      if (!response.ok || !resolved.deepLink) throw new Error(resolved.error || t("explorerSearchUnavailable"));
      window.location.assign(`${apiConfig.explorerUrl}${resolved.deepLink}`);
    } catch (error) {
      setSearchError(error.message || t("explorerSearchUnavailable"));
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Tab") {
      const focusable = [...(dialogRef.current?.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
      ) || [])].filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && query.trim()) {
      event.preventDefault();
      searchExplorer();
    } else if (event.key === "Enter") {
      event.preventDefault();
      openResult(results[activeIndex]);
    }
  };

  return (
    <div className="commandBackdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} id="command-palette" className="commandPalette" role="dialog" aria-modal="true" aria-labelledby="command-title" aria-describedby="command-summary" onKeyDown={onKeyDown}>
        <h2 className="visuallyHidden" id="command-title">{t("commandTitle")}</h2>
        <header className="commandSearch">
          <Search aria-hidden="true" />
          <label className="visuallyHidden" htmlFor="command-query">{t("commandTitle")}</label>
          <input
            ref={inputRef}
            id="command-query"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={results[activeIndex] ? `command-option-${activeIndex}` : undefined}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder={t("commandPlaceholder")}
            autoComplete="off"
          />
          <button type="button" onClick={onClose} aria-label={t("commandClose")}><X /></button>
        </header>
        <p className="commandSummary" id="command-summary" role="status">
          {query.trim() ? t("commandResults").replace("{count}", results.length) : t("commandQuickNavigation")}
        </p>
        <div className="commandResults">
          {query.trim() && <button type="button" className="explorerSearchResult" onClick={searchExplorer}><Search aria-hidden="true" /><span><strong>{t("commandSearchExplorer")}</strong><small>{t("commandExplorerTypes")}</small></span><kbd>↵</kbd></button>}
          <div className="commandOptions" id="command-results" role="listbox" aria-label={t("commandSearchResults")}>
          {results.map((command, index) => {
            const Icon = command.icon;
            return (
              <button
                id={`command-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "active" : ""}
                key={command.href}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => openResult(command)}
              >
                <Icon aria-hidden="true" />
                <span><strong>{command.title}</strong><small>{command.description}</small></span>
                <kbd>↵</kbd>
              </button>
            );
          })}
          {!results.length && (
            <div className="commandEmpty" role="status">
              <Search aria-hidden="true" />
              <strong>{t("commandNoMatch")}</strong>
              <span>{t("commandTry")}</span>
            </div>
          )}
          </div>
          {searchError && <p className="commandSearchError" role="alert">{searchError}</p>}
        </div>
        <footer><span><kbd>↑</kbd><kbd>↓</kbd> {t("commandNavigate")}</span><span><kbd>Esc</kbd> {t("commandClose")}</span></footer>
      </section>
    </div>
  );
}
