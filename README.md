# Github-Trending-Scheduler · 定时任务抓取与分析 GitHub 热门

ICT 大赛云赛道赛题 1.6：结合 `analyze-github-trending` 技能，创建定时任务自动抓取 GitHub Trending，生成中文日报与 dashboard 页面，全程无需人工干预。

## 作品内容

- `SKILL.md`：analyze-github-trending 技能（从参考项目 `Github-Trending-Analyze` 引入）
- `scripts/run-analysis.mjs`：分析入口（`--period daily|weekly|monthly`）
- `scripts/scheduler.mjs`：**定时任务调度器**（对应码道 IDE「定时任务」能力）
- `reports/github-trending/`：运行产物（日报 Markdown + dashboard HTML + 数据缓存）
- `package.json`：Node.js 依赖（node-cron）

## 定时任务配置（对应码道 IDE「定时任务」页面）

| 参数 | 填写内容 |
|------|----------|
| 名称 | GitHub Trending 每日分析 |
| 项目文件夹 | 当前项目 |
| 提示词 | 使用 analyze-github-trending 技能分析 GitHub Trending 每日榜单，执行 `node scripts/run-analysis.mjs --period daily`，生成今日中文日报并同步更新 dashboard 页面，并在当前浏览器预览 dashboard 页面。 |
| 执行频率 | 每天 08:00 |

本地实现：`scripts/scheduler.mjs` 使用 `node-cron` 注册 `0 8 * * *`（每天 08:00），到点自动执行 daily 分析；立即执行验证用 `node scripts/scheduler.mjs --run-now`。

## 执行记录（立即执行验证）

```
[2026-09-22] 定时任务已启动：0 8 * * * -> analyze-github-trending --period daily
[2026-09-22] 开始执行：node scripts/run-analysis.mjs --period daily
[ok] daily -> reports/github-trending/2026-09-22-daily.md | repos=12 focus=3
[ok] cache -> reports/github-trending/cache/2026-09-22
[ok] dashboard sync -> reports/github-trending/dashboard/index.html
[ok] unique repos enriched -> 12
```

## 产物说明

- `reports/github-trending/2026-09-22-daily.md`：中文日报（整体趋势分析 + 12 个热门项目清单 + 一句话读懂 + what/how/why 拆解）
- `reports/github-trending/dashboard/index.html`：可视化 dashboard（日期选择器 + 项目卡片 + 趋势标注）
- `reports/github-trending/cache/`：抓取缓存（trending 原始数据 + 富化数据）

## 运行方式

```bash
npm install          # 安装依赖
node scripts/run-analysis.mjs --period daily   # 手动分析一次
node scripts/scheduler.mjs                     # 启动定时任务（每天 08:00）
node scripts/scheduler.mjs --run-now           # 立即执行验证
```

或直接用浏览器打开 `reports/github-trending/dashboard/index.html` 查看 dashboard。