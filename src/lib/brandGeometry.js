/*!
 * Three.js — The MIT License
 * Copyright © 2010-2025 three.js authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import { Scene } from "three/src/scenes/Scene.js";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera.js";
import { Group } from "three/src/objects/Group.js";
import { Mesh } from "three/src/objects/Mesh.js";
import { Shape } from "three/src/extras/core/Shape.js";
import { ExtrudeGeometry } from "three/src/geometries/ExtrudeGeometry.js";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry.js";
import { MeshPhysicalMaterial } from "three/src/materials/MeshPhysicalMaterial.js";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial.js";
import { AmbientLight } from "three/src/lights/AmbientLight.js";
import { DirectionalLight } from "three/src/lights/DirectionalLight.js";
import { CanvasTexture } from "three/src/textures/CanvasTexture.js";
import { SRGBColorSpace, NoToneMapping } from "three/src/constants.js";

// Extracted from the alpha silhouette of public/ynx-logo.png (798 × 420),
// SHA-256 df071f540f21d54e92286fd709df5293187c269058850820adb11e7c5087c12d.
// Pixel-boundary tracing + RDP removes raster stair steps, not brand features.
// The maximum combined simplification bound is 3.55 source pixels.
export const BRAND_CONTOUR = Object.freeze([
  [2,3], [104,3], [232,164], [237,162], [357,3], [449,3], [567,156],
  [572,155], [697,3], [795,3], [620,217], [779,417], [678,417],
  [571,283], [474,400], [337,220], [384,160], [388,159], [475,276],
  [518,225], [516,217], [403,75], [276,236], [276,416], [192,417], [191,236],
]);

export function createBrandWorld(renderer) {
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 40);
  camera.position.set(0, 0.15, 8.8);
  camera.lookAt(0, -0.03, 0);
  const pivot = new Group();
  scene.add(pivot);

  const silhouette = new Shape();
  BRAND_CONTOUR.forEach(([x, y], index) => {
    const point = [(x - 398.5) / 160, (210 - y) / 160];
    if (index === 0) silhouette.moveTo(...point);
    else silhouette.lineTo(...point);
  });
  silhouette.closePath();
  const geometry = new ExtrudeGeometry(silhouette, {
    depth: 0.48, steps: 1, bevelEnabled: true, bevelSegments: 4,
    bevelSize: 0.018, bevelThickness: 0.028, curveSegments: 1,
  });
  geometry.translate(0, 0, -0.24);
  const face = new MeshPhysicalMaterial({
    color: 0x002fa7, metalness: 0.12, roughness: 0.3,
    clearcoat: 0.85, clearcoatRoughness: 0.18,
  });
  const edge = new MeshPhysicalMaterial({
    color: 0x00247e, metalness: 0.22, roughness: 0.23,
    clearcoat: 1, clearcoatRoughness: 0.16,
  });
  pivot.add(new Mesh(geometry, [face, edge]));
  scene.add(new AmbientLight(0xffffff, 1.15));
  const key = new DirectionalLight(0xffffff, 2.8);
  key.position.set(-3.5, 5, 5);
  const fill = new DirectionalLight(0xffffff, 1.1);
  fill.position.set(5, 1, 3);
  const rim = new DirectionalLight(0xffffff, 2.2);
  rim.position.set(1, -2, -4);
  scene.add(key, fill, rim);

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 128;
  shadowCanvas.height = 64;
  const context = shadowCanvas.getContext("2d");
  const texture = new CanvasTexture(shadowCanvas);
  if (context) {
    context.scale(2, 1);
    const gradient = context.createRadialGradient(32, 32, 1, 32, 32, 31);
    gradient.addColorStop(0, "rgba(0,47,167,.17)");
    gradient.addColorStop(0.45, "rgba(0,47,167,.07)");
    gradient.addColorStop(1, "rgba(0,47,167,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    texture.needsUpdate = true;
  }
  const shadowGeometry = new PlaneGeometry(5.5, 0.65);
  const shadowMaterial = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  const shadow = new Mesh(shadowGeometry, shadowMaterial);
  shadow.position.set(0.12, -1.78, -0.5);
  scene.add(shadow);

  return {
    scene, camera, pivot,
    resize(width, height) {
      camera.aspect = width / height;
      // Keep the actual mark completely inside both portrait and wide viewports.
      camera.position.z = camera.aspect < 1 ? 8.8 / camera.aspect : 8.8;
      camera.updateProjectionMatrix();
    },
    dispose() {
      geometry.dispose(); face.dispose(); edge.dispose();
      shadowGeometry.dispose(); shadowMaterial.dispose(); texture.dispose();
      scene.clear();
    },
  };
}
