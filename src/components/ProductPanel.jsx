import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { getHomeRedesignCopy } from "../content/homeRedesignContent.js";

export function ProductPanel({ icon, title, text, status, href }) {
  const { locale, t } = useLocale();
  const { productAction, productReference, productReachable } = getHomeRedesignCopy(locale);
  const stateLabel = status === "reference" ? productReference
    : status === "live" ? productReachable : t(status === "checking" ? "checking" : "unavailable");
  return (
    <article className="product" data-reveal>
      <div className="productTop">
        <span className="productIcon">{icon}</span>
        <span className={`serviceState ${status === "live" ? "live" : "planned"}`}>{stateLabel}</span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {href && <a href={href}>{productAction} <ArrowUpRight size={16} /></a>}
    </article>
  );
}
