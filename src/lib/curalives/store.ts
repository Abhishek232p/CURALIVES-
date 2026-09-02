import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import {
  MOCK_APPOINTMENTS,
  MOCK_CARE_JOURNEY_EVENTS,
  MOCK_CLINICS,
  MOCK_CONSENT_AUDIT_ENTRIES,
  MOCK_DIAGNOSTIC_ORDERS,
  MOCK_DIAGNOSTIC_RESULTS,
  MOCK_DOCTORS,
  MOCK_FOLLOW_UPS,
  MOCK_HEALTH_RECORDS,
  MOCK_LABS,
  MOCK_MEDICINES,
  MOCK_NOTIFICATIONS,
  MOCK_PATIENTS,
  MOCK_PHARMACIES,
  MOCK_PRESCRIPTIONS,
  MOCK_DIAGNOSTIC_TESTS,
} from "./mock-data";
import { MedicineFrequency } from "./types";
import {
  Appointment,
  AppointmentStatus,
  CareJourneyEvent,
  CareJourneyStage,
  ConsentAction,
  ConsentAuditEntry,
  ConsentScope,
  DiagnosticOrder,
  DiagnosticStatus,
  FollowUp,
  FollowUpStatus,
  Patient,
  Prescription,
  PrescriptionMedicine,
  PrescriptionStatus,
  UserRole,
} from "./types";

type CuraLabsState = {
  patients: Patient[];
  doctors: typeof MOCK_DOCTORS;
  clinics: typeof MOCK_CLINICS;
  pharmacies: typeof MOCK_PHARMACIES;
  medicines: typeof MOCK_MEDICINES;
  diagnosticTests: typeof import("./mock-data").MOCK_DIAGNOSTIC_TESTS;
  labs: typeof MOCK_LABS;
  appointments: Appointment[];
  prescriptions: Prescription[];
  diagnosticOrders: DiagnosticOrder[];
  diagnosticResults: typeof MOCK_DIAGNOSTIC_RESULTS;
  careJourneyEvents: CareJourneyEvent[];
  followUps: FollowUp[];
  consentAuditEntries: ConsentAuditEntry[];
  notifications: typeof MOCK_NOTIFICATIONS;
  healthRecords: typeof MOCK_HEALTH_RECORDS;

  currentUserId: string | null;
  currentRole: UserRole;
  selectedPatientId: string | null;
  tempSelectedSpecialty: string | null;
};

