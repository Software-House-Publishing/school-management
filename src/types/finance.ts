export interface FeePlan {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'semester' | 'annual';
  applicableGrades: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  feePlanId: string;
  invoiceNumber: string;
  amount: number;
  discount: number;
  tax: number;
  totalAmount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: FeeItem[];
  createdAt: string;
  updatedAt: string;
}

export interface FeeItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  paidAt: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'mobile_payment';

export interface Salary {
  id: string;
  teacherId: string;
  payrollPeriod: string; // YYYY-MM format
  baseSalary: number;
  allowances: SalaryAllowance[];
  deductions: SalaryDeduction[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryAllowance {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface SalaryDeduction {
  id: string;
  name: string;
  amount: number;
  type: 'tax' | 'insurance' | 'loan' | 'other';
}