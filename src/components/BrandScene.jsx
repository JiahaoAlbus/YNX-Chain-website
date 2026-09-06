import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers, Pause, Play, RotateCcw } from "lucide-react";
import { getBrandSceneCopy, SCENE_MODULES } from "../content/brandSceneCopy.js";
import { walkthroughAt, preferStaticScene } from "../lib/brandSceneState.js";
import "./BrandScene.css";

const REST = { x: 0.56, y: -0.48, z: -0.025 };
const INITIAL = { separated: true, selected: "transaction", paused: false, step: -1, demo: "idle" };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function StaticModel({ separated, selected }) {
  return <svg className="brandSceneFallback" viewBox="0 0 420 300" aria-hidden="true" focusable="false">
    <path className="brandSceneStaticBus" d={separated ? "M99 56 113 111 99 171 113 234" : "M106 119 106 148 106 177 106 206"} />
    {SCENE_MODULES.map((id, index) => {
      const x = separated ? (index % 2 ? 14 : -14) : 0;
      const y = separated ? 22 + index * 62 : 81 + index * 30;
      return <g key={id} transform={`translate(${x},${y})`} className={selected === id ? "isSelected" : ""}>
        <path className="brandSceneStaticSide" d="M110 34 214 65 314 34 314 42 214 74 110 42Z" />
        <path className="brandSceneStaticDeck" d="M110 34 214 3 314 34 214 65Z" />
        {index === 0 && <g className="brandSceneStaticInk"><path d="M154 28 184 19 217 29 187 38Z M188 19 218 10 251 20 221 29Z M221 28 251 19 284 29 254 38Z" /><path className="brandSceneStaticWhite" d="m168 27 19 6 12-4-19-6z m34-9 19 6 12-4-19-6z m33 9 19 6 12-4-19-6z" /></g>}
        {index === 1 && <g><path className="brandSceneStaticInk" d="M171 30 214 17 257 30 214 44Z" /><path className="brandSceneStaticWires" d="m158 21 27 8m-32 2 26 8m60-16 27-8m-21 18 26-8" /><text x="214" y="34" className="brandSceneStaticMark">YNX</text></g>}
        {index === 2 && <g className="brandSceneStaticInk">{[0, 1, 2].map(i => <path key={i} d={`M${166 + i * 30} 24 l22 7v12l-22-7z m0 0 18-6 22 7-18 6z`} />)}</g>}
        {index === 3 && <g><path className="brandSceneStaticWires" d="M151 34 182 20 245 20 277 34 245 48 182 48Z M151 34H277 M182 20 245 48 M245 20 182 48" />{[[151,34],[182,20],[245,20],[277,34],[245,48],[182,48]].map(([nx, ny]) => <rect className="brandSceneStaticInk" key={`${nx}-${ny}`} x={nx-4} y={ny-4} width="8" height="8" rx="1" />)}</g>}
      </g>;
    }).reverse()}
  </svg>;
}