type CuraLabsActions = {
  bookAppointment: (payload: {
    patientId: string;
    doctorId: string;
    clinicId: string;
    type: "in_clinic" | "video" | "home_visit";
    date: string;
    startTime: string;
    endTime: string;
    chiefComplaint: string;
    symptoms?: string[];
    consultationFees: number;
    paymentStatus?: "pending" | "paid" | "refunded";
    paymentMethod?: string;
  }) => Appointment;

  completeConsultation: (payload: {
    appointmentId: string;
    consultationNotes?: string;
    diagnosis?: string;
  }) => Appointment;

  createPrescription: (payload: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    pharmacyId?: string;
    diagnosis: string;
    chiefComplaint?: string;
    advice?: string;
    dietaryRestrictions?: string[];
    lifestyleChanges?: string[];
    investigationsAdvised?: string[];
    deliveryAddress?: import("./types").Address;
  }) => Prescription;

  addMedicineToPrescription: (payload: {
    prescriptionId: string;
    medicine: PrescriptionMedicine;
  }) => Prescription;

  updatePrescriptionStatus: (payload: {
    prescriptionId: string;
    status: PrescriptionStatus;
    actorId?: string;
    actorName?: string;
  }) => Prescription;

  scheduleDiagnostic: (payload: {
    patientId: string;
    doctorId?: string;
    prescribedBy?: string;
    labId: string;
    testIds: string[];
    tests: Array<{ testId: string; testName: string; price: number }>;
    clinicalIndication?: string;
    appointmentDate: string;
    sampleCollectionType: "home" | "lab";
    sampleCollectionAddress?: import("./types").Address;
    totalAmount: number;
    discountAmount?: number;
    finalAmount: number;
    paymentStatus?: "pending" | "paid" | "refunded";
  }) => DiagnosticOrder;

  updateDiagnosticStatus: (payload: {
    orderId: string;
    status: DiagnosticStatus;
    actorId?: string;
    actorName?: string;
  }) => DiagnosticOrder;

  addFollowUp: (payload: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    originalAppointmentId?: string;
    title: string;
    description?: string;
    scheduledDate: string;
    reminderDaysBefore?: number;
    priority?: "routine" | "important" | "urgent";
  }) => FollowUp;

  updateFollowUpStatus: (payload: {
    followUpId: string;
    status: FollowUpStatus;
    completedNotes?: string;
    reasonForCancel?: string;
  }) => FollowUp;

  grantConsent: (payload: {
    patientId: string;
    consentRequestId?: string;
    scopes: ConsentScope;
    actorId: string;
    actorRole: UserRole;
    actorName: string;
    purpose?: string;
    dataAccessed?: string[];
    notes?: string;
  }) => ConsentAuditEntry;

  revokeConsent: (payload: {
    patientId: string;
    consentRequestId?: string;
    scopes: ConsentScope;
    actorId: string;
    actorRole: UserRole;
    actorName: string;
    purpose?: string;
    notes?: string;
  }) => ConsentAuditEntry;

  addTimelineEvent: (payload: {
    patientId: string;
    stage: CareJourneyStage;
    title: string;
    description?: string;
    actorId?: string;
    actorRole?: UserRole;
    actorName?: string;
    referenceId?: string;
    referenceType?: "appointment" | "prescription" | "diagnostic" | "followup" | "consent";
    metadata?: Record<string, unknown>;
  }) => CareJourneyEvent;

  switchRole: (role: UserRole, userId?: string) => void;
  setTempSelectedSpecialty: (specialty: string | null) => void;
  setSelectedPatientId: (patientId: string | null) => void;
};

export type CuraLivesStore = CuraLabsState & CuraLabsActions;

const initialState: CuraLabsState = {
  patients: MOCK_PATIENTS,
  doctors: MOCK_DOCTORS,
  clinics: MOCK_CLINICS,
  pharmacies: MOCK_PHARMACIES,
  medicines: MOCK_MEDICINES,
  diagnosticTests: MOCK_DIAGNOSTIC_TESTS,
  labs: MOCK_LABS,
  appointments: MOCK_APPOINTMENTS,
  prescriptions: MOCK_PRESCRIPTIONS,
  diagnosticOrders: MOCK_DIAGNOSTIC_ORDERS,
  diagnosticResults: MOCK_DIAGNOSTIC_RESULTS,
  careJourneyEvents: MOCK_CARE_JOURNEY_EVENTS,
  followUps: MOCK_FOLLOW_UPS,
  consentAuditEntries: MOCK_CONSENT_AUDIT_ENTRIES,
  notifications: MOCK_NOTIFICATIONS,
  healthRecords: MOCK_HEALTH_RECORDS,
  currentUserId: "patient-1",
  currentRole: UserRole.PATIENT,
  selectedPatientId: null,
  tempSelectedSpecialty: null,
};

