import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadMarkdownBySlug } from "../markdownLoader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/$slug")({
  component: MarkdownPage,
});

function MarkdownPage() {
  const { slug } = Route.useParams();
  const [content, setContent] = useState(null);

  useEffect(() => {
    setContent(null);
    let cancelled = false;

    async function load() {
      const content = await loadMarkdownBySlug(slug);
      if (!content) {
        throw notFound();
      }
      if (!cancelled) {
        setContent(content);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!content) {
    return <div>Loading…</div>;
  }

  return (
    <article>
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </article>
  );
}

export default MarkdownPage;
