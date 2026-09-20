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
import { Line } from "three/src/objects/Line.js";
import { LineSegments } from "three/src/objects/LineSegments.js";
import { Shape } from "three/src/extras/core/Shape.js";
import { ExtrudeGeometry } from "three/src/geometries/ExtrudeGeometry.js";
import { BoxGeometry } from "three/src/geometries/BoxGeometry.js";
import { EdgesGeometry } from "three/src/geometries/EdgesGeometry.js";
import { BufferGeometry } from "three/src/core/BufferGeometry.js";
import { Float32BufferAttribute } from "three/src/core/BufferAttribute.js";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial.js";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial.js";
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial.js";
import { AmbientLight } from "three/src/lights/AmbientLight.js";
import { DirectionalLight } from "three/src/lights/DirectionalLight.js";
import { Vector2 } from "three/src/math/Vector2.js";
import { Vector3 } from "three/src/math/Vector3.js";
import { Raycaster } from "three/src/core/Raycaster.js";
import { SRGBColorSpace, NoToneMapping } from "three/src/constants.js";

// Extracted from public/ynx-logo.png (798 × 420), alpha silhouette, RDP bound 3.55 px.
// SHA-256 df071f540f21d54e92286fd709df5293187c269058850820adb11e7c5087c12d.
export const BRAND_CONTOUR = Object.freeze([
  [2,3], [104,3], [232,164], [237,162], [357,3], [449,3], [567,156],
  [572,155], [697,3], [795,3], [620,217], [779,417], [678,417],
  [571,283], [474,400], [337,220], [384,160], [388,159], [475,276],
  [518,225], [516,217], [403,75], [276,236], [276,416], [192,417], [191,236],
]);

// Educational concepts, not live telemetry, validator topology or protocol timing.
export const MODULE_IDS = Object.freeze(["transaction", "execution", "block", "network"]);
export const MODULE_LAYOUT = Object.freeze([
  { assembled: [0, 0.78, 0], separated: [-0.45, 1.56, 0] },
  { assembled: [0, 0.26, 0], separated: [0.32, 0.52, 0] },
  { assembled: [0, -0.26, 0], separated: [-0.32, -0.52, 0] },
  { assembled: [0, -0.78, 0], separated: [0.4, -1.56, 0] },
]);
const BLUE = 0x002fa7;
const point = (x, y, z) => new Vector3(x, y, z);

