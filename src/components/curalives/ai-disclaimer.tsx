import { AlertTriangle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  variant?: "summary" | "intake" | "test" | "compact";
  children?: ReactNode;
  className?: string;
}

const VARIANT_COPY: Record<NonNullable<Props["variant"]>, { title: string; body: string; tone: string }> = {
  summary: {
    title: "AI-generated summary — verify before clinical use.",
    body: "This draft is an assistive tool. The clinician is responsible for all clinical decisions.",
    tone: "border-mint/60 bg-mint-bg text-navy",
  },
  intake: {
    title: "This is an informational care-navigation prototype.",
    body: "It does not provide a medical diagnosis. For emergencies, please visit a hospital or dial an ambulance.",
    tone: "border-mint/60 bg-mint-bg text-navy",
  },
  test: {
    title: "AI-suggested tests — clinician decides final orders.",
    body: "Recommendations are informational and based on general patterns.",
    tone: "border-mint/60 bg-mint-bg text-navy",
  },
  compact: {
    title: "AI-assist. Human review required.",
    body: "Do not act on this output alone.",
    tone: "border-mint/60 bg-mint-bg/60 text-navy",
  },
};

export function AIDisclaimer({ variant = "summary", children, className }: Props) {
  const copy = VARIANT_COPY[variant];
  return (
    <div
      role="note"
      aria-label="AI disclaimer"
      className={cn(
        "flex gap-3 rounded-2xl border p-4",
        copy.tone,
        className,
      )}
    >
      <div className="mt-0.5 shrink-0">
        <Bot className="h-5 w-5 text-teal" aria-hidden />
      </div>
      <div className="flex-1 text-sm">
        <p className="inline-flex items-center gap-2 font-semibold text-navy">
          <AlertTriangle className="h-3.5 w-3.5 text-teal" aria-hidden />
          {copy.title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate/90 sm:text-sm">
          {children ?? copy.body}
        </p>
      </div>
    </div>
  );
}
