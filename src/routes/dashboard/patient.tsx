import { createFileRoute, Navigate } from "@tanstack/react-router";
import { PatientDashboard } from "@/components/dashboards/patient-dashboard";
import { UserRole } from "@/lib/curalives/types";
import { useCuraLivesStore } from "@/lib/curalives/store";

export const Route = createFileRoute("/dashboard/patient")({
  component: PatientDashboardRoute,
});

function PatientDashboardRoute() {
  const currentRole = useCuraLivesStore((s) => s.currentRole);
  if (currentRole !== UserRole.PATIENT) {
    // Auto-handoff from other roles: allow, just don't navigate away, but set role
  }
  return <PatientDashboard />;
}
