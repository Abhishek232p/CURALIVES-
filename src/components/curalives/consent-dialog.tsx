import {
  ShieldAlert,
  CalendarDays,
  User,
  FileSearch,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsentScope, UserRole } from "@/lib/curalives/types";
import { useCuraLivesStore } from "@/lib/curalives/store";

const SCOPE_LABELS: [ConsentScope, string][] = [
  [ConsentScope.BASIC_INFO, "Basic Info"],
  [ConsentScope.CONSULTATION_HISTORY, "Consultation History"],
  [ConsentScope.PRESCRIPTIONS, "Prescriptions"],
  [ConsentScope.DIAGNOSTICS_REPORTS, "Diagnostics Reports"],
  [ConsentScope.ALLERGIES_CONDITIONS, "Allergies & Conditions"],
];

export interface ConsentDialogData {
  requesterName: string;
  requesterRole: UserRole | string;
  requesterOrganization?: string;
  purpose: string;
  duration: string;
  scope: ConsentScope;
  requesterId?: string;
  requestId?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: ConsentDialogData;
  onGranted?: () => void;
  onDeclined?: () => void;
}

export function ConsentDialog({ open, onOpenChange, data, onGranted, onDeclined }: Props) {
  const grantConsent = useCuraLivesStore((s) => s.grantConsent);

  const enabledScopes = SCOPE_LABELS.filter(([s]) => (data.scope & s) !== 0);

  const allow = () => {
    grantConsent({
      requesterId: data.requesterId ?? data.requesterName,
      requesterName: data.requesterName,
      requesterRole: String(data.requesterRole),
      requesterOrganization: data.requesterOrganization,
      purpose: data.purpose,
      scope: data.scope,
      duration: data.duration,
      action: "granted",
    });
    onGranted?.();
    onOpenChange(false);
  };

  const decline = () => {
    grantConsent({
      requesterId: data.requesterId ?? data.requesterName,
      requesterName: data.requesterName,
      requesterRole: String(data.requesterRole),
      requesterOrganization: data.requesterOrganization,
      purpose: data.purpose,
      scope: data.scope,
      duration: data.duration,
      action: "declined",
    });
    onDeclined?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-tint text-primary">
              <ShieldAlert className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <DialogTitle className="text-lg">Access request</DialogTitle>
              <DialogDescription>
                A healthcare provider is requesting access to your record.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 rounded-2xl border border-grey bg-page p-5 text-sm">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 text-teal" aria-hidden />
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Requester</p>
              <p className="mt-0.5 font-semibold text-navy">{data.requesterName}</p>
              {data.requesterOrganization && (
                <p className="text-xs text-slate">{data.requesterOrganization}</p>
              )}
              <Badge variant="navy" className="mt-2">{String(data.requesterRole)}</Badge>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileSearch className="mt-0.5 h-4 w-4 text-teal" aria-hidden />
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Request</p>
              <ul className="mt-1.5 space-y-1">
                {enabledScopes.map(([, label]) => (
                  <li key={label} className="text-navy">
                    • {label}
                  </li>
                ))}
                {enabledScopes.length === 0 && (
                  <li className="italic text-slate">No information scopes requested</li>
                )}
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-teal" aria-hidden />
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Purpose &amp; duration</p>
              <p className="mt-0.5 text-navy">{data.purpose}</p>
              <p className="mt-1 text-xs text-slate">Access: {data.duration}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-between sm:space-x-0">
          <Button variant="ghost" onClick={decline}>
            Decline
          </Button>
          <div className="flex gap-2">
            <Button variant="teal" onClick={allow}>
              Allow access
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
