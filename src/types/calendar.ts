export type NameMode = 'Dual' | 'Khasi' | 'Jaintia';

export interface MarketDay {
  index: number;
  khasi: string;
  pnar: string;
  khasiMeaning?: string;
  pnarMeaning?: string;
  significance: string;
  majorLocations: string;
  activities: string;
}

export interface Holiday {
  id: string;
  name: string;
  khasiName?: string;
  day: number;
  month: number; // 0-indexed (0 = January)
  year?: number; // Specific Gregorian year, or 0 / undefined for recurring
  isFixed: boolean;
  type: 'state' | 'national' | 'cultural' | 'religious' | 'user_paid';
  description: string;
  wishKhasi?: string;
  wishEnglish?: string;
  badge?: '1Y' | '∞';
  userEmail?: string;
  userId?: string;
  createdAt?: string;
  isUserPaid?: boolean;
  expiryDate?: string;
  orderId?: string;
}

export interface AllHolidayItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'temp' | 'perm';
  userEmail: string;
  userId?: string;
  createdAt: string;
  status: 'active' | 'expired' | 'deleted';
  expiryDate?: string; // YYYY-MM-DD (for temp: date + 1 year) or 'forever'
  orderId?: string;
}

export interface HolidayReport {
  id?: string;
  holidayId: string;
  holidayTitle: string;
  reason: string;
  reporterEmail: string;
  createdAt: string;
  status?: 'pending' | 'reviewed' | 'dismissed';
}

export interface BillingProduct {
  productId: 'temp_holiday_1year' | 'permanent_holiday_forever';
  title: string;
  price: string;
  currency: string;
  amount: number;
  type: 'CONSUMABLE';
  description: string;
  durationText: string;
  badge: '1Y' | '∞';
}

export interface DayNote {
  id: string;
  dateKey: string; // YYYY-MM-DD
  text: string;
  category?: 'birthday' | 'anniversary' | 'shopping' | 'event' | 'meeting' | 'general';
  createdAt: string;
}