export function createBrandWorld(renderer) {
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 40);
  const pivot = new Group();
  scene.add(pivot);
  const geometries = new Set(), materials = new Set(), pickable = [];
  const ownGeometry = geometry => { geometries.add(geometry); return geometry; };
  const ownMaterial = material => { materials.add(material); return material; };
  const blue = ownMaterial(new MeshStandardMaterial({ color: BLUE, roughness: 0.32, metalness: 0.12 }));
  const white = ownMaterial(new MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.04 }));
  const ink = ownMaterial(new MeshBasicMaterial({ color: BLUE }));
  const whiteInk = ownMaterial(new MeshBasicMaterial({ color: 0xffffff }));
  const fine = ownMaterial(new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.2 }));
  const wire = ownMaterial(new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.45 }));
  const cube = ownGeometry(new BoxGeometry(1, 1, 1));
  const cubeEdges = ownGeometry(new EdgesGeometry(cube));
  const shape = new Shape();
  const w = 1.12, d = 0.8, r = 0.12;
  shape.moveTo(-w + r, -d); shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r); shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d); shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r); shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);
  const deckGeometry = ownGeometry(new ExtrudeGeometry(shape, { depth: 0.07, steps: 1, bevelEnabled: true, bevelSegments: 1, bevelSize: 0.018, bevelThickness: 0.014, curveSegments: 4 }));
  deckGeometry.rotateX(-Math.PI / 2);
  const deckEdges = ownGeometry(new EdgesGeometry(deckGeometry, 25));
  function mesh(parent, geometry, material, position, scale, id) {
    const object = new Mesh(geometry, material);
    if (position) object.position.set(...position);
    if (scale) object.scale.set(...scale);
    parent.add(object);
    if (id) { object.userData.moduleId = id; pickable.push(object); }
    return object;
  }
  function line(parent, points, material = fine) {
    const geometry = ownGeometry(new BufferGeometry().setFromPoints(points));
    const object = new Line(geometry, material);
    parent.add(object);
    return object;
  }
  const modules = MODULE_IDS.map((id, index) => {
    const group = new Group();
    group.userData.moduleId = id;
    pivot.add(group);
    mesh(group, deckGeometry, [white, blue], [0, 0, 0], null, id);
    const outlineMaterial = ownMaterial(new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 }));
    group.add(new LineSegments(deckEdges, outlineMaterial));
    const rail = mesh(group, cube, ink, [-1.12, 0.065, 0], [0.035, 0.09, 1.36], id);
    return { id, group, assembled: new Vector3(...MODULE_LAYOUT[index].assembled), separated: new Vector3(...MODULE_LAYOUT[index].separated), outlineMaterial, rail };
  });

  // Transaction cards contain a payload and a signature mark.
  const tx = modules[0].group;
  for (let i = 0; i < 3; i++) {
    const card = new Group(); tx.add(card);
    card.position.set((i - 1) * 0.52, 0.12 + i * 0.07, (i - 1) * -0.19);
    card.rotation.y = -0.1 + i * 0.07;
    mesh(card, cube, [blue, blue, white, blue, blue, blue], [0, 0.035, 0], [0.7, 0.06, 0.7], "transaction");
    for (let row = 0; row < 3; row++) mesh(card, cube, ink, [-0.04, 0.07, -0.18 + row * 0.12], [row === 2 ? 0.23 : 0.42, 0.008, 0.025], "transaction");
    mesh(card, cube, ink, [0.18, 0.071, 0.2], [0.13, 0.009, 0.085], "transaction");
  }

  // The execution chip bears the exact original YNX silhouette, extruded in 3D.
  const execution = modules[1].group;
  mesh(execution, cube, [blue, blue, white, blue, blue, blue], [0, 0.15, 0], [1.02, 0.17, 0.8], "execution");
  for (let side = -1; side <= 1; side += 2) for (let i = 0; i < 5; i++) {
    const z = (i - 2) * 0.135;
    mesh(execution, cube, blue, [side * 0.58, 0.12, z], [0.15, 0.025, 0.04], "execution");
    line(execution, [point(side * 0.65, 0.09, z), point(side * (0.83 + Math.abs(i - 2) * 0.06), 0.09, z), point(side * (0.83 + Math.abs(i - 2) * 0.06), 0.09, z + (i - 2) * 0.11)], wire);
  }
  const silhouette = new Shape();
  BRAND_CONTOUR.forEach(([x, y], index) => {
    const p = [(x - 398.5) / 160, (210 - y) / 160];
    if (index === 0) silhouette.moveTo(...p); else silhouette.lineTo(...p);
  });
  silhouette.closePath();
  const logoGeometry = ownGeometry(new ExtrudeGeometry(silhouette, { depth: 0.28, steps: 1, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.016, bevelThickness: 0.025, curveSegments: 1 }));
  const logo = mesh(execution, logoGeometry, blue, [0, 0.245, 0], [0.155, 0.155, 0.155], "execution");
  logo.rotation.x = -Math.PI / 2;

  // A block groups ordered cells; its visual count does not encode chain data.
  const block = modules[2].group;
  for (let x = 0; x < 3; x++) for (let z = 0; z < 2; z++) {
    const position = [(x - 1) * 0.45, 0.2, (z - 0.5) * 0.48];
    const cell = mesh(block, cube, (x + z) % 3 === 0 ? white : blue, position, [0.37, 0.25, 0.39], "block");
    const outline = new LineSegments(cubeEdges, wire);
    outline.position.copy(cell.position); outline.scale.copy(cell.scale); block.add(outline);
    mesh(block, cube, (x + z) % 3 === 0 ? ink : whiteInk, [position[0], 0.331, position[2]], [0.16, 0.008, 0.025], "block");
  }

  // Illustrative peers, unrelated to the public validator count or topology.
  const network = modules[3].group;
  const nodes = [];
  for (let i = 0; i < 6; i++) {
    const angle = i / 6 * Math.PI * 2;
    const position = point(Math.cos(angle) * 0.89, 0.18, Math.sin(angle) * 0.55);
    nodes.push(position);
    mesh(network, cube, i % 2 ? blue : white, position.toArray(), [0.19, 0.19, 0.19], "network");
    const outline = new LineSegments(cubeEdges, wire);
    outline.position.copy(position); outline.scale.setScalar(0.2); network.add(outline);
  }
  nodes.forEach((node, index) => {
    line(network, [node, nodes[(index + 1) % nodes.length]], wire);
    if (index < 3) line(network, [node, nodes[index + 3]], fine);
  });
  const networkPackets = Array.from({ length: 3 }, () => mesh(network, cube, ink, null, [0.065, 0.065, 0.065]));

  // The front data bus remains readable as the layers separate and reassemble.
  const busGeometry = ownGeometry(new BufferGeometry());
  busGeometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(12), 3));
  pivot.add(new Line(busGeometry, wire));
  const flow = mesh(pivot, cube, ink, null, [0.11, 0.11, 0.11]);
  const flowOutlineMaterial = ownMaterial(new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.22 }));
  const flowOutline = new LineSegments(cubeEdges, flowOutlineMaterial);
  flowOutline.scale.setScalar(0.2); pivot.add(flowOutline);
  const terminals = modules.map(() => mesh(pivot, cube, ink, null, [0.07, 0.07, 0.07]));
  const busPoints = modules.map(() => new Vector3());
  const grid = new Group(); pivot.add(grid); grid.position.y = -1.87;
  for (let i = -2; i <= 2; i++) {
    line(grid, [point(-1.65, 0, i * 0.45), point(1.65, 0, i * 0.45)]);
    line(grid, [point(i * 0.65, 0, -1.05), point(i * 0.65, 0, 1.05)]);
  }
  scene.add(new AmbientLight(0xffffff, 2));
  const key = new DirectionalLight(0xffffff, 3.2); key.position.set(-3, 6, 5);
  const fill = new DirectionalLight(0xffffff, 1.8); fill.position.set(4, 2, -2);
  scene.add(key, fill);
  const raycaster = new Raycaster(), pointer = new Vector2();

  return {
    scene, camera, pivot,
    present({ separation = 1, selected = "transaction", stage = -1, phase = 0, time = 0, motion = false }) {
      modules.forEach((module, index) => {
        module.group.position.lerpVectors(module.assembled, module.separated, separation);
        module.outlineMaterial.opacity = module.id === selected ? 0.9 : 0.2;
        module.rail.scale.y = module.id === selected ? 0.17 : 0.055;
        busPoints[index].copy(module.group.position).add(point(-1.29, 0.14, 0.93));
        terminals[index].position.copy(busPoints[index]);
        terminals[index].scale.setScalar(module.id === selected ? 0.11 : 0.065);
      });
      const positions = busGeometry.getAttribute("position");
      busPoints.forEach((p, i) => positions.setXYZ(i, p.x, p.y, p.z));
      positions.needsUpdate = true; busGeometry.computeBoundingSphere();
      const active = stage >= 0;
      const journey = active ? Math.min(3, stage + phase) : (time * 0.36) % 3;
      const segment = Math.min(2, Math.floor(journey));
      flow.position.lerpVectors(busPoints[segment], busPoints[segment + 1], journey - segment);
      flow.visible = active || motion;
      flowOutline.visible = flow.visible;
      flowOutline.position.copy(flow.position);
      if (motion) flow.rotation.y = time * 0.65;
      networkPackets.forEach((packet, i) => {
        const progress = (time * 0.2 + i / 3) % 1;
        packet.position.lerpVectors(nodes[i * 2], nodes[(i * 2 + 1) % nodes.length], progress);
        packet.visible = (active && stage === 3) || (!active && motion);
      });
      grid.position.y = -1.08 - separation * 0.79;
    },
    pick(x, y) {
      pointer.set(x, y);
      scene.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(pickable, false)[0]?.object.userData.moduleId || null;
    },
    resize(width, height) {
      camera.aspect = width / height;
      camera.position.set(0, 0.05, Math.max(9.5, 9.1 / camera.aspect));
      camera.lookAt(0, 0.04, 0);
      camera.updateProjectionMatrix();
    },
    dispose() {
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      pickable.length = 0;
      scene.clear();
    },
  };
}
