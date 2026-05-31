export type PaymentMode = 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'online';
export type PaymentStatus = 'not_paid' | 'part_paid' | 'fully_paid';

export interface Payment {
  id: string;
  taskId: string;
  amount: number;
  mode: PaymentMode;
  status: PaymentStatus;
  recordedBy: string;
  recordedAt: string;
  receiptUrl?: string;
  notes?: string;
}
