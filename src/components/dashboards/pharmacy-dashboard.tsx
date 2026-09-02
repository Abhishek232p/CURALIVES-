import { useMemo, useState } from "react";
import { useCuraLivesStore } from "@/lib/curalives/store";
import { PrescriptionStatus, MedicineFrequency } from "@/lib/curalives/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProgressSteps } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle2,
  IndianRupee,
  ScanLine,
  User,
  Stethoscope,
  Building2,
  Clock,
} from "lucide-react";

const frequencyLabel: Record<MedicineFrequency, string> = {
  [MedicineFrequency.ONCE_DAILY]: "Once daily",
  [MedicineFrequency.TWICE_DAILY]: "Twice daily",
  [MedicineFrequency.THRICE_DAILY]: "Thrice daily",
  [MedicineFrequency.FOUR_TIMES_DAILY]: "4 times daily",
  [MedicineFrequency.EVERY_6_HOURS]: "Every 6 hours",
  [MedicineFrequency.EVERY_8_HOURS]: "Every 8 hours",
  [MedicineFrequency.EVERY_12_HOURS]: "Every 12 hours",
  [MedicineFrequency.AS_NEEDED]: "As needed",
  [MedicineFrequency.BEFORE_FOOD]: "Before food",
  [MedicineFrequency.AFTER_FOOD]: "After food",
  [MedicineFrequency.BEDTIME]: "Bedtime",
};

const statusBadgeVariant: Record<string, "default" | "primary" | "teal" | "mint" | "success" | "outline" | "navy" | "warning" | "slate" | "emergency"> = {
  created: "navy",
  verified: "primary",
  confirmed: "teal",
  packing: "warning",
  out_for_delivery: "slate",
  delivered: "success",
  cancelled: "emergency",
};

