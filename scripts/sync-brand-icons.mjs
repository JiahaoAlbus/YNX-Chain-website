#!/usr/bin/env node

// Package the existing approved PNGs without redrawing, resizing, or re-encoding pixels.
import fs from "node:fs";

const publicRoot = new URL("../public/", import.meta.url);
const png48 = fs.readFileSync(new URL("ynx-favicon-48.png", publicRoot));
const png512 = fs.readFileSync(new URL("ynx-icon-512.png", publicRoot));

for (const [png, size] of [[png48, 48], [png512, 512]]) {
  if (png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || png.readUInt32BE(16) !== size || png.readUInt32BE(20) !== size) {
    throw new Error(`Expected the existing ${size} × ${size} brand PNG`);
  }
}

const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(1, 2); // ICO image type.
icoHeader.writeUInt16LE(1, 4); // One directory entry.
icoHeader[6] = 48;
icoHeader[7] = 48;
icoHeader.writeUInt16LE(1, 10); // Color planes.
icoHeader.writeUInt16LE(32, 12); // RGBA bit depth.
icoHeader.writeUInt32LE(png48.length, 14);
icoHeader.writeUInt32LE(icoHeader.length, 18);
fs.writeFileSync(new URL("favicon.ico", publicRoot), Buffer.concat([icoHeader, png48]));

// An SVG loaded as an image cannot rely on another external image request.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="YNX">\n  <image href="data:image/png;base64,${png512.toString("base64")}" x="0" y="0" width="512" height="512"/>\n</svg>\n`;
fs.writeFileSync(new URL("ynx-favicon.svg", publicRoot), svg);
