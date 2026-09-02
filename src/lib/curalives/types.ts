export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  PHARMACIST = "pharmacist",
  LAB_TECH = "lab_tech",
  ADMIN = "admin",
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum PrescriptionStatus {
  CREATED = "created",
  VERIFIED = "verified",
  CONFIRMED = "confirmed",
  PACKING = "packing",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum DiagnosticStatus {
  SCHEDULED = "scheduled",
  COLLECTED = "collected",
  IN_PROGRESS = "in_progress",
  REPORT_READY = "report_ready",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum FollowUpStatus {
  UPCOMING = "upcoming",
  OVERDUE = "overdue",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum CareJourneyStage {
  APPOINTMENT_BOOKED = "appointment_booked",
  CONSULTATION_COMPLETED = "consultation_completed",
  PRESCRIPTION_GENERATED = "prescription_generated",
  PHARMACY_VERIFIED = "pharmacy_verified",
  PHARMACY_CONFIRMED = "pharmacy_confirmed",
  MEDICINE_PACKING = "medicine_packing",
  MEDICINE_OUT_FOR_DELIVERY = "medicine_out_for_delivery",
  MEDICINE_DELIVERED = "medicine_delivered",
  DIAGNOSTIC_SCHEDULED = "diagnostic_scheduled",
  DIAGNOSTIC_SAMPLE_COLLECTED = "diagnostic_sample_collected",
  DIAGNOSTIC_IN_PROGRESS = "diagnostic_in_progress",
  DIAGNOSTIC_REPORT_READY = "diagnostic_report_ready",
  DIAGNOSTIC_RESULT_AVAILABLE = "diagnostic_result_available",
  FOLLOWUP_SCHEDULED = "followup_scheduled",
  FOLLOWUP_DUE = "followup_due",
  CARE_COMPLETED = "care_completed",
}

export enum ConsentScope {
  NONE = 0,
  BASIC_INFO = 1 << 0,
  CONSULTATION_HISTORY = 1 << 1,
  PRESCRIPTIONS = 1 << 2,
  DIAGNOSTICS_REPORTS = 1 << 3,
  ALLERGIES_CONDITIONS = 1 << 4,
  ALL = BASIC_INFO | CONSULTATION_HISTORY | PRESCRIPTIONS | DIAGNOSTICS_REPORTS | ALLERGIES_CONDITIONS,
}

export enum ConsentAction {
  GRANTED = "granted",
  REVOKED = "revoked",
  UPDATED = "updated",
  EXPIRED = "expired",
}

export enum NotificationType {
  APPOINTMENT = "appointment",
  PRESCRIPTION = "prescription",
  DIAGNOSTIC = "diagnostic",
  FOLLOWUP = "followup",
  CONSENT = "consent",
  SYSTEM = "system",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

export enum MedicineType {
  TABLET = "tablet",
  CAPSULE = "capsule",
  SYRUP = "syrup",
  INJECTION = "injection",
  OINTMENT = "ointment",
  DROPS = "drops",
  INHALER = "inhaler",
  CREAM = "cream",
}

export enum MedicineFrequency {
  ONCE_DAILY = "once_daily",
  TWICE_DAILY = "twice_daily",
  THRICE_DAILY = "thrice_daily",
  FOUR_TIMES_DAILY = "four_times_daily",
  EVERY_6_HOURS = "every_6_hours",
  EVERY_8_HOURS = "every_8_hours",
  EVERY_12_HOURS = "every_12_hours",
  AS_NEEDED = "as_needed",
  BEFORE_FOOD = "before_food",
  AFTER_FOOD = "after_food",
  BEDTIME = "bedtime",
}

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type Contact = {
  phone: string;
  email?: string;
  alternatePhone?: string;
};

export type Patient = {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  contact: Contact;
  address: Address;
  height?: number;
  weight?: number;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider?: string;
  insuranceNumber?: string;
  primaryDoctorId?: string;
  avatarUrl?: string;
  createdAt: string;
};

export type Doctor = {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  title: string;
  specialty: string;
  subSpecialty?: string;
  experienceYears: number;
  qualifications: string[];
  registrations: string[];
  clinicIds: string[];
  contact: Contact;
  address?: Address;
  languages: string[];
  consultationFees: {
    inClinic: number;
    video: number;
    followUp: number;
  };
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
    lunchBreak?: {
      start: string;
      end: string;
    };
  };
  rating?: number;
  reviewCount?: number;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
};

export type Clinic = {
  id: string;
  name: string;
  type: string;
  address: Address;
  contact: Contact;
  doctorIds: string[];
  amenities: string[];
  timings: {
    mondayToSaturday: {
      start: string;
      end: string;
    };
    sunday?: {
      start: string;
      end: string;
    };
  };
  rating?: number;
  reviewCount?: number;
  createdAt: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  type: "in_clinic" | "video" | "home_visit";
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  chiefComplaint: string;
  symptoms?: string[];
  consultationFees: number;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: string;
  consultationNotes?: string;
  diagnosis?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  prescriptionId?: string;
  followUpId?: string;
  createdAt: string;
};

export type Medicine = {
  id: string;
  name: string;
  genericName?: string;
  brand: string;
  type: MedicineType;
  strength: string;
  manufacturer: string;
  description?: string;
  sideEffects?: string[];
  storageInstructions?: string;
  saltComposition?: string[];
  isGeneric?: boolean;
  isControlled?: boolean;
  requiresPrescription: boolean;
  defaultPrice?: number;
  imageUrl?: string;
};

export type PrescriptionMedicine = {
  medicineId: string;
  medicineName: string;
  quantity: number;
  dosage: string;
  frequency: MedicineFrequency;
  durationDays: number;
  instructions?: string;
  beforeFood?: boolean;
  afterFood?: boolean;
  bedtime?: boolean;
  refillAllowed: boolean;
  maxRefills?: number;
  pricePerUnit?: number;
};

export type Prescription = {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  pharmacyId?: string;
  diagnosis: string;
  chiefComplaint?: string;
  medicines: PrescriptionMedicine[];
  advice?: string;
  dietaryRestrictions?: string[];
  lifestyleChanges?: string[];
  investigationsAdvised?: string[];
  status: PrescriptionStatus;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  packingStartedAt?: string;
  outForDeliveryAt?: string;
  deliveredAt?: string;
  deliveryPartner?: string;
  trackingNumber?: string;
  deliveryAddress?: Address;
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  paymentStatus?: "pending" | "paid" | "cod";
};

export type Pharmacy = {
  id: string;
  name: string;
  address: Address;
  contact: Contact;
  licenseNumber: string;
  operatingHours: {
    mondayToSaturday: {
      start: string;
      end: string;
    };
    sunday?: {
      start: string;
      end: string;
    };
  };
  is24x7: boolean;
  offersHomeDelivery: boolean;
  deliveryPincodes: string[];
  minimumOrderValue?: number;
  deliveryCharges?: number;
  freeDeliveryAbove?: number;
  acceptedInsurance?: string[];
  pharmacistNames: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
};

export type DiagnosticTest = {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  description?: string;
  fastingRequired: boolean;
  fastingHours?: number;
  sampleType: string;
  testComponents?: string[];
  preparationInstructions?: string[];
  reportTurnaroundTime: string;
  homeCollectionAvailable: boolean;
  ageRequirement?: {
    minAge?: number;
    maxAge?: number;
  };
  genderRestriction?: Gender;
  contraindications?: string[];
  defaultPrice: number;
};

export type DiagnosticOrder = {
  id: string;
  patientId: string;
  doctorId?: string;
  prescribedBy?: string;
  labId: string;
  testIds: string[];
  tests: Array<{
    testId: string;
    testName: string;
    price: number;
  }>;
  clinicalIndication?: string;
  status: DiagnosticStatus;
  appointmentDate?: string;
  sampleCollectionType: "home" | "lab";
  sampleCollectionAddress?: Address;
  sampleCollectedAt?: string;
  collectedBy?: string;
  inProgressAt?: string;
  reportReadyAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  reportPdfUrl?: string;
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
};

export type DiagnosticResult = {
  id: string;
  orderId: string;
  patientId: string;
  labId: string;
  testId: string;
  testName: string;
  results: Array<{
    parameter: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    status?: "normal" | "high" | "low" | "abnormal";
    flags?: string[];
  }>;
  conclusion?: string;
  interpretedBy?: string;
  verifiedBy?: string;
  reportedAt: string;
  createdAt: string;
};

export type HealthRecord = {
  id: string;
  patientId: string;
  type: "vitals" | "lab_report" | "prescription" | "discharge_summary" | "immunization" | "surgery" | "allergy" | "condition" | "document";
  title: string;
  description?: string;
  recordedBy?: string;
  recordedAt: string;
  source: "patient" | "doctor" | "lab" | "pharmacy" | "hospital" | "imported";
  referenceId?: string;
  data?: Record<string, unknown>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    sizeKb: number;
  }>;
  tags?: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FollowUp = {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  originalAppointmentId?: string;
  title: string;
  description?: string;
  scheduledDate: string;
  reminderDaysBefore: number;
  status: FollowUpStatus;
  priority: "routine" | "important" | "urgent";
  completedAt?: string;
  completedNotes?: string;
  reasonForCancel?: string;
  createdAt: string;
};

export type CareJourneyEvent = {
  id: string;
  patientId: string;
  stage: CareJourneyStage;
  title: string;
  description?: string;
  timestamp: string;
  actorId?: string;
  actorRole?: UserRole;
  actorName?: string;
  referenceId?: string;
  referenceType?: "appointment" | "prescription" | "diagnostic" | "followup" | "consent";
  metadata?: Record<string, unknown>;
};

export type ConsentRequest = {
  id: string;
  patientId: string;
  requesterId: string;
  requesterRole: UserRole;
  requesterName: string;
  purpose: string;
  scopes: ConsentScope;
  status: "pending" | "granted" | "denied" | "revoked" | "expired";
  validFrom: string;
  validUntil?: string;
  grantedAt?: string;
  deniedAt?: string;
  revokedAt?: string;
  createdAt: string;
};

export type ConsentAuditEntry = {
  id: string;
  patientId: string;
  consentRequestId?: string;
  action: ConsentAction;
  scopes: ConsentScope;
  actorId: string;
  actorRole: UserRole;
  actorName: string;
  purpose?: string;
  dataAccessed?: string[];
  ipAddress?: string;
  timestamp: string;
  notes?: string;
};

export type Notification = {
  id: string;
  userId: string;
  userRole: UserRole;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  isDismissed: boolean;
  referenceId?: string;
  referenceType?: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
};
