import { getStore } from "@netlify/blobs";
import { fetchLatestDigest } from "./lib.mjs";

export const config = {
  schedule: "0 13 * * *"
};

export default async function refreshNews() {
  const digest = await fetchLatestDigest();
  const { diagnostics, ...publicDigest } = digest;
  await getStore("daily-news").setJSON("latest", publicDigest);

  return new Response(
    JSON.stringify({
      ok: true,
      count: publicDigest.count,
      updatedAt: publicDigest.updatedAt
    }),
    {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" }
    }
  );
}
