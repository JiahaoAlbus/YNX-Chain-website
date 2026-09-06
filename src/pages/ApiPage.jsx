import React from "react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { LEARNING_COMMANDS, guideUi } from "../content/learningContent.js";
import { useLearningCopy } from "../lib/useLearningCopy.js";
import { getDocumentLibraryCopy } from "../content/documentLibraryCopy.js";
import { GuideCode } from "../components/GuideCode.jsx";
import "./learning-guides.css";
const python = `import sys\nsys.path.insert(0, "sdk/python")\nfrom ynx_client import YNXClient, assert_ynx_testnet_snapshot\n\nclient = YNXClient(rest_url="https://rpc.ynxweb4.com", evm_url="https://evm.ynxweb4.com")\nsnapshot = assert_ynx_testnet_snapshot(client.get_chain_snapshot())\nprint(snapshot["status"]["height"], snapshot["evmChainId"])`;
export function ApiPage() {
  const { locale, t } = useLocale(), copy = useLearningCopy(locale);
  if (!copy) return <main className="learningPage" aria-busy="true"><p role="status">{t("checking")}</p></main>;
  if (copy.loadFailed) { const errorCopy=getDocumentLibraryCopy(locale); return <main className="learningPage" lang={locale}><p role="alert">{errorCopy.loadError}</p><button type="button" onClick={()=>window.location.reload()}>{errorCopy.retry}</button></main>; }
  const ui = guideUi(copy);
  const endpoints = [["GET","https://rpc.ynxweb4.com/status",ui.status],["POST","https://evm.ynxweb4.com",ui.identity],["GET","https://explorer.ynxweb4.com",ui.inspect],["GET","https://faucet.ynxweb4.com",ui.assets],["GET","/status",ui.serviceStatus]];
  return <main className="learningPage apiLearningPage" lang={copy.bodyLocale || locale} dir={(copy.bodyLocale || locale) === "ar" ? "rtl" : "ltr"}>
    {copy.bodyLocale !== locale && <aside className="learningNetworkNote" lang={locale}><strong>{getDocumentLibraryCopy(locale).translationPending}</strong><p>{getDocumentLibraryCopy(locale).originalBodyNotice}</p></aside>}
    <header className="learningHero"><p className="sectionEyebrow">{ui.api}</p><h1>{ui.apiTitle}</h1><p>{ui.apiLead}</p><div className="learningLinks"><a href="/manual?path=develop">{ui.build}<ArrowRight size={16} /></a><a href="/docs?doc=api-api-reference">{ui.fullReference}</a></div></header>
    <section className="apiInterfaces" aria-labelledby="api-interfaces"><h2 id="api-interfaces">{ui.interfaces}</h2><p>{ui.readOnly}</p><div className="apiEndpointList">{endpoints.map(([method,address,purpose]) => <article key={address}><span className="apiMethod" dir="ltr">{method}</span><div><h3>{purpose}</h3><code dir="ltr">{address}</code></div></article>)}</div></section>
    <section className="apiExamples" aria-labelledby="api-read"><h2 id="api-read">{ui.identity}</h2><GuideCode ui={ui} code={LEARNING_COMMANDS.chainId} title={ui.identity} /><div className="learningExpected"><strong>{ui.expected}</strong><code dir="ltr">{"{\"jsonrpc\":\"2.0\",\"id\":1,\"result\":\"0x1917\"}"}</code></div><GuideCode ui={ui} code={LEARNING_COMMANDS.publicStatus} title={ui.status} /></section>
    <section className="apiExamples" aria-labelledby="api-sdk"><h2 id="api-sdk">{ui.jsSdk}</h2><p>{ui.sdkNotice}</p><GuideCode ui={ui} code={LEARNING_COMMANDS.sdk} title="Node.js ≥ 18 · ./" /><h2>{ui.pySdk}</h2><GuideCode ui={ui} code={python} title="Python ≥ 3.9 · ./" /><a className="learningTextLink" href="/docs?doc=developers-sdk-release-integrity">{ui.fullReference}<ArrowRight size={16} /></a></section>
    <section className="apiClientRules" aria-labelledby="api-client-rules"><h2 id="api-client-rules">{ui.clientRules}</h2><ol>{[ui.timeoutRule,ui.identityRule,ui.retryRule,ui.evmRule,ui.secretsRule].map(text => <li key={text}>{text}</li>)}</ol></section><aside className="learningNetworkNote"><strong>{ui.current}</strong><p>{ui.networkNotice}</p></aside>
  </main>;
}
