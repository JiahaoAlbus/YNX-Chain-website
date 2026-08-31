import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("secondary routes and command search are loaded on demand", () => {
  const main = fs.readFileSync("src/main.jsx", "utf8");
  const header = fs.readFileSync("src/components/SiteHeader.jsx", "utf8");
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

  for (const routeModule of [
    "AppsPage", "DownloadPage", "DocsPage", "AuthorityArticlePage", "ProductStatusPage",
    "SquarePage", "ManualPage", "ApiPage", "FaucetPage", "WalletAuthCallbackPage", "PortalPage",
  ]) {
    assert.match(main, new RegExp(`lazyNamed\\(\\(\\) => import\\(\\"[^\\"]*${routeModule}\\.jsx\\"\\)`));
    assert.doesNotMatch(main, new RegExp(`import \\{ ${routeModule}[^\\n]+from`));
  }

  assert.match(header, /lazy\(\(\) => import\("\.\/CommandPalette\.jsx"\)/);
  assert.doesNotMatch(header, /import \{ CommandPalette \}/);
  assert.match(packageJson.scripts.build, /verify-bundle-split\.mjs/);
});
