import { createFileRoute } from "@tanstack/react-router";
import { ConfigContext } from "../contexts";
import { useContext } from "react";
import { LuSprout } from "react-icons/lu";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [{ title: config.title }],
  }),
});

function Index() {
  const [config] = useContext(ConfigContext);
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center flex flex-col gap-2">
        <LuSprout size={36}></LuSprout>
        <p className="text-base">{config.welcome || "خوش اومدین!"}</p>
        <span className="text-gray-400 text-sm">
          {config.description || "برای شروع یکی از صفحات رو انتخاب کنید."}
        </span>
      </div>
    </div>
  );
}