const statusLabel: Record<string, string> = {
  created: "Created",
  verified: "Verified",
  confirmed: "Confirmed",
  packing: "Packing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUSES_FOR_FILTER = ["all", "created", "verified", "packing", "out_for_delivery", "delivered"] as const;

export function PharmacyDashboard() {
  const prescriptions = useCuraLivesStore((s) => s.prescriptions);
  const patients = useCuraLivesStore((s) => s.patients);
  const doctors = useCuraLivesStore((s) => s.doctors);
  const clinics = useCuraLivesStore((s) => s.clinics);
  const pharmacies = useCuraLivesStore((s) => s.pharmacies);
  const updatePrescriptionStatus = useCuraLivesStore((s) => s.updatePrescriptionStatus);

  const [filterTab, setFilterTab] = useState<(typeof STATUSES_FOR_FILTER)[number]>("all");
  const [selectedId, setSelectedId] = useState<string>("prescription-1");
  const [pharmacistNotes, setPharmacistNotes] = useState("");

  const currentPharmacy = pharmacies.find((p) => p.id === "pharmacy-1");

  const filteredPrescriptions = useMemo(() => {
    const pharmacyRxs = prescriptions.filter(
      (rx) => rx.pharmacyId === "pharmacy-1" || !rx.pharmacyId
    );
    if (filterTab === "all") return pharmacyRxs;
    return pharmacyRxs.filter((rx) => rx.status === filterTab);
  }, [prescriptions, filterTab]);

  const selectedRx = prescriptions.find((r) => r.id === selectedId) || prescriptions.find((r) => r.id === "prescription-1");

  const pendingCount = prescriptions.filter((r) => r.status === PrescriptionStatus.CREATED && (r.pharmacyId === "pharmacy-1" || !r.pharmacyId)).length;
  const outForDeliveryCount = prescriptions.filter((r) => r.status === PrescriptionStatus.OUT_FOR_DELIVERY).length;
  const deliveredTodayCount = prescriptions.filter((r) => r.status === PrescriptionStatus.DELIVERED).length;
  const revenueMock = prescriptions.reduce((sum, r) => sum + (r.finalAmount ?? r.totalAmount ?? 0), 0);

  const currentStatus = selectedRx?.status ?? PrescriptionStatus.CREATED;

  const progressSteps = [
    { id: "created", label: "Created", status: "completed" as const },
    {
      id: "verified",
      label: "Verified",
      status: ([PrescriptionStatus.VERIFIED, PrescriptionStatus.CONFIRMED, PrescriptionStatus.PACKING, PrescriptionStatus.OUT_FOR_DELIVERY, PrescriptionStatus.DELIVERED].includes(currentStatus)
        ? "completed"
        : currentStatus === PrescriptionStatus.CREATED
        ? "active"
        : "pending") as "completed" | "active" | "pending",
    },
    {
      id: "confirmed",
      label: "Confirmed",
      status: ([PrescriptionStatus.CONFIRMED, PrescriptionStatus.PACKING, PrescriptionStatus.OUT_FOR_DELIVERY, PrescriptionStatus.DELIVERED].includes(currentStatus)
        ? "completed"
        : currentStatus === PrescriptionStatus.VERIFIED
        ? "active"
        : "pending") as "completed" | "active" | "pending",
    },
    {
      id: "packing",
      label: "Packing",
      status: ([PrescriptionStatus.PACKING, PrescriptionStatus.OUT_FOR_DELIVERY, PrescriptionStatus.DELIVERED].includes(currentStatus)
        ? "completed"
        : currentStatus === PrescriptionStatus.CONFIRMED
        ? "active"
        : "pending") as "completed" | "active" | "pending",
    },
    {
      id: "out",
      label: "Out for delivery",
      status: ([PrescriptionStatus.OUT_FOR_DELIVERY, PrescriptionStatus.DELIVERED].includes(currentStatus)
        ? "completed"
        : currentStatus === PrescriptionStatus.PACKING
        ? "active"
        : "pending") as "completed" | "active" | "pending",
    },
    {
      id: "delivered",
      label: "Delivered",
      status: currentStatus === PrescriptionStatus.DELIVERED
        ? "active"
        : currentStatus === PrescriptionStatus.OUT_FOR_DELIVERY
        ? "active"
        : "pending" as "completed" | "active" | "pending",
    },
  ];

  const handleAdvanceStatus = () => {
    if (!selectedRx) return;
    const transitions: Record<PrescriptionStatus, PrescriptionStatus | null> = {
      [PrescriptionStatus.CREATED]: PrescriptionStatus.VERIFIED,
      [PrescriptionStatus.VERIFIED]: PrescriptionStatus.CONFIRMED,
      [PrescriptionStatus.CONFIRMED]: PrescriptionStatus.PACKING,
      [PrescriptionStatus.PACKING]: PrescriptionStatus.OUT_FOR_DELIVERY,
      [PrescriptionStatus.OUT_FOR_DELIVERY]: PrescriptionStatus.DELIVERED,
      [PrescriptionStatus.DELIVERED]: null,
      [PrescriptionStatus.CANCELLED]: null,
    };
    const next = transitions[selectedRx.status];
    if (next) {
      updatePrescriptionStatus({
        prescriptionId: selectedRx.id,
        status: next,
        actorName: currentPharmacy?.pharmacistNames?.[0] ?? "Wellness Pharmacy",
      });
    }
  };

  const patientForRx = (rxId: string) => {
    const rx = prescriptions.find((r) => r.id === rxId);
    if (!rx) return null;
    return patients.find((p) => p.id === rx.patientId);
  };

  const doctorForRx = (rxId: string) => {
    const rx = prescriptions.find((r) => r.id === rxId);
    if (!rx) return null;
    return doctors.find((d) => d.id === rx.doctorId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-sm text-teal font-semibold">{currentPharmacy?.name ?? "Wellness Pharmacy"}</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1">Pharmacy Dashboard</h1>
            <p className="text-slate mt-1 text-sm">Manage incoming prescriptions, verify orders, and track deliveries.</p>
          </div>
          <Button variant="secondary" size="md" onClick={() => {}}>
            <ScanLine className="h-4 w-4" />
            Scan prescription
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate">Pending verification</p>
                <p className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1">{pendingCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-tint flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate">Out for delivery</p>
                <p className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1">{outForDeliveryCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-mint-bg flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5 text-teal" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate">Delivered today</p>
                <p className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1">{deliveredTodayCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-mint-bg flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-teal" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate">Revenue (mock)</p>
                <p className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1 flex items-center gap-0.5">
                  <IndianRupee className="h-5 w-5" />
                  {revenueMock.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-tint flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Incoming orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={filterTab}
                onValueChange={(v) => setFilterTab(v as (typeof STATUSES_FOR_FILTER)[number])}
              >
                <TabsList className="flex-wrap h-auto !justify-start gap-0.5 !bg-page w-full">
                  {STATUSES_FOR_FILTER.map((st) => (
                    <TabsTrigger key={st} value={st} className="text-xs sm:text-sm px-2.5">
                      {st === "out_for_delivery" ? "Out" : st === "all" ? "All" : st.charAt(0).toUpperCase() + st.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {STATUSES_FOR_FILTER.map((st) => (
                  <TabsContent key={st} value={st}>
                    <div className="flex flex-col divide-y divide-grey -mx-2">
                      {filteredPrescriptions.length === 0 && (
                        <div className="py-8 text-center text-slate text-sm">
                          No orders in this status.
                        </div>
                      )}
                      {filteredPrescriptions.map((rx) => {
                        const pt = patientForRx(rx.id);
                        const dr = doctorForRx(rx.id);
                        const isActive = rx.id === selectedRx?.id;
                        return (
                          <button
                            key={rx.id}
                            type="button"
                            onClick={() => setSelectedId(rx.id)}
                            className={cn(
                              "w-full text-left p-3 rounded-xl transition-all min-h-[44px]",
                              isActive ? "bg-blue-tint ring-1 ring-primary/30" : "hover:bg-page"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-9 w-9 shrink-0 rounded-full bg-teal/10 flex items-center justify-center text-teal font-semibold text-sm">
                                  {pt?.firstName?.[0] ?? "P"}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-navy truncate">
                                    {pt ? `${pt.firstName} ${pt.lastName}` : "Unknown patient"}
                                  </p>
                                  <p className="text-xs text-slate truncate">
                                    {dr ? `Dr. ${dr.firstName} ${dr.lastName}` : "Unknown doctor"}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={statusBadgeVariant[rx.status] ?? "outline"} className="shrink-0">
                                {statusLabel[rx.status] ?? rx.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                              <Badge variant="navy" className="text-[10px]">
                                {rx.medicines.length} meds
                              </Badge>
                              <span className="text-[11px] text-slate">
                                {rx.totalAmount ? `₹${(rx.finalAmount ?? rx.totalAmount).toFixed(0)}` : ""}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {selectedRx ? (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base sm:text-lg">Order details</CardTitle>
                      <Badge variant="outline" className="text-[11px]">#{selectedRx.id}</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate">
                      Created {new Date(selectedRx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <Badge variant={statusBadgeVariant[selectedRx.status] ?? "outline"}>
                    {statusLabel[selectedRx.status] ?? selectedRx.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 p-4 rounded-2xl bg-page">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-tint flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-slate">Patient</p>
                      <p className="font-semibold text-navy">
                        {patientForRx(selectedRx.id)
                          ? `${patientForRx(selectedRx.id)!.firstName} ${patientForRx(selectedRx.id)!.lastName}`
                          : "—"}
                      </p>
                      <p className="text-xs text-slate">
                        Age {patientForRx(selectedRx.id)?.age ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-mint-bg flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <p className="text-xs text-slate">Doctor</p>
                      <p className="font-semibold text-navy">
                        {doctorForRx(selectedRx.id)
                          ? `Dr. ${doctorForRx(selectedRx.id)!.firstName} ${doctorForRx(selectedRx.id)!.lastName}`
                          : "—"}
                      </p>
                      <p className="text-xs text-slate">
                        {doctorForRx(selectedRx.id)?.registrations?.[0] ?? ""}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-tint flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-slate">Clinic</p>
                      <p className="font-semibold text-navy">
                        {clinics.find((c) =>
                          doctorForRx(selectedRx.id)?.clinicIds.includes(c.id)
                        )?.name ?? "Sunrise Clinic"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-navy mb-3">Prescription items</h3>
                  <div className="rounded-2xl border border-grey overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-page text-xs">
                          <tr>
                            <th className="text-left px-3 sm:px-4 py-3 font-semibold text-navy">Medicine</th>
                            <th className="text-left px-3 sm:px-4 py-3 font-semibold text-navy">Dosage</th>
                            <th className="text-left px-3 sm:px-4 py-3 font-semibold text-navy">Frequency</th>
                            <th className="text-left px-3 sm:px-4 py-3 font-semibold text-navy">Duration</th>
                            <th className="text-left px-3 sm:px-4 py-3 font-semibold text-navy">Qty</th>
                            <th className="text-left px-3 sm:px-4 py-3 font-semibold text-navy">Refills</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-grey">
                          {selectedRx.medicines.map((m, idx) => (
                            <tr key={idx}>
                              <td className="px-3 sm:px-4 py-3 font-medium text-navy align-top">{m.medicineName}</td>
                              <td className="px-3 sm:px-4 py-3 text-slate align-top">{m.dosage}</td>
                              <td className="px-3 sm:px-4 py-3 text-slate align-top">{frequencyLabel[m.frequency] ?? m.frequency}</td>
                              <td className="px-3 sm:px-4 py-3 text-slate align-top">{m.durationDays} days</td>
                              <td className="px-3 sm:px-4 py-3 text-slate align-top">{m.quantity}</td>
                              <td className="px-3 sm:px-4 py-3 align-top">
                                {m.refillAllowed ? (
                                  <Badge variant="mint">{m.maxRefills ?? 0} refills</Badge>
                                ) : (
                                  <span className="text-xs text-slate">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {selectedRx.advice && (
                  <div className="mb-5">
                    <h3 className="font-display text-base sm:text-lg font-semibold text-navy mb-2">Doctor notes</h3>
                    <div className="p-4 rounded-2xl bg-page text-sm text-navy leading-relaxed">
                      {selectedRx.advice}
                    </div>
                  </div>
                )}

                <div className="mb-5 p-4 sm:p-5 rounded-2xl border border-grey">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-navy mb-4">Order status</h3>
                  <ProgressSteps steps={progressSteps} orientation="horizontal" />
                </div>

                <div className="mb-5">
                  <Label htmlFor="pharmacist-notes" className="mb-1.5 block">
                    Pharmacist notes (optional)
                  </Label>
                  <Textarea
                    id="pharmacist-notes"
                    placeholder="Add any dispensing notes, drug interactions flagged, or substitution details..."
                    value={pharmacistNotes}
                    onChange={(e) => setPharmacistNotes(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  {currentStatus === PrescriptionStatus.CREATED && (
                    <Button variant="teal" size="lg" onClick={handleAdvanceStatus}>
                      <CheckCircle2 className="h-4 w-4" />
                      Verify order
                    </Button>
                  )}
                  {[PrescriptionStatus.VERIFIED, PrescriptionStatus.CONFIRMED].includes(currentStatus) && (
                    <Button variant="teal" size="lg" onClick={handleAdvanceStatus}>
                      <Package className="h-4 w-4" />
                      Mark packing
                    </Button>
                  )}
                  {currentStatus === PrescriptionStatus.PACKING && (
                    <Button variant="primary" size="lg" onClick={handleAdvanceStatus}>
                      <Truck className="h-4 w-4" />
                      Mark dispatched
                    </Button>
                  )}
                  {currentStatus === PrescriptionStatus.OUT_FOR_DELIVERY && (
                    <Button variant="teal" size="lg" onClick={handleAdvanceStatus}>
                      <CheckCircle2 className="h-4 w-4" />
                      Mark delivered
                    </Button>
                  )}
                  {currentStatus === PrescriptionStatus.DELIVERED && (
                    <Badge variant="success" className="h-auto py-2 px-4 text-sm">
                      Completed
                    </Badge>
                  )}
                  <Button variant="secondary" size="lg" onClick={() => {}}>
                    <ScanLine className="h-4 w-4" />
                    Scan prescription
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-slate">
                Select an order from the list to view details.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
