import NavMenu from "../NavMenu";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div>
          <NavMenu />
          <Outlet />
        </div>
      </>
    );
  },
});
