import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-grey", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-teal transition-all duration-500"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

interface Step {
  id: string;
  label: string;
  status: "completed" | "active" | "pending";
  icon?: React.ReactNode;
}

function ProgressSteps({ steps, orientation = "vertical" }: { steps: Step[]; orientation?: "horizontal" | "vertical" }) {
  return (
    <div className={cn(
      "flex",
      orientation === "vertical" ? "flex-col" : "flex-row items-start",
    )}>
      {steps.map((s, i) => (
        <div key={s.id} className={cn(
          "relative flex",
          orientation === "vertical" ? "gap-3 pb-6 last:pb-0" : "flex-1 flex-col items-center text-center",
        )}>
          {orientation === "vertical" && i < steps.length - 1 && (
            <div
              aria-hidden
              className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-grey"
            />
          )}
          <div className="relative z-10 flex shrink-0 items-center justify-center">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold",
              s.status === "completed" && "border-teal bg-teal text-white",
              s.status === "active" && "border-primary bg-blue-tint text-primary animate-pulse",
              s.status === "pending" && "border-grey bg-white text-slate",
            )}>
              {s.status === "completed" ? (s.icon ?? "✓") : i + 1}
            </div>
          </div>
          <div className={cn(
            "flex flex-col",
            orientation === "horizontal" ? "mt-3" : "",
          )}>
            <p className={cn(
              "text-sm font-semibold",
              s.status === "completed" && "text-navy",
              s.status === "active" && "text-primary",
              s.status === "pending" && "text-slate",
            )}>
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export { Progress, ProgressSteps };
