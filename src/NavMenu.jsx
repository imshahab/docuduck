import { Link } from "@tanstack/react-router";
import { getMarkdownIndex } from "./markdownLoader";
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "./contexts";

export default function NavMenu({ changeThemeFn }) {
  const [config] = useContext(ConfigContext);
  const [markdownPages, setMarkdownPages] = useState([]);

  useEffect(() => {
    getMarkdownIndex().then(setMarkdownPages);
  }, []);

  return (
    <div className="flex flex-col w-72 h-screen bg-base-200 p-4">
      <Link to="/" className="text-xl font-bold mb-4">
        {config.title || "داکیوداک"}
      </Link>
      <div className="h-full overflow-y-auto">
        <ul className="menu menu-lg gap-1 w-full h-full">
          {markdownPages.length > 0 ? (
            markdownPages.map((page, index) => (
              <li>
                <Link
                  to="/$slug"
                  key={index}
                  params={{ slug: page.slug }}
                  className="text-sm"
                  activeProps={{ className: "font-semibold text-primary" }}
                >
                  {page.label}
                </Link>
              </li>
            ))
          ) : (
            <div className="h-full flex justify-center items-center">
              <p className="text-center text-gray-400">اینجا خبری نیست...</p>
            </div>
          )}
        </ul>
      </div>

      <div className="mt-auto">
        <div className="divider"></div>
        <div className="flex flex-col justify-center items-center gap-3">
          {/* Theme Switch */}
          <button
            className="btn btn-sm btn-outline w-full"
            onClick={() => {
              const newTheme =
                localStorage.getItem("theme") === "dark" ? "light" : "dark";
              localStorage.setItem("theme", newTheme);
              changeThemeFn();
            }}
          >
            تغییر تم
          </button>
          <span className="text-gray-500 text-xs">
            🦆 داکیوداک v{__APP_VERSION__}
          </span>
        </div>
      </div>
    </div>
  );
}
