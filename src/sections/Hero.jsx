import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Move3d, WalletCards } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

export function Hero({ snapshot, connectionState, onAddNetwork }) {
  const status = snapshot.status || {};
  const live = !status.error && status.chainId === 6423;
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const ignoreClickRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [motion, setMotion] = useState({ x: 0, y: 0, pull: 0, dragging: false });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setScrollOffset(Math.min(window.scrollY, 460)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  const move = (event) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 14;
    if (!dragRef.current) return setMotion((current) => ({ ...current, x, y, dragging: false }));
    const pull = Math.max(0, Math.min(150, dragRef.current.pull + event.clientX - dragRef.current.x));
    if (Math.abs(event.clientX - dragRef.current.x) > 5) ignoreClickRef.current = true;
    setMotion({ x, y, pull, dragging: true });
  };

  const startPull = (event) => {
    ignoreClickRef.current = false;
    dragRef.current = { x: event.clientX, pull: motion.pull };
    try { stageRef.current?.setPointerCapture?.(event.pointerId); } catch { /* synthetic pointers have no capture target */ }
    setMotion((current) => ({ ...current, dragging: true }));
  };

  const release = (event) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      if (stageRef.current?.hasPointerCapture?.(event.pointerId)) stageRef.current.releasePointerCapture(event.pointerId);
    } catch { /* the pointer may already be released */ }
    const nextExpanded = motion.pull >= 68;
    setExpanded(nextExpanded);
    setMotion((current) => ({ ...current, pull: nextExpanded ? 112 : 0, dragging: false }));
  };

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    setMotion((current) => ({ ...current, pull: next ? 112 : 0, dragging: false }));
  };

  const handleClick = () => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    toggleExpanded();
  };

  const reset = () => {
    if (!dragRef.current) setMotion((current) => ({ ...current, x: 0, y: 0, dragging: false }));
  };

  return (
    <section className="hero" aria-labelledby="hero-title" style={{ "--hero-scroll": `${scrollOffset}px` }}>
      <div className="heroGrid" aria-hidden="true" />
      <div
        ref={stageRef}
        className={`heroStage ${motion.dragging ? "isPulling" : ""} ${expanded ? "isExpanded" : ""}`}
        role="button"
        tabIndex="0"
        aria-label={expanded ? "Collapse execution layers" : "Drag or press Enter to separate execution layers"}
        aria-pressed={expanded}
        onPointerDown={startPull}
        onPointerMove={move}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={reset}
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleExpanded();
          }
        }}
        style={{
          "--scene-rx": `${motion.y * -0.42}deg`,
          "--scene-ry": `${motion.x * 0.62}deg`,
          "--pull-near": `${motion.pull}px`,
          "--pull-mid": `${motion.pull * 0.68}px`,
          "--pull-far": `${motion.pull * 0.36}px`
        }}
      >
        <div className="executionScene" aria-hidden="true">
          <div className="sceneShadow" />
          <div className="sceneRail railBack" />
          <div className="scenePlane planeBack"><b>RPC</b><i /><i /><i /></div>
          <div className="scenePlane planeLeft"><b>INDEX</b><i /><i /></div>
          <div className="scenePlane planeCenter"><b>EVM</b><span /></div>
          <div className="sceneGlass glassBack" />
          <div className="sceneCore"><small>LIVE BLOCK</small><strong>{status.height ? `#${Number(status.height).toLocaleString("en-US")}` : "SYNC"}</strong><span /></div>
          <div className="sceneGlass glassFront" />
          <div className="scenePlane planeRight"><b>TRUST</b><i /><i /></div>
          <div className="scenePlane planeFloor"><b>STATE</b><i /><i /><i /></div>
          <div className="sceneRail railFront" />
          <div className="chainPacket packetOne" />
          <div className="chainPacket packetTwo" />
          <div className="chainPacket packetThree" />
          <div className="validatorTag tagPrimary">PRIMARY</div>
          <div className="validatorTag tagSingapore">SINGAPORE</div>
          <div className="validatorTag tagSilicon">SILICON VALLEY</div>
          <div className="validatorTag tagSeoul">SEOUL</div>
        </div>
        <span className="heroPullHint" title="Drag to separate the execution layers"><Move3d size={18} /></span>
      </div>

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
          <a className="button secondary" href="/apps">Explore ecosystem <ArrowUpRight size={18} /></a>
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
