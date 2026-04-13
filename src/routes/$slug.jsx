import { createFileRoute } from "@tanstack/react-router";
import { loadMarkdownBySlug } from "../markdownLoader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export const Route = createFileRoute("/$slug")({
  component: MarkdownPage,
  head: ({ params }) => ({
    meta: [{ title: params.slug }],
  }),
});

function MarkdownPage() {
  const { slug } = Route.useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(null);
    setLoading(true);
    let cancelled = false;

    async function load() {
      const content = await loadMarkdownBySlug(slug);

      if (!cancelled) {
        setContent(content);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400 text-base">
          اینجا چیزی برای خوندن نیست...
        </span>
      </div>
    );
  }
  const PERSIAN_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  function hasPersian(text) {
    return PERSIAN_REGEX.test(text);
  }

  const MarkdownComponents = {
    p: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return (
        <p
          dir={isRTL ? "rtl" : "ltr"}
          style={{ textAlign: isRTL ? "right" : "left" }}
        >
          {children}
        </p>
      );
    },

    h1: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return <h1 dir={isRTL ? "rtl" : "ltr"}>{children}</h1>;
    },

    h2: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return <h2 dir={isRTL ? "rtl" : "ltr"}>{children}</h2>;
    },

    h3: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return <h3 dir={isRTL ? "rtl" : "ltr"}>{children}</h3>;
    },

    h4: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return <h4 dir={isRTL ? "rtl" : "ltr"}>{children}</h4>;
    },

    h5: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return <h5 dir={isRTL ? "rtl" : "ltr"}>{children}</h5>;
    },

    h6: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return <h6 dir={isRTL ? "rtl" : "ltr"}>{children}</h6>;
    },

    li: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return <li dir={isRTL ? "rtl" : "ltr"}>{children}</li>;
    },

    blockquote: ({ children }) => {
      const text = children?.toString?.() ?? "";
      const isRTL = hasPersian(text);

      return <blockquote dir={isRTL ? "rtl" : "ltr"}>{children}</blockquote>;
    },
  };

  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-full p-6"
      style={{ direction: "ltr" }}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={MarkdownComponents}
      >
        {content}
      </Markdown>
    </div>
  );
}

export default MarkdownPage;
