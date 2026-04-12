import NavMenu from "../NavMenu";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div className="drawer drawer-end lg:drawer-open min-h-screen">
          <input id="doc-drawer" type="checkbox" className="drawer-toggle" />

          <main className="drawer-content p-6 bg-base-100">
            <label
              htmlFor="doc-drawer"
              className="btn btn-primary drawer-button lg:hidden mb-4"
            >
              ☰ منو
            </label>
            <Outlet />
          </main>

          <aside className="drawer-side">
            <label htmlFor="doc-drawer" className="drawer-overlay"></label>
            <NavMenu />
          </aside>
        </div>
      </>
    );
  },
});
