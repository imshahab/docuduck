import { createFileRoute } from "@tanstack/react-router";
import config from "../../config.json";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center flex flex-col gap-2">
        <p className="text-base">{config.welcome || "خوش اومدین!"}</p>
        <span className="text-gray-400 text-sm">
          {config.description || "برای شروع یکی از صفحات رو انتخاب کنید."}
        </span>
      </div>
    </div>
  );
}