const nextId = (prefix: string, existing: { id: string }[]) => {
  const nums = existing
    .map((e) => {
      const m = e.id.match(new RegExp(`^${prefix}-(\\d+)$`));
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 0;
  return `${prefix}-${max + 1}`;
};

const nowISO = () => new Date().toISOString();

export const useCuraLivesStore = create<CuraLivesStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      bookAppointment: (payload) => {
        const schema = z.object({
          patientId: z.string().min(1),
          doctorId: z.string().min(1),
          clinicId: z.string().min(1),
          type: z.enum(["in_clinic", "video", "home_visit"]),
          date: z.string().min(1),
          startTime: z.string().min(1),
          endTime: z.string().min(1),
          chiefComplaint: z.string().min(1),
          symptoms: z.array(z.string()).optional(),
          consultationFees: z.number().positive(),
          paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
          paymentMethod: z.string().optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const id = nextId("appointment", state.appointments);
        const appointment: Appointment = {
          id,
          patientId: p.patientId,
          doctorId: p.doctorId,
          clinicId: p.clinicId,
          type: p.type,
          date: p.date,
          startTime: p.startTime,
          endTime: p.endTime,
          status: AppointmentStatus.SCHEDULED,
          chiefComplaint: p.chiefComplaint,
          symptoms: p.symptoms ?? [],
          consultationFees: p.consultationFees,
          paymentStatus: p.paymentStatus ?? "pending",
          paymentMethod: p.paymentMethod,
          createdAt: nowISO(),
        };

        const doctor = state.doctors.find((d) => d.id === p.doctorId);
        const clinic = state.clinics.find((c) => c.id === p.clinicId);
        const clinicName = clinic?.name;
        const event = get().addTimelineEvent({
          patientId: p.patientId,
          stage: CareJourneyStage.APPOINTMENT_BOOKED,
          title: `Appointment booked with Dr. ${doctor ? `${doctor.firstName} ${doctor.lastName}` : p.doctorId}`,
          description: `${p.type === "in_clinic" ? "In-clinic" : p.type === "video" ? "Video" : "Home visit"} consultation${clinicName ? ` at ${clinicName}` : ""} on ${p.date} at ${p.startTime}`,
          actorId: state.currentUserId ?? undefined,
          actorRole: state.currentRole,
          actorName: "Patient",
          referenceId: id,
          referenceType: "appointment",
          metadata: { clinicName, fees: p.consultationFees, doctorId: p.doctorId },
        });

        set({
          appointments: [...state.appointments, appointment],
          careJourneyEvents: [...state.careJourneyEvents, event],
        });
        return appointment;
      },

      completeConsultation: (payload) => {
        const schema = z.object({
          appointmentId: z.string().min(1),
          consultationNotes: z.string().optional(),
          diagnosis: z.string().optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const appointments = state.appointments.map((a) => {
          if (a.id !== p.appointmentId) return a;
          return {
            ...a,
            status: AppointmentStatus.COMPLETED,
            consultationNotes: p.consultationNotes ?? a.consultationNotes,
            diagnosis: p.diagnosis ?? a.diagnosis,
          };
        });
        const updated = appointments.find((a) => a.id === p.appointmentId)!;

        const doctor = state.doctors.find((d) => d.id === updated.doctorId);
        const event = get().addTimelineEvent({
          patientId: updated.patientId,
          stage: CareJourneyStage.CONSULTATION_COMPLETED,
          title: `Consultation completed${doctor ? ` with Dr. ${doctor.firstName} ${doctor.lastName}` : ""}`,
          description: p.diagnosis ? `Diagnosis: ${p.diagnosis}` : undefined,
          actorId: updated.doctorId,
          actorRole: UserRole.DOCTOR,
          actorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Doctor",
          referenceId: p.appointmentId,
          referenceType: "appointment",
        });

        set({
          appointments,
          careJourneyEvents: [...state.careJourneyEvents, event],
        });
        return updated;
      },

      createPrescription: (payload) => {
        const schema = z.object({
          patientId: z.string().min(1),
          doctorId: z.string().min(1),
          appointmentId: z.string().optional(),
          pharmacyId: z.string().optional(),
          diagnosis: z.string().min(1),
          chiefComplaint: z.string().optional(),
          advice: z.string().optional(),
          dietaryRestrictions: z.array(z.string()).optional(),
          lifestyleChanges: z.array(z.string()).optional(),
          investigationsAdvised: z.array(z.string()).optional(),
          deliveryAddress: z
            .object({
              line1: z.string(),
              line2: z.string().optional(),
              city: z.string(),
              state: z.string(),
              pincode: z.string(),
              country: z.string(),
            })
            .optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const id = nextId("prescription", state.prescriptions);
        const prescription: Prescription = {
          id,
          patientId: p.patientId,
          doctorId: p.doctorId,
          appointmentId: p.appointmentId,
          pharmacyId: p.pharmacyId,
          diagnosis: p.diagnosis,
          chiefComplaint: p.chiefComplaint,
          medicines: [],
          advice: p.advice,
          dietaryRestrictions: p.dietaryRestrictions ?? [],
          lifestyleChanges: p.lifestyleChanges ?? [],
          investigationsAdvised: p.investigationsAdvised ?? [],
          status: PrescriptionStatus.CREATED,
          createdAt: nowISO(),
          deliveryAddress: p.deliveryAddress,
          paymentStatus: "pending",
        };

        const doctor = state.doctors.find((d) => d.id === p.doctorId);
        const event = get().addTimelineEvent({
          patientId: p.patientId,
          stage: CareJourneyStage.PRESCRIPTION_GENERATED,
          title: "Prescription generated",
          description: `Diagnosis: ${p.diagnosis}${p.investigationsAdvised?.length ? ` | Investigations advised: ${p.investigationsAdvised.join(", ")}` : ""}`,
          actorId: p.doctorId,
          actorRole: UserRole.DOCTOR,
          actorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Doctor",
          referenceId: id,
          referenceType: "prescription",
        });

        set({
          prescriptions: [...state.prescriptions, prescription],
          careJourneyEvents: [...state.careJourneyEvents, event],
        });
        return prescription;
      },

      addMedicineToPrescription: (payload) => {
        const schema = z.object({
          prescriptionId: z.string().min(1),
          medicine: z.object({
            medicineId: z.string().min(1),
            medicineName: z.string().min(1),
            quantity: z.number().positive(),
            dosage: z.string().min(1),
            frequency: z.nativeEnum(MedicineFrequency),
            durationDays: z.number().positive(),
            instructions: z.string().optional(),
            beforeFood: z.boolean().optional(),
            afterFood: z.boolean().optional(),
            bedtime: z.boolean().optional(),
            refillAllowed: z.boolean().default(false),
            maxRefills: z.number().optional(),
            pricePerUnit: z.number().optional(),
          }),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const prescriptions = state.prescriptions.map((rx) => {
          if (rx.id !== p.prescriptionId) return rx;
          return {
            ...rx,
            medicines: [...rx.medicines, p.medicine],
          };
        });
        return prescriptions.find((rx) => rx.id === p.prescriptionId)!;
      },

      updatePrescriptionStatus: (payload) => {
        const schema = z.object({
          prescriptionId: z.string().min(1),
          status: z.nativeEnum(PrescriptionStatus),
          actorId: z.string().optional(),
          actorName: z.string().optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const rx = state.prescriptions.find((r) => r.id === p.prescriptionId);
        if (!rx) throw new Error("Prescription not found");

        const now = nowISO();
        const updatedRx: Prescription = {
          ...rx,
          status: p.status,
          verifiedAt: p.status === PrescriptionStatus.VERIFIED ? rx.verifiedAt ?? now : rx.verifiedAt,
          confirmedAt: p.status === PrescriptionStatus.CONFIRMED ? rx.confirmedAt ?? now : rx.confirmedAt,
          packingStartedAt: p.status === PrescriptionStatus.PACKING ? rx.packingStartedAt ?? now : rx.packingStartedAt,
          outForDeliveryAt: p.status === PrescriptionStatus.OUT_FOR_DELIVERY ? rx.outForDeliveryAt ?? now : rx.outForDeliveryAt,
          deliveredAt: p.status === PrescriptionStatus.DELIVERED ? rx.deliveredAt ?? now : rx.deliveredAt,
          verifiedBy: p.status === PrescriptionStatus.VERIFIED ? rx.verifiedBy ?? p.actorId : rx.verifiedBy,
          confirmedBy: p.status === PrescriptionStatus.CONFIRMED ? rx.confirmedBy ?? p.actorId : rx.confirmedBy,
        };
        const prescriptions = state.prescriptions.map((r) => (r.id === p.prescriptionId ? updatedRx : r));

        const stageMap: Partial<Record<PrescriptionStatus, CareJourneyStage>> = {
          [PrescriptionStatus.VERIFIED]: CareJourneyStage.PHARMACY_VERIFIED,
          [PrescriptionStatus.CONFIRMED]: CareJourneyStage.PHARMACY_CONFIRMED,
          [PrescriptionStatus.PACKING]: CareJourneyStage.MEDICINE_PACKING,
          [PrescriptionStatus.OUT_FOR_DELIVERY]: CareJourneyStage.MEDICINE_OUT_FOR_DELIVERY,
          [PrescriptionStatus.DELIVERED]: CareJourneyStage.MEDICINE_DELIVERED,
        };
        const stage = stageMap[p.status];
        let events = state.careJourneyEvents;
        if (stage) {
          const titleMap: Record<CareJourneyStage, string> = {
            [CareJourneyStage.PHARMACY_VERIFIED]: "Prescription verified by pharmacy",
            [CareJourneyStage.PHARMACY_CONFIRMED]: "Pharmacy confirmed order & pricing",
            [CareJourneyStage.MEDICINE_PACKING]: "Medicines being packed",
            [CareJourneyStage.MEDICINE_OUT_FOR_DELIVERY]: "Medicines out for delivery",
            [CareJourneyStage.MEDICINE_DELIVERED]: "Medicines delivered",
            [CareJourneyStage.APPOINTMENT_BOOKED]: "",
            [CareJourneyStage.CONSULTATION_COMPLETED]: "",
            [CareJourneyStage.PRESCRIPTION_GENERATED]: "",
            [CareJourneyStage.DIAGNOSTIC_SCHEDULED]: "",
            [CareJourneyStage.DIAGNOSTIC_SAMPLE_COLLECTED]: "",
            [CareJourneyStage.DIAGNOSTIC_IN_PROGRESS]: "",
            [CareJourneyStage.DIAGNOSTIC_REPORT_READY]: "",
            [CareJourneyStage.DIAGNOSTIC_RESULT_AVAILABLE]: "",
            [CareJourneyStage.FOLLOWUP_SCHEDULED]: "",
            [CareJourneyStage.FOLLOWUP_DUE]: "",
            [CareJourneyStage.CARE_COMPLETED]: "",
          };
          const ev = get().addTimelineEvent({
            patientId: rx.patientId,
            stage,
            title: titleMap[stage],
            actorId: p.actorId,
            actorRole: UserRole.PHARMACIST,
            actorName: p.actorName,
            referenceId: p.prescriptionId,
            referenceType: "prescription",
          });
          events = [...state.careJourneyEvents, ev];
        }

        set({ prescriptions, careJourneyEvents: events });
        return updatedRx;
      },

      scheduleDiagnostic: (payload) => {
        const schema = z.object({
          patientId: z.string().min(1),
          doctorId: z.string().optional(),
          prescribedBy: z.string().optional(),
          labId: z.string().min(1),
          testIds: z.array(z.string()).min(1),
          tests: z
            .array(
              z.object({
                testId: z.string().min(1),
                testName: z.string().min(1),
                price: z.number().positive(),
              })
            )
            .min(1),
          clinicalIndication: z.string().optional(),
          appointmentDate: z.string().min(1),
          sampleCollectionType: z.enum(["home", "lab"]),
          sampleCollectionAddress: z
            .object({
              line1: z.string(),
              line2: z.string().optional(),
              city: z.string(),
              state: z.string(),
              pincode: z.string(),
              country: z.string(),
            })
            .optional(),
          totalAmount: z.number().positive(),
          discountAmount: z.number().optional(),
          finalAmount: z.number().positive(),
          paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const id = nextId("diag-order", state.diagnosticOrders);
        const order: DiagnosticOrder = {
          id,
          patientId: p.patientId,
          doctorId: p.doctorId,
          prescribedBy: p.prescribedBy,
          labId: p.labId,
          testIds: p.testIds,
          tests: p.tests,
          clinicalIndication: p.clinicalIndication,
          status: DiagnosticStatus.SCHEDULED,
          appointmentDate: p.appointmentDate,
          sampleCollectionType: p.sampleCollectionType,
          sampleCollectionAddress: p.sampleCollectionAddress,
          totalAmount: p.totalAmount,
          discountAmount: p.discountAmount ?? 0,
          finalAmount: p.finalAmount,
          paymentStatus: p.paymentStatus ?? "pending",
          createdAt: nowISO(),
        };

        const lab = state.labs.find((l) => l.id === p.labId);
        const event = get().addTimelineEvent({
          patientId: p.patientId,
          stage: CareJourneyStage.DIAGNOSTIC_SCHEDULED,
          title: `Diagnostics scheduled${lab ? ` at ${lab.name}` : ""}`,
          description: `${p.tests.length} test(s) on ${p.appointmentDate} · ${p.sampleCollectionType === "home" ? "Home collection" : "Visit lab"}`,
          actorId: state.currentUserId ?? undefined,
          actorRole: state.currentRole,
          referenceId: id,
          referenceType: "diagnostic",
          metadata: { labName: lab?.name, testCount: p.tests.length, amount: p.finalAmount },
        });

        set({
          diagnosticOrders: [...state.diagnosticOrders, order],
          careJourneyEvents: [...state.careJourneyEvents, event],
        });
        return order;
      },

      updateDiagnosticStatus: (payload) => {
        const schema = z.object({
          orderId: z.string().min(1),
          status: z.nativeEnum(DiagnosticStatus),
          actorId: z.string().optional(),
          actorName: z.string().optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const order = state.diagnosticOrders.find((o) => o.id === p.orderId);
        if (!order) throw new Error("Diagnostic order not found");

        const now = nowISO();
        const updated: DiagnosticOrder = {
          ...order,
          status: p.status,
          sampleCollectedAt: p.status === DiagnosticStatus.COLLECTED ? order.sampleCollectedAt ?? now : order.sampleCollectedAt,
          collectedBy: p.status === DiagnosticStatus.COLLECTED ? order.collectedBy ?? p.actorId : order.collectedBy,
          inProgressAt: p.status === DiagnosticStatus.IN_PROGRESS ? order.inProgressAt ?? now : order.inProgressAt,
          reportReadyAt: p.status === DiagnosticStatus.REPORT_READY ? order.reportReadyAt ?? now : order.reportReadyAt,
          completedAt: p.status === DiagnosticStatus.COMPLETED ? order.completedAt ?? now : order.completedAt,
        };
        const diagnosticOrders = state.diagnosticOrders.map((o) => (o.id === p.orderId ? updated : o));

        const stageMap: Partial<Record<DiagnosticStatus, CareJourneyStage>> = {
          [DiagnosticStatus.SCHEDULED]: CareJourneyStage.DIAGNOSTIC_SCHEDULED,
          [DiagnosticStatus.COLLECTED]: CareJourneyStage.DIAGNOSTIC_SAMPLE_COLLECTED,
          [DiagnosticStatus.IN_PROGRESS]: CareJourneyStage.DIAGNOSTIC_IN_PROGRESS,
          [DiagnosticStatus.REPORT_READY]: CareJourneyStage.DIAGNOSTIC_REPORT_READY,
          [DiagnosticStatus.COMPLETED]: CareJourneyStage.DIAGNOSTIC_RESULT_AVAILABLE,
        };
        const stage = stageMap[p.status];
        let events = state.careJourneyEvents;
        if (stage) {
          const titleMap: Record<CareJourneyStage, string> = {
            [CareJourneyStage.DIAGNOSTIC_SAMPLE_COLLECTED]: "Sample collected",
            [CareJourneyStage.DIAGNOSTIC_IN_PROGRESS]: "Lab processing started",
            [CareJourneyStage.DIAGNOSTIC_REPORT_READY]: "Diagnostic report ready",
            [CareJourneyStage.DIAGNOSTIC_RESULT_AVAILABLE]: "Diagnostic results available",
            [CareJourneyStage.DIAGNOSTIC_SCHEDULED]: "",
            [CareJourneyStage.APPOINTMENT_BOOKED]: "",
            [CareJourneyStage.CONSULTATION_COMPLETED]: "",
            [CareJourneyStage.PRESCRIPTION_GENERATED]: "",
            [CareJourneyStage.PHARMACY_VERIFIED]: "",
            [CareJourneyStage.PHARMACY_CONFIRMED]: "",
            [CareJourneyStage.MEDICINE_PACKING]: "",
            [CareJourneyStage.MEDICINE_OUT_FOR_DELIVERY]: "",
            [CareJourneyStage.MEDICINE_DELIVERED]: "",
            [CareJourneyStage.FOLLOWUP_SCHEDULED]: "",
            [CareJourneyStage.FOLLOWUP_DUE]: "",
            [CareJourneyStage.CARE_COMPLETED]: "",
          };
          const ev = get().addTimelineEvent({
            patientId: order.patientId,
            stage,
            title: titleMap[stage],
            description: `${order.tests.length} test(s)`,
            actorId: p.actorId,
            actorRole: UserRole.LAB_TECH,
            actorName: p.actorName,
            referenceId: p.orderId,
            referenceType: "diagnostic",
          });
          events = [...state.careJourneyEvents, ev];
        }

        set({ diagnosticOrders, careJourneyEvents: events });
        return updated;
      },

      addFollowUp: (payload) => {
        const schema = z.object({
          patientId: z.string().min(1),
          doctorId: z.string().min(1),
          appointmentId: z.string().optional(),
          originalAppointmentId: z.string().optional(),
          title: z.string().min(1),
          description: z.string().optional(),
          scheduledDate: z.string().min(1),
          reminderDaysBefore: z.number().optional(),
          priority: z.enum(["routine", "important", "urgent"]).optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const id = nextId("followup", state.followUps);
        const followUp: FollowUp = {
          id,
          patientId: p.patientId,
          doctorId: p.doctorId,
          appointmentId: p.appointmentId,
          originalAppointmentId: p.originalAppointmentId,
          title: p.title,
          description: p.description,
          scheduledDate: p.scheduledDate,
          reminderDaysBefore: p.reminderDaysBefore ?? 2,
          status: FollowUpStatus.UPCOMING,
          priority: p.priority ?? "routine",
          createdAt: nowISO(),
        };

        const event = get().addTimelineEvent({
          patientId: p.patientId,
          stage: CareJourneyStage.FOLLOWUP_SCHEDULED,
          title: "Follow-up scheduled",
          description: `${p.title} on ${p.scheduledDate}`,
          actorId: state.currentUserId ?? undefined,
          actorRole: state.currentRole,
          referenceId: id,
          referenceType: "followup",
        });

        set({
          followUps: [...state.followUps, followUp],
          careJourneyEvents: [...state.careJourneyEvents, event],
        });
        return followUp;
      },

      updateFollowUpStatus: (payload) => {
        const schema = z.object({
          followUpId: z.string().min(1),
          status: z.nativeEnum(FollowUpStatus),
          completedNotes: z.string().optional(),
          reasonForCancel: z.string().optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const followUps = state.followUps.map((f) => {
          if (f.id !== p.followUpId) return f;
          return {
            ...f,
            status: p.status,
            completedAt: p.status === FollowUpStatus.COMPLETED ? f.completedAt ?? nowISO() : f.completedAt,
            completedNotes: p.completedNotes ?? f.completedNotes,
            reasonForCancel: p.reasonForCancel ?? f.reasonForCancel,
          };
        });
        return followUps.find((f) => f.id === p.followUpId)!;
      },

      grantConsent: (payload) => {
        const schema = z.object({
          patientId: z.string().min(1),
          consentRequestId: z.string().optional(),
          scopes: z.number(),
          actorId: z.string().min(1),
          actorRole: z.nativeEnum(UserRole),
          actorName: z.string().min(1),
          purpose: z.string().optional(),
          dataAccessed: z.array(z.string()).optional(),
          notes: z.string().optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const id = nextId("consent-audit", state.consentAuditEntries);
        const entry: ConsentAuditEntry = {
          id,
          patientId: p.patientId,
          consentRequestId: p.consentRequestId,
          action: ConsentAction.GRANTED,
          scopes: p.scopes,
          actorId: p.actorId,
          actorRole: p.actorRole,
          actorName: p.actorName,
          purpose: p.purpose,
          dataAccessed: p.dataAccessed,
          timestamp: nowISO(),
          notes: p.notes,
        };

        set({
          consentAuditEntries: [...state.consentAuditEntries, entry],
        });
        return entry;
      },

      revokeConsent: (payload) => {
        const schema = z.object({
          patientId: z.string().min(1),
          consentRequestId: z.string().optional(),
          scopes: z.number(),
          actorId: z.string().min(1),
          actorRole: z.nativeEnum(UserRole),
          actorName: z.string().min(1),
          purpose: z.string().optional(),
          notes: z.string().optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const id = nextId("consent-audit", state.consentAuditEntries);
        const entry: ConsentAuditEntry = {
          id,
          patientId: p.patientId,
          consentRequestId: p.consentRequestId,
          action: ConsentAction.REVOKED,
          scopes: p.scopes,
          actorId: p.actorId,
          actorRole: p.actorRole,
          actorName: p.actorName,
          purpose: p.purpose,
          timestamp: nowISO(),
          notes: p.notes,
        };

        set({
          consentAuditEntries: [...state.consentAuditEntries, entry],
        });
        return entry;
      },

      addTimelineEvent: (payload) => {
        const schema = z.object({
          patientId: z.string().min(1),
          stage: z.nativeEnum(CareJourneyStage),
          title: z.string().min(1),
          description: z.string().optional(),
          actorId: z.string().optional(),
          actorRole: z.nativeEnum(UserRole).optional(),
          actorName: z.string().optional(),
          referenceId: z.string().optional(),
          referenceType: z.enum(["appointment", "prescription", "diagnostic", "followup", "consent"]).optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) throw new Error(parsed.error.message);
        const p = parsed.data;

        const state = get();
        const id = nextId("event", state.careJourneyEvents);
        const event: CareJourneyEvent = {
          id,
          patientId: p.patientId,
          stage: p.stage,
          title: p.title,
          description: p.description,
          timestamp: nowISO(),
          actorId: p.actorId,
          actorRole: p.actorRole,
          actorName: p.actorName,
          referenceId: p.referenceId,
          referenceType: p.referenceType,
          metadata: p.metadata,
        };
        return event;
      },

      switchRole: (role, userId) => {
        const schema = z.object({
          role: z.nativeEnum(UserRole),
          userId: z.string().optional(),
        });
        const parsed = schema.safeParse({ role, userId });
        if (!parsed.success) throw new Error(parsed.error.message);
        set({
          currentRole: parsed.data.role,
          currentUserId: parsed.data.userId ?? get().currentUserId,
        });
      },

      setTempSelectedSpecialty: (specialty) => {
        const schema = z.string().nullable();
        const parsed = schema.safeParse(specialty);
        if (!parsed.success) throw new Error(parsed.error.message);
        set({ tempSelectedSpecialty: parsed.data });
      },

      setSelectedPatientId: (patientId) => {
        const schema = z.string().nullable();
        const parsed = schema.safeParse(patientId);
        if (!parsed.success) throw new Error(parsed.error.message);
        set({ selectedPatientId: parsed.data });
      },
    }),
    {
      name: "curalives-store",
      partialize: (state) => ({
        patients: state.patients,
        appointments: state.appointments,
        prescriptions: state.prescriptions,
        diagnosticOrders: state.diagnosticOrders,
        careJourneyEvents: state.careJourneyEvents,
        followUps: state.followUps,
        consentAuditEntries: state.consentAuditEntries,
        currentUserId: state.currentUserId,
        currentRole: state.currentRole,
        selectedPatientId: state.selectedPatientId,
        tempSelectedSpecialty: state.tempSelectedSpecialty,
      }),
    }
  )
);
