import { UserRound, Stethoscope, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCuraLivesStore } from "@/lib/curalives/store";
import { UserRole } from "@/lib/curalives/types";

const ROLES = [
  {
    id: UserRole.PATIENT,
    label: "Patient",
    Icon: UserRound,
    href: "/dashboard/patient",
  },
  {
    id: UserRole.DOCTOR,
    label: "Doctor",
    Icon: Stethoscope,
    href: "/dashboard/doctor",
  },
  {
    id: UserRole.PHARMACIST,
    label: "Pharmacy",
    Icon: Pill,
    href: "/dashboard/pharmacy",
  },
] as const;

export function RoleSwitcher({ size = "sm" }: { size?: "sm" | "md" }) {
  const currentRole = useCuraLivesStore((s: any) => s.currentRole);
  const switchRole = useCuraLivesStore((s: any) => s.switchRole);

  return (
    <div
      role="radiogroup"
      aria-label="Prototype role view"
      className={cn(
        "inline-flex items-center rounded-full border border-grey bg-white/70 p-0.5 backdrop-blur",
        size === "sm" ? "h-9" : "h-10",
      )}
    >
      {ROLES.map(({ id, label, Icon }) => {
        const active = currentRole === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            type="button"
            onClick={() => switchRole(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all",
              size === "sm" ? "h-8" : "h-9",
              active
                ? "bg-navy text-white shadow-sm"
                : "text-slate hover:bg-blue-tint hover:text-navy",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
