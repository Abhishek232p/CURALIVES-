import { useState, useMemo } from "react";
import { useCuraLivesStore } from "@/lib/curalives/store";
import { DiagnosticStatus } from "@/lib/curalives/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAIService } from "@/lib/ai";
import { AIDisclaimer } from "@/components/curalives/ai-disclaimer";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  FastForward,
  FlaskConical,
  Home,
  MapPin,
  Share2,
  Sparkles,
  Stethoscope,
  XCircle,
} from "lucide-react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

const RECOMMENDED_TESTS = [
  {
    id: "inline-test-1",
    name: "Complete Blood Count (CBC)",
    description: "Comprehensive blood panel including RBC, WBC, Platelets and Hemoglobin",
    lab: "HealthFirst Diagnostics",
    labId: "lab-1",
    tat: "TAT 4h",
    fasting: false,
    price: 350,
  },
  {
    id: "inline-test-2",
    name: "Lipid Profile",
    description: "Cholesterol panel to assess cardiovascular risk — Total, LDL, HDL, Triglycerides",
    lab: "ClearPath Labs",
    labId: "lab-2",
    tat: "TAT 12h",
    fasting: true,
    price: 900,
  },
  {
    id: "inline-test-3",
    name: "HbA1c",
    description: "3-month average blood sugar — gold standard for diabetes monitoring",
    lab: "HealthFirst Diagnostics",
    labId: "lab-1",
    tat: "TAT 8h",
    fasting: false,
    price: 700,
  },
  {
    id: "inline-test-4",
    name: "Thyroid Profile",
    description: "TSH, T3, T4 panel to assess thyroid function and metabolism",
    lab: "ClearPath Labs",
    labId: "lab-2",
    tat: "TAT 10h",
    fasting: false,
    price: 1100,
  },
  {
    id: "inline-test-5",
    name: "Liver Function Test (LFT)",
    description: "Liver enzyme panel: SGPT, SGOT, Bilirubin, Albumin, Alkaline Phosphatase",
    lab: "HealthFirst Diagnostics",
    labId: "lab-1",
    tat: "TAT 10h",
    fasting: true,
    price: 1300,
  },
  {
    id: "inline-test-6",
    name: "ECG (12-Lead)",
    description: "Standard resting ECG to assess heart rhythm, rate and conduction",
    lab: "ClearPath Labs",
    labId: "lab-2",
    tat: "TAT 30m",
    fasting: false,
    price: 450,
  },
  {
    id: "inline-test-7",
    name: "X-Ray Chest",
    description: "Digital chest radiograph to screen lungs, heart silhouette and mediastinum",
    lab: "HealthFirst Diagnostics",
    labId: "lab-1",
    tat: "TAT 2h",
    fasting: false,
    price: 800,
  },
];

const TIME_SLOTS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
];

