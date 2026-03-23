export enum UserRole {
  STUDENT = 'student',
  VOLUNTEER = 'volunteer',
  DONOR = 'donor',
  ADMIN = 'admin'
}

export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  district: string;
  mobile?: string;
  photoURL?: string;
  createdAt: number;
}

export interface ScholarshipApplication {
  id: string;
  studentId: string;
  programId: string;
  status: ApplicationStatus;
  personalInfo: {
    dob: string;
    category: string;
    familyIncome: number;
    marks: number;
    bankDetails: {
      accHolder: string;
      accNumber: string;
      ifsc: string;
    };
  };
  documents: {
    photo: string;
    aadhaar: string;
    incomeCert: string;
    marksheet: string;
    passbook: string;
  };
  submittedAt: number;
  updatedAt: number;
}
