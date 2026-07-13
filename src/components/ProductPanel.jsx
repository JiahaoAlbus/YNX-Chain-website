import React from "react";
import { ArrowUpRight } from "lucide-react";

export function ProductPanel({ icon, title, text, status, href }) {
  return (
    <article className="product" data-reveal>
      <div className="productTop">
        <span className="productIcon">{icon}</span>
        <span className={`serviceState ${status === "live" ? "live" : "planned"}`}>{status === "live" ? "Live testnet" : status}</span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {href && <a href={href}>View surface <ArrowUpRight size={16} /></a>}
    </article>
  );
}