const CBC_PARAMS = [
  { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", ref: "13 - 17", status: "normal", badge: "teal" as const },
  { parameter: "TLC (Total WBC)", value: "8,200", unit: "/cumm", ref: "4,000 - 11,000", status: "normal", badge: "teal" as const },
  { parameter: "DLC - Neutrophils", value: "62", unit: "%", ref: "40 - 70", status: "normal", badge: "teal" as const },
  { parameter: "DLC - Lymphocytes", value: "28", unit: "%", ref: "20 - 40", status: "normal", badge: "teal" as const },
  { parameter: "Platelets", value: "245,000", unit: "/cumm", ref: "150,000 - 450,000", status: "normal", badge: "teal" as const },
  { parameter: "RBC Count", value: "4.9", unit: "million/cumm", ref: "4.5 - 5.9", status: "normal", badge: "teal" as const },
  { parameter: "Hematocrit (HCT)", value: "43", unit: "%", ref: "41 - 53", status: "normal", badge: "teal" as const },
];

const LIPID_PARAMS = [
  { parameter: "Total Cholesterol", value: "238", unit: "mg/dL", ref: "< 200", status: "high", badge: "warning" as const },
  { parameter: "LDL Cholesterol", value: "158", unit: "mg/dL", ref: "< 100 (DM High Risk)", status: "high", badge: "warning" as const },
  { parameter: "HDL Cholesterol", value: "38", unit: "mg/dL", ref: "> 40 (Men)", status: "low", badge: "navy" as const },
  { parameter: "Triglycerides", value: "160", unit: "mg/dL", ref: "< 150", status: "borderline", badge: "warning" as const },
];

const STATUS_FLOW: DiagnosticStatus[] = [
  DiagnosticStatus.SCHEDULED,
  DiagnosticStatus.COLLECTED,
  DiagnosticStatus.IN_PROGRESS,
  DiagnosticStatus.REPORT_READY,
  DiagnosticStatus.COMPLETED,
];

function statusBadgeVariant(status: DiagnosticStatus): "navy" | "teal" | "primary" | "success" | "slate" | "warning" {
  switch (status) {
    case DiagnosticStatus.SCHEDULED: return "navy";
    case DiagnosticStatus.COLLECTED: return "primary";
    case DiagnosticStatus.IN_PROGRESS: return "warning";
    case DiagnosticStatus.REPORT_READY: return "teal";
    case DiagnosticStatus.COMPLETED: return "success";
    default: return "slate";
  }
}

function statusLabel(status: DiagnosticStatus): string {
  switch (status) {
    case DiagnosticStatus.SCHEDULED: return "Scheduled";
    case DiagnosticStatus.COLLECTED: return "Collected";
    case DiagnosticStatus.IN_PROGRESS: return "In_progress";
    case DiagnosticStatus.REPORT_READY: return "Report_ready";
    case DiagnosticStatus.COMPLETED: return "Completed";
    case DiagnosticStatus.CANCELLED: return "Cancelled";
    default: return status;
  }
}

function Switch({
  className,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-teal data-[state=unchecked]:bg-grey",
        className,
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export function DiagnosticsPage() {
  const {
    labs,
    diagnosticOrders,
    diagnosticTests,
    currentUserId,
    scheduleDiagnostic,
    updateDiagnosticStatus,
  } = useCuraLivesStore((s) => ({
    labs: s.labs,
    diagnosticOrders: s.diagnosticOrders,
    diagnosticTests: s.diagnosticTests,
    currentUserId: s.currentUserId,
    scheduleDiagnostic: s.scheduleDiagnostic,
    updateDiagnosticStatus: s.updateDiagnosticStatus,
  }));

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<typeof RECOMMENDED_TESTS[number] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<typeof diagnosticOrders[number] | null>(null);
  const [selectedLab, setSelectedLab] = useState<string>("");
  const [apptDate, setApptDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [homeCollection, setHomeCollection] = useState(false);
  const [clinicalIndication, setClinicalIndication] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const patientId = currentUserId ?? "patient-1";

  const scheduledOrders = useMemo(
    () => [...diagnosticOrders].filter((o) => o.status !== DiagnosticStatus.COMPLETED)
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")),
    [diagnosticOrders],
  );

  const completedOrders = useMemo(
    () => [...diagnosticOrders].filter((o) =>
      o.status === DiagnosticStatus.COMPLETED || o.status === DiagnosticStatus.REPORT_READY,
    ).sort((a, b) => (b.reportReadyAt ?? b.createdAt ?? "").localeCompare(a.reportReadyAt ?? a.createdAt ?? "")),
    [diagnosticOrders],
  );

  const homeFee = homeCollection ? 99 : 0;
  const testPrice = selectedTest?.price ?? 0;
  const totalAmount = testPrice;
  const finalAmount = totalAmount + homeFee;

  const openSchedule = (test: typeof RECOMMENDED_TESTS[number]) => {
    setSelectedTest(test);
    setSelectedLab(test.labId);
    setApptDate("");
    setSelectedTime("");
    setHomeCollection(false);
    setClinicalIndication("");
    setScheduleOpen(true);
  };

  const runAISuggest = async () => {
    setAiLoading(true);
    try {
      const ai = createAIService();
      const res = await ai.suggestTests({
        symptoms: "routine annual check-up, diabetes follow-up",
        findings: "Type 2 Diabetes, Hypertension, Dyslipidemia",
      });
      setAiSuggestions(res.tests.map((t) => `${t.name} — ${t.reason}`));
      toast.success("AI suggestions loaded");
    } catch {
      toast.error("AI suggestions unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  const confirmSchedule = () => {
    if (!selectedTest || !selectedLab || !apptDate || !selectedTime) {
      toast.error("Please fill all required fields");
      return;
    }
    const appointmentDate = `${apptDate} ${selectedTime}`;
    const lab = labs.find((l) => l.id === selectedLab);
    try {
      scheduleDiagnostic({
        patientId,
        labId: selectedLab,
        testIds: [selectedTest.id],
        tests: [{ testId: selectedTest.id, testName: selectedTest.name, price: selectedTest.price }],
        clinicalIndication: clinicalIndication || undefined,
        appointmentDate,
        sampleCollectionType: homeCollection ? "home" : "lab",
        sampleCollectionAddress: homeCollection ? {
          line1: "Apt 304, Green Heights",
          line2: "Linking Road, Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
          country: "India",
        } : undefined,
        totalAmount,
        finalAmount,
        paymentStatus: "paid",
      });
      toast.success(`${selectedTest.name} scheduled with ${lab?.name ?? "lab"} on ${apptDate}`);
      setScheduleOpen(false);
    } catch (e) {
      toast.error("Failed to schedule. Please try again.");
    }
  };

  const advancePipeline = (order: typeof diagnosticOrders[number]) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    updateDiagnosticStatus({
      orderId: order.id,
      status: next,
      actorId: "lab-1",
      actorName: "Lab Pipeline Simulator",
    });
    toast.success(`Order ${order.id} → ${statusLabel(next)}`);
  };

  const openReport = (order: typeof diagnosticOrders[number]) => {
    setSelectedOrder(order);
    setReportOpen(true);
  };

  const reportParams = useMemo(() => {
    if (!selectedOrder) return [];
    const name = selectedOrder.tests[0]?.testName ?? "";
    if (name.includes("CBC") || name.includes("Blood")) return CBC_PARAMS;
    if (name.includes("Lipid")) return LIPID_PARAMS;
    return CBC_PARAMS;
  }, [selectedOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Toaster richColors position="top-right" />
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="h-6 w-6 text-teal" />
          <Badge variant="mint" className="text-xs">Diagnostics Hub</Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-navy mb-2">
          Diagnostics &amp; Lab Tests
        </h1>
        <p className="text-slate max-w-2xl text-base sm:text-lg">
          Scheduled, collected and returned — all flowing into your record automatically.
        </p>
      </header>

      <AIDisclaimer variant="test" className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span>AI can recommend tests based on age, conditions and history. Always verify with a clinician.</span>
          <Button
            variant="teal"
            size="sm"
            onClick={runAISuggest}
            disabled={aiLoading}
            className="shrink-0 min-h-[44px]"
          >
            <Sparkles className="h-4 w-4" />
            {aiLoading ? "Thinking…" : "Suggest tests (AI)"}
          </Button>
        </div>
        {aiSuggestions.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-navy">
            {aiSuggestions.map((s, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        )}
      </AIDisclaimer>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md h-auto">
          <TabsTrigger value="recommended" className="min-h-[44px]">
            <ClipboardList className="h-4 w-4 mr-2" />
            Recommended
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="min-h-[44px]">
            <CalendarClock className="h-4 w-4 mr-2" />
            Scheduled
            {scheduledOrders.length > 0 && (
              <Badge variant="navy" className="ml-2 px-2 py-0">{scheduledOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="results" className="min-h-[44px]">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECOMMENDED_TESTS.map((t) => (
              <Card key={t.id} className="hover:shadow-md transition-shadow border-grey">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                      {t.lab === "HealthFirst Diagnostics" ? "NABL · Mumbai" : "JCI · Bengaluru"}
                    </Badge>
                    <Badge variant="navy" className="shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {t.tat.replace("TAT ", "")}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-snug">{t.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed mt-1">
                    {t.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <Badge variant={t.fasting ? "warning" : "mint"}>
                      Fasting {t.fasting ? "Required" : "Not required"}
                    </Badge>
                    <Badge variant="outline">{t.lab}</Badge>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate">Price</p>
                      <p className="font-display text-2xl font-bold text-navy">₹{t.price}</p>
                    </div>
                    <Dialog open={scheduleOpen && selectedTest?.id === t.id} onOpenChange={(o) => !o && setScheduleOpen(false)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => openSchedule(t)}
                          className="min-h-[44px]"
                        >
                          <CalendarClock className="h-4 w-4" />
                          Schedule
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          {scheduledOrders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <FlaskConical className="h-12 w-12 text-slate mx-auto mb-3 opacity-40" />
                <p className="text-navy font-semibold mb-1">No tests scheduled yet</p>
                <p className="text-slate text-sm">Browse the Recommended tab to book your first test.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {scheduledOrders.map((order) => {
                const lab = labs.find((l) => l.id === order.labId);
                return (
                  <Card key={order.id}>
                    <CardContent className="py-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant={statusBadgeVariant(order.status)}>
                              {statusLabel(order.status)}
                            </Badge>
                            <span className="text-xs text-slate">{order.id}</span>
                          </div>
                          <h3 className="font-semibold text-navy text-base mb-1">
                            {order.tests.map((t) => t.testName).join(" + ")}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate">
                            <span className="flex items-center gap-1">
                              <FlaskConical className="h-3.5 w-3.5" />
                              {lab?.name ?? order.labId}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarClock className="h-3.5 w-3.5" />
                              {order.appointmentDate ?? "—"}
                            </span>
                            <span className="flex items-center gap-1">
                              {order.sampleCollectionType === "home" ? (
                                <><Home className="h-3.5 w-3.5" /> Home collection</>
                              ) : (
                                <><MapPin className="h-3.5 w-3.5" /> Visit lab</>
                              )}
                            </span>
                            <span className="font-semibold text-navy">₹{order.finalAmount}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {order.status === DiagnosticStatus.SCHEDULED && (
                            <Button variant="ghost" size="sm" className="min-h-[44px]" onClick={() => toast.info("Cancelled (demo)")}>
                              <XCircle className="h-4 w-4" />
                              Cancel
                            </Button>
                          )}
                          {(order.status === DiagnosticStatus.REPORT_READY || order.status === DiagnosticStatus.COMPLETED) && (
                            <Button variant="teal" size="sm" className="min-h-[44px]" onClick={() => openReport(order)}>
                              <ClipboardList className="h-4 w-4" />
                              View report
                            </Button>
                          )}
                          {order.status !== DiagnosticStatus.COMPLETED && order.status !== DiagnosticStatus.CANCELLED && (
                            <Button variant="secondary" size="sm" className="min-h-[44px]" onClick={() => advancePipeline(order)}>
                              <FastForward className="h-4 w-4" />
                              Advance pipeline
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="results">
          {completedOrders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-slate mx-auto mb-3 opacity-40" />
                <p className="text-navy font-semibold mb-1">No results yet</p>
                <p className="text-slate text-sm">Scheduled tests will appear here once the lab publishes the report.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-page text-slate">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Test</th>
                      <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Date</th>
                      <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Lab</th>
                      <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                      <th className="text-right px-6 py-4 font-semibold whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grey">
                    {completedOrders.map((order) => {
                      const lab = labs.find((l) => l.id === order.labId);
                      return (
                        <tr key={order.id} className="hover:bg-page/50">
                          <td className="px-6 py-4 font-medium text-navy whitespace-nowrap">
                            {order.tests.map((t) => t.testName).join(", ")}
                          </td>
                          <td className="px-6 py-4 text-slate whitespace-nowrap">
                            {order.reportReadyAt?.slice(0, 10) ?? order.appointmentDate ?? "—"}
                          </td>
                          <td className="px-6 py-4 text-slate whitespace-nowrap">{lab?.name ?? order.labId}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="teal">Report ready</Badge>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <Button variant="primary" size="sm" onClick={() => openReport(order)} className="min-h-[44px]">
                              <ClipboardList className="h-4 w-4" />
                              View report
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Schedule {selectedTest?.name}
            </DialogTitle>
            <DialogDescription>
              Choose a lab, time slot and collection preference. Home collection adds ₹99.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lab partner *</Label>
                <Select value={selectedLab} onValueChange={setSelectedLab}>
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue placeholder="Select lab" />
                  </SelectTrigger>
                  <SelectContent>
                    {labs.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name} ({l.address.city}) — {l.accreditation[0] ?? "Certified"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diag-date">Appointment date *</Label>
                <Input
                  id="diag-date"
                  type="date"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time slot *</Label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {TIME_SLOTS.map((ts) => (
                  <button
                    key={ts}
                    type="button"
                    onClick={() => setSelectedTime(ts)}
                    className={cn(
                      "min-h-[44px] rounded-lg border text-xs font-semibold transition-colors",
                      selectedTime === ts
                        ? "border-teal bg-teal text-white"
                        : "border-grey bg-white text-navy hover:border-primary hover:text-primary",
                    )}
                  >
                    {ts}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-grey p-4 bg-page/40">
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-navy">Home collection</p>
                  <p className="text-xs text-slate">Phlebotomist visits your address. Adds ₹99.</p>
                </div>
              </div>
              <Switch checked={homeCollection} onCheckedChange={setHomeCollection} />
            </div>

            {homeCollection && (
              <div className="rounded-xl border border-mint/50 bg-mint-bg/40 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-navy mb-0.5">Collection address</p>
                    <p className="text-slate leading-relaxed">
                      Apt 304, Green Heights, Linking Road, Bandra West, Mumbai — 400050
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="diag-indication">Clinical indication <span className="text-slate font-normal">(optional)</span></Label>
              <Textarea
                id="diag-indication"
                placeholder="e.g. Routine annual check-up, post-medication review, etc."
                value={clinicalIndication}
                onChange={(e) => setClinicalIndication(e.target.value)}
                className="min-h-[88px]"
              />
            </div>

            <div className="rounded-xl border border-grey p-4 space-y-2 bg-page/40">
              <div className="flex justify-between text-sm text-slate">
                <span>{selectedTest?.name} ({selectedLab ? labs.find(l => l.id === selectedLab)?.name ?? "Lab" : "Lab"})</span>
                <span>₹{testPrice}</span>
              </div>
              {homeCollection && (
                <div className="flex justify-between text-sm text-slate">
                  <span>Home collection fee</span>
                  <span>₹{homeFee}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-grey">
                <span className="font-semibold text-navy">Total</span>
                <span className="font-display text-xl font-bold text-navy">₹{finalAmount}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setScheduleOpen(false)} className="min-h-[44px] sm:order-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmSchedule} className="min-h-[44px]">
              <Stethoscope className="h-4 w-4" />
              Confirm &amp; Pay ₹{finalAmount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-teal" />
              Diagnostic Report
            </DialogTitle>
            <DialogDescription>
              {selectedOrder
                ? `${selectedOrder.tests.map((t) => t.testName).join(" + ")} · ${selectedOrder.id}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-grey p-4">
                  <p className="text-xs text-slate mb-1 uppercase tracking-wider font-semibold">Patient</p>
                  <p className="font-semibold text-navy">Aditya Kapoor · 34 / Male · B+</p>
                  <p className="text-xs text-slate mt-1">patient-1</p>
                </div>
                <div className="rounded-xl border border-grey p-4">
                  <p className="text-xs text-slate mb-1 uppercase tracking-wider font-semibold">Order</p>
                  <p className="font-semibold text-navy">{selectedOrder.id}</p>
                  <p className="text-xs text-slate mt-1">
                    Reported {selectedOrder.reportReadyAt?.slice(0, 10) ?? "—"}
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Results</CardTitle>
                  <CardDescription>Parameters with reference ranges and interpretation</CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-page text-slate">
                      <tr>
                        <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Parameter</th>
                        <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Value</th>
                        <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Reference</th>
                        <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-grey">
                      {reportParams.map((r, i) => (
                        <tr key={i}>
                          <td className="px-5 py-3 font-medium text-navy whitespace-nowrap">{r.parameter}</td>
                          <td className="px-5 py-3 text-navy whitespace-nowrap">
                            {r.value} <span className="text-slate text-xs">{r.unit}</span>
                          </td>
                          <td className="px-5 py-3 text-slate whitespace-nowrap">{r.ref}</td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            <Badge variant={r.badge}>{r.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <div className="rounded-xl border border-blue-tint bg-blue-tint/50 p-4 text-sm">
                <p className="text-xs text-slate uppercase tracking-wider font-semibold mb-1">
                  Doctor comment
                </p>
                <p className="text-navy">
                  <span className="font-semibold">Reviewed by Dr. Aarav Sharma</span> — Key values discussed at
                  next visit. Lipid targets not yet met; continue statin and DASH diet.
                </p>
              </div>

              <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
                <Button variant="secondary" className="min-h-[44px] sm:order-1" onClick={() => toast.success("Shared with Dr. Aarav Sharma (demo)")}>
                  <Share2 className="h-4 w-4" />
                  Share with current doctor
                </Button>
                <Button variant="primary" className="min-h-[44px]" onClick={() => toast.success("PDF download started (demo)")}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