export function BrandScene({ locale = "en" }) {
  const copy = getBrandSceneCopy(locale);
  const titleId = useId(), hintId = useId(), detailId = useId();
  const host = useRef(null), controls = useRef(null), model = useRef({ ...INITIAL });
  const [presentation, setPresentation] = useState({ ...INITIAL });
  const [status, setStatus] = useState("loading");
  const [reducedMotion, setReducedMotion] = useState(false);
  const update = patch => {
    model.current = { ...model.current, ...patch };
    setPresentation(model.current);
    controls.current?.redraw();
  };
  const selectModule = id => {
    if (!SCENE_MODULES.includes(id)) return;
    update({ selected: id, step: -1, demo: "idle" });
    controls.current?.restartClock();
  };

  useEffect(() => {
    const element = host.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, renderer, world, frame = 0, observer, resizeObserver, bootObserver;
    let visible = true, nearby = false, initializing = false, reduced = media.matches, activePointer = null;
    let idleHandle = 0, bootTimer = 0;
    let target = { ...REST }, current = { ...REST }, separation = 1;
    let lastTime = 0, elapsed = 0, demoElapsed = 0;
    const removals = [];
    const listen = (object, event, handler, options) => {
      object.addEventListener(event, handler, options);
      removals.push(() => object.removeEventListener(event, handler, options));
    };
    setReducedMotion(reduced);
    const isVisible = () => visible && !document.hidden && !disposed;
    const requestRender = () => { if (!frame && world && isVisible()) frame = requestAnimationFrame(render); };
    function render(now) {
      frame = 0;
      if (!world || !isVisible()) { lastTime = 0; return; }
      // Cap actual rendering at 30 fps. Idle scenes schedule no animation frames.
      if (lastTime && now - lastTime < 1000 / 30) { requestRender(); return; }
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.075) : 1 / 30;
      lastTime = now;
      const motion = !reduced && !model.current.paused && model.current.demo === "running";
      if (motion) {
        elapsed += delta; demoElapsed += delta;
        const progress = walkthroughAt(demoElapsed);
        if (model.current.step !== progress.step) update({ step: progress.step, selected: SCENE_MODULES[progress.step] });
        if (progress.complete) update({ demo: "complete" });
      }
      const blend = reduced ? 1 : 1 - Math.exp(-delta * 10);
      for (const key of ["x", "y", "z"]) current[key] += (target[key] - current[key]) * blend;
      const goal = model.current.separated ? 1 : 0;
      separation += (goal - separation) * blend;
      world.pivot.rotation.set(current.x, current.y, current.z);
      world.present({ separation, selected: model.current.selected, stage: model.current.step, phase: model.current.demo === "running" ? walkthroughAt(demoElapsed).phase : 0, time: elapsed, motion });
      try { renderer.render(world.scene, world.camera); } catch { fail(); return; }
      const moving = Math.abs(separation - goal) > 0.001 || ["x", "y", "z"].some(key => Math.abs(current[key] - target[key]) > 0.001);
      if ((motion && model.current.demo === "running") || moving) requestRender();
      else lastTime = 0;
    }
    const reset = () => { target = { ...REST }; requestRender(); };
    const rotate = direction => { target.y += direction * 0.28; requestRender(); };
    controls.current = { reset, rotate, redraw: requestRender, restartClock: () => { demoElapsed = 0; requestRender(); } };
    function fail() {
      if (disposed) return;
      if (model.current.demo === "running") update({ demo: "manual" });
      cancelAnimationFrame(frame); frame = 0;
      setStatus("fallback"); controls.current = null;
      world?.dispose(); world = null;
      renderer?.dispose(); renderer?.domElement.remove(); renderer = null;
    }
    async function initialize() {
      if (disposed || initializing || document.hidden || !nearby) return;
      initializing = true;
      try {
        // Split, deferred imports keep Three out of the first content/input work.
        const [{ WebGLRenderer }, { createBrandWorld }] = await Promise.all([
          import("three/src/renderers/WebGLRenderer.js"), import("../lib/brandGeometry.js"),
        ]);
        if (disposed) return;
        if (document.hidden || !nearby) { initializing = false; return; }
        renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 480 ? 1.25 : 1.5));
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.setAttribute("role", "presentation");
        element.appendChild(renderer.domElement);
        world = createBrandWorld(renderer);
        const resize = () => {
          if (!renderer || !world) return;
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
          renderer.setSize(rect.width, rect.height, false);
          world.resize(rect.width, rect.height); requestRender();
        };
        resizeObserver = new ResizeObserver(resize); resizeObserver.observe(element);
        observer = new IntersectionObserver(entries => {
          visible = entries[0]?.isIntersecting === true;
          if (visible) requestRender();
          else { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
        }, { threshold: 0.01 });
        observer.observe(element);
        listen(renderer.domElement, "webglcontextlost", event => { event.preventDefault(); fail(); });
        listen(element, "pointerdown", event => {
          if (event.button !== 0 || activePointer !== null) return;
          activePointer = { id: event.pointerId, x: event.clientX, y: event.clientY, rotation: { ...target }, type: event.pointerType, axis: null, moved: false };
          if (event.pointerType !== "touch") element.setPointerCapture(event.pointerId);
        });
        listen(element, "pointermove", event => {
          if (!activePointer || activePointer.id !== event.pointerId) return;
          const dx = event.clientX - activePointer.x, dy = event.clientY - activePointer.y;
          if (Math.hypot(dx, dy) < 7) return;
          activePointer.moved = true;
          if (activePointer.type === "touch") {
            if (!activePointer.axis) activePointer.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? "horizontal" : "vertical";
            if (activePointer.axis === "vertical") return;
            if (!element.hasPointerCapture(event.pointerId)) element.setPointerCapture(event.pointerId);
          }
          element.classList.add("isDragging");
          target.y = activePointer.rotation.y + dx * 0.008;
          if (activePointer.type !== "touch") target.x = clamp(activePointer.rotation.x + dy * 0.005, 0.12, 1.15);
          requestRender();
        });
        const endPointer = event => {
          if (activePointer?.id !== event.pointerId) return;
          const wasTap = !activePointer.moved && event.type === "pointerup";
          activePointer = null;
          if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
          element.classList.remove("isDragging");
          if (wasTap && world) {
            const rect = element.getBoundingClientRect();
            const id = world.pick((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
            if (id) selectModule(id);
          }
        };
        listen(element, "pointerup", endPointer); listen(element, "pointercancel", endPointer); listen(element, "lostpointercapture", endPointer);
        listen(element, "keydown", event => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "Home") reset();
          else if (event.key === "ArrowLeft") rotate(-1);
          else if (event.key === "ArrowRight") rotate(1);
          else { target.x = clamp(target.x + (event.key === "ArrowUp" ? 0.15 : -0.15), 0.12, 1.15); requestRender(); }
        });
        resize(); world.pivot.rotation.set(REST.x, REST.y, REST.z);
        world.present({ separation: model.current.separated ? 1 : 0, selected: model.current.selected });
        if (isVisible()) renderer.render(world.scene, world.camera);
        setStatus("ready"); requestRender();
      } catch { fail(); }
    }
    function scheduleInitialize() {
      if (!nearby || disposed || initializing || document.hidden || idleHandle || bootTimer) return;
      if ("requestIdleCallback" in window) idleHandle = window.requestIdleCallback(() => { idleHandle = 0; initialize(); }, { timeout: 1800 });
      else bootTimer = window.setTimeout(() => { bootTimer = 0; initialize(); }, 250);
    }
    listen(document, "visibilitychange", () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      else { scheduleInitialize(); requestRender(); }
    });
    listen(media, "change", event => {
      reduced = event.matches; setReducedMotion(reduced);
      if (reduced && model.current.demo === "running") update({ demo: "manual" });
      requestRender();
    });
    if (preferStaticScene(navigator)) setStatus("fallback");
    else {
      bootObserver = new IntersectionObserver(entries => { nearby = entries[0]?.isIntersecting === true; scheduleInitialize(); }, { rootMargin: "160px", threshold: 0 });
      bootObserver.observe(element);
    }
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      if (idleHandle) window.cancelIdleCallback(idleHandle);
      clearTimeout(bootTimer);
      bootObserver?.disconnect(); observer?.disconnect(); resizeObserver?.disconnect();
      removals.forEach(remove => remove()); controls.current = null;
      world?.dispose(); renderer?.dispose(); renderer?.forceContextLoss(); renderer?.domElement.remove();
    };
  }, []);

  const walk = () => {
    if (presentation.demo === "manual" && presentation.step < 3) {
      const step = presentation.step + 1; update({ step, selected: SCENE_MODULES[step] });
    } else if (presentation.demo === "manual" && presentation.step === 3) update({ demo: "complete" });
    else {
      controls.current?.restartClock();
      update({ separated: true, selected: "transaction", paused: false, step: 0, demo: reducedMotion || status !== "ready" ? "manual" : "running" });
    }
  };
  const selectedIndex = SCENE_MODULES.indexOf(presentation.selected);
  const description = presentation.demo === "complete" ? copy.complete : presentation.step >= 0 ? copy.steps[presentation.step] : copy.details[selectedIndex];
  return <figure className={`brandScene ${status === "ready" ? "isReady" : ""}`} aria-labelledby={titleId} data-scene-status={status} data-scene-mode={presentation.separated ? "separated" : "assembled"} data-selected-module={presentation.selected} data-demo-state={presentation.demo} data-demo-step={presentation.step} data-motion={reducedMotion ? "reduced" : presentation.paused ? "paused" : presentation.demo === "running" ? "playing" : "idle"}>
    <div className="brandSceneHeading"><span id={titleId}>{copy.title}</span><span className="brandSceneModelBadge">{copy.badge}</span></div>
    <div className="brandSceneStage">
      <StaticModel separated={presentation.separated} selected={presentation.selected} />
      <div ref={host} className="brandSceneViewport" role="group" aria-label={copy.title} aria-describedby={hintId} tabIndex={status === "ready" ? 0 : -1} />
      <div className="brandSceneStageFooter"><span>{status === "ready" ? copy.hint : copy.static}</span>{status === "ready" && <div className="brandSceneViewControls">
        <button type="button" aria-label={copy.rotateLeft} title={copy.rotateLeft} onClick={() => controls.current?.rotate(-1)}><ArrowLeft aria-hidden="true" size={15} /></button>
        <button type="button" aria-label={copy.rotateRight} title={copy.rotateRight} onClick={() => controls.current?.rotate(1)}><ArrowRight aria-hidden="true" size={15} /></button>
        <button type="button" aria-label={copy.reset} title={copy.reset} onClick={() => controls.current?.reset()}><RotateCcw aria-hidden="true" size={14} /></button>
        {!reducedMotion && <button type="button" aria-label={presentation.paused ? copy.resume : copy.pause} title={presentation.paused ? copy.resume : copy.pause} aria-pressed={presentation.paused} disabled={presentation.demo !== "running"} onClick={() => update({ paused: !presentation.paused })}>{presentation.paused ? <Play aria-hidden="true" size={14} /> : <Pause aria-hidden="true" size={14} />}</button>}
      </div>}</div>
    </div>
    <figcaption className="brandSceneCaption">
      <span id={hintId} className="brandSceneSR">{copy.keyboard}</span>
      <div className="brandSceneModules" role="group" aria-label={copy.selectLabel}>{SCENE_MODULES.map((id, index) => <button type="button" key={id} aria-pressed={presentation.selected === id} aria-controls={detailId} data-module={id} onClick={() => selectModule(id)}><span className="brandSceneModuleIndex" aria-hidden="true">0{index + 1}</span><span>{copy.names[index]}</span></button>)}</div>
      <div className="brandSceneExplanation" id={detailId} role="status" aria-live="polite" aria-atomic="true"><span className="brandSceneStep" aria-hidden="true">{presentation.step >= 0 ? `${copy.stepLabel} ${presentation.step + 1} / 4` : `0${selectedIndex + 1}`}</span><p>{description}</p></div>
      <div className="brandSceneActions">
        <button type="button" className="brandSceneAssemble" aria-pressed={!presentation.separated} onClick={() => { update({ separated: !presentation.separated, step: -1, demo: "idle" }); controls.current?.restartClock(); }}><Layers size={15} aria-hidden="true" /><span>{presentation.separated ? copy.assemble : copy.explode}</span></button>
        <button type="button" className="brandSceneWalk" onClick={walk}><span>{presentation.demo === "manual" ? copy.next : presentation.demo === "complete" || presentation.demo === "running" ? copy.restart : copy.demo}</span><ArrowUpRight size={16} aria-hidden="true" /></button>
      </div>
    </figcaption>
  </figure>;
}
