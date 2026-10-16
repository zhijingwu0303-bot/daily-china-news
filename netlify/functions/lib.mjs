import { randomUUID } from "node:crypto";

export const SEARCH_QUERIES = [
  "中国 金融 财经",
  "中国 经济 统计局",
  "中国 企业 公告 并购",
  "中国 科技 芯片 人工智能",
  "中国 政策 监管",
  "香港 澳门 台湾 中国",
  "China economy technology policy"
];

export const DIRECT_FEEDS = [
  "https://www.chinanews.com.cn/rss/scroll-news.xml",
  "https://www.chinanews.com.cn/rss/finance.xml",
  "https://www.ithome.com/rss/",
  "https://www.people.com.cn/rss/finance.xml",
  "https://www.news.cn/fortune/news_fortune.xml"
];

export const SOURCES = [
  { id: "gov-cn", name: "中国政府网", domain: "gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "pbc", name: "中国人民银行", domain: "pbc.gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "stats-cn", name: "国家统计局", domain: "stats.gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "court-cn", name: "中国法院网", domain: "chinacourt.org", sourceType: "official", trustLevel: 1 },
  { id: "macao-gov", name: "澳门特别行政区政府", domain: "gov.mo", sourceType: "official", trustLevel: 1 },
  { id: "xinhua", name: "新华社", domain: "news.cn", sourceType: "trusted_media", trustLevel: 1 },
  { id: "people", name: "人民网", domain: "people.com.cn", sourceType: "trusted_media", trustLevel: 1 },
  { id: "chinanews", name: "中国新闻网", domain: "chinanews.com.cn", sourceType: "trusted_media", trustLevel: 1 },
  { id: "yicai", name: "第一财经", domain: "yicai.com", sourceType: "trusted_media", trustLevel: 1 },
  { id: "caixin", name: "财新网", domain: "caixin.com", sourceType: "trusted_media", trustLevel: 1 },
  { id: "thepaper", name: "澎湃新闻", domain: "thepaper.cn", sourceType: "trusted_media", trustLevel: 2 },
  { id: "jiemian", name: "界面新闻", domain: "jiemian.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "21jingji", name: "21世纪经济报道", domain: "21jingji.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "stcn", name: "证券时报", domain: "stcn.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "cnstock", name: "上海证券报", domain: "cnstock.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "cls", name: "财联社", domain: "cls.cn", sourceType: "trusted_media", trustLevel: 2 },
  { id: "wallstreetcn", name: "华尔街见闻", domain: "wallstreetcn.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "36kr", name: "36氪", domain: "36kr.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "ithome", name: "IT之家", domain: "ithome.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "scmp", name: "South China Morning Post", domain: "scmp.com", sourceType: "trusted_media", trustLevel: 1 },
  { id: "rthk", name: "香港电台", domain: "rthk.hk", sourceType: "trusted_media", trustLevel: 1 },
  { id: "cna-tw", name: "中央社", domain: "cna.com.tw", sourceType: "trusted_media", trustLevel: 1 },
  { id: "udn", name: "联合新闻网", domain: "udn.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "reuters", name: "Reuters", domain: "reuters.com", sourceType: "trusted_media", trustLevel: 1 },
  { id: "ap", name: "Associated Press", domain: "apnews.com", sourceType: "trusted_media", trustLevel: 1 }
];

function decodeEntities(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

export function stripHtml(value) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagValue(item, tag) {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripHtml(match[1]) : "";
}

function tagAttribute(item, tag, attribute) {
  const match = item.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?\\s${attribute}=["']([^"']+)["'][^>]*>`, "i")
  );
  return match ? decodeEntities(match[1]) : "";
}

export function parseFeed(xml) {
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const item = match[1];
      return {
        title: tagValue(item, "title"),
        url: tagValue(item, "link"),
        description: tagValue(item, "description"),
        pubDate: tagValue(item, "pubDate"),
        sourceName: tagValue(item, "source"),
        sourceUrl: tagAttribute(item, "source", "url")
      };
    })
    .filter((item) => item.title && item.url);
}

export const parseBingRss = parseFeed;

export function domainMatches(hostname, sourceDomain) {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  const domain = sourceDomain.toLowerCase().replace(/\.$/, "");
  return host === domain || host.endsWith(`.${domain}`);
}

export function sourceForUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return SOURCES.find((source) => domainMatches(hostname, source.domain)) ?? null;
  } catch {
    return null;
  }
}

export function normalizeTitle(title) {
  return title
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let indexA = 1; indexA <= a.length; indexA += 1) {
    let previous = row[0];
    row[0] = indexA;
    for (let indexB = 1; indexB <= b.length; indexB += 1) {
      const current = row[indexB];
      row[indexB] = Math.min(
        row[indexB] + 1,
        row[indexB - 1] + 1,
        previous + (a[indexA - 1] === b[indexB - 1] ? 0 : 1)
      );
      previous = current;
    }
  }
  return row[b.length];
}

export function similarity(a, b) {
  const left = normalizeTitle(a);
  const right = normalizeTitle(b);
  const longest = Math.max(left.length, right.length);
  return longest === 0 ? 1 : 1 - levenshteinDistance(left, right) / longest;
}

const titleStopWords = new Set([
  "中国",
  "最新",
  "官方",
  "表示",
  "发布",
  "公布",
  "显示",
  "今年",
  "今日",
  "昨天",
  "记者",
  "报道",
  "消息",
  "相关",
  "进行",
  "计划",
  "可能",
  "已经",
  "公司"
]);

const chineseSegmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

function titleTokens(title) {
  return new Set(
    [...chineseSegmenter.segment(title)]
      .filter((part) => part.isWordLike)
      .map((part) => part.segment.toLowerCase())
      .filter((token) => token.length >= 2 && !titleStopWords.has(token))
  );
}

function sameEvent(leftTitle, rightTitle) {
  if (similarity(leftTitle, rightTitle) >= 0.72) return true;

  const left = titleTokens(leftTitle);
  const right = titleTokens(rightTitle);
  const overlap = [...left].filter((token) => right.has(token));
  if (overlap.length >= 3) return true;
  if (overlap.some((token) => token.length >= 3 || /[a-z0-9]/i.test(token))) return true;
  return overlap.length >= 2 && similarity(leftTitle, rightTitle) >= 0.25;
}

export function groupCandidates(candidates) {
  const groups = [];
  for (const candidate of candidates) {
    const group = groups.find((items) =>
      items.some((item) => sameEvent(item.title, candidate.title))
    );
    if (group) group.push(candidate);
    else groups.push([candidate]);
  }
  return groups;
}

function contentClusters(group) {
  const clusters = [];
  for (const article of group) {
    const cluster = clusters.find((items) =>
      items.some(
        (item) =>
          item.canonicalUrl === article.canonicalUrl ||
          (similarity(item.title, article.title) >= 0.9 &&
            similarity(item.excerpt, article.excerpt) >= 0.9)
      )
    );
    if (cluster) cluster.push(article);
    else clusters.push([article]);
  }
  return clusters;
}

export function verifyGroups(groups) {
  const verified = [];

  for (const group of groups) {
    const representativeSources = representativeSourcesForGroup(group);

    const officials = representativeSources.filter((source) => source.sourceType === "official");
    const media = representativeSources.filter((source) => source.sourceType === "trusted_media");

    if (officials.length === 0 && media.length < 2) continue;
    verified.push({
      key: normalizeTitle(group[0].title),
      articles: group,
      sources: representativeSources
    });
  }

  return verified;
}

function representativeSourcesForGroup(group) {
  return [
    ...new Map(
      contentClusters(group)
        .map((cluster) => cluster[0])
        .filter(Boolean)
        .map((article) => article.source)
        .filter(Boolean)
        .map((source) => [source.id, source])
    ).values()
  ];
}

export function diagnoseGroups(groups) {
  let multiSource = 0;
  let official = 0;
  let confirmed = 0;

  for (const group of groups) {
    const sources = representativeSourcesForGroup(group);
    const media = sources.filter((source) => source.sourceType === "trusted_media");
    const hasOfficial = sources.some((source) => source.sourceType === "official");
    if (hasOfficial) official += 1;
    if (media.length >= 2) multiSource += 1;
    if (hasOfficial || media.length >= 2) confirmed += 1;
  }

  return { multiSource, official, confirmed };
}

export function classify(text) {
  const rules = [
    ["finance", /银行|证券|股票|债券|基金|保险|利率|汇率|金融|券商|投资/],
    ["economics", /经济|GDP|消费|通胀|就业|出口|进口|财政|统计局|增长|收入/],
    ["industries", /公司|企业|并购|财报|公告|汽车|能源|制造|房地产|产业|工厂/],
    ["tech", /科技|人工智能|AI|芯片|半导体|互联网|软件|机器人|手机|大数据|数据中心|数据要素|数据安全|数据库/],
    ["politics", /政策|政府|国务院|人大|政协|外交|法院|监管|党委|主席|部长/]
  ];
  const tags = rules.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag);
  return tags.length > 0 ? tags : ["industries"];
}

export function importance(group) {
  const sourceCount = group.sources.length;
  const bestTrust = Math.min(...group.sources.map((source) => source.trustLevel));
  const newest = Math.max(...group.articles.map((article) => article.publishedAt.getTime()));
  const ageHours = Math.max(0, (Date.now() - newest) / 3_600_000);
  return Math.max(
    1,
    Math.min(100, Math.round(80 + sourceCount * 8 - (bestTrust - 1) * 8 - Math.min(ageHours / 6, 12)))
  );
}

function canonicalizeUrl(value) {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith("utm_") || key === "from" || key === "source") {
      url.searchParams.delete(key);
    }
  }
  return url.toString();
}

export function buildDigest(hits, now = new Date()) {
  const cutoff = now.getTime() - 36 * 60 * 60 * 1000;
  const candidates = new Map();

  for (const hit of hits) {
    const source = sourceForUrl(hit.sourceUrl || hit.url);
    if (!source) continue;

    const publishedAt = hit.pubDate ? new Date(hit.pubDate) : now;
    if (Number.isNaN(publishedAt.getTime()) || publishedAt.getTime() < cutoff) continue;

    let canonicalUrl;
    try {
      canonicalUrl = canonicalizeUrl(hit.url);
    } catch {
      continue;
    }

    if (!candidates.has(canonicalUrl)) {
      candidates.set(canonicalUrl, {
        id: randomUUID(),
        source,
        url: hit.url,
        canonicalUrl,
        title: hit.sourceName && hit.title.endsWith(` - ${hit.sourceName}`)
          ? hit.title.slice(0, -(` - ${hit.sourceName}`).length)
          : hit.title,
        excerpt: hit.description,
        publishedAt
      });
    }
  }

  const groups = groupCandidates([...candidates.values()]);
  const candidateSamples = [...candidates.values()]
    .slice(0, 60)
    .map((candidate) => ({
      title: candidate.title,
      source: candidate.source.id,
      publishedAt: candidate.publishedAt.toISOString()
    }));
  const verifiedGroups = verifyGroups(groups);
  const verifiedSamples = verifiedGroups.slice(0, 12).map((group) => ({
    lead: group.articles[0].title,
    members: group.articles.map((article) => ({
      title: article.title,
      source: article.source.id
    }))
  }));
  const verified = verifiedGroups
    .map((group) => {
      const text = `${group.articles[0].title} ${group.articles[0].excerpt}`;
      const summary =
        group.articles[0].excerpt.length > 260
          ? `${group.articles[0].excerpt.slice(0, 260)}…`
          : group.articles[0].excerpt;
      return {
        id: group.key,
        title: group.articles[0].title,
        summary,
        tags: classify(text),
        importance: importance(group),
        publishedAt: new Date(
          Math.max(...group.articles.map((article) => article.publishedAt.getTime()))
        ).toISOString(),
        sources: [...new Map(group.articles.map((article) => [article.source.id, article])).values()].map(
          (article) => ({
            name: article.source.name,
            url: article.url
          })
        )
      };
    })
    .sort((left, right) => right.importance - left.importance);

  return {
    updatedAt: now.toISOString(),
    count: verified.length,
    underfilled: verified.length < 5,
    items: verified,
    diagnostics: {
      rawHits: hits.length,
      candidates: candidates.size,
      candidateSamples,
      groups: groups.length,
      verified: verified.length,
      ...diagnoseGroups(groups),
      verifiedSamples
    }
  };
}

export async function fetchBingNewsRss(query, fetchImpl = fetch) {
  const url = new URL("https://www.bing.com/news/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "rss");

  const response = await fetchImpl(url, {
    headers: {
      "User-Agent": "DailyChinaNews/1.0 (+personal news reader)"
    }
  });
  if (!response.ok) throw new Error(`Bing News RSS failed: ${response.status}`);
  return parseFeed(await response.text());
}

export async function fetchGoogleNewsRss(query, fetchImpl = fetch) {
  const url = new URL("https://news.google.com/rss/search");
  url.searchParams.set("q", query);
  url.searchParams.set("hl", "zh-CN");
  url.searchParams.set("gl", "CN");
  url.searchParams.set("ceid", "CN:zh-Hans");

  const response = await fetchImpl(url, {
    headers: {
      "User-Agent": "DailyChinaNews/1.0 (+personal news reader)"
    }
  });
  if (!response.ok) throw new Error(`Google News RSS failed: ${response.status}`);
  return parseFeed(await response.text());
}

export async function fetchDirectFeed(url, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    headers: {
      "User-Agent": "DailyChinaNews/1.0 (+personal news reader)"
    }
  });
  if (!response.ok) throw new Error(`Direct feed failed: ${response.status}`);
  return parseFeed(await response.text());
}

export async function fetchLatestDigest(fetchImpl = fetch) {
  const results = await Promise.allSettled([
    ...SEARCH_QUERIES.map((query) => fetchGoogleNewsRss(query, fetchImpl)),
    ...DIRECT_FEEDS.map((url) => fetchDirectFeed(url, fetchImpl))
  ]);
  const hits = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const digest = buildDigest(hits);
  digest.diagnostics.sourcesSucceeded = results.filter((result) => result.status === "fulfilled").length;
  digest.diagnostics.sourcesFailed = results.filter((result) => result.status === "rejected").length;
  return digest;
}
