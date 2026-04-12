import { Link } from "@tanstack/react-router";
import { getMarkdownIndex } from "./markdownLoader";

function NavMenu() {
  const markdownPages = getMarkdownIndex();
  return (
    <div
      className="nav-menu"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {markdownPages.map((slug, index) => (
        <Link to="/$slug" key={index} params={{ slug: slug }}>
          {slug}
        </Link>
      ))}
    </div>
  );
}

export default NavMenu;
