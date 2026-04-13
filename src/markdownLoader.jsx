import fm from "front-matter";

const modules = import.meta.glob("/src/markdown/*.md", {
  query: "?raw",
  import: "default",
});

export async function getMarkdownIndex() {
  const entries = await Promise.all(
    Object.entries(modules).map(async ([path, loader]) => {
      const raw = await loader();
      const { attributes } = fm(raw);
      const slug = path.split("/").pop().replace(/\.md$/, "");

      return {
        slug,
        label: attributes.label ?? slug,
        order: attributes.order ?? 0,
      };
    }),
  );

  return entries.sort((a, b) => a.order - b.order);
}

export async function loadMarkdownBySlug(slug) {
  const path = `/src/markdown/${slug}.md`;
  const loader = modules[path];

  if (!loader) return null;

  const raw = await loader();
  const { body } = fm(raw);
  return body;
}
