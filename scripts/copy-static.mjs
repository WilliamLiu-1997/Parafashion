import { cpSync, existsSync, lstatSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");
const distDir = resolve(projectRoot, "dist");

const copyTargets = [
  { src: "images", dest: "images" },
  { src: "obj", dest: "obj" },
  { src: "js/worker.js", dest: "js/worker.js" },
  { src: "js/three_worker.js", dest: "js/three_worker.js" },
  { src: "js/DerivePatchLayout.js", dest: "js/DerivePatchLayout.js" },
  { src: "js/DerivePatchLayout.wasm", dest: "js/DerivePatchLayout.wasm" },
];

for (const { src, dest } of copyTargets) {
  const sourcePath = resolve(projectRoot, src);
  const destinationPath = resolve(distDir, dest);

  if (!existsSync(sourcePath)) {
    console.warn(`[copy-static] Skip missing: ${src}`);
    continue;
  }

  mkdirSync(dirname(destinationPath), { recursive: true });
  const sourceStats = lstatSync(sourcePath);

  cpSync(sourcePath, destinationPath, {
    recursive: sourceStats.isDirectory(),
    force: true,
  });

  console.log(`[copy-static] Copied ${src} -> dist/${dest}`);
}
