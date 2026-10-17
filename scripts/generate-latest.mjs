import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { fetchLatestDigest } from "./news-lib.mjs";

const digest = await fetchLatestDigest();
const { diagnostics, ...publicDigest } = digest;
const output = new URL("../site/latest.json", import.meta.url);

await writeFile(output, `${JSON.stringify(publicDigest, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify({
    output: fileURLToPath(output),
    count: publicDigest.count,
    underfilled: publicDigest.underfilled,
    sourcesSucceeded: diagnostics.sourcesSucceeded,
    sourcesFailed: diagnostics.sourcesFailed,
    resolvedGoogleUrls: diagnostics.resolvedGoogleUrls,
    unresolvedGoogleUrls: diagnostics.unresolvedGoogleUrls
  })
);
