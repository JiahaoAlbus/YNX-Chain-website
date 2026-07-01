import { ExternalLink } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

const links = [
  ["Explorer", () => apiConfig.explorerUrl],
  ["Faucet", () => apiConfig.faucetUrl],
  ["Docs", () => apiConfig.docsUrl],
  ["Grant Package", () => apiConfig.grantUrl],
  ["Ecosystem Package", () => apiConfig.ecosystemUrl],
  ["Exchange Readiness", () => apiConfig.exchangeUrl],
  ["API Status", () => `${apiConfig.apiBase}/status`]
];

export function LinkGrid() {
  return (
    <div className="links">
      {links.map(([label, getHref]) => {
        const href = getHref();
        const disabled = !href;
        return <a key={label} className={disabled ? "disabled" : ""} href={disabled ? undefined : href}>{label}<ExternalLink size={16} /></a>;
      })}
    </div>
  );
}
