import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  SEARCH_QUERIES,
  buildDigest,
  classify,
  fetchYicaiList,
  groupCandidates,
  parseBingRss,
  parseYicaiList,
  selectDiverseItems,
  sourceForUrl,
  stripHtml,
  verifyGroups
} from "../scripts/news-lib.mjs";

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

test("parses the first-party Yicai news list", () => {
  const html = `<script>
    var firstlist = [{"NewsTitle":"中国经济三季报发布","NewsNotes":"统计局介绍主要数据。","CreateDate":"2026-10-19T09:30:00","url":"/news/103398866.html","VideoUrl":""}];
  </script>`;
  const items = parseYicaiList(html);

  assert.equal(items.length, 1);
  assert.equal(items[0].title, "中国经济三季报发布");
  assert.equal(items[0].url, "https://www.yicai.com/news/103398866.html");
  assert.equal(items[0].pubDate, "2026-10-19T01:30:00.000Z");
});

test("can load the dedicated Yicai video list", async () => {
  let requestedUrl = "";
  const fetchImpl = async (url) => {
    requestedUrl = String(url);
    return new Response(
      `<script>var firstlist = [{"NewsTitle":"视频报道","NewsNotes":"","CreateDate":"2026-10-19T09:30:00","url":"/video/103398924.html","VideoUrl":"https://video.example/file.mp4"}];</script>`
    );
  };
  const items = await fetchYicaiList(fetchImpl, "https://www.yicai.com/video/");

  assert.equal(requestedUrl, "https://www.yicai.com/video/");
  assert.equal(items[0].isVideo, true);
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

test("accepts one curated media source when other outlets do not cover the story", () => {
  const groups = verifyGroups([
    [
      {
        title: "同一通稿",
        excerpt: "完全相同的内容",
        canonicalUrl: "https://reuters.com/a",
        url: "https://reuters.com/a",
        publishedAt: new Date(),
        source: { id: "reuters", name: "Reuters", sourceType: "trusted_media", trustLevel: 1 }
      }
    ]
  ]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].sources.length, 1);
});

test("builds a latest-only digest", () => {
  const digest = buildDigest(parseBingRss(rss), new Date("2026-10-16T13:00:00Z"));
  assert.equal(digest.count, 1);
  assert.equal(digest.items[0].title, "中国公布最新经济数据");
});

test("classifies business and economic news", () => {
  assert.deepEqual(classify("国家统计局公布消费和GDP数据"), ["economics"]);
  assert.deepEqual(classify("某上市公司发布并购公告"), ["industries"]);
  assert.ok(classify("A股收评：沪指收涨，创业板指收跌").includes("finance"));
});

test("classifies healthcare news and adds it alongside related categories", () => {
  assert.deepEqual(classify("国家药监局批准创新药上市"), ["healthcare"]);
  assert.ok(classify("某医药公司发布创新药临床进展").includes("healthcare"));
  assert.ok(classify("某医药公司发布创新药临床进展").includes("industries"));
  assert.ok(SEARCH_QUERIES.some((query) => /医药|医疗/.test(query)));
});

test("does not classify sports, culture, or human-interest stories as industries", () => {
  assert.deepEqual(classify("第十五届环云竹湖自行车公开赛开赛"), []);
  assert.deepEqual(classify("顾彬：跟李白坐在一起喝酒"), []);
  assert.deepEqual(classify("强冷空气来袭多地降温 黑龙江部分区域达到暴雪量级"), []);
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

test("cleans non-breaking spaces from HTML text", () => {
  assert.equal(stripHtml("第一财经&nbsp;&nbsp;消息"), "第一财经 消息");
});

test("does not treat every gov.cn subdomain as the central government", () => {
  assert.equal(sourceForUrl("https://www.gov.cn/zhengce")?.id, "gov-cn");
  assert.equal(sourceForUrl("https://www.gdjb.gov.cn/notice"), null);
});

test("marks video reports and keeps their links", () => {
  const digest = buildDigest(
    [
      {
        title: "第一财经视频报道中国制造业新进展",
        url: "https://www.yicai.com/video/123456.html",
        description: "视频报道",
        pubDate: new Date().toUTCString(),
        sourceUrl: "https://www.yicai.com/"
      }
    ],
    new Date()
  );
  assert.equal(digest.count, 1);
  assert.equal(digest.items[0].sources[0].isVideo, true);
  assert.match(digest.items[0].sources[0].url, /yicai\.com\/video\//);
});

test("public digest items contain headlines but no summaries", () => {
  const now = new Date();
  const digest = buildDigest(
    [
      {
        title: "国家统计局发布最新经济数据",
        url: "https://www.stats.gov.cn/sj/zxfb/202610/t20261019.html",
        description: "这是一段不应出现在公开新闻数据里的摘要。",
        pubDate: now.toUTCString(),
        sourceUrl: "https://www.stats.gov.cn/"
      }
    ],
    now
  );
  assert.equal(digest.count, 1);
  assert.equal("summary" in digest.items[0], false);
  assert.equal(digest.items[0].title, "国家统计局发布最新经济数据");
});

test("shows one link per outlet and media type", () => {
  const now = new Date();
  const digest = buildDigest(
    [
      {
        title: "中国A股收盘涨跌互现",
        url: "https://www.chinanews.com.cn/cj/2026/10-19/1.shtml",
        description: "",
        pubDate: now.toUTCString(),
        sourceUrl: "https://www.chinanews.com.cn/"
      },
      {
        title: "中国A股收盘涨跌互现",
        url: "https://www.chinanews.com.cn/cj/2026/10-19/2.shtml",
        description: "",
        pubDate: now.toUTCString(),
        sourceUrl: "https://www.chinanews.com.cn/"
      }
    ],
    now
  );
  assert.equal(digest.count, 1);
  assert.equal(digest.items[0].sources.length, 1);
});

test("limits the digest to 20 events", () => {
  const now = new Date();
  const titles = [
    "星河银行获批筹建上海分行",
    "海岳证券完成对岭南期货收购",
    "北辰汽车发布三季度财报",
    "云峰芯片扩大武汉工厂产能",
    "青禾基金下调科技ETF管理费率",
    "远山保险推出新能源车险产品",
    "金桥信托增资至一百亿元",
    "东浦证券获批基金投顾资格",
    "南湾银行发行五十亿元绿色债券",
    "北岭汽车召回部分纯电车型",
    "天工机器人发布人形机械臂产品",
    "灵犀软件推出工业操作系统",
    "深蓝芯片启动先进封装产线",
    "华岳能源建设海上风电项目",
    "中河制造完成智能工厂改造",
    "明州医药发布创新药临床进展",
    "海晨物流开通东南亚货运航线",
    "星州食品公布年度业绩预告",
    "云鼎地产完成保障房项目交付",
    "长江航运公司订造新型集装箱船",
    "金穗农业发布种业研发成果",
    "光谷通信中标运营商集采项目",
    "远东材料建设碳纤维生产基地",
    "山泉饮料启用华南智能仓",
    "银河航空增开国际客运航线"
  ];
  const hits = titles.map((title, index) => ({
    title: `中国${title}`,
    url: `https://www.yicai.com/news/202610/${index + 1}.html`,
    pubDate: now.toUTCString(),
    sourceUrl: "https://www.yicai.com/"
  }));

  const digest = buildDigest(hits, now);
  assert.equal(digest.count, 20);
  assert.equal(digest.items.length, 20);
});

test("balances the digest across media sources before filling the remainder", () => {
  const chinanews = Array.from({ length: 12 }, (_, index) => ({
    id: `c${index}`,
    sourceKey: "chinanews"
  }));
  const ithome = Array.from({ length: 8 }, (_, index) => ({
    id: `i${index}`,
    sourceKey: "ithome"
  }));
  const selected = selectDiverseItems([...chinanews, ...ithome], 20);

  assert.equal(selected.length, 20);
  assert.equal(selected[0].sourceKey, "chinanews");
  assert.equal(selected[1].sourceKey, "ithome");
  assert.equal(selected.filter((item) => item.sourceKey === "ithome").length, 8);
});

test("runs the scheduled update before 09:00 China time", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/deploy.yml", import.meta.url),
    "utf8"
  );
  assert.match(workflow, /cron:\s*"45 0 \* \* \*"/);
});

test("renders source names with only a small video badge", async () => {
  const app = await readFile(new URL("../site/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(app, />原文|<` \+ "原文|原文 ·|视频 · /);
  assert.match(app, /class="video-badge">视频<\/span>/);
});

test("versions frontend assets so browsers skip stale scripts", async () => {
  const html = await readFile(new URL("../site/index.html", import.meta.url), "utf8");
  assert.match(html, /href="\.\/styles\.css\?v=[^"]+"/);
  assert.match(html, /src="\.\/app\.js\?v=[^"]+"/);
});

test("rejects roundup articles as event sources", () => {
  const digest = buildDigest([
    {
      title: "IT早报：特斯拉 Roadster 中国官网开放预订",
      url: "https://www.ithome.com/1/014/199.htm",
      description: "今日科技资讯汇总",
      pubDate: new Date().toUTCString()
    }
  ]);
  assert.equal(digest.count, 0);
});

test("ignores topic words that appear only in the article description", () => {
  const digest = buildDigest([
    {
      title: "某地举办春季群众文化活动",
      url: "https://www.chinanews.com.cn/cj/2026/10-19/123456.shtml",
      description: "活动由某公司赞助，并讨论了经济政策和科技产业。",
      pubDate: new Date().toUTCString(),
      sourceUrl: "https://www.chinanews.com.cn/"
    }
  ]);
  assert.equal(digest.count, 0);
});

test("rejects unconfirmed product rumors", () => {
  const digest = buildDigest([
    {
      title: "消息称某厂明年推出新款AI芯片手机",
      url: "https://www.ithome.com/0/123/456.htm",
      description: "新品尚未发布。",
      pubDate: new Date().toUTCString(),
      sourceUrl: "https://www.ithome.com/"
    }
  ]);
  assert.equal(digest.count, 0);
});

test("rejects international stories without a close China connection", () => {
  const digest = buildDigest([
    {
      title: "前美联储副主席谈美国劳动力市场",
      url: "https://www.yicai.com/news/103398907.html",
      pubDate: new Date().toUTCString(),
      sourceUrl: "https://www.yicai.com/"
    }
  ]);
  assert.equal(digest.count, 0);
});

test("rejects low-signal competitions and product reservation notices", () => {
  const now = new Date();
  const digest = buildDigest(
    [
      {
        title: "中国沿黄公路新能源汽车拉力赛闭幕",
        url: "https://www.chinanews.com.cn/ty/2026/10-19/1.shtml",
        pubDate: now.toUTCString(),
        sourceUrl: "https://www.chinanews.com.cn/"
      },
      {
        title: "中国华为新手机开启预约申购",
        url: "https://www.ithome.com/0/123/457.htm",
        pubDate: now.toUTCString(),
        sourceUrl: "https://www.ithome.com/"
      },
      {
        title: "中国网友让小米手机刷入模拟器系统",
        url: "https://www.ithome.com/0/123/458.htm",
        pubDate: now.toUTCString(),
        sourceUrl: "https://www.ithome.com/"
      }
    ],
    now
  );
  assert.equal(digest.count, 0);
});

test("uses the earliest publication time for an event", () => {
  const now = new Date("2026-10-17T13:00:00Z");
  const base = {
    title: "商务部发布重要公告",
    description: "商务部发布公告并介绍政策安排。",
    sourceUrl: "https://www.gov.cn/",
    url: "https://www.gov.cn/a"
  };
  const digest = buildDigest(
    [
      { ...base, pubDate: "Fri, 16 Oct 2026 14:00:00 GMT" },
      { ...base, pubDate: "Fri, 16 Oct 2026 13:00:00 GMT", url: "https://www.gov.cn/b" }
    ],
    now
  );
  assert.equal(digest.items[0].publishedAt, "2026-10-16T13:00:00.000Z");
});
