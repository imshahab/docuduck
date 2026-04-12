import { Link } from "@tanstack/react-router";
import { getMarkdownIndex } from "./markdownLoader";

export default function NavMenu() {
  const markdownPages = getMarkdownIndex();
  return (
    <div className="flex flex-col w-72 h-screen bg-base-200 p-4">
      <h2 className="text-xl font-bold mb-4">مستندات</h2>
      <div>
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
            onClick={() =>
              document.documentElement.setAttribute(
                "data-theme",
                document.documentElement.getAttribute("data-theme") === "dark"
                  ? "light"
                  : "dark",
              )
            }
          >
            تغییر تم
          </button>
          <small className="text-gray-500">قدرت گرفته از داکیوداک</small>
        </div>
      </div>
    </div>
  );
}
