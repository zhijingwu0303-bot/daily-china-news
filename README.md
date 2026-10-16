# 中国每日新闻 Netlify 极简版

线上地址：https://zhijing-daily-news-2026.netlify.app

这是一个只需要 Netlify 的新闻网站：

- 打开网址时自动获取最近 36 小时新闻。
- 使用免费的 Bing News RSS 搜索候选新闻。
- 只保留官方来源和可信媒体。
- 官方来源可单独成立；其他新闻需要至少两家独立可信媒体。
- 相同通稿的重复转载不会当作独立来源。
- 自动添加 finance、economics、industries、tech、politics 标签。
- 按来源覆盖数和新鲜度排序。
- 只显示最新一期，不保存历史。
- 不提供日期回顾和关键词搜索。
- 不使用 OpenAI、Brave、Supabase、Vercel 或 Railway。
- 不产生 token 费用。

## 部署

### 方法一：Netlify Drop

1. 打开 https://app.netlify.com/drop
2. 登录你的 Netlify 账号。
3. 把 `daily-news-netlify.zip` 拖到页面中。
4. 等待部署完成。
5. Netlify 会给出类似 `https://xxxx.netlify.app` 的网址。

### 方法二：Netlify CLI

```bash
npx netlify-cli login
npx netlify-cli deploy --prod
```

## 本地测试

```bash
npm test
```

## 调整来源

编辑：

```text
netlify/functions/lib.mjs
```

修改 `SOURCES` 数组即可增加或删除来源。

## 关闭网站

在 Netlify 项目的 Site configuration 中删除站点或停用部署即可。
