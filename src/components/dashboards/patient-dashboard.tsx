import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Download,
  FileText,
  Pill,
  Stethoscope,
  Video,
  ChevronRight,
  Activity,
  Heart,
  Ruler,
  Scale,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { useCuraLivesStore } from "@/lib/curalives/store";
import { CareTimeline } from "@/components/curalives/care-timeline";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MedicineFrequency, PrescriptionStatus } from "@/lib/curalives/types";

const frequencyLabel: Record<MedicineFrequency, string> = {
  once_daily: "1-0-0",
  twice_daily: "1-0-1",
  thrice_daily: "1-1-1",
  four_times_daily: "1-1-1-1",
  every_6_hours: "Every 6h",
  every_8_hours: "Every 8h",
  every_12_hours: "Every 12h",
  as_needed: "SOS",
  before_food: "Before food",
  after_food: "After food",
  bedtime: "Bedtime",
};

const fulfillmentBadge: Record<PrescriptionStatus, { variant: any; label: string }> = {
  created: { variant: "outline", label: "Created" },
  verified: { variant: "navy", label: "Verified" },
  confirmed: { variant: "mint", label: "Confirmed" },
  packing: { variant: "primary", label: "Packing" },
  out_for_delivery: { variant: "navy", label: "Out for delivery" },
  delivered: { variant: "success", label: "Delivered" },
  cancelled: { variant: "slate", label: "Cancelled" },
};

