import { createFileRoute } from "@tanstack/react-router";
import { DiagnosticsPage } from "@/components/flows/diagnostics-page";

export const Route = createFileRoute("/diagnostics")({
  component: DiagnosticsPage,
});
