import NavMenu from "../NavMenu";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ConfigContext } from "../contexts";
import { useState } from "react";
import config from "../../config.json";

export const Route = createRootRoute({
  component: () => {
    const configHook = useState(config);
    const [theme, setTheme] = useState(
      localStorage.getItem("theme") || "light",
    );

    function changeTheme() {
      setTheme(theme === "light" ? "dark" : "light");
    }

    return (
      <ConfigContext.Provider value={configHook}>
        <div data-theme={theme}>
          <div className="drawer drawer lg:drawer-open min-h-screen">
            <input id="doc-drawer" type="checkbox" className="drawer-toggle" />

            <main className="drawer-content p-6 bg-base-100">
              <label
                htmlFor="doc-drawer"
                className="btn btn-primary drawer-button lg:hidden mb-4 sticky top-6"
              >
                ☰ منو
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
  },
});
