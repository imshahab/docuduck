const modules = import.meta.glob("/src/markdown/*.md", {
  query: "?raw",
  import: "default",
});

export function getMarkdownIndex() {
  return Object.keys(modules).map((path) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    return slug;
  });
}

export async function loadMarkdownBySlug(slug) {
  const path = `/src/markdown/${slug}.md`;
  const loader = modules[path];

  if (!loader) return null;

  const content = await loader();
  return content;
}
