import NavMenu from "../NavMenu";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ConfigContext } from "../contexts";
import { useContext, useState } from "react";
import { LuMenu } from "react-icons/lu";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const contextValue = useContext(ConfigContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  function changeTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ConfigContext.Provider value={contextValue}>
      <div data-theme={theme}>
        <div className="drawer lg:drawer-open min-h-screen">
          <input id="doc-drawer" type="checkbox" className="drawer-toggle" />

          <main className="drawer-content bg-base-100">
            <label
              htmlFor="doc-drawer"
              className="btn btn-primary drawer-button lg:hidden mb-4 sticky top-6 right-4"
            >
              <LuMenu width={16}></LuMenu>
              منو
            </label>
            <Outlet />
          </main>

          <aside className="drawer-side">
            <label htmlFor="doc-drawer" className="drawer-overlay"></label>
            <NavMenu changeThemeFn={changeTheme} />
          </aside>
        </div>
      </div>
    </ConfigContext.Provider>
  );
}
