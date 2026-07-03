import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LuArrowDown,
  LuArrowUp,
  LuCornerDownLeft,
  LuFileText,
  LuSearch,
  LuX,
} from "react-icons/lu";
import {
  buildSnippet,
  highlightSnippet,
  searchMarkdown,
} from "./markdownLoader";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const mouseActiveRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen && !el.open) {
      el.showModal();
    } else if (!isOpen && el.open) {
      el.close();
    }
  }, [isOpen]);

  // Auto-focus the input when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let the dialog animation start
      const id = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // Search as the user types
  useEffect(() => {
    const trimmed = query.trim();
    let cancelled = false;
    const delay = trimmed ? 150 : 0;
    const timeoutId = setTimeout(async () => {
      if (cancelled) return;
      if (!trimmed) {
        setResults([]);
        setSelectedIndex(0);
        return;
      }
      const next = await searchMarkdown(query);
      if (cancelled) return;
      setResults(next);
      setSelectedIndex(0);
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  // Scroll selected item into view (only for keyboard nav, not mouse hover)
  useEffect(() => {
    if (!isOpen || mouseActiveRef.current) return undefined;
    const container = dialogRef.current;
    if (!container) return undefined;
    const selected = container.querySelector(
      '.search-result[data-selected="true"]',
    );
    if (selected && typeof selected.scrollIntoView === "function") {
      selected.scrollIntoView({ block: "nearest" });
    }
    return undefined;
  }, [selectedIndex, isOpen]);

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      mouseActiveRef.current = false;
      setSelectedIndex((index) => {
        if (results.length === 0) return 0;
        return Math.min(index + 1, results.length - 1);
      });
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      mouseActiveRef.current = false;
      setSelectedIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      const target = results[selectedIndex];
      if (!target) return;
      event.preventDefault();
      selectResult(target);
    }
  }

  function selectResult(result) {
    navigate({
      to: "/$slug",
      params: { slug: result.fileSlug },
      hash: result.chunkId || "intro",
      search: { q: query.trim() },
    });
    onClose();
  }

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) {
      onClose();
    }
  }

  function handleCancel(event) {
    event.preventDefault();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="search-modal"
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      aria-label="جستجو"
    >
      <div className="search-modal__panel">
        <div className="search-modal__header">
          <LuSearch size={18} className="text-base-content/60 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            className="search-modal__input"
            placeholder="جستجو..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            dir="auto"
          />
          <span className="search-modal__count">{results.length} نتیجه</span>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="بستن"
          >
            <LuX size={16} />
          </button>
        </div>

        <div className="search-modal__body">
          {results.length === 0 ? (
            <div className="search-modal__empty">
              <LuSearch size={30} className="text-base-content/30" />
              <p className="text-sm text-base-content/60">
                {query.trim() ? "نتیجه‌ای پیدا نشد..." : "برای شروع تایپ کنید."}
              </p>
            </div>
          ) : (
            <ul className="search-modal__list">
              {results.map((result, index) => (
                <li key={`${result.fileSlug}-${result.chunkId}`}>
                  <button
                    type="button"
                    className="search-result"
                    data-selected={index === selectedIndex}
                    onClick={() => selectResult(result)}
                    onMouseEnter={() => {
                      mouseActiveRef.current = true;
                      setSelectedIndex(index);
                    }}
                  >
                    <div className="search-result__path">
                      <LuFileText size={14} className="shrink-0" />
                      <span className="search-result__file">
                        {result.fileLabel}
                      </span>
                      {result.chunkHeading && (
                        <>
                          <span className="search-result__sep">›</span>
                          <span className="search-result__heading">
                            {result.chunkHeading}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="search-result__snippet" dir="auto">
                      {renderHighlight(buildSnippet(result, query), query)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search-modal__footer">
          <span className="search-modal__hint">
            <kbd className="search-modal__kbd">
              <LuArrowUp size={10} />
            </kbd>
            <kbd className="search-modal__kbd">
              <LuArrowDown size={10} />
            </kbd>
            جستجو
          </span>
          <span className="search-modal__hint">
            <kbd className="search-modal__kbd">
              <LuCornerDownLeft size={10} />
            </kbd>
            انتخاب
          </span>
          <span className="search-modal__hint">
            <kbd className="search-modal__kbd">Esc</kbd>
            بستن
          </span>
        </div>
      </div>
    </dialog>
  );
}

function renderHighlight(snippet, query) {
  const parts = highlightSnippet(snippet, query);
  return parts.map((part, index) =>
    part.highlight ? (
      <mark key={index} className="search-snippet__match">
        {part.text}
      </mark>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  );
}
