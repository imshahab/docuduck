import { createFileRoute, notFound } from "@tanstack/react-router";
import { getMarkdownPages } from "../getMarkdownPages";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/$slug")({
  component: MarkdownPage,
});

function MarkdownPage() {
  const markdownPages = getMarkdownPages();
  const { slug } = Route.useParams();

  const page = markdownPages.find((p) => p.slug === slug);

  return (
    <article>
      <h1>{page.title}</h1>
      <Markdown remarkPlugins={[remarkGfm]}>{page.content}</Markdown>
    </article>
  );
}

export default MarkdownPage;
