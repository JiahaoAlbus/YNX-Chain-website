import React from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BASIC_ROUTES as pages } from "../content/basicRouteContent.js";



export function RoutePage({ path }) {
  const page = pages[path];
  if (!page) {
    return (
      <main className="routePage notFoundPage">
        <div className="routeInner">
          <a className="backLink" href="/"><ArrowLeft size={17} /> YNX Chain</a>
          <p className="sectionEyebrow">Page unavailable</p>
          <h1>This route is not part of the public website.</h1>
          <p className="routeLead">The link may be outdated or the resource may not have public release evidence. Search the current product, documentation, API, security, and support surfaces instead.</p>
          <div className="routeLinks">
            <a className="button primary" href="/docs">Open documentation <ArrowUpRight size={17} /></a>
            <a className="button secondary" href="/support">Get support <ArrowUpRight size={17} /></a>
          </div>
        </div>
      </main>
    );
  }
  const [eyebrow, title, text, links] = page;
  return (
    <main className="routePage">
      <div className="routeInner">
        <a className="backLink" href="/"><ArrowLeft size={17} /> YNX Chain</a>
        <p className="sectionEyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="routeLead">{text}</p>
        <div className="routeFacts">
          <div><span>Network</span><strong>YNX Testnet</strong></div>
          <div><span>Chain ID</span><strong>6423 / 0x1917</strong></div>
          <div><span>Native coin</span><strong>YNXT</strong></div>
          <div><span>Mainnet</span><strong>Not launched</strong></div>
        </div>
        {links.length > 0 && <div className="routeLinks">{links.map(([label, href]) => <a key={label} className="button primary" href={href}>{label}<ArrowUpRight size={17} /></a>)}</div>}
      </div>
    </main>
  );
}
