#!/usr/bin/env node
// 定时任务调度器 — 对应码道 IDE「定时任务」能力
// 任务：GitHub Trending 每日分析  |  频率：每天 08:00  |  提示词：使用 analyze-github-trending 技能执行 daily 分析并同步 dashboard
import cron from "node-cron";
import { spawn } from "node:child_process";
import { mkdirSync, appendFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LOG_DIR = path.join(ROOT, "reports", "cron");
mkdirSync(LOG_DIR, { recursive: true });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  appendFileSync(path.join(LOG_DIR, "execution.log"), line);
  console.log(line.trim());
}

function runAnalysis(period = "daily") {
  log(`开始执行：node scripts/run-analysis.mjs --period ${period}`);
  const child = spawn("node", ["scripts/run-analysis.mjs", "--period", period], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  child.stdout.on("data", (d) => (out += d));
  child.stderr.on("data", (d) => (out += d));
  child.on("close", (code) => log(`执行结束 code=${code}\n${out.trim()}`));
}

// 定时任务定义：每天 08:00（等同码道 IDE 中「GitHub Trending 每日分析」任务的执行频率）
const SCHEDULE = process.env.CRON_EXPR || "0 8 * * *";
log(`定时任务已启动：${SCHEDULE} -> analyze-github-trending --period daily`);

cron.schedule(SCHEDULE, () => runAnalysis("daily"));

// 支持立即执行验证（对应码道定时任务页的「立即执行」）：node scripts/scheduler.mjs --run-now
if (process.argv.includes("--run-now")) {
  setTimeout(() => runAnalysis("daily"), 800);
}