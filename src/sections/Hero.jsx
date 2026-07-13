import React, { useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Move3d, WalletCards } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

export function Hero({ snapshot, connectionState, onAddNetwork }) {
  const status = snapshot.status || {};
  const live = !status.error && status.chainId === 6423;
  const heroRef = useRef(null);
  const dragRef = useRef(null);
  const [motion, setMotion] = useState({ x: 0, y: 0, pull: 0, dragging: false });

  const move = (event) => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
    if (!dragRef.current) return setMotion({ x, y, pull: 0, dragging: false });
    const pull = Math.max(-24, Math.min(150, event.clientX - dragRef.current.x));
    setMotion({ x, y, pull, dragging: true });
  };

  const startPull = (event) => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds || event.clientX < bounds.left + bounds.width * 0.46 || event.target.closest("a, button")) return;
    dragRef.current = { x: event.clientX };
    try { heroRef.current.setPointerCapture?.(event.pointerId); } catch { /* synthetic pointers have no capture target */ }
    setMotion((current) => ({ ...current, dragging: true }));
  };

  const release = (event) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      if (heroRef.current?.hasPointerCapture?.(event.pointerId)) heroRef.current.releasePointerCapture(event.pointerId);
    } catch { /* the pointer may already be released */ }
    setMotion((current) => ({ ...current, pull: 0, dragging: false }));
  };

  const reset = () => {
    if (!dragRef.current) setMotion({ x: 0, y: 0, pull: 0, dragging: false });
  };

  return (
    <section
      ref={heroRef}
      className={`hero ${motion.dragging ? "isPulling" : ""}`}
      aria-labelledby="hero-title"
      onPointerDown={startPull}
      onPointerMove={move}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={reset}
      style={{ "--hero-x": motion.x, "--hero-y": motion.y, "--hero-pull": motion.pull }}
    >
      <img className="heroImage" src="/ynx-execution-sculpture.png" alt="Abstract white and transparent execution layers in a Klein blue space" draggable="false" />
      <div className="heroOverlay" />
      <span className="heroPullHint" title="Drag the execution layers" aria-hidden="true"><Move3d size={18} /></span>
      <div className="heroInner">
        <div className={`liveBadge ${live ? "isLive" : ""}`}>
          <span className="statusDot" />
          {live ? "YNX Testnet live" : connectionState === "loading" ? "Connecting to testnet" : "Live status unavailable"}
        </div>
        <h1 id="hero-title">YNX Chain</h1>
        <p className="heroLead">
          A full-stack Web4 L1 ecosystem built around YNXT, EVM-compatible execution, resource economics, AI-native services, payments, Trust tracing, and developer infrastructure.
        </p>
        <div className="heroActions">
          <a className="button primary" href={apiConfig.explorerUrl}>Open Explorer <ArrowUpRight size={18} /></a>
          <button className="button secondary" onClick={onAddNetwork}><WalletCards size={18} /> Add YNX Testnet</button>
        </div>
        <div className="heroFacts" aria-label="Current network boundaries">
          <span><CheckCircle2 size={16} /> Chain ID 6423</span>
          <span><CheckCircle2 size={16} /> Native coin YNXT</span>
          <span><CheckCircle2 size={16} /> Four public validator roles</span>
          <span className="boundary">Authoritative replication today; public BFT migration pending</span>
        </div>
      </div>
    </section>
  );
}
