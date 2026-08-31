import React from "react";
import { useLocale } from "../lib/i18n.jsx";

export function StatusCard({ icon, title, value, label, error, emphasis = false }) {
  const { t } = useLocale();
  return (
    <article className={`metric ${error ? "hasError" : ""} ${emphasis ? "emphasis" : ""}`} data-reveal>
      <div className="metricLabel">{icon}<span>{title}</span></div>
      <strong>{error ? t("unavailable") : value ?? t("checking")}</strong>
      <p>{error ? t("liveSourceUnavailable") : label}</p>
    </article>
  );
}
