import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "attached_assets");
const outDir = path.join(root, "attached_assets", "optimized");

// name (without ext) -> max width in px. Heights scale automatically.
const targets = {
  "hero-1": 1600,
  "hero-2": 1600,
  "hero-3": 1600,
  "workforce-solutions": 900,
  "rider-visa": 900,
  "fleet-cyclists": 800,
  "fleet-motorcycles": 800,
  "fleet-cars": 800,
  "fleet-vans": 800,
  "fleet-trucks": 800,
  "logo": 480,
};

await sharp(); // no-op to ensure module loaded
const { mkdir } = await import("fs/promises");
await mkdir(outDir, { recursive: true });

for (const [name, width] of Object.entries(targets)) {
  const input = path.join(srcDir, `${name}.png`);
  const output = path.join(outDir, `${name}.webp`);
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(output);
  console.log(
    `${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
  );
}
console.log("Done.");
