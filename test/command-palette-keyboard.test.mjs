import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { transform } from "esbuild";

const source = await readFile(new URL("../src/components/CommandPalette.jsx", import.meta.url), "utf8");
const { code } = await transform(source, { loader: "jsx", format: "cjs" });

// Execute the component's actual event handlers and effects with a small host.
// Browser QA separately covers native button activation and scroll geometry.
function mountPalette() {
  const hooks = [], assigned = [], fetched = [], scrolled = [];
  let cursor = 0, pending = [], dirty = false, tree, nodes = [], closed = 0;
  const document = { body: { style: {} }, activeElement: null };
  const same = (left, right) => left && right && left.length === right.length && left.every((value, index) => Object.is(value, right[index]));
  class Element {
    constructor(node) { this.node = node; this.hidden = Boolean(node.props.hidden); this.isConnected = true; }
    focus() { document.activeElement = this; }
    getAttribute(key) { return this.node.props[key] ?? null; }
    querySelector(selector) { return nodes.find(node => `#${node.props.id}` === selector)?.element; }
    querySelectorAll() { return nodes.filter(node => ["input", "button"].includes(node.type)).map(node => node.element); }
    scrollIntoView(options) { scrolled.push({ id: this.node.props.id, ...options }); }
  }
  const React = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children: children.flat(Infinity).filter(Boolean) } }),
    useState(initial) {
      const index = cursor++;
      hooks[index] ||= { value: typeof initial === "function" ? initial() : initial };
      return [hooks[index].value, next => {
        const value = typeof next === "function" ? next(hooks[index].value) : next;
        if (!Object.is(value, hooks[index].value)) { hooks[index].value = value; dirty = true; }
      }];
    },
    useRef(initial) { const index = cursor++; return hooks[index] ||= { current: initial }; },
    useMemo(factory, deps) {
      const index = cursor++;
      if (!same(hooks[index]?.deps, deps)) hooks[index] = { deps, value: factory() };
      return hooks[index].value;
    },
    useEffect(effect, deps) {
      const index = cursor++;
      if (!same(hooks[index]?.deps, deps)) {
        const cleanup = hooks[index]?.cleanup;
        hooks[index] = { deps };
        pending.push(() => { cleanup?.(); hooks[index].cleanup = effect(); });
      }
    },
  };
  const locale = { t: key => key };
  const imports = {
    react: React,
    "lucide-react": Object.fromEntries(["AppWindow", "BookOpen", "Braces", "CircleHelp", "FileText", "Search", "ShieldCheck", "X"].map(name => [name, name])),
    "../lib/documentSearch.js": { loadDocumentSearch: () => ({ then(callback) { callback(Array.from({length:4}, (_,index) => ({title:`Article ${index}`,description:"Reference",href:`/article-${index}`}))); return {catch() {}}; } }) },
    "../lib/ecosystemCatalog.js": { getCatalog: () => [] },
    "../lib/productPublicContract.js": { PRODUCT_PUBLIC_SECTIONS: [] },
    "../lib/api/ynxApi.js": { apiConfig: { explorerUrl: "https://explorer.ynxweb4.com" } },
    "../lib/i18n.jsx": { useLocale: () => locale },
    "../lib/economicsEvidence.js": { ECONOMIC_COMMANDS: [] },
  };
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require: name => { assert.ok(Object.hasOwn(imports, name), name); return imports[name]; },
    document, HTMLElement: Element,
    window: { requestAnimationFrame: callback => callback(), location: { assign: href => assigned.push(href) } },
    fetch: async url => { fetched.push(url); return { ok: true, json: async () => ({ deepLink: "/address/result" }) }; },
  });
  function render() {
    do {
      dirty = false; cursor = 0; pending = [];
      tree = module.exports.CommandPalette({ open: true, onClose: () => { closed += 1; } });
      nodes = [];
      const walk = node => {
        if (!node || typeof node !== "object") return;
        nodes.push(node); node.element = new Element(node);
        if (node.props.ref) node.props.ref.current = node.element;
        node.props.children.forEach(walk);
      };
      walk(tree);
      pending.forEach(effect => effect());
    } while (dirty);
  }
  render();
  const input = () => nodes.find(node => node.props.id === "command-query");
  return {
    assigned, fetched, scrolled,
    get closed() { return closed; },
    input,
    closeButton: () => nodes.find(node => node.type === "button" && node.props["aria-label"] === "commandClose"),
    option: index => nodes.find(node => node.props.id === `command-option-${index}`),
    type(value) { input().props.onChange({ target: { value } }); render(); },
    key(key, target = input(), extras = {}) {
      const event = { key, target: target.element, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...extras };
      nodes.find(node => node.props.id === "command-palette").props.onKeyDown(event);
      render();
      return event;
    },
  };
}

test("Enter on dialog buttons preserves native close and result activation", () => {
  for (const query of ["", "developer"]) {
    const palette = mountPalette();
    palette.type(query);
    const close = palette.closeButton();
    assert.equal(palette.key("Enter", close).defaultPrevented, false);
    assert.deepEqual(palette.assigned, []);
    assert.deepEqual(palette.fetched, []);
    close.props.onClick();
    assert.equal(palette.closed, 1);
  }
  const palette = mountPalette();
  palette.type("developer");
  const option = palette.option(0);
  assert.equal(palette.key("Enter", option).defaultPrevented, false);
  assert.deepEqual(palette.assigned, []);
  option.props.onClick();
  assert.deepEqual(palette.assigned, ["/docs"]);
});

test("Enter in the combobox opens its selected match and preserves IME composition", () => {
  const palette = mountPalette();
  palette.type("developer");
  assert.equal(palette.key("Enter", palette.input(), { nativeEvent: { isComposing: true } }).defaultPrevented, false);
  assert.deepEqual(palette.assigned, []);
  assert.equal(palette.key("Enter").defaultPrevented, true);
  assert.deepEqual(palette.assigned, ["/docs"]);
  assert.deepEqual(palette.fetched, []);
});

test("keyboard selection brings offscreen results into view and stops at list boundaries", () => {
  const palette = mountPalette();
  for (let index = 0; index < 10; index += 1) palette.key("ArrowDown");
  assert.equal(palette.input().props["aria-activedescendant"], "command-option-10");
  assert.deepEqual(palette.scrolled.at(-1), { id: "command-option-10", block: "nearest", inline: "nearest" });
  for (let index = 0; index < 5; index += 1) palette.key("ArrowDown");
  assert.equal(palette.input().props["aria-activedescendant"], "command-option-11");
  palette.key("Enter");
  assert.deepEqual(palette.assigned, ["/article-3"]);
});

test("unmatched record queries still use Explorer lookup", async () => {
  const palette = mountPalette();
  const address = `0x${"1".repeat(40)}`;
  palette.type(address);
  palette.key("ArrowDown");
  palette.key("Enter");
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(palette.fetched, [`/api/explorer/resolve?q=${address}`]);
  assert.deepEqual(palette.assigned, ["https://explorer.ynxweb4.com/address/result"]);
});
