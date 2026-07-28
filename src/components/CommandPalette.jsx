import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppWindow, BookOpen, Braces, CircleHelp, FileText, Search, ShieldCheck,
  X
} from "lucide-react";
import docsAuthority from "virtual:ynx-docs-authority";
import { getCatalog } from "../lib/ecosystemCatalog.js";

const coreCommands = [
  { title: "Products", description: "Browse every evidence-backed YNX product state", href: "/apps", icon: AppWindow, keywords: "apps ecosystem product" },
  { title: "User manual", description: "Connect, inspect, build, and recover safely", href: "/manual", icon: BookOpen, keywords: "guide help onboarding wallet testnet" },
  { title: "Developer documentation", description: "SDK, integration, and technical references", href: "/docs", icon: Braces, keywords: "developer sdk code docs" },
  { title: "API reference", description: "REST, EVM JSON-RPC, status, and service endpoints", href: "/api", icon: FileText, keywords: "rpc endpoint api reference" },
  { title: "FAQ", description: "Answers with evidence and claim boundaries", href: "/faq", icon: CircleHelp, keywords: "questions support help" },
  { title: "Security", description: "Controls, limitations, and responsible reporting", href: "/security", icon: ShieldCheck, keywords: "security audit risk report vulnerability" },
  { title: "Status", description: "Public testnet state and release boundaries", href: "/status", icon: Search, keywords: "network live health recovery" },
  { title: "Support", description: "Safe support paths and self-service checks", href: "/support", icon: CircleHelp, keywords: "support issue recovery contact" },
];

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => {
    const articleCommands = docsAuthority.articles.map((article) => ({
      title: article.h1,
      description: article.description,
      href: article.route,
      icon: FileText,
      keywords: `authority ${article.route}`,
    }));
    const productCommands = getCatalog().map((product) => ({
      title: product.name,
      description: product.detail,
      href: product.route,
      icon: product.icon,
      keywords: `product ${product.key} ${product.status}`,
    }));
    const seen = new Set();
    return [...coreCommands, ...articleCommands, ...productCommands].filter((command) => {
      if (seen.has(command.href)) return false;
      seen.add(command.href);
      return true;
    });
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return commands.slice(0, 12);
    return commands.filter((command) =>
      `${command.title} ${command.description} ${command.keywords || ""}`.toLocaleLowerCase().includes(needle)
    ).slice(0, 12);
  }, [commands, query]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setActiveIndex(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(results.length - 1, 0)));
  }, [results.length]);

  if (!open) return null;

  const openResult = (command) => {
    if (!command) return;
    window.location.assign(command.href);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      openResult(results[activeIndex]);
    }
  };

  return (
    <div className="commandBackdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="commandPalette" role="dialog" aria-modal="true" aria-labelledby="command-title" onKeyDown={onKeyDown}>
        <header className="commandSearch">
          <Search aria-hidden="true" />
          <label className="visuallyHidden" htmlFor="command-query" id="command-title">Search YNX Chain</label>
          <input
            ref={inputRef}
            id="command-query"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search products, docs, API, security…"
            autoComplete="off"
          />
          <button type="button" onClick={onClose} aria-label="Close command palette"><X /></button>
        </header>
        <p className="commandSummary" role="status">
          {query.trim() ? `${results.length} results` : "Quick navigation"}
        </p>
        <div className="commandResults" role="listbox" aria-label="Search results">
          {results.map((command, index) => {
            const Icon = command.icon;
            return (
              <button
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
            <div className="commandEmpty">
              <Search aria-hidden="true" />
              <strong>No matching YNX resource</strong>
              <span>Try “wallet”, “API”, “security”, or “testnet”.</span>
            </div>
          )}
        </div>
        <footer><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>Esc</kbd> Close</span></footer>
      </section>
    </div>
  );
}
