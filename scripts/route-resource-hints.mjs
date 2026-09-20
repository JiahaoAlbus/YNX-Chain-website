import fs from 'node:fs';
import path from 'node:path';

// Discover hashed assets from Vite, without loading other pages or Three.js.
const root = path.resolve('dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, '.vite/manifest.json'), 'utf8'));
const pages = {
  '/manual': 'ManualPage', '/contact': 'ContactPage', '/docs': 'DocsPage',
  '/api': 'ApiPage', '/whitepaper': 'WhitepaperPage', '/dapp/download': 'DownloadPage',
  '/dapp': 'AppsPage', '/dapp/faucet': 'FaucetPage',
};
const portals = new Set(['/blockchain','/tokens','/data','/governance','/developers','/downloads','/ecosystem','/more']);
function assetsFor(route) {
  const names = route === '/' ? [] : ['RoutedContent'];
  const page = pages[route] || (portals.has(route) ? 'PortalPage' : route.startsWith('/dapp/') && !route.includes('wallet-auth') ? 'ProductStatusPage' : null);
  if (page) names.push(page);
  const seen = new Set(), js = new Set(), css = new Set();
  function visit(key) {
    if (seen.has(key)) return;
    seen.add(key);
    const item = manifest[key];
    if (!item) return;
    if (item.file.endsWith('.js')) js.add('/' + item.file);
    for (const file of item.css || []) css.add('/' + file);
    for (const dependency of item.imports || []) visit(dependency);
  }
  for (const name of names) {
    const key = Object.keys(manifest).find(key => key === `src/pages/${name}.jsx`) ||
      Object.keys(manifest).find(key => manifest[key].name === name && manifest[key].isDynamicEntry);
    if (key) visit(key);
  }
  return { js, css };
}
let count = 0;
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { if (!['assets','document-library','docs-authority','releases','third-party'].includes(entry.name)) walk(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(file, 'utf8');
    const relative = path.relative(root, file).split(path.sep).join('/');
    const route = '/' + relative.replace(/(?:\/)?index\.html$|\.html$/g, '');
    const { js, css } = assetsFor(route);
    const hints = [...js].filter(href => !html.includes(`src="${href}"`) && !html.includes(`href="${href}"`)).map(href => `<link rel="modulepreload" crossorigin href="${href}">`);
    hints.push(...[...css].filter(href => !html.includes(`href="${href}"`)).map(href => `<link rel="stylesheet" crossorigin href="${href}">`));
    if (hints.length) { html = html.replace('</head>', hints.join('\n') + '\n</head>'); fs.writeFileSync(file, html); count++; }
  }
}
walk(root);
console.log(`Added route-specific resource hints to ${count} HTML files`);
