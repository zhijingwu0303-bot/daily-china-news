import { randomUUID } from "node:crypto";
import { GoogleDecoder } from "google-news-url-decoder";

export const SEARCH_QUERIES = [
  "中国 金融 财经",
  "中国 经济 统计局",
  "中国 企业 公告 并购",
  "中国 科技 芯片 人工智能",
  "中国 政策 监管",
  "中国 医药 医疗 创新药 医保",
  "香港 澳门 台湾 中国",
  "(site:yicai.com OR site:cls.cn OR site:21jingji.com OR site:stcn.com OR site:cnstock.com) 中国",
  "(site:cs.com.cn OR site:cnstock.com OR site:stcn.com) 中国 公司 公告",
  "(site:thepaper.cn OR site:jiemian.com OR site:caixin.com) 中国",
  "(site:yicai.com OR site:jiemian.com OR site:thepaper.cn OR site:caixin.com OR site:21jingji.com) 医药 医疗 药品",
  "(国务院 OR 国家发展改革委 OR 商务部 OR 中国人民银行 OR 证监会 OR 统计局) 中国 政策 数据",
  "(site:csrc.gov.cn OR site:pbc.gov.cn OR site:stats.gov.cn) 公告 数据",
  "(site:nmpa.gov.cn OR site:nhc.gov.cn) 医药 医疗 药品",
  "(site:wallstreetcn.com OR site:36kr.com OR site:ithome.com OR site:cls.cn) 中国 公司",
  "(site:yicai.com OR site:cctv.com OR site:news.cn) 中国 视频 报道",
  "(site:thepaper.cn OR site:jiemian.com OR site:cls.cn) 中国 视频"
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
  { id: "nhc", name: "国家卫生健康委员会", domain: "nhc.gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "nmpa", name: "国家药品监督管理局", domain: "nmpa.gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "court-cn", name: "中国法院网", domain: "chinacourt.org", sourceType: "official", trustLevel: 1 },
  { id: "macao-gov", name: "澳门特别行政区政府", domain: "gov.mo", sourceType: "official", trustLevel: 1 },
  { id: "csrc", name: "中国证监会", domain: "csrc.gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "miit", name: "工业和信息化部", domain: "miit.gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "mofcom", name: "商务部", domain: "mofcom.gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "ndrc", name: "国家发展改革委", domain: "ndrc.gov.cn", sourceType: "official", trustLevel: 1 },
  { id: "samr", name: "市场监管总局", domain: "samr.gov.cn", sourceType: "official", trustLevel: 1 },
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
  { id: "cs", name: "中国证券报", domain: "cs.com.cn", sourceType: "trusted_media", trustLevel: 1 },
  { id: "cls", name: "财联社", domain: "cls.cn", sourceType: "trusted_media", trustLevel: 2 },
  { id: "wallstreetcn", name: "华尔街见闻", domain: "wallstreetcn.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "36kr", name: "36氪", domain: "36kr.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "ithome", name: "IT之家", domain: "ithome.com", sourceType: "trusted_media", trustLevel: 2 },
  { id: "scmp", name: "South China Morning Post", domain: "scmp.com", sourceType: "trusted_media", trustLevel: 1 },
  { id: "rthk", name: "香港电台", domain: "rthk.hk", sourceType: "trusted_media", trustLevel: 1 },
  { id: "cctv", name: "央视网", domain: "cctv.com", sourceType: "trusted_media", trustLevel: 1 },
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
    .replace(/&nbsp;/gi, " ")
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
  if (domain === "gov.cn") return host === "gov.cn" || host === "www.gov.cn";
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
  "公司",
  "发展",
  "经济",
  "国家",
  "全国",
  "全球",
  "世界",
  "同比",
  "增长",
  "加快",
  "推进",
  "建设",
  "上半年",
  "前三季度"
]);

