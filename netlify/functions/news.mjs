import { fetchLatestDigest } from "./lib.mjs";

export async function handler() {
  try {
    const digest = await fetchLatestDigest();
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=300, s-maxage=1800"
      },
      body: JSON.stringify(digest)
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
