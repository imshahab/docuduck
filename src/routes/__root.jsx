import NavMenu from "../NavMenu";
import SearchModal from "../SearchModal";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ConfigContext } from "../contexts";
import { useContext, useState } from "react";
import { LuMenu, LuSearch } from "react-icons/lu";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const contextValue = useContext(ConfigContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchModalKey, setSearchModalKey] = useState(0);

  function changeTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function openSearch() {
    setSearchModalKey((k) => k + 1);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
  }

  return (
    <ConfigContext.Provider value={contextValue}>
      <div data-theme={theme}>
        <div className="drawer lg:drawer-open min-h-screen">
          <input id="doc-drawer" type="checkbox" className="drawer-toggle" />

          <main className="drawer-content bg-base-100">
            <div className="flex justify-between items-start mb-4 sticky top-6 px-4 lg:hidden">
              <label
                htmlFor="doc-drawer"
                className="btn btn-primary drawer-button shadow-lg"
              >
                <LuMenu size={16}></LuMenu>
                منو
              </label>
              <button
                type="button"
                className="btn btn-primary btn-circle shadow-lg"
                onClick={openSearch}
              >
                <LuSearch size={18} />
              </button>
            </div>
            <SearchModal
              key={searchModalKey}
              isOpen={searchOpen}
              onClose={closeSearch}
            />
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
