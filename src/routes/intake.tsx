import { createFileRoute } from "@tanstack/react-router";
import { IntakePage } from "@/components/flows/intake-page";

export const Route = createFileRoute("/intake")({
  component: IntakePage,
});
