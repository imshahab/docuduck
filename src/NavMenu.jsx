import { Link } from "@tanstack/react-router";
import { getMarkdownIndex } from "./markdownLoader";
import { useContext } from "react";
import { ConfigContext } from "./contexts";

export default function NavMenu({ changeThemeFn }) {
  const [config] = useContext(ConfigContext);

  const markdownPages = getMarkdownIndex();
  return (
    <div className="flex flex-col w-72 h-screen bg-base-200 p-4">
      <h2 className="text-xl font-bold mb-4">{config.title}</h2>
      <div className="h-full overflow-y-auto">
        <ul className="menu menu-lg gap-1">
          {markdownPages.map((slug, index) => (
            <li>
              <Link
                to="/$slug"
                key={index}
                params={{ slug: slug }}
                activeProps={{ className: "font-semibold text-primary" }}
              >
                {slug}
              </Link>
            </li>
          ))}
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
          <small className="text-gray-500">قدرت گرفته از داکیوداک</small>
        </div>
      </div>
    </div>
  );
}
