import React from "react";

export function StatusCard({ icon, title, value, label, error, emphasis = false }) {
  return (
    <article className={`metric ${error ? "hasError" : ""} ${emphasis ? "emphasis" : ""}`} data-reveal>
      <div className="metricLabel">{icon}<span>{title}</span></div>
      <strong>{error ? "Unavailable" : value ?? "Connecting"}</strong>
      <p>{error || label}</p>
    </article>
  );
}
