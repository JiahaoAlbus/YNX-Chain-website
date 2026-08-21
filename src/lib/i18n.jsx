import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const SUPPORTED_LOCALES = ["en", "zh-CN"];

const messages = {
  en: {
    skip: "Skip to content", home: "YNX Chain home", primaryNav: "Primary navigation",
    products: "Products", dapps: "DApps", ecosystem: "Ecosystem", download: "Download", manual: "Manual", docs: "Docs", status: "Status", explorer: "Explorer",
    search: "Search", searchOpen: "Search and open command palette", light: "Use light mode", dark: "Use dark mode",
    openNav: "Open navigation", closeNav: "Close navigation", language: "Language", switchLanguage: "切换到简体中文",
    footerLead: "Web4 L1 ecosystem built around YNXT.", userManual: "User manual", developerDocs: "Developer docs", api: "API", faq: "FAQ",
    security: "Security", support: "Support", square: "Square", readiness: "Readiness", risk: "Risk", privacy: "Privacy", terms: "Terms",
    footerBoundary: "Public testnet project. No mainnet launch, exchange listing, stablecoin issuer support, wallet default support, or third-party partnership is claimed."
  },
  "zh-CN": {
    skip: "跳到正文", home: "YNX Chain 首页", primaryNav: "主导航",
    products: "产品", dapps: "DApp", ecosystem: "生态", download: "下载", manual: "使用手册", docs: "文档", status: "状态", explorer: "浏览器",
    search: "搜索", searchOpen: "搜索并打开命令面板", light: "切换到浅色模式", dark: "切换到深色模式",
    openNav: "打开导航", closeNav: "关闭导航", language: "语言", switchLanguage: "Switch to English",
    footerLead: "围绕 YNXT 构建的 Web4 L1 生态系统。", userManual: "用户手册", developerDocs: "开发者文档", api: "API", faq: "常见问题",
    security: "安全", support: "支持", square: "广场", readiness: "就绪度", risk: "风险", privacy: "隐私", terms: "条款",
    footerBoundary: "公开测试网项目。未宣称主网上线、交易所上币、稳定币发行方支持、钱包默认支持或第三方合作关系。"
  }
};

const LocaleContext = createContext({ locale: "en", setLocale: () => {}, t: (key) => key });

function enforceNativeLtr() {
  for (const element of [document.documentElement, document.body]) {
    if (!element) continue;
    if (element.getAttribute("dir") !== "ltr") element.setAttribute("dir", "ltr");
    if (element.style.getPropertyValue("direction") !== "ltr" || element.style.getPropertyPriority("direction") !== "important") {
      element.style.setProperty("direction", "ltr", "important");
    }
  }
}

function normalizeLocale(value) {
  return value === "zh-CN" || String(value || "").toLowerCase().startsWith("zh") ? "zh-CN" : "en";
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const queryLocale = new URLSearchParams(window.location.search).get("lang");
    const saved = window.localStorage.getItem("ynx-locale");
    // navigator.language remains a browser capability, but public entry defaults to English.
    return normalizeLocale(queryLocale || saved || "en");
  });

  const setLocale = (next) => setLocaleState(normalizeLocale(next));

  useEffect(() => {
    document.documentElement.lang = locale;
    enforceNativeLtr();
    document.documentElement.dataset.locale = locale;
    document.title = locale === "zh-CN" ? "YNX Chain — Web4 Layer-1 生态系统" : "YNX Chain — Web4 Layer-1 Ecosystem";
    window.localStorage.setItem("ynx-locale", locale);
  }, [locale]);

  useEffect(() => {
    enforceNativeLtr();
    const observer = new MutationObserver(enforceNativeLtr);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["dir", "style"] });
    if (document.body) observer.observe(document.body, { attributes: true, attributeFilter: ["dir", "style"] });
    return () => observer.disconnect();
  }, []);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: (key) => messages[locale]?.[key] || messages.en[key] || key,
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
