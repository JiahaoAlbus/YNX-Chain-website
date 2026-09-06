import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import "./BrandScene.css";

const COPY = {
  en: ["YNX in three dimensions", "Drag to explore", "Rotate left", "Rotate right", "Reset view", "Pause animation", "Resume animation", "Use the arrow keys to rotate; Home resets the view."],
  "zh-CN": ["立体 YNX 标志", "拖动，探索不同视角", "向左旋转", "向右旋转", "重置视角", "暂停动画", "继续动画", "使用方向键旋转，按 Home 重置视角。"],
  "zh-TW": ["立體 YNX 標誌", "拖曳，探索不同視角", "向左旋轉", "向右旋轉", "重設視角", "暫停動畫", "繼續動畫", "使用方向鍵旋轉，按 Home 重設視角。"],
  ja: ["立体的な YNX ロゴ", "ドラッグして角度を変える", "左へ回転", "右へ回転", "表示をリセット", "アニメーションを停止", "アニメーションを再開", "矢印キーで回転、Home キーでリセットします。"],
  ko: ["입체 YNX 로고", "드래그하여 살펴보기", "왼쪽으로 회전", "오른쪽으로 회전", "보기 초기화", "애니메이션 일시 정지", "애니메이션 재개", "방향키로 회전하고 Home 키로 초기화하세요."],
  es: ["YNX en tres dimensiones", "Arrastra para explorar", "Girar a la izquierda", "Girar a la derecha", "Restablecer vista", "Pausar animación", "Reanudar animación", "Usa las flechas para girar; Inicio restablece la vista."],
  fr: ["YNX en trois dimensions", "Faites glisser pour explorer", "Tourner à gauche", "Tourner à droite", "Réinitialiser la vue", "Mettre en pause", "Reprendre l’animation", "Utilisez les flèches pour tourner ; Origine réinitialise la vue."],
  de: ["YNX in drei Dimensionen", "Zum Erkunden ziehen", "Nach links drehen", "Nach rechts drehen", "Ansicht zurücksetzen", "Animation pausieren", "Animation fortsetzen", "Mit den Pfeiltasten drehen; Pos1 setzt die Ansicht zurück."],
  pt: ["YNX em três dimensões", "Arraste para explorar", "Rodar para a esquerda", "Rodar para a direita", "Repor vista", "Pausar animação", "Retomar animação", "Use as setas para rodar; Home repõe a vista."],
  ru: ["Объёмный логотип YNX", "Перетащите, чтобы рассмотреть", "Повернуть влево", "Повернуть вправо", "Сбросить вид", "Приостановить анимацию", "Продолжить анимацию", "Стрелки поворачивают логотип; Home сбрасывает вид."],
  ar: ["شعار YNX ثلاثي الأبعاد", "اسحب لاستكشاف الزوايا", "تدوير إلى اليسار", "تدوير إلى اليمين", "إعادة ضبط العرض", "إيقاف الحركة مؤقتًا", "استئناف الحركة", "استخدم مفاتيح الأسهم للتدوير ومفتاح Home لإعادة الضبط."],
  id: ["YNX dalam tiga dimensi", "Seret untuk menjelajahi", "Putar ke kiri", "Putar ke kanan", "Atur ulang tampilan", "Jeda animasi", "Lanjutkan animasi", "Gunakan tombol panah untuk memutar; Home mengatur ulang tampilan."],
};
const REST = { x: 0.12, y: -0.28, z: -0.065 };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function BrandScene({ locale = "en" }) {
  const copy = COPY[locale] || COPY.en;
  const hintId = useId();
  const host = useRef(null);
  const controls = useRef(null);
  const pausedRef = useRef(false);
  const [status, setStatus] = useState("loading");
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const element = host.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, renderer, world, frame = 0, observer, resizeObserver;
    let visible = true, reduced = media.matches, activePointer = null;
    let target = { ...REST }, current = { ...REST }, lastTime = 0, elapsed = 0, lastInteraction = 0;
    const removals = [];
    const listen = (object, event, handler, options) => {
      object.addEventListener(event, handler, options);
      removals.push(() => object.removeEventListener(event, handler, options));
    };
    setReducedMotion(reduced);
    const isVisible = () => visible && !document.hidden && !disposed;
    const requestRender = () => { if (!frame && world && isVisible()) frame = requestAnimationFrame(render); };
    const invalidate = () => { lastInteraction = performance.now(); requestRender(); };
    function render(now) {
      frame = 0;
      if (!world || !isVisible()) { lastTime = 0; return; }
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      const idle = !reduced && !pausedRef.current && activePointer === null && now - lastInteraction > 2400;
      if (idle) elapsed += delta;
      const blend = reduced ? 1 : 1 - Math.exp(-delta * 12);
      for (const key of ["x", "y", "z"]) current[key] += (target[key] - current[key]) * (delta ? blend : 1);
      const bob = idle ? Math.sin(elapsed * 0.7) * 0.045 : 0;
      world.pivot.rotation.set(current.x + (idle ? Math.sin(elapsed * 0.5) * 0.035 : 0), current.y + (idle ? Math.sin(elapsed * 0.38) * 0.12 : 0), current.z);
      world.pivot.position.y = bob;
      try { renderer.render(world.scene, world.camera); } catch { fail(); return; }
      const moving = ["x", "y", "z"].some(key => Math.abs(current[key] - target[key]) > 0.001);
      if ((!reduced && !pausedRef.current) || moving || activePointer !== null) requestRender();
    }
    const reset = () => { target = { ...REST }; elapsed = 0; invalidate(); };
    const rotate = direction => { target.y += direction * 0.28; invalidate(); };
    controls.current = { reset, rotate, redraw: requestRender };
    function fail() {
      if (disposed) return;
      cancelAnimationFrame(frame); frame = 0;
      setStatus("fallback");
      controls.current = null;
      world?.dispose(); world = null;
      renderer?.dispose(); renderer?.domElement.remove(); renderer = null;
    }

    async function initialize() {
      try {
        // Separate dynamic entry points let Rollup share core classes while keeping
        // the renderer and geometry below the website's per-chunk size limit.
        const [{ WebGLRenderer }, { createBrandWorld }] = await Promise.all([
          import("three/src/renderers/WebGLRenderer.js"),
          import("../lib/brandGeometry.js"),
        ]);
        if (disposed) return;
        renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.setAttribute("role", "presentation");
        element.appendChild(renderer.domElement);
        world = createBrandWorld(renderer);
        const resize = () => {
          if (!renderer || !world) return;
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          renderer.setSize(rect.width, rect.height, false);
          world.resize(rect.width, rect.height);
          requestRender();
        };
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(element);
        observer = new IntersectionObserver(entries => {
          visible = entries[0]?.isIntersecting === true;
          if (visible) requestRender();
          else { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
        }, { threshold: 0.01 });
        observer.observe(element);
        listen(document, "visibilitychange", () => {
          if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
          else requestRender();
        });
        listen(media, "change", event => { reduced = event.matches; setReducedMotion(reduced); requestRender(); });
        listen(renderer.domElement, "webglcontextlost", event => { event.preventDefault(); fail(); });
        listen(element, "pointerdown", event => {
          if (event.button !== 0 || activePointer !== null) return;
          activePointer = { id: event.pointerId, x: event.clientX, y: event.clientY, rotation: { ...target }, type: event.pointerType };
          element.setPointerCapture(event.pointerId);
          element.classList.add("isDragging");
          invalidate();
        });
        listen(element, "pointermove", event => {
          if (!activePointer || activePointer.id !== event.pointerId) return;
          const dx = event.clientX - activePointer.x, dy = event.clientY - activePointer.y;
          if (activePointer.type === "touch" && Math.abs(dy) > Math.abs(dx) + 8) return;
          target.y = activePointer.rotation.y + dx * 0.009;
          if (activePointer.type !== "touch") target.x = clamp(activePointer.rotation.x + dy * 0.006, -0.65, 0.65);
          invalidate();
        });
        const endPointer = event => {
          if (activePointer?.id !== event.pointerId) return;
          if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
          activePointer = null;
          element.classList.remove("isDragging");
          invalidate();
        };
        listen(element, "pointerup", endPointer);
        listen(element, "pointercancel", endPointer);
        listen(element, "lostpointercapture", endPointer);
        listen(element, "keydown", event => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "Home") reset();
          else if (event.key === "ArrowLeft") rotate(-1);
          else if (event.key === "ArrowRight") rotate(1);
          else { target.x = clamp(target.x + (event.key === "ArrowUp" ? -0.15 : 0.15), -0.65, 0.65); invalidate(); }
        });
        resize();
        world.pivot.rotation.set(REST.x, REST.y, REST.z);
        renderer.render(world.scene, world.camera);
        setStatus("ready");
        requestRender();
      } catch { fail(); }
    }
    initialize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect(); resizeObserver?.disconnect();
      removals.forEach(remove => remove());
      controls.current = null;
      world?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer?.domElement.remove();
    };
  }, []);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    controls.current?.redraw();
  };
  return <figure className={`brandScene ${status === "ready" ? "isReady" : ""}`}>
    <img className="brandSceneFallback" src="/ynx-sculpture.jpg" width="1254" height="1254" alt={status === "ready" ? "" : copy[0]} aria-hidden={status === "ready" ? "true" : undefined} decoding="async" />
    <div ref={host} className="brandSceneViewport" role={status === "ready" ? "img" : undefined} aria-label={status === "ready" ? copy[0] : undefined} aria-describedby={status === "ready" ? hintId : undefined} tabIndex={status === "ready" ? 0 : -1} />
    {status === "ready" && <figcaption className="brandSceneCaption">
      <span>{copy[1]}<span id={hintId} className="brandSceneSR">{copy[7]}</span></span>
      <div className="brandSceneControls" aria-label={copy[0]}>
        <button type="button" aria-label={copy[2]} title={copy[2]} onClick={() => controls.current?.rotate(-1)}><ArrowLeft aria-hidden="true" size={16} /></button>
        <button type="button" aria-label={copy[3]} title={copy[3]} onClick={() => controls.current?.rotate(1)}><ArrowRight aria-hidden="true" size={16} /></button>
        <button type="button" aria-label={copy[4]} title={copy[4]} onClick={() => controls.current?.reset()}><RotateCcw aria-hidden="true" size={15} /></button>
        {!reducedMotion && <button type="button" aria-label={paused ? copy[6] : copy[5]} title={paused ? copy[6] : copy[5]} aria-pressed={paused} onClick={togglePause}>{paused ? <Play aria-hidden="true" size={14} /> : <Pause aria-hidden="true" size={14} />}</button>}
      </div>
    </figcaption>}
  </figure>;
}
