import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AllHolidayItem } from '../types/calendar';

export interface HolidayNotification {
  id: string;
  holidayId: string;
  holidayTitle: string;
  date: string; // YYYY-MM-DD
  type: 'temp' | 'perm';
  userName: string;
  userEmail: string;
  userId?: string;
  description?: string;
  submittedAt: string; // ISO date string
  status: 'pending' | 'approved' | 'denied';
  reviewedAt?: string;
  reviewedBy?: string;
  denialReason?: string;
}

const STORAGE_KEY = 'kj_admin_holiday_notifications';
const LOCAL_STORAGE_ALL_HOLIDAYS = 'kj_all_holidays_local';
export const NOTIFICATIONS_UPDATED_EVENT = 'kj_holiday_notifications_updated';

class HolidayApprovalService {
  /**
   * Get all notifications from localStorage
   */
  getNotifications(): HolidayNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.warn('Failed to parse notifications from localStorage:', err);
    }
    return [];
  }

  /**
   * Save notifications to localStorage and dispatch event
   */
  saveNotifications(notifications: HolidayNotification[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, { detail: notifications }));
      }
    } catch (err) {
      console.warn('Failed to save notifications to localStorage:', err);
    }
  }

  /**
   * Count how many notifications are pending review
   */
  getPendingCount(): number {
    return this.getNotifications().filter(n => n.status === 'pending').length;
  }

  /**
   * Add a new holiday notification (status: pending)
   */
  addNotification(data: {
    holidayId: string;
    holidayTitle: string;
    date: string;
    type: 'temp' | 'perm';
    userName: string;
    userEmail: string;
    userId?: string;
    description?: string;
    submittedAt?: string;
  }): HolidayNotification {
    const list = this.getNotifications();

    // Check if notification already exists for this holiday
    const existingIndex = list.findIndex(n => n.holidayId === data.holidayId);
    const newNotif: HolidayNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      holidayId: data.holidayId,
      holidayTitle: data.holidayTitle,
      date: data.date,
      type: data.type,
      userName: data.userName || data.userEmail.split('@')[0],
      userEmail: data.userEmail,
      userId: data.userId,
      description: data.description,
      submittedAt: data.submittedAt || new Date().toISOString(),
      status: 'pending'
    };

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...newNotif, id: list[existingIndex].id };
    } else {
      list.unshift(newNotif);
    }

    this.saveNotifications(list);
    return newNotif;
  }

  /**
   * Admin approves a holiday:
   * 1. Changes notification status to 'approved'
   * 2. Changes holiday status to 'approved' in localStorage
   * 3. Syncs with Firestore if online
   * 4. Dispatches events so calendar displays it live immediately
   */
  async approveHoliday(holidayId: string, adminEmail: string): Promise<boolean> {
    const list = this.getNotifications();
    const notif = list.find(n => n.holidayId === holidayId || n.id === holidayId);
    const targetHolidayId = notif ? notif.holidayId : holidayId;

    const now = new Date().toISOString();

    if (notif) {
      notif.status = 'approved';
      notif.reviewedAt = now;
      notif.reviewedBy = adminEmail;
      this.saveNotifications(list);
    }

    // 1. Update localStorage holidays to 'active'
    this.updateHolidayStatusInLocalStorage(targetHolidayId, 'active', notif);

    // 2. Update Firestore if connected using setDoc with merge for reliability
    try {
      const docRef = doc(db, 'all_holidays', targetHolidayId);
      await setDoc(docRef, {
        status: 'active',
        updatedAt: now,
        approvedAt: now,
        approvedBy: adminEmail
      }, { merge: true });
    } catch (err) {
      console.warn('Could not update Firestore (will persist locally):', err);
    }

    // Trigger holiday storage event to refresh calendar immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kj_holidays_updated'));
    }

    return true;
  }

  /**
   * Admin denies a holiday:
   * 1. Changes notification status to 'denied'
   * 2. Changes holiday status to 'denied' in localStorage
   * 3. Syncs with Firestore if online
   * 4. Dispatches events so calendar hides it from public
   */
  async denyHoliday(holidayId: string, adminEmail: string, reason?: string): Promise<boolean> {
    const list = this.getNotifications();
    const notif = list.find(n => n.holidayId === holidayId || n.id === holidayId);
    const targetHolidayId = notif ? notif.holidayId : holidayId;

    const now = new Date().toISOString();

    if (notif) {
      notif.status = 'denied';
      notif.reviewedAt = now;
      notif.reviewedBy = adminEmail;
      notif.denialReason = reason?.trim() || 'Not approved as a public holiday';
      this.saveNotifications(list);
    }

    // 1. Update localStorage holidays
    this.updateHolidayStatusInLocalStorage(targetHolidayId, 'denied', notif);

    // 2. Update Firestore if connected
    try {
      const docRef = doc(db, 'all_holidays', targetHolidayId);
      await setDoc(docRef, {
        status: 'denied',
        updatedAt: now,
        deniedAt: now,
        deniedBy: adminEmail,
        denialReason: reason?.trim() || 'Not approved as a public holiday'
      }, { merge: true });
    } catch (err) {
      console.warn('Could not update Firestore (will persist locally):', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kj_holidays_updated'));
    }

    return true;
  }

  /**
   * Helper to update holiday status in localStorage
   */
  private updateHolidayStatusInLocalStorage(
    holidayId: string,
    status: 'active' | 'approved' | 'denied',
    notifContext?: HolidayNotification
  ): void {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_ALL_HOLIDAYS);
      if (raw) {
        const holidays: AllHolidayItem[] = JSON.parse(raw);
        let changed = false;
        const normalizedStatus = status === 'approved' ? 'active' : status;

        for (const h of holidays) {
          const idMatch = h.id === holidayId || (notifContext && h.id === notifContext.holidayId);
          const metaMatch = notifContext && h.title.trim().toLowerCase() === notifContext.holidayTitle.trim().toLowerCase() && h.date === notifContext.date;
          if (idMatch || metaMatch) {
            h.status = normalizedStatus;
            changed = true;
          }
        }

        if (changed) {
          localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(holidays));
        }
      }
    } catch (err) {
      console.warn('Failed to update holiday status in localStorage:', err);
    }
  }

  /**
   * Synchronize notifications with the current holidays list
   * Ensures that any pending holidays submitted anywhere appear in notifications,
   * and auto-heals any approved holidays to active status on calendar.
   */
  syncWithHolidaysList(allHolidays: AllHolidayItem[]): void {
    const notifications = this.getNotifications();
    let notifsChanged = false;
    let holidaysChanged = false;

    for (const h of allHolidays) {
      const notif = notifications.find(n => n.holidayId === h.id || (n.holidayTitle.trim().toLowerCase() === h.title.trim().toLowerCase() && n.date === h.date));

      if (h.status === 'pending') {
        if (!notif) {
          notifications.unshift({
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            holidayId: h.id,
            holidayTitle: h.title,
            date: h.date,
            type: h.type,
            userName: h.userEmail.split('@')[0],
            userEmail: h.userEmail,
            userId: h.userId,
            description: h.wish || h.wishKhasi || '',
            submittedAt: h.createdAt || new Date().toISOString(),
            status: 'pending'
          });
          notifsChanged = true;
        } else if (notif.status === 'approved') {
          // Self-heal: notification was approved, make sure holiday is active!
          h.status = 'active';
          holidaysChanged = true;
        }
      } else if (h.status === 'active' || h.status === 'approved') {
        if (notif && notif.status === 'pending') {
          notif.status = 'approved';
          notifsChanged = true;
        }
      } else if (h.status === 'denied') {
        if (notif && notif.status !== 'denied') {
          notif.status = 'denied';
          notifsChanged = true;
        }
      }
    }

    if (notifsChanged) {
      this.saveNotifications(notifications);
    }

    if (holidaysChanged) {
      try {
        localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(allHolidays));
      } catch {
        // ignore
      }
    }
  }
}

export const holidayApprovalService = new HolidayApprovalService();
