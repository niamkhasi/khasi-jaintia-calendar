import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { Holiday, AllHolidayItem, HolidayReport } from '../types/calendar';
import { billingClient } from '../services/billingClient';
import { holidayApprovalService, NOTIFICATIONS_UPDATED_EVENT } from '../services/holidayApprovalService';

export const ADMIN_EMAILS = ['muniphawa@gmail.com', 'niamkhasi@gmail.com'];
export const SUPPORT_PHONE = '+917005893341';
export const SUPPORT_EMAIL = 'muniphawa@gmail.com';

const ALL_HOLIDAYS_COLLECTION = 'all_holidays';
const CUSTOM_HOLIDAYS_COLLECTION = 'custom_holidays';
const DELETED_HOLIDAYS_COLLECTION = 'deleted_holidays';
const REPORTS_COLLECTION = 'reports';
export const LOCAL_STORAGE_ALL_HOLIDAYS = 'kj_all_holidays_local';
export const LOCAL_STORAGE_CUSTOM_HOLIDAYS = 'kj_custom_holidays_local';
export const LOCAL_STORAGE_DELETED_HOLIDAYS = 'kj_deleted_holiday_keys';
export const LOCAL_STORAGE_LAST_SYNCED = 'kj_holidays_last_synced';


export function useFirebaseHolidays() {
  const [customHolidays, setCustomHolidays] = useState<Holiday[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_HOLIDAYS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [allPaidHolidays, setAllPaidHolidays] = useState<AllHolidayItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ALL_HOLIDAYS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deletedHolidayKeys, setDeletedHolidayKeys] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DELETED_HOLIDAYS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_LAST_SYNCED) || '';
    } catch {
      return '';
    }
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [reports, setReports] = useState<HolidayReport[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // If we already have cached holidays in localStorage, don't block UI with loading: true
  const [loading, setLoading] = useState<boolean>(() => {
    try {
      const hasAll = !!localStorage.getItem(LOCAL_STORAGE_ALL_HOLIDAYS);
      const hasCustom = !!localStorage.getItem(LOCAL_STORAGE_CUSTOM_HOLIDAYS);
      return !(hasAll || hasCustom);
    } catch {
      return false;
    }
  });
  const [error, setError] = useState<string | null>(null);

  // Monitor Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Check admin status: muniphawa@gmail.com (and niamkhasi@gmail.com)
  const isAdmin = !!(
    currentUser?.email &&
    ADMIN_EMAILS.some(email => email.toLowerCase() === currentUser.email?.toLowerCase())
  );

  // Holiday Approval System notification count
  const [pendingNotificationsCount, setPendingNotificationsCount] = useState<number>(() => {
    return holidayApprovalService.getPendingCount();
  });

  useEffect(() => {
    const handleNotifs = () => {
      setPendingNotificationsCount(holidayApprovalService.getPendingCount());
    };
    const handleHolidays = () => {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_ALL_HOLIDAYS);
        if (raw) {
          setAllPaidHolidays(JSON.parse(raw));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleNotifs);
    window.addEventListener('kj_holidays_updated', handleHolidays);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleNotifs);
      window.removeEventListener('kj_holidays_updated', handleHolidays);
    };
  }, []);

  // 1. Listen to all_holidays collection in real-time
  useEffect(() => {
    // Sync approval service with initial data
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_ALL_HOLIDAYS);
      if (localData) {
        const parsed = JSON.parse(localData);
        holidayApprovalService.syncWithHolidaysList(parsed);
        setPendingNotificationsCount(holidayApprovalService.getPendingCount());
      }
    } catch {
      // ignore
    }

    const colRef = collection(db, ALL_HOLIDAYS_COLLECTION);
    const q = query(colRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: AllHolidayItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title,
            date: data.date,
            type: data.type || 'temp',
            userEmail: data.userEmail || '',
            userId: data.userId || '',
            createdAt: data.createdAt || '',
            status: data.status || 'active',
            expiryDate: data.expiryDate,
            orderId: data.orderId,
            wish: data.wish,
            wishKhasi: data.wishKhasi,
            wishEnglish: data.wishEnglish
          };
        });

        setAllPaidHolidays(list);
        holidayApprovalService.syncWithHolidaysList(list);
        setPendingNotificationsCount(holidayApprovalService.getPendingCount());
        const timestamp = new Date().toISOString();
        try {
          localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(list));
          localStorage.setItem(LOCAL_STORAGE_LAST_SYNCED, timestamp);
          setLastSyncedTime(timestamp);
        } catch {
          // ignore
        }
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, ALL_HOLIDAYS_COLLECTION);
        // Do not overwrite cached holidays on network error
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Listen to custom_holidays collection in real-time
  useEffect(() => {
    const colRef = collection(db, CUSTOM_HOLIDAYS_COLLECTION);

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: Holiday[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            khasiName: data.khasiName || data.name,
            day: Number(data.day),
            month: Number(data.month),
            year: Number(data.year || 0),
            isFixed: data.year === 0 || data.isFixed === true,
            type: data.type || 'cultural',
            description: data.description || '',
            wishKhasi: data.wishKhasi || '',
            wishEnglish: data.wishEnglish || '',
          };
        });
        setCustomHolidays(list);
        const timestamp = new Date().toISOString();
        try {
          localStorage.setItem(LOCAL_STORAGE_CUSTOM_HOLIDAYS, JSON.stringify(list));
          localStorage.setItem(LOCAL_STORAGE_LAST_SYNCED, timestamp);
          setLastSyncedTime(timestamp);
        } catch {
          // ignore
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, CUSTOM_HOLIDAYS_COLLECTION);
        console.warn('Error fetching custom_holidays (using local cache if available):', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Active sync function: downloads all collections and updates localStorage
  const syncWithFirebase = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return;
    }
    setIsSyncing(true);
    try {
      const allRef = collection(db, ALL_HOLIDAYS_COLLECTION);
      const customRef = collection(db, CUSTOM_HOLIDAYS_COLLECTION);
      const delRef = collection(db, DELETED_HOLIDAYS_COLLECTION);

      const [allSnap, customSnap, delSnap] = await Promise.all([
        getDocs(allRef).catch(() => null),
        getDocs(customRef).catch(() => null),
        getDocs(delRef).catch(() => null)
      ]);

      if (allSnap && !allSnap.empty) {
        const list: AllHolidayItem[] = allSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title,
            date: data.date,
            type: data.type || 'temp',
            userEmail: data.userEmail || '',
            userId: data.userId || '',
            createdAt: data.createdAt || '',
            status: data.status || 'active',
            expiryDate: data.expiryDate,
            orderId: data.orderId,
            wish: data.wish,
            wishKhasi: data.wishKhasi,
            wishEnglish: data.wishEnglish
          };
        });
        setAllPaidHolidays(list);
        holidayApprovalService.syncWithHolidaysList(list);
        setPendingNotificationsCount(holidayApprovalService.getPendingCount());
        try {
          localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(list));
        } catch {}
      }

      if (customSnap && !customSnap.empty) {
        const list: Holiday[] = customSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            khasiName: data.khasiName || data.name,
            day: Number(data.day),
            month: Number(data.month),
            year: Number(data.year || 0),
            isFixed: data.year === 0 || data.isFixed === true,
            type: data.type || 'cultural',
            description: data.description || '',
            wishKhasi: data.wishKhasi || '',
            wishEnglish: data.wishEnglish || '',
          };
        });
        setCustomHolidays(list);
        try {
          localStorage.setItem(LOCAL_STORAGE_CUSTOM_HOLIDAYS, JSON.stringify(list));
        } catch {}
      }

      if (delSnap && !delSnap.empty) {
        const keys: string[] = [];
        delSnap.docs.forEach((d) => {
          keys.push(d.id);
          const data = d.data();
          if (data.holidayId) keys.push(data.holidayId);
          if (data.holidayName) keys.push(String(data.holidayName).toLowerCase());
        });
        const unique = Array.from(new Set(keys.filter(Boolean)));
        setDeletedHolidayKeys(unique);
        try {
          localStorage.setItem(LOCAL_STORAGE_DELETED_HOLIDAYS, JSON.stringify(unique));
        } catch {}
      }

      const timestamp = new Date().toISOString();
      try {
        localStorage.setItem(LOCAL_STORAGE_LAST_SYNCED, timestamp);
        setLastSyncedTime(timestamp);
      } catch {}

      window.dispatchEvent(new CustomEvent('kj_holidays_synced', { detail: { timestamp } }));
    } catch (e) {
      console.warn('Sync with Firebase encountered an issue:', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Auto-sync whenever internet comes back online
  useEffect(() => {
    const handleReconnected = () => {
      syncWithFirebase();
    };

    window.addEventListener('online', handleReconnected);
    window.addEventListener('kj_network_reconnected', handleReconnected);

    return () => {
      window.removeEventListener('online', handleReconnected);
      window.removeEventListener('kj_network_reconnected', handleReconnected);
    };
  }, [syncWithFirebase]);


  // 3. Listen to deleted_holidays collection in real-time
  useEffect(() => {
    const colRef = collection(db, DELETED_HOLIDAYS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const keys: string[] = [];
        snapshot.docs.forEach((d) => {
          keys.push(d.id);
          const data = d.data();
          if (data.holidayId) keys.push(data.holidayId);
          if (data.holidayName) keys.push(String(data.holidayName).toLowerCase());
        });
        const unique = Array.from(new Set(keys.filter(Boolean)));
        setDeletedHolidayKeys(unique);
        try {
          localStorage.setItem(LOCAL_STORAGE_DELETED_HOLIDAYS, JSON.stringify(unique));
        } catch {
          // ignore
        }
      },
      (err) => {
        console.warn('Error fetching deleted_holidays:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  // 4. Listen to reports if admin
  useEffect(() => {
    if (!isAdmin) {
      setReports([]);
      return;
    }
    const colRef = collection(db, REPORTS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: HolidayReport[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<HolidayReport, 'id'>)
        }));
        setReports(list);
      },
      (err) => {
        console.warn('Error fetching reports:', err);
      }
    );
    return () => unsubscribe();
  }, [isAdmin]);

  // Convert all_holidays items into Holiday objects for the calendar
  // Convert all_holidays items into Holiday objects for the calendar:
  // - Filter out status !== 'active'
  // - For 'temp' holidays: year is set specifically to the chosen year (e.g. 2027) so it shows ONLY in that chosen year and does not repeat every year.
  //   When current year advances (e.g. into 2028), it remains permanently visible on the calendar for that chosen year.
  // - For 'perm' holidays: year is 0, repeating every year from 2025 to 2100.
  const activePaidHolidaysAsCalendarHolidays: Holiday[] = allPaidHolidays
    .filter((item) => {
      if (item.status !== 'active' && item.status !== 'approved') return false;
      return true;
    })
    .map((item) => {
      // Date is in YYYY-MM-DD format
      const [yearStr, monthStr, dayStr] = item.date.split('-');
      const y = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10) - 1; // 0-indexed month
      const d = parseInt(dayStr, 10);

      const isTemp = item.type === 'temp';
      const isSoulDay = item.title.toLowerCase().includes('soul');
      const isAdminHoliday = Boolean(
        item.userEmail && ADMIN_EMAILS.some(a => a.toLowerCase() === item.userEmail.toLowerCase())
      );

      return {
        id: item.id,
        name: isSoulDay ? "All Souls' Day" : item.title,
        khasiName: isSoulDay ? "Ka Sngi ki Mynsiem Ba La Iap (All Souls' Day)" : item.title,
        day: d,
        month: m,
        year: isSoulDay ? 0 : (isTemp ? y : 0), // 0 = repeats every year
        isFixed: isSoulDay || !isTemp,
        type: isSoulDay ? 'religious' : (isAdminHoliday ? 'cultural' : 'user_paid'),
        badge: isSoulDay ? undefined : (isTemp ? '1Y' : '∞'),
        description: isSoulDay
          ? "Ka Sngi Kynmaw ia ki Ba la Iap (All Souls' Day) is observed across Meghalaya to remember, honor, and pray for departed souls and loved ones, visiting cemeteries and lighting candles."
          : (isTemp ? `Temporary Holiday (Appears in ${y} only)` : `Permanent Holiday (Repeats every year)`),
        userEmail: (isSoulDay || isAdminHoliday) ? undefined : item.userEmail,
        userId: item.userId,
        createdAt: item.createdAt,
        isUserPaid: !(isSoulDay || isAdminHoliday),
        expiryDate: item.expiryDate,
        wishKhasi: isSoulDay 
          ? "Ka jingduwai bad jingkynmaw ieit ia baroh ki mynsiem kiba la dep leit noh ha kane ka Sngi All Souls!" 
          : (item.wishKhasi || item.wish || `Khublei ${item.title} ba suk ba kmen ia phi baroh!`),
        wishEnglish: isSoulDay 
          ? "May the cherished memories and peaceful prayers for our departed loved ones bring eternal comfort, hope, and solace on All Souls' Day." 
          : (item.wishEnglish || (item.wish ? item.wish : `Wishing you and your family a peaceful, joyous, and blessed ${item.title}!`))
      };
    });

  // Combine custom admin holidays and active paid holidays, omitting any deleted ones
  const combinedHolidays: Holiday[] = [
    ...customHolidays,
    ...activePaidHolidaysAsCalendarHolidays
  ].filter(h => {
    const lowerName = h.name.trim().toLowerCase();
    const lowerId = h.id.trim().toLowerCase();
    return !deletedHolidayKeys.some(k => {
      const lowerKey = k.trim().toLowerCase();
      return lowerKey === lowerId || lowerKey === lowerName;
    });
  });

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return res.user;
    } catch (err: unknown) {
      console.error('Google Sign In failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: unknown) {
      console.error('Sign Out failed:', err);
    }
  };

  /**
   * Save holiday to Firestore collection "all_holidays"
   * Fields: title, date, type(temp/perm), userEmail, createdAt, status="active", expiryDate (for temp: date+1year)
   * If user is admin (muniphawa@gmail.com / niamkhasi@gmail.com), free lifetime addition without slot deduction!
   */
  const addPaidHoliday = async (params: {
    title: string;
    date: string; // YYYY-MM-DD
    type: 'temp' | 'perm';
    orderId?: string;
    wish?: string;
    wishKhasi?: string;
    wishEnglish?: string;
  }) => {
    if (!currentUser || !currentUser.email) {
      throw new Error('Please sign in with Google to add a holiday or birthday.');
    }

    const { title, date, type, orderId, wish, wishKhasi, wishEnglish } = params;
    if (!title.trim() || !date) {
      throw new Error('Please enter a valid title and date.');
    }

    // Admins have lifetime free addition without slot requirements or deduction
    let slotDeducted = false;
    if (!isAdmin) {
      slotDeducted = billingClient.decrementSlot(type);
      if (!slotDeducted) {
        throw new Error(`No available ${type === 'temp' ? 'Temporary' : 'Permanent'} slots remaining. Please purchase a slot.`);
      }
    }

    // Calculate expiryDate: for temp = date + 1 year, for perm = forever
    let expiryDate = 'forever';
    if (type === 'temp') {
      const [y, m, d] = date.split('-');
      const expiryYear = parseInt(y, 10) + 1;
      expiryDate = `${expiryYear}-${m}-${d}`;
    }

    const docId = `hol-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const docRef = doc(db, ALL_HOLIDAYS_COLLECTION, docId);

    const trimmedWish = wish?.trim() || '';
    const trimmedWishKhasi = wishKhasi?.trim() || trimmedWish;
    const trimmedWishEnglish = wishEnglish?.trim() || '';

    // Admin added holidays are live immediately. Normal user holidays are saved as 'pending' for admin review.
    const initialStatus = isAdmin ? 'active' : 'pending';

    const newRecord: AllHolidayItem = {
      id: docId,
      title: title.trim(),
      date,
      type,
      userEmail: currentUser.email,
      userId: currentUser.uid,
      createdAt: new Date().toISOString(),
      status: initialStatus,
      expiryDate,
      orderId: orderId || (isAdmin ? 'ADMIN-FREE-LIFETIME' : billingClient.getLastOrderId()),
      ...(trimmedWish ? { wish: trimmedWish } : {}),
      ...(trimmedWishKhasi ? { wishKhasi: trimmedWishKhasi } : {}),
      ...(trimmedWishEnglish ? { wishEnglish: trimmedWishEnglish } : {})
    };

    try {
      await setDoc(docRef, newRecord);
      
      // Update local storage cache immediately
      const updatedList = [newRecord, ...allPaidHolidays];
      setAllPaidHolidays(updatedList);
      localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(updatedList));

      // If user is not admin, instantly create a notification in Admin's Notification Box
      if (!isAdmin) {
        holidayApprovalService.addNotification({
          holidayId: docId,
          holidayTitle: title.trim(),
          date,
          type,
          userName: currentUser.displayName || currentUser.email.split('@')[0],
          userEmail: currentUser.email,
          userId: currentUser.uid,
          description: trimmedWish || undefined,
          submittedAt: newRecord.createdAt
        });
        setPendingNotificationsCount(holidayApprovalService.getPendingCount());
      }

      return newRecord;
    } catch (err: unknown) {
      // Restore slot if write fails and user was charged a slot
      if (!isAdmin && slotDeducted) {
        billingClient.addSlot(type);
      }
      handleFirestoreError(err, OperationType.CREATE, `${ALL_HOLIDAYS_COLLECTION}/${docId}`);
      throw err;
    }
  };

  /**
   * Edit holiday title (name)
   * Users who bought/added the holiday can edit the name within 7 days of creation.
   * Admins (muniphawa@gmail.com and niamkhasi@gmail.com) can edit anytime for lifetime.
   */
  const editPaidHolidayTitle = async (holidayId: string, newTitle: string, newWish?: string) => {
    if (!currentUser || !currentUser.email) {
      throw new Error('Please sign in to edit your holiday.');
    }

    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      throw new Error('Holiday title cannot be empty.');
    }

    const item = allPaidHolidays.find(h => h.id === holidayId);
    if (!item) {
      throw new Error('Holiday not found.');
    }

    const isOwner = (item.userId && item.userId === currentUser.uid) || 
                    (item.userEmail && item.userEmail.toLowerCase() === currentUser.email.toLowerCase());

    if (!isAdmin && !isOwner) {
      throw new Error('Unauthorized: You can only edit holidays created by your account.');
    }

    // 7-day rule for non-admin creators
    if (!isAdmin) {
      const createdTime = item.createdAt ? new Date(item.createdAt).getTime() : 0;
      const elapsed = Date.now() - createdTime;
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (createdTime > 0 && elapsed > sevenDaysMs) {
        const daysAgo = Math.floor(elapsed / (24 * 60 * 60 * 1000));
        throw new Error(`The 7-day edit window has expired (${daysAgo} days since creation). Holiday names can only be edited within 7 days of creation.`);
      }
    }

    const docRef = doc(db, ALL_HOLIDAYS_COLLECTION, holidayId);
    try {
      const updateData: any = { 
        title: trimmedTitle,
        updatedAt: new Date().toISOString()
      };
      if (newWish !== undefined) {
        updateData.wish = newWish.trim() || '';
        updateData.wishKhasi = newWish.trim() || '';
      }

      await setDoc(docRef, updateData, { merge: true });

      const updatedList = allPaidHolidays.map(h => h.id === holidayId ? { 
        ...h, 
        title: trimmedTitle,
        ...(newWish !== undefined ? { wish: newWish.trim() || undefined, wishKhasi: newWish.trim() || undefined } : {})
      } : h);
      setAllPaidHolidays(updatedList);
      localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(updatedList));
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.UPDATE, `${ALL_HOLIDAYS_COLLECTION}/${holidayId}`);
      throw err;
    }
  };

  /**
   * Delete Holiday:
   * 1. Creator who bought/added the holiday can delete it anytime they want.
   * 2. Admins (muniphawa@gmail.com & niamkhasi@gmail.com) can delete ANY holiday at any time for lifetime (user-added, custom, or built-in).
   */
  const deleteHolidayDoc = async (holidayId: string, holidayName?: string) => {
    let user = currentUser;
    if (!user || !user.email) {
      try {
        await loginWithGoogle();
        user = auth.currentUser;
      } catch {
        throw new Error('Please sign in with Google to delete a holiday.');
      }
    }

    if (!user || !user.email) {
      throw new Error('Please sign in with Google to delete a holiday.');
    }

    const lowerUserEmail = user.email.toLowerCase();
    const isUserAdmin = ADMIN_EMAILS.some(e => e.toLowerCase() === lowerUserEmail);

    const paidItem = allPaidHolidays.find(h => h.id === holidayId);
    const customItem = customHolidays.find(h => h.id === holidayId);
    const targetName = holidayName || paidItem?.title || customItem?.name || '';

    // If deleting from all_holidays collection
    if (paidItem) {
      const isOwner = (paidItem.userId && paidItem.userId === user.uid) ||
                      (paidItem.userEmail && paidItem.userEmail.toLowerCase() === lowerUserEmail);

      if (!isUserAdmin && !isOwner) {
        throw new Error('Unauthorized: You can only delete holidays created by your account.');
      }

      const docRef = doc(db, ALL_HOLIDAYS_COLLECTION, holidayId);
      try {
        await deleteDoc(docRef);
        const updated = allPaidHolidays.filter(h => h.id !== holidayId);
        setAllPaidHolidays(updated);
        localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(updated));
      } catch (err: unknown) {
        handleFirestoreError(err, OperationType.DELETE, `${ALL_HOLIDAYS_COLLECTION}/${holidayId}`);
        throw err;
      }
    }

    // If deleting from custom_holidays collection
    if (customItem) {
      if (!isUserAdmin) {
        throw new Error('Unauthorized: Only administrators can delete this festival.');
      }
      const docRef = doc(db, CUSTOM_HOLIDAYS_COLLECTION, holidayId);
      try {
        await deleteDoc(docRef);
        setCustomHolidays(prev => prev.filter(h => h.id !== holidayId));
      } catch (err: unknown) {
        handleFirestoreError(err, OperationType.DELETE, `${CUSTOM_HOLIDAYS_COLLECTION}/${holidayId}`);
        throw err;
      }
    }

    // For admins: ALWAYS persist to deleted_holidays so built-in templates, festivals, or user holidays disappear permanently for all users
    if (isUserAdmin) {
      const safeId = holidayId.replace(/[^a-zA-Z0-9_\-]/g, '_');
      const delRef = doc(db, DELETED_HOLIDAYS_COLLECTION, safeId);
      try {
        await setDoc(delRef, {
          holidayId,
          holidayName: targetName,
          deletedBy: lowerUserEmail,
          deletedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not record to deleted_holidays:', err);
      }

      // Add to local state immediately so UI updates instantly
      const updatedKeys = Array.from(new Set([
        ...deletedHolidayKeys,
        holidayId,
        safeId,
        targetName.toLowerCase()
      ].filter(Boolean)));
      setDeletedHolidayKeys(updatedKeys);
      try {
        localStorage.setItem(LOCAL_STORAGE_DELETED_HOLIDAYS, JSON.stringify(updatedKeys));
      } catch {
        // ignore
      }
    }
  };

  /**
   * Admin Delete Power alias:
   */
  const adminDeletePaidHoliday = async (holidayId: string, holidayName?: string) => {
    return deleteHolidayDoc(holidayId, holidayName);
  };

  /**
   * Submit Customer Care complaint / report bad holiday to Firestore "reports"
   */
  const submitHolidayReport = async (data: {
    holidayId: string;
    holidayTitle: string;
    reason: string;
  }) => {
    if (!currentUser || !currentUser.email) {
      throw new Error('Please sign in to submit a complaint or report.');
    }

    const reportId = `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const docRef = doc(db, REPORTS_COLLECTION, reportId);

    const payload: HolidayReport = {
      holidayId: data.holidayId,
      holidayTitle: data.holidayTitle,
      reason: data.reason.trim(),
      reporterEmail: currentUser.email,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    try {
      await setDoc(docRef, payload);
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.CREATE, `${REPORTS_COLLECTION}/${reportId}`);
      throw err;
    }
  };

  // Legacy custom holiday methods (for admin)
  const addHoliday = async (data: {
    name: string;
    khasiName?: string;
    day: number;
    month: number;
    year: number;
    type: 'cultural' | 'state' | 'religious' | 'national';
    description?: string;
    wishKhasi?: string;
    wishEnglish?: string;
  }) => {
    if (!currentUser || !isAdmin) {
      throw new Error(`Unauthorized: Only administrator can publish public festivals.`);
    }
    const docId = `hol-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const docRef = doc(db, CUSTOM_HOLIDAYS_COLLECTION, docId);
    const payload = {
      name: data.name.trim(),
      khasiName: data.khasiName?.trim() || data.name.trim(),
      day: Number(data.day),
      month: Number(data.month),
      year: Number(data.year),
      type: data.type,
      description: data.description?.trim() || '',
      wishKhasi: data.wishKhasi?.trim() || '',
      wishEnglish: data.wishEnglish?.trim() || '',
      createdBy: currentUser.uid,
      creatorEmail: currentUser.email || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(docRef, payload);
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.CREATE, `${CUSTOM_HOLIDAYS_COLLECTION}/${docId}`);
      throw err;
    }
  };

  const updateHoliday = async (id: string, data: {
    name: string;
    khasiName?: string;
    day: number;
    month: number;
    year: number;
    type: 'cultural' | 'state' | 'religious' | 'national';
    description?: string;
    wishKhasi?: string;
    wishEnglish?: string;
  }) => {
    if (!currentUser || !isAdmin) {
      throw new Error('Unauthorized');
    }
    const docRef = doc(db, CUSTOM_HOLIDAYS_COLLECTION, id);
    const payload = {
      name: data.name.trim(),
      khasiName: data.khasiName?.trim() || data.name.trim(),
      day: Number(data.day),
      month: Number(data.month),
      year: Number(data.year),
      type: data.type,
      description: data.description?.trim() || '',
      wishKhasi: data.wishKhasi?.trim() || '',
      wishEnglish: data.wishEnglish?.trim() || '',
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(docRef, payload, { merge: true });
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.UPDATE, `${CUSTOM_HOLIDAYS_COLLECTION}/${id}`);
      throw err;
    }
  };

  const deleteHoliday = async (id: string) => {
    if (!currentUser || !isAdmin) {
      throw new Error('Unauthorized');
    }
    const docRef = doc(db, CUSTOM_HOLIDAYS_COLLECTION, id);
    try {
      await deleteDoc(docRef);
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.DELETE, `${CUSTOM_HOLIDAYS_COLLECTION}/${id}`);
      throw err;
    }
  };

  /**
   * Admin approves a holiday: changes status to 'active', makes it live on calendar, updates notifications
   */
  const approveHoliday = async (holidayId: string) => {
    if (!isAdmin || !currentUser?.email) {
      throw new Error('Only authorized admins can approve holidays.');
    }

    const notifs = holidayApprovalService.getNotifications();
    const notif = notifs.find(n => n.id === holidayId || n.holidayId === holidayId);
    const targetHolidayId = notif ? notif.holidayId : holidayId;
    const now = new Date().toISOString();

    await holidayApprovalService.approveHoliday(holidayId, currentUser.email);

    // Write directly to Firestore with setDoc merge
    try {
      const docRef = doc(db, ALL_HOLIDAYS_COLLECTION, targetHolidayId);
      await setDoc(docRef, {
        status: 'active',
        updatedAt: now,
        approvedAt: now,
        approvedBy: currentUser.email
      }, { merge: true });
    } catch (err) {
      console.warn('Could not update Firestore approval, saved locally:', err);
    }

    setAllPaidHolidays(prev => {
      const updated = prev.map(h => {
        const isMatch = h.id === targetHolidayId || h.id === holidayId ||
          (notif && h.title.trim().toLowerCase() === notif.holidayTitle.trim().toLowerCase() && h.date === notif.date);
        return isMatch ? { ...h, status: 'active' as const } : h;
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setPendingNotificationsCount(holidayApprovalService.getPendingCount());

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kj_holidays_updated'));
    }
  };

  /**
   * Admin denies a holiday: changes status to 'denied', keeps it hidden, records reason
   */
  const denyHoliday = async (holidayId: string, reason?: string) => {
    if (!isAdmin || !currentUser?.email) {
      throw new Error('Only authorized admins can deny holidays.');
    }

    const notifs = holidayApprovalService.getNotifications();
    const notif = notifs.find(n => n.id === holidayId || n.holidayId === holidayId);
    const targetHolidayId = notif ? notif.holidayId : holidayId;
    const now = new Date().toISOString();

    await holidayApprovalService.denyHoliday(holidayId, currentUser.email, reason);

    try {
      const docRef = doc(db, ALL_HOLIDAYS_COLLECTION, targetHolidayId);
      await setDoc(docRef, {
        status: 'denied',
        updatedAt: now,
        deniedAt: now,
        deniedBy: currentUser.email,
        denialReason: reason?.trim() || 'Not approved as a public holiday'
      }, { merge: true });
    } catch (err) {
      console.warn('Could not update Firestore denial, saved locally:', err);
    }

    setAllPaidHolidays(prev => {
      const updated = prev.map(h => {
        const isMatch = h.id === targetHolidayId || h.id === holidayId ||
          (notif && h.title.trim().toLowerCase() === notif.holidayTitle.trim().toLowerCase() && h.date === notif.date);
        return isMatch ? { ...h, status: 'denied' as const } : h;
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_ALL_HOLIDAYS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setPendingNotificationsCount(holidayApprovalService.getPendingCount());

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kj_holidays_updated'));
    }
  };

  return {
    customHolidays: combinedHolidays, // returns all active holidays including paid ones with 1Y and ∞ badges
    allPaidHolidays,
    deletedHolidayKeys,
    reports,
    loading,
    error,
    currentUser,
    isAdmin,
    pendingNotificationsCount,
    loginWithGoogle,
    logout,
    addPaidHoliday,
    approveHoliday,
    denyHoliday,
    editPaidHolidayTitle,
    deleteHolidayDoc,
    adminDeletePaidHoliday,
    submitHolidayReport,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    syncWithFirebase,
    lastSyncedTime,
    isSyncing
  };
}
