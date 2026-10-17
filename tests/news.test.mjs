import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDigest,
  classify,
  cleanSummary,
  fetchArticleSummary,
  groupCandidates,
  parseBingRss,
  sourceForUrl,
  stripHtml,
  verifyGroups
} from "../netlify/functions/lib.mjs";

const rss = `<?xml version="1.0"?>
<rss><channel>
  <item>
    <title>中国公布最新经济数据</title>
    <link>https://www.reuters.com/world/china/story-a</link>
    <description>国家统计局发布数据，消费和工业产出均有所增长。</description>
    <pubDate>Thu, 16 Oct 2026 12:00:00 GMT</pubDate>
  </item>
  <item>
    <title>中国公布最新经济数据</title>
    <link>https://apnews.com/article/story-b</link>
    <description>最新官方统计显示，工业活动与居民消费同步回升。</description>
    <pubDate>Thu, 16 Oct 2026 12:05:00 GMT</pubDate>
  </item>
  <item>
    <title>某未知来源新闻</title>
    <link>https://example.com/story</link>
    <description>不会被收录。</description>
    <pubDate>Thu, 16 Oct 2026 12:00:00 GMT</pubDate>
  </item>
</channel></rss>`;

test("parses Bing RSS", () => {
  const items = parseBingRss(rss);
  assert.equal(items.length, 3);
  assert.equal(items[0].title, "中国公布最新经济数据");
});

test("accepts independent media reports with different wording", () => {
  const items = parseBingRss(rss);
  const candidates = items.map((item, index) => ({
    title: item.title,
    excerpt: item.description,
    canonicalUrl: item.url,
    url: item.url,
    publishedAt: new Date(item.pubDate),
    source: index === 0
      ? { id: "reuters", name: "Reuters", sourceType: "trusted_media", trustLevel: 1 }
      : index === 1
        ? { id: "ap", name: "AP", sourceType: "trusted_media", trustLevel: 1 }
        : null
  })).filter((item) => item.source);

  const groups = verifyGroups([
    candidates.filter((item) => item.source.id === "reuters" || item.source.id === "ap")
  ]);
  assert.equal(groups.length, 1);
});

test("rejects the same wire copy republished by two domains", () => {
  const groups = verifyGroups([
    [
      {
        title: "同一通稿",
        excerpt: "完全相同的内容",
        canonicalUrl: "https://reuters.com/a",
        url: "https://reuters.com/a",
        publishedAt: new Date(),
        source: { id: "reuters", name: "Reuters", sourceType: "trusted_media", trustLevel: 1 }
      },
      {
        title: "同一通稿",
        excerpt: "完全相同的内容",
        canonicalUrl: "https://apnews.com/b",
        url: "https://apnews.com/b",
        publishedAt: new Date(),
        source: { id: "ap", name: "AP", sourceType: "trusted_media", trustLevel: 1 }
      }
    ]
  ]);
  assert.equal(groups.length, 0);
});

test("builds a latest-only digest", () => {
  const digest = buildDigest(parseBingRss(rss), new Date("2026-10-16T13:00:00Z"));
  assert.equal(digest.count, 1);
  assert.equal(digest.items[0].title, "中国公布最新经济数据");
});

test("classifies business and economic news", () => {
  assert.deepEqual(classify("国家统计局公布消费和GDP数据"), ["economics"]);
  assert.deepEqual(classify("某上市公司发布并购公告"), ["industries"]);
});

test("groups differently worded reports about the same economic event", () => {
  const groups = groupCandidates([
    { title: "中国公布最新经济数据", source: { id: "a" } },
    { title: "最新官方统计显示中国经济数据", source: { id: "b" } }
  ]);
  assert.equal(groups.length, 1);
});

test("does not group unrelated stories merely because both mention AI", () => {
  const groups = groupCandidates([
    { title: "印度首次报告测试AI模型侵入企业系统", source: { id: "a" } },
    { title: "中国科学家首次用中国大模型攻克世界级数学难题", source: { id: "b" } }
  ]);
  assert.equal(groups.length, 2);
});

test("rejects contradictory market-direction reports", () => {
  const groups = verifyGroups([
    [
      {
        title: "富时中国A50指数高开",
        excerpt: "上涨",
        canonicalUrl: "https://a.example/1",
        url: "https://a.example/1",
        source: { id: "yicai", name: "第一财经", sourceType: "trusted_media", trustLevel: 1 }
      },
      {
        title: "富时中国A50指数期货跌超2%",
        excerpt: "下跌",
        canonicalUrl: "https://b.example/2",
        url: "https://b.example/2",
        source: { id: "jiemian", name: "界面新闻", sourceType: "trusted_media", trustLevel: 2 }
      }
    ]
  ]);
  assert.equal(groups.length, 0);
});

test("cleans non-breaking spaces from summaries", () => {
  assert.equal(stripHtml("第一财经&nbsp;&nbsp;消息"), "第一财经 消息");
});

test("does not treat every gov.cn subdomain as the central government", () => {
  assert.equal(sourceForUrl("https://www.gov.cn/zhengce")?.id, "gov-cn");
  assert.equal(sourceForUrl("https://www.gdjb.gov.cn/notice"), null);
});

test("extracts a meaningful article description", async () => {
  const fetchImpl = async () =>
    new Response(
      '<html><head><meta name="description" content="商务部发布公告，就技术出口限制目录公开征求意见，并说明人工智能等技术的管理范围。"></head></html>'
    );
  const summary = await fetchArticleSummary("https://example.com/article", fetchImpl);
  assert.match(summary, /商务部发布公告/);
});

test("does not repeat the headline as the summary", () => {
  assert.equal(
    cleanSummary("中国稀土：预计前三季度净利润同比增长88.96%-140.99% 第一财经", "中国稀土：预计前三季度净利润同比增长88.96%-140.99%"),
    ""
  );
});
