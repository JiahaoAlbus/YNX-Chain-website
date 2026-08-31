import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const SUPPORTED_LOCALES = ["en", "zh-CN", "zh-TW", "ja", "ko"];

const messages = {
  en: {
    skip: "Skip to content", home: "YNX Chain home", primaryNav: "Primary navigation",
    products: "Products", dapps: "DApps", ecosystem: "YNX Ecosystem", download: "Download", manual: "Manual", docs: "Docs", status: "Status", explorer: "Explorer", openExplorer: "Open Explorer", blockchain: "Blockchain", tokens: "Tokens", data: "Data", governance: "Governance", developers: "Developers", downloads: "Downloads", more: "More",
    search: "Search", searchOpen: "Search and open command palette", connectWallet: "Connect Wallet", connectingWallet: "Connecting…", walletUnavailable: "No wallet found", walletRequestRejected: "Connection declined", walletConnectionFailed: "Connection failed", walletNetworkFailed: "Network change failed", walletMenu: "Wallet connection", walletNetwork: "Network", switchTo6423: "Switch to YNX 6423", disconnectWallet: "Disconnect from this site", unavailable: "Unavailable", light: "Use light mode", dark: "Use dark mode",
    openNav: "Open navigation", closeNav: "Close navigation", language: "Language", switchLanguage: "切换到简体中文",
    footerLead: "Web4 L1 ecosystem built around YNXT.", userManual: "User manual", developerDocs: "Developer docs", api: "API", faq: "FAQ",
    security: "Security", support: "Support", square: "Square", readiness: "Readiness", risk: "Risk", privacy: "Privacy", terms: "Terms", faucet: "Faucet",
    footerBoundary: "Public testnet project. No mainnet launch, exchange listing, stablecoin issuer support, wallet default support, or third-party partnership is claimed."
  },
  "zh-CN": {
    skip: "跳到正文", home: "YNX Chain 首页", primaryNav: "主导航",
    products: "产品", dapps: "DApp", ecosystem: "YNX 生态", download: "下载", manual: "使用手册", docs: "文档", status: "状态", explorer: "浏览器", openExplorer: "打开区块浏览器", blockchain: "区块链", tokens: "代币", data: "数据", governance: "治理", developers: "开发者", downloads: "下载中心", more: "更多",
    search: "搜索", searchOpen: "搜索并打开命令面板", connectWallet: "连接钱包", connectingWallet: "正在连接…", walletUnavailable: "未检测到钱包", walletRequestRejected: "已拒绝连接", walletConnectionFailed: "连接失败", walletNetworkFailed: "切换网络失败", walletMenu: "钱包连接", walletNetwork: "网络", switchTo6423: "切换到 YNX 6423", disconnectWallet: "从本站断开", unavailable: "暂不可用", light: "切换到浅色模式", dark: "切换到深色模式",
    openNav: "打开导航", closeNav: "关闭导航", language: "语言", switchLanguage: "Switch to English",
    footerLead: "围绕 YNXT 构建的 Web4 L1 生态系统。", userManual: "用户手册", developerDocs: "开发者文档", api: "API", faq: "常见问题",
    security: "安全", support: "支持", square: "广场", readiness: "就绪度", risk: "风险", privacy: "隐私", terms: "条款", faucet: "水龙头",
    footerBoundary: "公开测试网项目。未宣称主网上线、交易所上币、稳定币发行方支持、钱包默认支持或第三方合作关系。"
  },
  "zh-TW": {
    skip:"跳至內容",home:"YNX Chain 首頁",primaryNav:"主要導覽",products:"產品",dapps:"DApp",ecosystem:"YNX 生態",download:"下載",manual:"使用手冊",docs:"文件",status:"狀態",explorer:"瀏覽器",openExplorer:"開啟區塊瀏覽器",blockchain:"區塊鏈",tokens:"代幣",data:"資料",governance:"治理",developers:"開發者",downloads:"下載中心",more:"更多",search:"搜尋",searchOpen:"搜尋並開啟命令面板",connectWallet:"連接錢包",connectingWallet:"正在連接…",walletUnavailable:"未偵測到錢包",walletRequestRejected:"已拒絕連接",walletConnectionFailed:"連接失敗",walletNetworkFailed:"切換網路失敗",walletMenu:"錢包連線",walletNetwork:"網路",switchTo6423:"切換至 YNX 6423",disconnectWallet:"從本站中斷連線",unavailable:"暫不可用",light:"切換至淺色模式",dark:"切換至深色模式",openNav:"開啟導覽",closeNav:"關閉導覽",language:"語言",switchLanguage:"切換語言",footerLead:"以 YNXT 為核心的 Web4 L1 生態系統。",userManual:"使用手冊",developerDocs:"開發者文件",api:"API",faq:"常見問題",security:"安全",support:"支援",square:"廣場",readiness:"就緒度",risk:"風險",privacy:"隱私",terms:"條款",faucet:"水龍頭",footerBoundary:"公開測試網專案；未宣稱主網上線、交易所上幣、錢包預設支援或第三方合作。"
  },
  ja: {
    skip:"本文へ移動",home:"YNX Chain ホーム",primaryNav:"メインナビゲーション",products:"プロダクト",dapps:"DApp",ecosystem:"YNX エコシステム",download:"ダウンロード",manual:"ユーザーガイド",docs:"ドキュメント",status:"ステータス",explorer:"エクスプローラー",openExplorer:"エクスプローラーを開く",blockchain:"ブロックチェーン",tokens:"トークン",data:"データ",governance:"ガバナンス",developers:"開発者",downloads:"ダウンロード",more:"その他",search:"検索",searchOpen:"検索パレットを開く",connectWallet:"ウォレットを接続",connectingWallet:"接続中…",walletUnavailable:"ウォレットが見つかりません",walletRequestRejected:"接続が拒否されました",walletConnectionFailed:"接続できませんでした",walletNetworkFailed:"ネットワークを変更できませんでした",walletMenu:"ウォレット接続",walletNetwork:"ネットワーク",switchTo6423:"YNX 6423 に切り替える",disconnectWallet:"このサイトから切断",unavailable:"利用不可",light:"ライトモードにする",dark:"ダークモードにする",openNav:"ナビゲーションを開く",closeNav:"ナビゲーションを閉じる",language:"言語",switchLanguage:"言語を切り替える",footerLead:"YNXT を中心とする Web4 L1 エコシステム。",userManual:"ユーザーガイド",developerDocs:"開発者ドキュメント",api:"API",faq:"よくある質問",security:"セキュリティ",support:"サポート",square:"スクエア",readiness:"準備状況",risk:"リスク",privacy:"プライバシー",terms:"利用規約",faucet:"フォーセット",footerBoundary:"公開テストネットです。メインネット、上場、ウォレットの標準対応、第三者提携は主張していません。"
  },
  ko: {
    skip:"본문으로 건너뛰기",home:"YNX Chain 홈",primaryNav:"기본 탐색",products:"제품",dapps:"DApp",ecosystem:"YNX 생태계",download:"다운로드",manual:"사용자 가이드",docs:"문서",status:"상태",explorer:"익스플로러",openExplorer:"익스플로러 열기",blockchain:"블록체인",tokens:"토큰",data:"데이터",governance:"거버넌스",developers:"개발자",downloads:"다운로드",more:"더보기",search:"검색",searchOpen:"검색 팔레트 열기",connectWallet:"지갑 연결",connectingWallet:"연결 중…",walletUnavailable:"지갑을 찾을 수 없음",walletRequestRejected:"연결이 거부됨",walletConnectionFailed:"연결 실패",walletNetworkFailed:"네트워크 변경 실패",walletMenu:"지갑 연결",walletNetwork:"네트워크",switchTo6423:"YNX 6423으로 전환",disconnectWallet:"이 사이트에서 연결 해제",unavailable:"사용할 수 없음",light:"라이트 모드 사용",dark:"다크 모드 사용",openNav:"탐색 열기",closeNav:"탐색 닫기",language:"언어",switchLanguage:"언어 전환",footerLead:"YNXT 중심의 Web4 L1 생태계입니다.",userManual:"사용자 가이드",developerDocs:"개발자 문서",api:"API",faq:"자주 묻는 질문",security:"보안",support:"지원",square:"스퀘어",readiness:"준비 상태",risk:"위험",privacy:"개인정보",terms:"이용약관",faucet:"파우셋",footerBoundary:"공개 테스트넷 프로젝트입니다. 메인넷, 거래소 상장, 기본 지갑 지원 또는 제3자 파트너십을 주장하지 않습니다."
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
  const candidate = String(value || "");
  if (SUPPORTED_LOCALES.includes(candidate)) return candidate;
  if (candidate.toLowerCase().startsWith("zh")) return candidate.toLowerCase().includes("tw") || candidate.toLowerCase().includes("hk") ? "zh-TW" : "zh-CN";
  if (candidate.toLowerCase().startsWith("ja")) return "ja";
  if (candidate.toLowerCase().startsWith("ko")) return "ko";
  return "en";
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const queryLocale = new URLSearchParams(window.location.search).get("lang");
    const saved = window.localStorage.getItem("ynx-locale");
    return normalizeLocale(queryLocale || saved || navigator.language);
  });

  const setLocale = (next) => {
    const normalized = normalizeLocale(next);
    setLocaleState(normalized);
    // A deliberate language choice must survive copying, refresh and history
    // navigation; automatic browser-language selection remains query-free.
    const url = new URL(window.location.href);
    url.searchParams.set("lang", normalized);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };

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
