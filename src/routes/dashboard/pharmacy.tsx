import { createFileRoute } from "@tanstack/react-router";
import { PharmacyDashboard } from "@/components/dashboards/pharmacy-dashboard";

export const Route = createFileRoute("/dashboard/pharmacy")({
  component: PharmacyDashboard,
});
