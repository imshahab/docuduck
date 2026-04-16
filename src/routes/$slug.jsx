import { createFileRoute } from "@tanstack/react-router";
import { loadMarkdownBySlug } from "../markdownLoader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useContext, useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { ConfigContext } from "../contexts";
import { GiDuckPalm } from "react-icons/gi";

export const Route = createFileRoute("/$slug")({
  component: MarkdownPage,
});

function MarkdownPage() {
  const { slug } = Route.useParams();
  const [body, setBody] = useState("");
  const [attributes, setAttributes] = useState({});
  const [loading, setLoading] = useState(false);
  const config = useContext(ConfigContext);

  useEffect(() => {
    setBody("");
    setAttributes({});
    setLoading(true);
    let cancelled = false;

    async function load() {
      const content = await loadMarkdownBySlug(slug);

      if (!cancelled) {
        setBody(content.body);
        setAttributes(content.attributes);
        document.title = content.attributes?.label || config.title;
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

  if (body === "") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GiDuckPalm size={36} className="text-gray-400 "></GiDuckPalm>
        <p className="text-gray-400 text-base">اینجا چیزی برای خوندن نیست...</p>
      </div>
    );
  } else if (body === null) {
    return (
      <div className="min-h-screen flex items-center justify-center flex flex-col gap-2">
        <GiDuckPalm size={36} className="text-gray-400 "></GiDuckPalm>
        <p className="text-gray-400 text-base">صفحه پیدا نشد...</p>
      </div>
    );
  }

  const PERSIAN_REGEX = /\p{Script=Arabic}/u;
  function hasPersian(text) {
    return PERSIAN_REGEX.test(text);
  }

  function extractText(node) {
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node?.props?.children) return extractText(node.props.children);
    return "";
  }

  const MarkdownComponents = {
    p: ({ children }) => {
      const text = extractText(children);
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
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return <h1 dir={isRTL ? "rtl" : "ltr"}>{children}</h1>;
    },

    h2: ({ children }) => {
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return <h2 dir={isRTL ? "rtl" : "ltr"}>{children}</h2>;
    },

    h3: ({ children }) => {
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return <h3 dir={isRTL ? "rtl" : "ltr"}>{children}</h3>;
    },

    h4: ({ children }) => {
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return <h4 dir={isRTL ? "rtl" : "ltr"}>{children}</h4>;
    },

    h5: ({ children }) => {
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return <h5 dir={isRTL ? "rtl" : "ltr"}>{children}</h5>;
    },

    h6: ({ children }) => {
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return <h6 dir={isRTL ? "rtl" : "ltr"}>{children}</h6>;
    },

    li: ({ children }) => {
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return <li dir={isRTL ? "rtl" : "ltr"}>{children}</li>;
    },

    blockquote: ({ children }) => {
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return <blockquote dir={isRTL ? "rtl" : "ltr"}>{children}</blockquote>;
    },
    ul: ({ children }) => {
      return <ul style={{ margin: 20 }}>{children}</ul>;
    },
    table: ({ children }) => {
      const text = extractText(children);
      const isRTL = hasPersian(text);

      return (
        <div className="overflow-x-auto">
          <table
            dir={isRTL ? "rtl" : "ltr"}
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {children}
          </table>
        </div>
      );
    },
  };

  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-full py-6 px-8"
      style={{ direction: "ltr" }}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={MarkdownComponents}
      >
        {body}
      </Markdown>
    </div>
  );
}

export default MarkdownPage;
