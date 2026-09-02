import {
  CalendarCheck2,
  Stethoscope,
  Pill,
  ShieldCheck,
  PackageCheck,
  Truck,
  ClipboardList,
  TestTubeDiagonal,
  Clock,
  CircleCheckBig,
  Circle,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CareJourneyEvent, CareJourneyStage } from "@/lib/curalives/types";

const STAGE_META: Record<
  CareJourneyStage | string,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  appointment_booked: { label: "Appointment booked", Icon: CalendarCheck2 },
  consultation_completed: { label: "Consultation completed", Icon: Stethoscope },
  prescription_generated: { label: "Prescription generated", Icon: Pill },
  pharmacy_verified: { label: "Pharmacy verification", Icon: ShieldCheck },
  pharmacy_confirmed: { label: "Order confirmed", Icon: PackageCheck },
  medicine_packing: { label: "Packing", Icon: PackageCheck },
  medicine_out_for_delivery: { label: "Out for delivery", Icon: Truck },
  medicine_delivered: { label: "Medicines delivered", Icon: CircleCheckBig },
  diagnostic_scheduled: { label: "Diagnostic scheduled", Icon: ClipboardList },
  diagnostic_sample_collected: { label: "Sample collected", Icon: TestTubeDiagonal },
  diagnostic_in_progress: { label: "Test in progress", Icon: TestTubeDiagonal },
  diagnostic_report_ready: { label: "Report ready", Icon: ClipboardList },
  diagnostic_result_available: { label: "Result in your records", Icon: ClipboardList },
  followup_scheduled: { label: "Follow-up planned", Icon: Clock },
  followup_due: { label: "Follow-up due", Icon: Clock },
  care_completed: { label: "Care cycle complete", Icon: CircleCheckBig },
};

const STAGE_ORDER: CareJourneyStage[] = [
  CareJourneyStage.APPOINTMENT_BOOKED,
  CareJourneyStage.CONSULTATION_COMPLETED,
  CareJourneyStage.PRESCRIPTION_GENERATED,
  CareJourneyStage.PHARMACY_VERIFIED,
  CareJourneyStage.PHARMACY_CONFIRMED,
  CareJourneyStage.MEDICINE_PACKING,
  CareJourneyStage.MEDICINE_OUT_FOR_DELIVERY,
  CareJourneyStage.MEDICINE_DELIVERED,
  CareJourneyStage.DIAGNOSTIC_SCHEDULED,
  CareJourneyStage.DIAGNOSTIC_SAMPLE_COLLECTED,
  CareJourneyStage.DIAGNOSTIC_IN_PROGRESS,
  CareJourneyStage.DIAGNOSTIC_REPORT_READY,
  CareJourneyStage.DIAGNOSTIC_RESULT_AVAILABLE,
  CareJourneyStage.FOLLOWUP_SCHEDULED,
  CareJourneyStage.FOLLOWUP_DUE,
  CareJourneyStage.CARE_COMPLETED,
];

interface CareTimelineProps {
  events: CareJourneyEvent[];
  compact?: boolean;
}

export function CareTimeline({ events, compact = false }: CareTimelineProps) {
  const eventStages = new Set(events.map((e) => e.stage));
  let firstPending = true;

  const items = STAGE_ORDER.map((stage) => {
    const event = events.find((e) => e.stage === stage);
    let status: "completed" | "active" | "pending";
    if (event) status = "completed";
    else if (firstPending) {
      status = "active";
      firstPending = false;
    } else {
      status = "pending";
    }

    const meta =
      STAGE_META[stage] ??
      STAGE_META[stage as string] ?? { label: stage, Icon: Circle };
    const { label, Icon } = meta;

    return { stage, status, label, Icon, event };
  });

  return (
    <ol className={cn("relative", compact ? "space-y-3" : "space-y-0")}>
      {items.map(({ stage, status, label, Icon, event }, i) => {
        const last = i === items.length - 1;
        return (
          <li key={stage} className={cn("relative flex gap-4", !compact && "pb-6")}>
            {!last && (
              <div
                aria-hidden
                className={cn(
                  "absolute left-4 top-9 w-px",
                  status === "completed" ? "bg-teal/50" : "bg-grey",
                  compact ? "h-[calc(100%-16px)]" : "h-[calc(100%-20px)]",
                )}
              />
            )}
            <div className="relative z-10 mt-0.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                  status === "completed" &&
                    "border-teal bg-teal text-white shadow-sm",
                  status === "active" &&
                    "border-primary bg-blue-tint text-primary",
                  status === "pending" &&
                    "border-grey bg-white text-slate",
                )}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                ) : status === "active" ? (
                  <CircleDot className="h-5 w-5 animate-pulse" aria-hidden />
                ) : (
                  <Icon className="h-4 w-4 opacity-60" aria-hidden />
                )}
              </div>
            </div>
            <div className="flex-1 pb-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    status === "completed" && "text-navy",
                    status === "active" && "text-primary",
                    status === "pending" && "text-slate",
                  )}
                >
                  {label}
                </p>
                {status === "active" && (
                  <span className="inline-flex items-center rounded-full bg-blue-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Next
                  </span>
                )}
              </div>
              {event?.description && (
                <p className="mt-0.5 text-xs text-slate">{event.description}</p>
              )}
              {event?.timestamp && (
                <p className="mt-0.5 text-[11px] text-slate/70">
                  {new Date(event.timestamp).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { STAGE_META, STAGE_ORDER };
