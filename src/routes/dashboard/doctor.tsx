import { createFileRoute } from "@tanstack/react-router";
import { DoctorDashboard } from "@/components/dashboards/doctor-dashboard";

export const Route = createFileRoute("/dashboard/doctor")({
  component: DoctorDashboard,
});
