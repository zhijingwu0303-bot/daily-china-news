# 中国每日新闻 GitHub Pages 版

这是一个免费的个人新闻网站：

- GitHub Actions 每天中国时间 21:00 自动更新。
- GitHub Pages 提供公开网址。
- 只显示最新一期，不保存历史。
- 不提供日期回顾和关键词搜索。
- 只保留已证实新闻。
- 官方来源可以单独成立。
- 其他新闻需要两家独立可信媒体。
- 相同通稿和重复转载不会作为独立来源。
- 自动消除明显的事实冲突。
- 解析媒体原始链接并提取新闻梗概。
- 不显示新闻重要度。
- 不显示 token 或 AI 费用。
- 不使用 OpenAI、Netlify、Vercel、Supabase 或 Railway。

## 自动更新时间

```text
0 13 * * *
```

GitHub Actions 使用 UTC。`13:00 UTC` 等于中国时间 `21:00`。

GitHub 的定时任务可能延迟几分钟启动，但不需要电脑开机。

## 网站结构

```text
site/
  index.html
  app.js
  styles.css
  latest.json

scripts/
  generate-latest.mjs
  news-lib.mjs

.github/workflows/deploy.yml
```

`generate-latest.mjs` 生成最新新闻，GitHub Actions 将 `site/` 发布到 GitHub Pages。

## 手动重新生成

在 GitHub 仓库的 Actions 页面运行 `Publish Daily News`。

## 本地测试

```bash
pnpm install
node --test tests/*.test.mjs
node scripts/generate-latest.mjs
```

## 调整来源

编辑 `scripts/news-lib.mjs` 中的 `SOURCES` 和 `SEARCH_QUERIES`。

## 关闭网站

在 GitHub 仓库 Settings > Pages 中取消发布，或者禁用 `Publish Daily News` workflow。