export function PatientDashboard() {
  const patients = useCuraLivesStore((s) => s.patients);
  const doctors = useCuraLivesStore((s) => s.doctors);
  const clinics = useCuraLivesStore((s) => s.clinics);
  const appointments = useCuraLivesStore((s) => s.appointments);
  const prescriptions = useCuraLivesStore((s) => s.prescriptions);
  const diagnosticOrders = useCuraLivesStore((s) => s.diagnosticOrders);
  const diagnosticResults = useCuraLivesStore((s) => s.diagnosticResults);
  const careJourneyEvents = useCuraLivesStore((s) => s.careJourneyEvents);
  const followUps = useCuraLivesStore((s) => s.followUps);
  const healthRecords = useCuraLivesStore((s) => s.healthRecords);
  const labs = useCuraLivesStore((s) => s.labs);

  const patient = patients[0];
  const patientEvents = careJourneyEvents.filter((e) => e.patientId === "patient-1");
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === "patient-1");
  const patientAppointments = appointments.filter((a) => a.patientId === "patient-1");
  const upcomingAppointment = patientAppointments.find((a) => a.id === "appointment-1");
  const recentConsult = patientAppointments.find((a) => a.id === "appointment-2");
  const scheduledOrders = diagnosticOrders.filter(
    (o) => o.patientId === "patient-1" && o.status === "scheduled"
  );
  const patientRecords = healthRecords.filter((r) => r.patientId === "patient-1");
  const patientFollowUps = followUps.filter((f) => f.patientId === "patient-1");
  const nextFollowUp = patientFollowUps[0];

  const appointmentDoctor = upcomingAppointment
    ? doctors.find((d) => d.id === upcomingAppointment.doctorId)
    : null;
  const appointmentClinic = upcomingAppointment
    ? clinics.find((c) => c.id === upcomingAppointment.clinicId)
    : null;
  const consultDoctor = recentConsult
    ? doctors.find((d) => d.id === recentConsult.doctorId)
    : null;

  const hba1cResult = diagnosticResults.find((r) => r.testId === "test-2");
  const lipidResult = diagnosticResults.find((r) => r.testId === "test-3");
  const hba1cValue = hba1cResult?.results.find((r) => r.parameter.includes("HbA1c"));
  const ldlValue = lipidResult?.results.find((r) => r.parameter.includes("LDL"));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-bold">AK</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="font-display text-2xl font-semibold text-navy leading-tight">
                    {patient?.firstName} {patient?.lastName}
                  </h1>
                  <Badge variant="teal">Under active care</Badge>
                </div>
                <p className="mt-1 text-sm text-slate">
                  {patient?.age} yrs · {patient?.gender === "male" ? "Male" : patient?.gender === "female" ? "Female" : "Other"} · {patient?.bloodGroup}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-tint px-3 py-1 text-xs font-semibold text-primary">
                    <Ruler className="h-3 w-3" />
                    {patient?.height}cm
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-bg px-3 py-1 text-xs font-semibold text-teal">
                    <Scale className="h-3 w-3" />
                    {patient?.weight}kg
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-100">
                    <Heart className="h-3 w-3" />
                    BP 138/88
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-teal" />
                  Care journey
                </CardTitle>
                <CardDescription>Track every step of your care plan</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate">
                <Link to="/consent" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline h-11 px-3 rounded-lg">
                  Consent
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/diagnostics" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline h-11 px-3 rounded-lg">
                  Diagnostics
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CareTimeline events={patientEvents} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Recent consultation
            </CardTitle>
            <CardDescription>
              {recentConsult ? new Date(recentConsult.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>
                  {consultDoctor ? `${consultDoctor.firstName[0]}${consultDoctor.lastName[0]}` : "DS"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy">
                  {consultDoctor ? `Dr. ${consultDoctor.firstName} ${consultDoctor.lastName}` : "Dr. Aarav Sharma"}
                </p>
                <p className="text-xs text-slate">{consultDoctor?.specialty ?? "General Medicine"}</p>
                <p className="mt-3 text-sm text-navy/90 leading-relaxed">
                  Review of blood glucose and BP control; titration of oral hypoglycemics. Referral for cardiac workup.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="md" className="h-11">
              View notes
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-primary/30 bg-gradient-to-br from-blue-tint/50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-display text-xl font-bold text-navy">
                {upcomingAppointment ? new Date(upcomingAppointment.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "5 Sep 2026"}
              </p>
              <p className="text-sm text-slate mt-0.5">
                {upcomingAppointment?.startTime ?? "10:30 AM"} ·{" "}
                {upcomingAppointment?.type === "video" ? "Video Consult" : upcomingAppointment?.type === "in_clinic" ? "In-clinic" : "Home visit"}
              </p>
            </div>
            <div className="flex items-center gap-3 py-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs">
                  {appointmentDoctor ? `${appointmentDoctor.firstName[0]}${appointmentDoctor.lastName[0]}` : "AS"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-navy">
                  {appointmentDoctor ? `Dr. ${appointmentDoctor.firstName} ${appointmentDoctor.lastName}` : "Dr. Aarav Sharma"}
                </p>
                <p className="text-xs text-slate">{appointmentClinic?.name ?? "Sunrise Clinic"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 border border-grey/60">
              <span className="text-xs text-slate">Consultation fee</span>
              <span className="text-sm font-bold text-navy">
                ₹{upcomingAppointment?.consultationFees ?? 600}{" "}
                <Badge variant="mint" className="ml-1">{upcomingAppointment?.paymentStatus === "paid" ? "Paid" : "Pending"}</Badge>
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="primary" size="md" className="w-full h-11">
              <Video className="h-4 w-4" />
              Join video call
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Pill className="h-4 w-4 text-teal" />
              Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientPrescriptions.slice(0, 3).map((rx) => {
              const fb = fulfillmentBadge[rx.status];
              return (
                <div key={rx.id} className="rounded-xl border border-grey p-3 hover:border-teal/40 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy line-clamp-1">
                        {rx.medicines.map((m) => m.medicineName).join(", ")}
                      </p>
                      <p className="mt-1 text-xs text-slate">
                        {rx.medicines.length} medicine{rx.medicines.length > 1 ? "s" : ""} · {rx.medicines[0]?.durationDays ?? 30}d
                      </p>
                      {rx.medicines[0] && (
                        <p className="mt-1 text-xs text-navy/70">
                          {rx.medicines[0].dosage} · {frequencyLabel[rx.medicines[0].frequency] ?? rx.medicines[0].frequency}
                        </p>
                      )}
                    </div>
                    <Badge variant={fb.variant}>{fb.label}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledOrders.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate mb-2">Scheduled</p>
                <div className="space-y-2">
                  {scheduledOrders.map((ord) => {
                    const lab = labs.find((l) => l.id === ord.labId);
                    return (
                      <div key={ord.id} className="rounded-xl border border-grey p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-navy">
                              {ord.tests.map((t) => t.testName.split(" ")[0]).join(" + ")}
                            </p>
                            <p className="mt-0.5 text-xs text-slate">
                              {ord.appointmentDate ? new Date(ord.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "6 Sep"} ·{" "}
                              {lab?.name ?? "ClearPath Labs"}
                            </p>
                          </div>
                          <Badge variant="navy">{ord.tests.length} tests</Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2 w-full h-9 text-xs">
                          View details
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(hba1cResult || lipidResult) && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate mb-2">Recent results</p>
                <div className="space-y-2">
                  {hba1cValue && (
                    <div className="rounded-xl border border-grey p-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-navy">HbA1c</p>
                        <p className="text-xs text-slate mt-0.5">3-month average glucose</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy">{hba1cValue.value}%</span>
                        <Badge variant="warning">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          High
                        </Badge>
                      </div>
                    </div>
                  )}
                  {ldlValue && (
                    <div className="rounded-xl border border-grey p-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-navy">Lipid Profile · LDL</p>
                        <p className="text-xs text-slate mt-0.5">Cardiac risk panel</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy">{ldlValue.value} mg/dL</span>
                        <Badge variant="warning">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          High
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-teal" />
              Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-mint-bg/60 border border-mint/30 p-3">
              <p className="text-sm font-bold text-teal">
                {nextFollowUp?.scheduledDate
                  ? new Date(nextFollowUp.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "Sep 5 2026"}
              </p>
              <p className="text-xs text-navy/80 mt-0.5">
                {consultDoctor ? `Dr. ${consultDoctor.firstName} ${consultDoctor.lastName}` : "Dr. Sharma"}
              </p>
              <p className="mt-2 text-sm text-navy/90">
                {nextFollowUp?.title ?? "Review reports + titration"}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-grey px-3 py-2.5">
              <span className="text-sm font-semibold text-navy">Reminder 2 days before</span>
              <button
                type="button"
                role="switch"
                aria-checked={true}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  "bg-teal"
                )}
              >
                <span className="pointer-events-none inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white shadow ring-0 transition-transform" />
              </button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="md" className="w-full h-11">
              <Link to="/follow-up">
                View plan
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-navy" />
                Health records
              </span>
              <Badge variant="navy">{patientRecords.length || 12} records</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(patientRecords.length ? patientRecords.slice(0, 3) : [
              { id: "r1", title: "Annual Vitals Panel", type: "vitals", recordedAt: "2026-08-20T14:10:00.000Z" },
              { id: "r2", title: "Annual Health Package - Aug 2026", type: "lab_report", recordedAt: "2026-08-26T16:00:00.000Z" },
              { id: "r3", title: "Prescription - 20 Aug 2026", type: "prescription", recordedAt: "2026-08-20T15:12:00.000Z" },
            ] as any[]).map((rec: any) => (
              <button
                key={rec.id}
                type="button"
                className="w-full flex items-center gap-3 rounded-xl border border-grey p-3 text-left hover:border-teal/40 hover:bg-blue-tint/20 transition-all"
              >
                <div className="h-9 w-9 rounded-lg bg-blue-tint flex items-center justify-center shrink-0">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy truncate">{rec.title}</p>
                  <p className="text-xs text-slate mt-0.5">
                    {rec.recordedAt
                      ? new Date(rec.recordedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : ""}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate shrink-0" />
              </button>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="md" className="w-full h-11">
              View all records
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