const specificShortTokens = new Set([
  "数据",
  "通胀",
  "就业",
  "消费",
  "出口",
  "进口",
  "并购",
  "芯片",
  "利率",
  "汇率",
  "关税",
  "房价",
  "机器人"
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

function distinctiveToken(token) {
  if (/^\d+$/.test(token)) return false;
  if (/^\d{4}(?:年|届|款|赛季)?$/u.test(token)) return false;
  if (/[a-z]/i.test(token) && !/^\d/.test(token)) return true;
  return (token.length >= 3 && !titleStopWords.has(token)) || specificShortTokens.has(token);
}

function sameEvent(leftTitle, rightTitle) {
  if (similarity(leftTitle, rightTitle) >= 0.72) return true;

  const left = titleTokens(leftTitle);
  const right = titleTokens(rightTitle);
  const overlap = [...left].filter((token) => right.has(token));
  const distinctive = overlap.filter(distinctiveToken);
  if (distinctive.length === 0) return false;
  if (distinctive.length >= 2) return true;
  if (overlap.length >= 3 && similarity(leftTitle, rightTitle) >= 0.45) return true;
  if (overlap.includes("数据") && similarity(leftTitle, rightTitle) >= 0.25) return true;
  return similarity(leftTitle, rightTitle) >= 0.6;
}

function dateFromUrl(value) {
  try {
    const pathname = new URL(value).pathname;
    const full = pathname.match(/(20\d{2})[-/](\d{2})[-/](\d{2})/);
    if (full) return new Date(`${full[1]}-${full[2]}-${full[3]}T12:00:00Z`);
    const month = pathname.match(/(20\d{2})[-/](\d{2})(?:[-/]|$)/);
    if (month) return new Date(`${month[1]}-${month[2]}-01T12:00:00Z`);
  } catch {}
  return null;
}

function isDigestTitle(title) {
  return /IT早报|新闻早报|早报速览|午报|晚报速览|今日要闻|一周要闻|周末要闻|收盘日报|早间新闻/.test(
    title
  );
}

function isUnconfirmedRumor(title) {
  return /消息称|传闻|网传|爆料|疑似|曝光|渲染图|谍照|预热|开箱|上手|评测/.test(title);
}

function isLowSignalTitle(title) {
  return /公开赛|拉力赛|马拉松|比赛|赛事|冠军|夺冠|预约申购|开抢|开售|优惠|促销|抽奖|明星代言|院士专家齐聚|共探.*新赛道|网友|刷入|模拟器|破解|教程/.test(
    title
  );
}

function isChinaRelated(title) {
  return /中国|中方|国内|国产|全国|人民币|央行|A股|港股|沪深|上证|深证|创业板|科创板|北交所|国务院|国家|中央|商务部|财政部|工信部|统计局|证监会|北京|上海|天津|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|四川|贵州|云南|西藏|陕西|甘肃|青海|宁夏|新疆|内蒙古|香港|澳门|台湾|腾讯|阿里|字节|华为|小米|比亚迪|宁德时代|理想|蔚来|小鹏|宇树|京东|拼多多|百度|美团|滴滴|中国移动|中国电信|中国联通/.test(
    title
  );
}

export function groupCandidates(candidates) {
  const groups = [];
  for (const candidate of candidates) {
    const group = groups.find((items) => sameEvent(items[0].title, candidate.title));
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
    if (hasCoreConflict(group)) continue;
    const representativeSources = representativeSourcesForGroup(group);
    if (representativeSources.length === 0) continue;

    const officials = representativeSources.filter((source) => source.sourceType === "official");
    const media = representativeSources.filter((source) => source.sourceType === "trusted_media");

    if (officials.length === 0 && media.length === 0) continue;
    if (officials.length > 0 && media.length === 0 && !isHighImpactOfficial(group[0].title)) continue;
    verified.push({
      key: normalizeTitle(group[0].title),
      articles: group,
      sources: representativeSources
    });
  }

  return verified;
}

function isHighImpactOfficial(title) {
  const noise = /比选|采购|招标|中标|公示|申报|遴选|接访|拍卖|体检|租赁|自行采购|结果公告|开标公告/.test(title);
  if (noise) return false;
  return /国务院|国家发展改革委|发改委|商务部|财政部|中国人民银行|央行|证监会|统计局|工业和信息化部|工信部|市场监管总局|国家卫生健康委|国家药监局|习近平|李强|政策|意见|条例|数据|经济|金融|贸易|出口|进口|关税|人工智能|芯片|房地产|就业|消费|利率|人民币|医药|医疗|药品|医保|创新药|医疗器械|疫苗|公共卫生/.test(
    title
  );
}

function hasCoreConflict(group) {
  const titles = group.map((article) => article.title).join(" ");
  const positive = /上涨|高开|涨超|增长|升至|增加|盈利/.test(titles);
  const negative = /下跌|低开|跌超|下降|减少|亏损/.test(titles);
  return positive && negative;
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

function sourceLinksForArticles(articles) {
  const links = new Map();
  for (const article of articles) {
    const isVideo = article.isVideo || isVideoUrl(article.url, article.title);
    const key = `${article.source.id}:${isVideo ? "video" : "article"}`;
    if (links.has(key)) continue;
    links.set(key, {
      name: article.source.name,
      url: article.url,
      isVideo
    });
  }
  return [...links.values()];
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
    if (hasOfficial || media.length >= 1) confirmed += 1;
  }

  return { multiSource, official, confirmed };
}

export function classify(text) {
  const rules = [
    ["finance", /银行|证券|股票|债券|基金|保险|利率|汇率|金融|券商|投资|A股|沪指|深指|创业板|港股|美股|个股|涨停|跌停|成交额|收评|收盘|开盘/],
    ["economics", /经济|GDP|消费|通胀|就业|出口|进口|财政|统计局|增长|收入/],
    ["industries", /公司|企业|并购|财报|公告|重组|整合|IPO|首次公开发行|回购|分红|汽车|能源|制造|房地产|地产|产业|工厂|信托|医药|物流|食品|农业|通信|材料|饮料|航空|航运|港口|机场|零售|电商|家电|钢铁|煤炭|石油|化工|电力|机械/],
    ["tech", /科技|人工智能|AI|芯片|半导体|互联网|软件|机器人|手机|大数据|数据中心|数据要素|数据安全|数据库/],
    ["politics", /政策|政府|国务院|人大|政协|外交|法院|监管|党委|主席|部长/],
    ["healthcare", /医药|医疗|药品|药企|创新药|医疗器械|疫苗|医保|医院|临床|药监|疾控|公共卫生|生物医药/]
  ];
  const tags = rules.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag);
  return tags;
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

export function selectDiverseItems(items, maxItems = 20) {
  const buckets = new Map();
  for (const item of items) {
    const bucket = buckets.get(item.sourceKey) ?? [];
    bucket.push(item);
    buckets.set(item.sourceKey, bucket);
  }

  const queues = [...buckets.values()];
  const selected = [];
  while (selected.length < maxItems) {
    let progressed = false;
    for (const queue of queues) {
      if (queue.length === 0) continue;
      selected.push(queue.shift());
      progressed = true;
      if (selected.length === maxItems) break;
    }
    if (!progressed) break;
  }
  return selected;
}

export function isVideoUrl(value, title = "") {
  if (/视频|直播|实录|发布会回放|记者探访/.test(title)) return true;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const pathname = url.pathname;
    if (
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtu.be" ||
      host.endsWith(".bilibili.com") ||
      host === "b23.tv" ||
      host.endsWith(".v.qq.com") ||
      host.startsWith("video.") ||
      host.startsWith("tv.")
    ) {
      return true;
    }
    return /\/(?:video|videos|vod|watch|live)(?:\/|$)/i.test(pathname) || /\/VIDE[0-9A-Z]/i.test(pathname);
  } catch {
    return false;
  }
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
  const cutoff = now.getTime() - 24 * 60 * 60 * 1000;
  const candidates = new Map();
  const rawHostCounts = {};

  for (const hit of hits) {
    try {
      const host = new URL(hit.sourceUrl || hit.url).hostname;
      rawHostCounts[host] = (rawHostCounts[host] ?? 0) + 1;
    } catch {}
    const source = sourceForUrl(hit.sourceUrl || hit.url);
    if (!source) continue;
    if (isDigestTitle(hit.title)) continue;
    if (isUnconfirmedRumor(hit.title)) continue;
    if (isLowSignalTitle(hit.title)) continue;
    if (!isChinaRelated(hit.title)) continue;

    const publishedAt = hit.pubDate ? new Date(hit.pubDate) : dateFromUrl(hit.url);
    if (!publishedAt) continue;
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
        isVideo: Boolean(hit.isVideo),
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
  const candidateSourceCounts = [...candidates.values()].reduce((counts, candidate) => {
    counts[candidate.source.id] = (counts[candidate.source.id] ?? 0) + 1;
    return counts;
  }, {});
  const verifiedGroups = verifyGroups(groups);
  const verifiedSamples = verifiedGroups.slice(0, 12).map((group) => ({
    lead: group.articles[0].title,
    members: group.articles.map((article) => ({
      title: article.title,
      source: article.source.id
    }))
  }));
  const rankedVerifiedGroups = verifiedGroups
    .map((group) => {
      const tags = classify(group.articles[0].title);
      if (tags.length === 0) return null;
      return {
        id: group.key,
        sourceKey: group.sources[0].id,
        title: group.articles[0].title,
        tags,
        importance: importance(group),
        publishedAt: new Date(
          Math.min(...group.articles.map((article) => article.publishedAt.getTime()))
        ).toISOString(),
        sources: sourceLinksForArticles(group.articles)
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.importance - left.importance);
  const verified = selectDiverseItems(rankedVerifiedGroups).map(
    ({ importance, sourceKey, ...item }) => item
  );

  return {
    updatedAt: now.toISOString(),
    count: verified.length,
    underfilled: verified.length < 5,
    items: verified,
    diagnostics: {
      rawHits: hits.length,
      rawHostCounts,
      candidates: candidates.size,
      candidateSamples,
      candidateSourceCounts,
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
    signal: AbortSignal.timeout(4_500),
    headers: {
      "User-Agent": "DailyChinaNews/1.0 (+personal news reader)"
    }
  });
  if (!response.ok) throw new Error(`Bing News RSS failed: ${response.status}`);
  return parseFeed(await response.text());
}

export async function fetchGoogleNewsRss(query, fetchImpl = fetch) {
  const url = new URL("https://news.google.com/rss/search");
  url.searchParams.set("q", `${query} when:2d`);
  url.searchParams.set("hl", "zh-CN");
  url.searchParams.set("gl", "CN");
  url.searchParams.set("ceid", "CN:zh-Hans");

  const response = await fetchImpl(url, {
    signal: AbortSignal.timeout(4_500),
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

export function parseYicaiList(html) {
  const match = html.match(/\bvar firstlist = (\[[\s\S]*?\]);\s*<\/script>/);
  if (!match) return [];

  try {
    return JSON.parse(match[1])
      .map((item) => {
        const createDate = String(item.CreateDate ?? "");
        const normalized = /(?:Z|[+-]\d{2}:\d{2})$/.test(createDate)
          ? createDate
          : `${createDate}+08:00`;
        const publishedAt = new Date(normalized);
        if (!item.NewsTitle || !item.url || Number.isNaN(publishedAt.getTime())) return null;
        return {
          title: item.NewsTitle,
          url: new URL(item.url, "https://www.yicai.com").toString(),
          description: item.NewsNotes ?? "",
          pubDate: publishedAt.toISOString(),
          sourceUrl: "https://www.yicai.com/",
          isVideo: Boolean(item.VideoUrl)
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function fetchYicaiList(fetchImpl = fetch, pageUrl = "https://www.yicai.com/news/") {
  const response = await fetchImpl(pageUrl, {
    signal: AbortSignal.timeout(8_000),
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      "Accept-Language": "zh-CN,zh;q=0.9"
    }
  });
  if (!response.ok) throw new Error(`Yicai list failed: ${response.status}`);
  return parseYicaiList(await response.text());
}

function isGoogleNewsUrl(value) {
  return value.startsWith("https://news.google.com/rss/articles/");
}

async function enrichDigest(digest) {
  const decoder = new GoogleDecoder();
  const googleUrls = [
    ...new Set(
      digest.items.flatMap((item) => item.sources.map((source) => source.url)).filter(isGoogleNewsUrl)
    )
  ];

  const decoded = new Map();
  for (const sourceUrl of googleUrls) {
    try {
      const result = await decoder.decode(sourceUrl);
      if (result?.status && result.decoded_url) {
        decoded.set(sourceUrl, result.decoded_url);
      }
    } catch {}
  }

  const enrichedItems = [];
  for (const item of digest.items) {
    const sources = [
      ...new Map(
        item.sources
          .map((source) => {
            const url = isGoogleNewsUrl(source.url) ? decoded.get(source.url) : source.url;
            return url
              ? {
                  ...source,
                  url,
                  isVideo: source.isVideo || isVideoUrl(url, item.title)
                }
              : null;
          })
          .filter(Boolean)
          .map((source) => [source.url, source])
      ).values()
    ].sort((left, right) => Number(right.isVideo) - Number(left.isVideo));

    if (sources.length === 0) continue;

    enrichedItems.push({
      ...item,
      sources
    });
  }

  return {
    ...digest,
    count: enrichedItems.length,
    underfilled: enrichedItems.length < 5,
    items: enrichedItems,
    diagnostics: {
      ...digest.diagnostics,
      resolvedGoogleUrls: decoded.size,
      unresolvedGoogleUrls: googleUrls.length - decoded.size
    }
  };
}

export async function fetchLatestDigest(fetchImpl = fetch) {
  const results = await Promise.allSettled([
    ...SEARCH_QUERIES.map((query) => fetchGoogleNewsRss(query, fetchImpl)),
    ...DIRECT_FEEDS.map((url) => fetchDirectFeed(url, fetchImpl)),
    fetchYicaiList(fetchImpl),
    fetchYicaiList(fetchImpl, "https://www.yicai.com/video/")
  ]);
  const hits = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const digest = await enrichDigest(buildDigest(hits));
  digest.diagnostics.sourcesSucceeded = results.filter((result) => result.status === "fulfilled").length;
  digest.diagnostics.sourcesFailed = results.filter((result) => result.status === "rejected").length;
  return digest;
}
