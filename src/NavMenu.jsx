import { Link } from "@tanstack/react-router";
import { getMarkdownPages } from "./getMarkdownPages";

function NavMenu() {
  const markdownPages = getMarkdownPages();
  return (
    <div
      className="nav-menu"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {markdownPages.map((page, index) => (
        <Link to="/$slug" key={index} params={{ slug: page.slug }}>
          {page.title}
        </Link>
      ))}
    </div>
  );
}

export default NavMenu;
