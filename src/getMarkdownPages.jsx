export function getMarkdownPages() {
  const markdownModules = import.meta.glob("./markdown/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });
  const markdownPages = Object.entries(markdownModules).map(
    ([path, content]) => {
      // "./markdown/getting-started.md" -> "getting-started"
      const slug = path.split("/").pop().replace(/\.md$/, "");

      return {
        slug,
        title: slug.replace(/-/g, " "),
        content,
      };
    },
  );
  return markdownPages;
}
