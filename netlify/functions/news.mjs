import { fetchLatestDigest } from "./lib.mjs";
import { getStore } from "@netlify/blobs";

export async function handler(event) {
  try {
    const store = getStore("daily-news");
    const forceRefresh = event?.queryStringParameters?.refresh === "1";
    let publicDigest = forceRefresh ? null : await store.get("latest", { type: "json" });

    if (!publicDigest) {
      const digest = await fetchLatestDigest();
      const { diagnostics, ...freshDigest } = digest;
      publicDigest = freshDigest;
      await store.setJSON("latest", freshDigest);
    }

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": forceRefresh ? "no-store" : "public, max-age=300, s-maxage=1800"
      },
      body: JSON.stringify(
        event?.queryStringParameters?.debug === "1"
          ? { ...publicDigest, diagnostics: { cacheHit: !forceRefresh } }
          : publicDigest
      )
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      },
      body: JSON.stringify({
        error: "新闻获取失败，请稍后刷新。",
        detail: error instanceof Error ? error.message : String(error)
      })
    };
  }
}
