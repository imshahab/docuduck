import fm from "front-matter";
import Fuse from "fuse.js";

const modules = import.meta.glob("/src/markdown/*.md", {
  query: "?raw",
  import: "default",
});

let parsedEntriesPromise = null;
let fuseInstance = null;

const FUSE_OPTIONS = {
  includeScore: true,
  shouldSort: true,
  ignoreLocation: true,
  threshold: 0.35,
  minMatchCharLength: 2,
  keys: [
    { name: "searchFileLabel", weight: 0.3 },
    { name: "searchChunkHeading", weight: 0.15 },
    { name: "searchContent", weight: 0.5 },
    { name: "searchChunkId", weight: 0.05 },
  ],
};

function normalizeForSearch(text) {
  return String(text ?? "")
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function makeHeadingId(text) {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/["'`*_~<>\\#]/g, "");
}

export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function loadParsedEntries() {
  if (!parsedEntriesPromise) {
    parsedEntriesPromise = Promise.all(
      Object.entries(modules).map(async ([path, loader]) => {
        const raw = await loader();
        const { attributes, body } = fm(raw);
        const slug = path.split("/").pop().replace(/\.md$/, "");
        const label = attributes.label ?? slug;
        const order = attributes.order ?? 0;
        return { slug, label, order, body };
      }),
    );
  }
  return parsedEntriesPromise;
}

export async function getMarkdownIndex() {
  const entries = await loadParsedEntries();
  return entries
    .map(({ slug, label, order }) => ({ slug, label, order }))
    .sort((a, b) => a.order - b.order);
}

function buildChunksForEntry({ slug, label, order, body }) {
  const lines = body.split("\n");
  const chunks = [];
  let h1Title = null;
  let preH2 = [];
  let currentHeading = null;
  let currentContent = [];
  function flushPreH2() {
    if (preH2.length === 0) return;
    chunks.push({
      fileSlug: slug,
      fileLabel: label,
      fileOrder: order,
      chunkId: makeHeadingId(h1Title ?? "intro"),
      chunkHeading: h1Title,
      content: preH2.join("\n"),
    });
    preH2 = [];
  }

  function flushCurrent() {
    if (!currentHeading) return;
    chunks.push({
      fileSlug: slug,
      fileLabel: label,
      fileOrder: order,
      chunkId: makeHeadingId(currentHeading),
      chunkHeading: currentHeading,
      content: currentContent.join("\n"),
    });
    currentHeading = null;
    currentContent = [];
  }

  for (const line of lines) {
    if (h1Title === null) {
      const h1Match = /^#\s+(.+?)\s*$/.exec(line);
      if (h1Match) h1Title = h1Match[1];
    }

    const h2Match = /^##\s+(.+?)\s*$/.exec(line);
    if (h2Match) {
      flushPreH2();
      flushCurrent();
      currentHeading = h2Match[1];
      currentContent = [line];
      continue;
    }

    if (currentHeading) {
      currentContent.push(line);
    } else {
      preH2.push(line);
    }
  }

  flushCurrent();
  flushPreH2();

  return chunks.map((chunk, idx) => ({
    ...chunk,
    chunkOrder: idx,
    searchFileLabel: normalizeForSearch(chunk.fileLabel),
    searchChunkHeading: normalizeForSearch(chunk.chunkHeading ?? ""),
    searchContent: normalizeForSearch(chunk.content),
    searchChunkId: normalizeForSearch(chunk.chunkId),
  }));
}

async function getChunkEntries() {
  const entries = await loadParsedEntries();
  const sorted = [...entries].sort((a, b) => a.order - b.order);
  const all = [];
  sorted.forEach((entry) => {
    all.push(...buildChunksForEntry(entry));
  });
  return all.map((chunk, idx) => ({ ...chunk, globalOrder: idx }));
}

function getFuse(entries) {
  if (!fuseInstance) {
    fuseInstance = new Fuse(entries, FUSE_OPTIONS);
  }
  return fuseInstance;
}

export async function searchMarkdown(query) {
  const normalizedQuery = normalizeForSearch(query);
  if (!normalizedQuery) return [];

  const chunks = await getChunkEntries();
  const fuseResults = getFuse(chunks)
    .search(normalizedQuery)
    .map((result) => result.item);

  // Post-filter: only keep chunks where the query actually appears as a substring
  // in any of the searchable fields.  Fuse's fuzzy matching can return items
  // where the term is only "vibe matched" but never actually present.
  return fuseResults.filter((chunk) => {
    const fields = [
      chunk.searchFileLabel,
      chunk.searchChunkHeading,
      chunk.searchContent,
      chunk.searchChunkId,
    ];
    return fields.some((field) => field.includes(normalizedQuery));
  });
}

export function buildSnippet(chunk, query, maxLength = 220) {
  if (!query || !query.trim()) {
    const meaningful = chunk.content
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.length > 0 &&
          !line.startsWith("#") &&
          !line.startsWith("---") &&
          !line.startsWith("|"),
      )
      .slice(0, 2)
      .join(" ");
    return meaningful.slice(0, maxLength);
  }

  const lines = chunk.content.split("\n");
  const regex = new RegExp(escapeRegex(query.trim()), "i");

  for (const line of lines) {
    if (regex.test(line)) {
      return line.trim().slice(0, maxLength);
    }
  }

  const normalizedQuery = normalizeForSearch(query);
  if (normalizedQuery.length >= 2) {
    for (const line of lines) {
      if (normalizeForSearch(line).includes(normalizedQuery)) {
        return line.trim().slice(0, maxLength);
      }
    }
  }

  const meaningful = chunk.content
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith("#") &&
        !line.startsWith("---") &&
        !line.startsWith("|"),
    )
    .slice(0, 2)
    .join(" ");
  return meaningful.slice(0, maxLength);
}

export function highlightSnippet(text, query) {
  if (!query || !query.trim() || !text) {
    return [{ text, highlight: false }];
  }

  const regex = new RegExp(`(${escapeRegex(query.trim())})`, "gi");
  const parts = text.split(regex);

  const result = [];
  parts.forEach((part, idx) => {
    if (part === "") return;
    result.push({ text: part, highlight: idx % 2 === 1 });
  });
  return result.length > 0 ? result : [{ text, highlight: false }];
}

export async function loadMarkdownBySlug(slug) {
  const path = `/src/markdown/${slug}.md`;
  const loader = modules[path];

  if (!loader) return { body: null, attributes: {} };

  const raw = await loader();
  return fm(raw);
}
