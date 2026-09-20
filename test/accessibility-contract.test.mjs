import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [main, header, palette, styles] = await Promise.all([
  readFile(new URL("../src/main.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/SiteHeader.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/CommandPalette.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

test("landmarks expose one focusable skip destination after the global header", () => {
  assert.match(main, /<SiteHeader[\s\S]*?<main id="main-content" tabIndex=\{-1\}>/);
  assert.match(main, /<div id="main-content" tabIndex=\{-1\}>\s*(?:\{languageNotice\}\s*)?<Suspense\b[^\n]*>\{page\}<\/Suspense>\s*<\/div>/);
  assert.match(header, /className="skipLink" href="#main-content"/);
  assert.match(styles, /#main-content\[tabindex="-1"\]:focus \{ outline: 0; \}/);
});

test("command dialog has labelled combobox/listbox semantics and deterministic focus containment", () => {
  assert.match(palette, /role="dialog" aria-modal="true" aria-labelledby="command-title" aria-describedby="command-summary"/);
  assert.match(palette, /role="combobox"/);
  assert.match(palette, /aria-controls="command-results"/);
  assert.match(palette, /aria-activedescendant=/);
  assert.match(palette, /role="listbox"/);
  assert.match(palette, /role="option"/);
  assert.match(palette, /event\.key === "Tab"/);
  assert.match(palette, /returnFocusRef\.current/);
  assert.match(palette, /target\?\.isConnected && target\.focus\(\)/);
});

test("header popovers and mobile navigation expose control relationships and escape focus return", () => {
  assert.match(header, /aria-controls="command-palette"/);
  assert.match(header, /aria-controls="wallet-connection-dialog"/);
  assert.match(header, /id="wallet-connection-dialog"[\s\S]*?role="dialog"/);
  assert.match(header, /closeWalletMenu\(true\)/);
  assert.match(header, /aria-controls="primary-navigation"/);
  assert.match(header, /menuButtonRef\.current\?\.focus\(\)/);
  assert.match(header, /SUPPORTED_LOCALES\.map/);
});

test("responsive, RTL, dark and motion preferences have source-level gates", () => {
  assert.doesNotMatch(styles, /direction:\s*ltr\s*!important/);
  assert.match(styles, /html\[dir="rtl"\] body/);
  assert.match(styles, /\[dir="rtl"\] \.scrollProgress/);
  assert.match(styles, /@media \(max-width: 420px\)/);
  assert.match(styles, /@media \(pointer: coarse\)/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /\[data-theme="dark"\] \.portalHeroV2/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /animation-iteration-count:\s*1\s*!important/);
});

test("canonical light and dark text tokens satisfy WCAG AA normal-text contrast", () => {
  const pairs = [
    ["light ink", "#0b1020", "#ffffff"],
    ["light muted", "#5f6675", "#ffffff"],
    ["light blue", "#002fa7", "#ffffff"],
    ["light success", "#0b7a4b", "#ffffff"],
    ["light danger", "#b42318", "#ffffff"],
    ["dark ink", "#edf2ff", "#080d19"],
    ["dark muted", "#a8b1c3", "#080d19"],
    ["dark blue", "#5f85ff", "#080d19"],
    ["inverse", "#ffffff", "#002fa7"],
  ];
  for (const [name, foreground, background] of pairs) {
    assert.ok(contrast(foreground, background) >= 4.5, `${name} must remain at least 4.5:1`);
  }
});

function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((left, right) => right - left);
  return (high + 0.05) / (low + 0.05);
}

function luminance(hex) {
  const normalized = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255);
  return channels.reduce((total, channel, index) => {
    const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    return total + linear * [0.2126, 0.7152, 0.0722][index];
  }, 0);
}
