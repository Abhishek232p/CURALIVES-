import { useState } from "react";
import { X, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "curalives-proto-banner-dismissed";

export function PrototypeBanner({ className }: { className?: string }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  return (
    <div
      role="status"
      className={cn(
        "border-b border-mint/40 bg-mint-bg text-navy",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <FlaskConical className="h-4 w-4 shrink-0 text-teal" aria-hidden />
        <p className="flex-1 text-xs font-medium leading-snug text-navy/90 sm:text-sm">
          Prototype demonstration. All data is synthetic. Not a substitute for real medical care or official health records.
        </p>
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={() => {
            try {
              sessionStorage.setItem(SESSION_KEY, "1");
            } catch {}
            setDismissed(true);
          }}
          className="rounded-lg p-1.5 text-slate/80 transition-colors hover:bg-white/60 hover:text-navy"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
