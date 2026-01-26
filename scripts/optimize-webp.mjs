import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, "public");

function formatBytes(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

function getProfile(absPath) {
  const rel = absPath.replace(repoRoot + path.sep, "").split(path.sep).join("/");
  const base = path.basename(absPath).toLowerCase();

  // Icons / logos
  if (base === "rect1.webp" || base.startsWith("favicon")) return { maxW: 256, q: 80, rel };
  if (base === "ico.webp" || base.endsWith("-ico.webp")) {
    return { maxW: 256, q: 82, rel };
  }

  // Certificates: thumbnail-ish
  if (rel.startsWith("public/certifieds/")) {
    return { maxW: 900, q: 62, rel };
  }

  // Project assets
  if (rel.startsWith("public/projects/")) {
    // Screenshots: limit width to reduce LCP impact
    return { maxW: 1200, q: 62, rel };
  }

  // Backgrounds / hero images
  if (base.includes("avila") || base.includes("cyberpunk")) {
    return { maxW: 1600, q: 62, rel };
  }

  // Default
  return { maxW: 1400, q: 62, rel };
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

async function optimizeWebp(absPath) {
  const { maxW, q } = getProfile(absPath);
  const statBefore = await fs.stat(absPath);

  const tmp = absPath + ".tmp.webp";

  // Note: re-encode webp via ffmpeg. We keep aspect ratio and prevent upscaling.
  // IMPORTANT: when passing args via spawn, do not include shell quotes in filter strings.
  const vf = `scale=min(${maxW},iw):-2`;
  try {
    await run("ffmpeg", [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      absPath,
      "-vf",
      vf,
      "-c:v",
      "libwebp",
      "-q:v",
      String(q),
      "-preset",
      "picture",
      "-compression_level",
      "6",
      tmp,
    ]);
  } catch (err) {
    // If something goes wrong (corrupt file, unsupported, etc.), keep original.
    try {
      await fs.unlink(tmp);
    } catch {
      // ignore
    }
    return { changed: false, before: statBefore.size, after: statBefore.size, error: String(err) };
  }

  const statAfter = await fs.stat(tmp);

  if (statAfter.size < statBefore.size) {
    await fs.rename(tmp, absPath);
    return { changed: true, before: statBefore.size, after: statAfter.size };
  }

  // If not smaller, keep original.
  await fs.unlink(tmp);
  return { changed: false, before: statBefore.size, after: statBefore.size };
}

async function main() {
  const all = await walk(publicDir);
  const webps = all.filter((p) => p.toLowerCase().endsWith(".webp"));

  if (!webps.length) {
    console.log("No .webp files found under public/");
    return;
  }

  // Sort stable for repeatability
  webps.sort((a, b) => a.localeCompare(b));

  let totalBefore = 0;
  let totalAfter = 0;
  let changedCount = 0;

  const reportLines = [];

  const reportPath = path.join(repoRoot, "scripts", "optimize-webp.report.txt");
  const writeReport = async (extraSummaryLines = []) => {
    const report = [...reportLines, "", ...extraSummaryLines, ""].join("\n");
    await fs.writeFile(reportPath, report, "utf8");
  };

  try {
    for (const p of webps) {
      const rel = p.replace(repoRoot + path.sep, "");
      const result = await optimizeWebp(p);
      const { before, after, changed } = result;
      totalBefore += before;
      totalAfter += after;
      if (changed) changedCount += 1;

      const delta = before - after;
      const pct = before ? ((delta / before) * 100).toFixed(1) : "0.0";
      const mark = changed ? "optimized" : "kept";
      const extra = result.error ? `  [error: ${result.error}]` : "";
      const line = `${mark}: ${rel}  ${formatBytes(before)} -> ${formatBytes(after)}  (-${pct}%)${extra}`;
      reportLines.push(line);
      console.log(line);
    }
  } finally {
    const totalDelta = totalBefore - totalAfter;
    const totalPct = totalBefore ? ((totalDelta / totalBefore) * 100).toFixed(1) : "0.0";
    await writeReport([
      "Summary",
      `- Files: ${webps.length}`,
      `- Optimized: ${changedCount}`,
      `- Total: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (-${totalPct}%)`,
    ]);
  }

  const totalDelta = totalBefore - totalAfter;
  const totalPct = totalBefore ? ((totalDelta / totalBefore) * 100).toFixed(1) : "0.0";
  console.log("\nSummary");
  console.log(`- Files: ${webps.length}`);
  console.log(`- Optimized: ${changedCount}`);
  console.log(`- Total: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (-${totalPct}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
