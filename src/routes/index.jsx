import { createFileRoute } from "@tanstack/react-router";
import { ConfigContext } from "../contexts";
import { useContext } from "react";
import { LuSprout } from "react-icons/lu";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [config] = useContext(ConfigContext);

  useEffect(() => {
    document.title = config.title;
  }, [config]);

  return (
    <div>
      <div className="h-[100dvh] flex items-center justify-center flex flex-col gap-2">
        <LuSprout size={36}></LuSprout>
        <p className="text-base">{config.welcome || "خوش اومدین!"}</p>
        <span className="text-gray-400 text-sm">
          {config.description || "برای شروع یکی از صفحات رو انتخاب کنید."}
        </span>
      </div>
    </div>
  );
}
