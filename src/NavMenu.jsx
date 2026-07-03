import { Link } from "@tanstack/react-router";
import { getMarkdownIndex } from "./markdownLoader";
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "./contexts";
import { GiDuck } from "react-icons/gi";
import { LuCoffee } from "react-icons/lu";
import SearchBox from "./SearchBox";

export default function NavMenu({ changeThemeFn }) {
  const config = useContext(ConfigContext);
  const [markdownPages, setMarkdownPages] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getMarkdownIndex().then((index) => {
      if (!cancelled) setMarkdownPages(index);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col w-72 h-[100dvh] bg-base-200 p-4">
      <Link to="/" className="text-xl font-bold mb-4">
        {config.title || "داکیوداک"}
      </Link>
      <SearchBox />

      <div className="h-full overflow-y-auto overflow-x-hidden">
        <ul className="menu menu-lg gap-1 w-full">
          {markdownPages.length > 0 ? (
            markdownPages.map((page) => (
              <li key={page.slug}>
                <Link
                  to="/$slug"
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
          <div className="flex justify-between gap-2 w-full">
            {config.coffee.show && (
              <a
                href={config.coffee.link}
                target="_blank"
                className="btn btn-sm btn-outline flex-1"
              >
                <LuCoffee size={16}></LuCoffee>
              </a>
            )}
            <button
              className="btn btn-sm btn-outline flex-4"
              onClick={() => {
                const newTheme =
                  localStorage.getItem("theme") === "dark" ? "light" : "dark";
                localStorage.setItem("theme", newTheme);
                changeThemeFn();
              }}
            >
              تغییر تم
            </button>
          </div>

          <div className="flex justify-center items-center gap-1">
            <GiDuck size={12} className="text-gray-500"></GiDuck>
            <span className="text-gray-500 text-xs">
              داکیوداک v{__APP_VERSION__}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
