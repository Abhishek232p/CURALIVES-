import { createFileRoute } from "@tanstack/react-router";
import { ConsentPage } from "@/components/flows/consent-page";

export const Route = createFileRoute("/consent")({
  component: ConsentPage,
});
