const newsElement = document.querySelector("#news");
const metaElement = document.querySelector("#meta");
const tagsElement = document.querySelector("#tags");
const refreshButton = document.querySelector("#refresh");

let allItems = [];
let activeTag = "";

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(new Date(value));
}

function renderItems() {
  const items = activeTag
    ? allItems.filter((item) => item.tags.includes(activeTag))
    : allItems;

  if (items.length === 0) {
    newsElement.innerHTML = '<div class="empty">暂时没有通过验证的新闻。</div>';
    return;
  }

  newsElement.innerHTML = items
    .map(
      (item) => `
        <article class="item">
          <div>
            <h2>${escapeHtml(item.title)}</h2>
            <p class="summary">${escapeHtml(item.summary || "暂无摘要，请查看原文。")}</p>
            <p class="meta">${formatDate(item.publishedAt)}</p>
            <div class="links">
              ${item.sources
                .map(
                  (source) =>
                    `<a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}原文</a>`
                )
                .join("")}
            </div>
          </div>
          <div class="item-tags">
            ${item.tags.map((tag) => `<span class="item-tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </article>`
    )
    .join("");
}

function renderTags() {
  const tags = [...new Set(allItems.flatMap((item) => item.tags))].sort();
  tagsElement.innerHTML = [
    `<button class="tag ${activeTag === "" ? "active" : ""}" data-tag="">全部</button>`,
    ...tags.map(
      (tag) =>
        `<button class="tag ${activeTag === tag ? "active" : ""}" data-tag="${escapeAttribute(tag)}">${escapeHtml(tag)}</button>`
    )
  ].join("");

  tagsElement.querySelectorAll(".tag").forEach((button) => {
    button.addEventListener("click", () => {
      activeTag = button.dataset.tag || "";
      renderTags();
      renderItems();
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

async function loadNews(forceRefresh = false) {
  refreshButton.disabled = true;
  metaElement.textContent = "正在获取新闻…";

  try {
    const response = await fetch(`./latest.json?v=${Date.now()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "获取失败");

    allItems = data.items;
    metaElement.textContent = `${data.count} 条 · 更新于 ${formatDate(data.updatedAt)}${
      data.underfilled ? " · 今日通过验证的新闻不足 5 条" : ""
    }`;
    renderTags();
    renderItems();
  } catch (error) {
    metaElement.textContent = error instanceof Error ? error.message : "获取失败";
    newsElement.innerHTML = '<div class="empty">新闻获取失败，请点击右上角刷新重试。</div>';
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", () => loadNews(true));
loadNews(false);
setInterval(() => loadNews(false), 30 * 60 * 1000);
