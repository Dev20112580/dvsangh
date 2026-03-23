export enum UserRole {
  STUDENT = 'student',
  VOLUNTEER = 'volunteer',
  DONOR = 'donor',
  ADMIN = 'admin'
}

export enum ApplicationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  district: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Scholarship {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  college_name: string;
  course: string;
  marks_percentage: number;
  family_income: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
}

export interface Donation {
  id: string;
  user_id?: string;
  amount: number;
  currency: string;
  category: string;
  frequency: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  created_at: string;
}
