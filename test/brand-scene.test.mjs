import test from "node:test";
import assert from "node:assert/strict";
import { Vector3 } from "three/src/math/Vector3.js";
import { createBrandWorld, MODULE_IDS } from "../src/lib/brandGeometry.js";
import { SCENE_MODULES, getBrandSceneCopy } from "../src/content/brandSceneCopy.js";
import { preferStaticScene, walkthroughAt } from "../src/lib/brandSceneState.js";

const createWorld = () => createBrandWorld({ setClearColor() {} });

test("the model has complete explanatory copy for all twelve locales", () => {
  const locales = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar", "id"];
  assert.deepEqual(MODULE_IDS, SCENE_MODULES);
  const fields = Object.keys(getBrandSceneCopy("en"));
  for (const locale of locales) {
    const copy = getBrandSceneCopy(locale);
    assert.deepEqual(Object.keys(copy), fields, locale);
    for (const [key, value] of Object.entries(copy)) {
      if (Array.isArray(value)) { assert.equal(value.length, 4, `${locale}.${key}`); value.forEach(text => assert.ok(text.trim())); }
      else assert.ok(value.trim(), `${locale}.${key}`);
    }
    if (locale !== "en") assert.notEqual(copy.complete, getBrandSceneCopy("en").complete, locale);
  }
});

test("constrained devices avoid the renderer and retain the static walkthrough", () => {
  assert.equal(preferStaticScene({}), false);
  assert.equal(preferStaticScene({ connection: { saveData: true } }), true);
  assert.equal(preferStaticScene({ connection: { effectiveType: "2g" } }), true);
  assert.equal(preferStaticScene({ hardwareConcurrency: 2 }), true);
  assert.equal(preferStaticScene({ deviceMemory: 2 }), true);
  assert.equal(preferStaticScene({ hardwareConcurrency: 8, deviceMemory: 8, connection: { effectiveType: "4g" } }), false);
});

test("walkthrough presents four bounded stages and a distinct completed state", () => {
  assert.deepEqual(walkthroughAt(-1), { step: 0, phase: 0, complete: false });
  [0.1, 2, 4, 6].forEach((seconds, stage) => assert.equal(walkthroughAt(seconds).step, stage));
  assert.equal(walkthroughAt(7.59).complete, false);
  assert.deepEqual(walkthroughAt(7.6), { step: 3, phase: 1, complete: true });
  assert.deepEqual(walkthroughAt(100), { step: 3, phase: 1, complete: true });
});

test("separated layers remain individually selectable with actual raycasting", () => {
  const world = createWorld();
  world.resize(320, 236); world.pivot.rotation.set(0.56, -0.48, -0.025); world.present({ separation: 1 });
  const hits = new Set();
  for (let y = -0.85; y <= 0.85; y += 0.04) for (let x = -0.85; x <= 0.85; x += 0.04) {
    const id = world.pick(x, y); if (id) hits.add(id);
  }
  assert.deepEqual([...hits].sort(), [...MODULE_IDS].sort());
  world.dispose();
});

test("geometry fits narrow and wide viewports across supported rotations", () => {
  const world = createWorld(), vertex = new Vector3();
  for (const [width, height] of [[280, 212], [320, 236], [390, 236], [550, 309]]) {
    world.resize(width, height); world.camera.updateMatrixWorld(true);
    for (const separation of [0, 1]) for (const pitch of [0.12, 0.56, 1.15]) for (const yaw of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
      world.pivot.rotation.set(pitch, yaw, -0.025); world.present({ separation }); world.scene.updateMatrixWorld(true);
      world.scene.traverse(object => {
        if (!object.isMesh || !object.visible) return;
        const positions = object.geometry.getAttribute("position");
        for (let i = 0; i < positions.count; i++) {
          vertex.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld).project(world.camera);
          assert.ok(Number.isFinite(vertex.x) && Number.isFinite(vertex.y) && Number.isFinite(vertex.z));
          assert.ok(Math.abs(vertex.x) < 0.98 && Math.abs(vertex.y) < 0.98, `clipped at ${width}×${height}, pitch ${pitch}, yaw ${yaw}`);
        }
      });
    }
  }
  world.dispose();
});

test("shared model resources are disposed once and geometry stays lightweight", () => {
  const world = createWorld(), geometries = new Set(), materials = new Set();
  let triangleCount = 0;
  world.scene.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    if (object.isMesh) triangleCount += (object.geometry.index?.count || object.geometry.getAttribute("position").count) / 3;
  });
  assert.ok(triangleCount < 2000, `model has ${triangleCount} triangles`);
  const disposed = new Map();
  for (const resource of [...geometries, ...materials]) resource.addEventListener("dispose", () => disposed.set(resource, (disposed.get(resource) || 0) + 1));
  world.dispose();
  for (const resource of [...geometries, ...materials]) assert.equal(disposed.get(resource), 1);
  assert.equal(world.scene.children.length, 0);
});
