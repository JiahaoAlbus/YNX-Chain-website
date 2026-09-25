import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { getHomeRedesignCopy } from "../content/homeRedesignContent.js";
import { getAppsCopy } from "../content/businessLocaleContent.js";

export function ProductPanel({ icon, title, text, status, href, healthStatus }) {
  const { locale, t } = useLocale();
  const { productAction, productReference, productReachable } = getHomeRedesignCopy(locale);
  const appStatus = getAppsCopy(locale).statusLabels;
  const stateLabel = status === "public-web" ? appStatus.live
    : status === "candidate" ? appStatus.local
    : status === "candidate-incomplete" ? appStatus.planned
    : status === "reference" ? productReference
    : status === "live" ? productReachable : t(status === "checking" ? "checking" : "unavailable");
  return (
    <article className="product" data-reveal>
      <div className="productTop">
        <span className="productIcon">{icon}</span>
        <span className={`serviceState ${status === "live" || status === "public-web" ? "live" : "planned"}`}>{stateLabel}</span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {healthStatus && <small className="productHealth">{healthStatus === "live" ? productReachable : t(healthStatus === "checking" ? "checking" : "unavailable")}</small>}
      {href && <a href={href}>{productAction} <ArrowUpRight size={16} /></a>}
    </article>
  );
}
