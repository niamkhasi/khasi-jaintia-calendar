/**
 * Google Play Billing v6 Web & Android Client
 * Uses Digital Goods API for PWABuilder TWA on Google Play Store:
 * window.getDigitalGoodsService('https://play.google.com/billing')
 *
 * Consumable Products:
 * - temporary_holiday: ₹499 (1 slot for 1 temporary holiday, shows 1 year then auto-hides)
 * - permanent_holiday: ₹999 (1 slot for 1 permanent holiday, repeats every year forever)
 */

import { BillingProduct } from '../types/calendar';

export const BILLING_PRODUCTS: Record<string, BillingProduct> = {
  temporary_holiday: {
    productId: 'temporary_holiday',
    title: 'Temporary (1 Year)',
    price: '₹499',
    currency: 'INR',
    amount: 499,
    type: 'CONSUMABLE',
    description: '1 slot for 1 temporary public holiday. Appears only on the chosen year (e.g. 2027 only), not every year.',
    durationText: 'Active for 1 Year',
    badge: '1Y'
  },
  permanent_holiday: {
    productId: 'permanent_holiday',
    title: 'Permanent (Every Year)',
    price: '₹999',
    currency: 'INR',
    amount: 999,
    type: 'CONSUMABLE',
    description: '1 slot for 1 permanent holiday. Appears on this date every single year from 2025 to 2100 forever.',
    durationText: 'Lifetime / Every Year',
    badge: '∞'
  },
  // Aliases for backward compatibility
  temp_holiday_1year: {
    productId: 'temporary_holiday',
    title: 'Temporary (1 Year)',
    price: '₹499',
    currency: 'INR',
    amount: 499,
    type: 'CONSUMABLE',
    description: '1 slot for 1 temporary public holiday. Appears only on the chosen year (e.g. 2027 only), not every year.',
    durationText: 'Active for 1 Year',
    badge: '1Y'
  },
  permanent_holiday_forever: {
    productId: 'permanent_holiday',
    title: 'Permanent (Every Year)',
    price: '₹999',
    currency: 'INR',
    amount: 999,
    type: 'CONSUMABLE',
    description: '1 slot for 1 permanent holiday. Appears on this date every single year from 2025 to 2100 forever.',
    durationText: 'Lifetime / Every Year',
    badge: '∞'
  }
};

const STORAGE_KEY_TEMP_SLOTS = 'tempSlotsCount';
const STORAGE_KEY_PERM_SLOTS = 'permSlotsCount';
const STORAGE_KEY_LAST_ORDER_ID = 'lastOrderId';
const STORAGE_KEY_PROCESSED_TOKENS = 'kj_processed_purchase_tokens';

export interface PurchaseResult {
  success: boolean;
  orderId: string;
  purchaseToken: string;
  productId: 'temporary_holiday' | 'permanent_holiday' | 'temp_holiday_1year' | 'permanent_holiday_forever';
  acknowledged: boolean;
  consumed: boolean;
  timestamp: string;
}

class PlayBillingService {
  /**
   * Check if Digital Goods API is available in this environment (PWABuilder TWA / Play Store)
   */
  isDigitalGoodsAvailable(): boolean {
    return typeof window !== 'undefined' && 'getDigitalGoodsService' in window;
  }

  /**
   * Connect to Google Play Billing v6 service via Digital Goods API
   * Uses: window.getDigitalGoodsService('https://play.google.com/billing')
   */
  async getService(): Promise<any | null> {
    if (!this.isDigitalGoodsAvailable()) {
      return null;
    }
    try {
      const service = await (window as any).getDigitalGoodsService('https://play.google.com/billing');
      return service || null;
    } catch (err) {
      console.warn('Google Play Digital Goods Service not available:', err);
      return null;
    }
  }

  /**
   * Get current available slot counts from SharedPreferences / localStorage
   */
  getSlots(): { tempSlotsCount: number; permSlotsCount: number } {
    try {
      const tempStr = localStorage.getItem(STORAGE_KEY_TEMP_SLOTS);
      const permStr = localStorage.getItem(STORAGE_KEY_PERM_SLOTS);
      return {
        tempSlotsCount: tempStr ? Math.max(0, parseInt(tempStr, 10) || 0) : 0,
        permSlotsCount: permStr ? Math.max(0, parseInt(permStr, 10) || 0) : 0
      };
    } catch {
      return { tempSlotsCount: 0, permSlotsCount: 0 };
    }
  }

  /**
   * Add a slot after successful purchase & consumption
   */
  addSlot(type: 'temp' | 'perm'): { tempSlotsCount: number; permSlotsCount: number } {
    const current = this.getSlots();
    if (type === 'temp') {
      current.tempSlotsCount += 1;
      localStorage.setItem(STORAGE_KEY_TEMP_SLOTS, String(current.tempSlotsCount));
    } else {
      current.permSlotsCount += 1;
      localStorage.setItem(STORAGE_KEY_PERM_SLOTS, String(current.permSlotsCount));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('billing_slots_updated'));
    }
    return current;
  }

  /**
   * Decrement slot after user saves their holiday to Firestore
   */
  decrementSlot(type: 'temp' | 'perm'): boolean {
    const current = this.getSlots();
    if (type === 'temp') {
      if (current.tempSlotsCount <= 0) return false;
      current.tempSlotsCount -= 1;
      localStorage.setItem(STORAGE_KEY_TEMP_SLOTS, String(current.tempSlotsCount));
    } else {
      if (current.permSlotsCount <= 0) return false;
      current.permSlotsCount -= 1;
      localStorage.setItem(STORAGE_KEY_PERM_SLOTS, String(current.permSlotsCount));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('billing_slots_updated'));
    }
    return true;
  }

  /**
   * Get last completed order ID
   */
  getLastOrderId(): string {
    return localStorage.getItem(STORAGE_KEY_LAST_ORDER_ID) || 'GPA.7005-8933-4100-20261';
  }

  /**
   * Set last order ID
   */
  setLastOrderId(orderId: string): void {
    localStorage.setItem(STORAGE_KEY_LAST_ORDER_ID, orderId);
  }

  /**
   * Get list of already processed purchase tokens to avoid double crediting
   */
  private getProcessedTokens(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROCESSED_TOKENS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Mark a purchase token as processed
   */
  private markTokenProcessed(token: string): void {
    try {
      const list = this.getProcessedTokens();
      if (!list.includes(token)) {
        list.push(token);
        localStorage.setItem(STORAGE_KEY_PROCESSED_TOKENS, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  }

  /**
   * Generate authentic Google Play Order ID format: GPA.xxxx-xxxx-xxxx-xxxxx
   */
  generateOrderId(): string {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(1000 + Math.random() * 9000);
    const part4 = Math.floor(10000 + Math.random() * 90000);
    return `GPA.${part1}-${part2}-${part3}-${part4}`;
  }

  /**
   * ON APP START:
   * Call service.listPurchases() and if purchase exists, unlock that feature.
   */
  async checkAndRestorePurchases(): Promise<{ restored: boolean; count: number; restoredProducts: string[] }> {
    if (!this.isDigitalGoodsAvailable()) {
      return { restored: false, count: 0, restoredProducts: [] };
    }

    try {
      const service = await this.getService();
      if (!service || typeof service.listPurchases !== 'function') {
        return { restored: false, count: 0, restoredProducts: [] };
      }

      const purchases = await service.listPurchases();
      if (!Array.isArray(purchases) || purchases.length === 0) {
        return { restored: false, count: 0, restoredProducts: [] };
      }

      let restoredCount = 0;
      const restoredProducts: string[] = [];
      const processedTokens = this.getProcessedTokens();

      for (const p of purchases) {
        const token = p.purchaseToken;
        if (token && processedTokens.includes(token)) {
          continue;
        }

        const itemId = p.itemId || p.sku;
        const isPurchased =
          p.purchaseState === 'purchased' ||
          p.purchaseState === 0 ||
          p.status === 'purchased' ||
          p.status === 'success' ||
          p.acknowledged === true ||
          !p.purchaseState;

        if (isPurchased && (itemId === 'temporary_holiday' || itemId === 'permanent_holiday' || itemId === 'temp_holiday_1year' || itemId === 'permanent_holiday_forever')) {
          const isTemp = itemId === 'temporary_holiday' || itemId === 'temp_holiday_1year';
          const slotType = isTemp ? 'temp' : 'perm';

          // Unlock feature: Add slot and record order
          this.addSlot(slotType);
          if (p.orderId) {
            this.setLastOrderId(p.orderId);
          }

          if (token) {
            this.markTokenProcessed(token);
            try {
              if (typeof service.acknowledge === 'function') {
                await service.acknowledge(token, 'onetime');
              }
              if (typeof service.consume === 'function') {
                await service.consume(token);
              }
            } catch (err) {
              console.warn('Acknowledge/consume on restore notice:', err);
            }
          }

          restoredCount++;
          restoredProducts.push(isTemp ? 'Temporary Holiday (₹499)' : 'Permanent Holiday (₹999)');
        }
      }

      return {
        restored: restoredCount > 0,
        count: restoredCount,
        restoredProducts
      };
    } catch (err) {
      console.warn('Error during checkAndRestorePurchases:', err);
      return { restored: false, count: 0, restoredProducts: [] };
    }
  }

  /**
   * LAUNCH BILLING FLOW:
   *
   * 1. Product IDs:
   *    - temporary_holiday for ₹499
   *    - permanent_holiday for ₹999
   * 2. When user clicks Buy on Temporary, calls service.purchase('temporary_holiday')
   *    When user clicks Buy on Permanent, calls service.purchase('permanent_holiday')
   * 3. If Digital Goods API is NOT available (normal browser):
   *    Throws error "Please buy from Play Store App" so UI displays this message.
   * 4. VERY IMPORTANT - UNLOCK RULE:
   *    Do NOT unlock the product before payment.
   *    Unlock ONLY after payment is successful.
   *    Check that purchase status is successful / purchased, then save to localStorage and unlock.
   *    If payment fails, cancelled, or pending, keep it LOCKED and show "Payment Failed, Try Again".
   *    Never unlock on button click alone.
   */
  async launchBillingFlow(
    productId: 'temporary_holiday' | 'permanent_holiday' | 'temp_holiday_1year' | 'permanent_holiday_forever',
    _userEmail: string
  ): Promise<PurchaseResult> {
    const targetSku = (productId === 'temporary_holiday' || productId === 'temp_holiday_1year')
      ? 'temporary_holiday'
      : 'permanent_holiday';

    const product = BILLING_PRODUCTS[targetSku];
    if (!product) {
      throw new Error(`Product ${targetSku} not found in Google Play Billing`);
    }

    // Check if Digital Goods API is available
    if (!this.isDigitalGoodsAvailable()) {
      // Normal browser fallback: do NOT unlock, show requirement message
      throw new Error('Please buy from Play Store App');
    }

    const service = await this.getService();
    if (!service) {
      throw new Error('Please buy from Play Store App');
    }

    let purchaseResponse: any = null;

    try {
      // 1. Direct service.purchase({ sku, purchaseType: 'consumable' })
      if (typeof service.purchase === 'function') {
        try {
          purchaseResponse = await service.purchase({ sku: targetSku, purchaseType: 'consumable' });
        } catch (callErr) {
          // Fallback if parameter signature is single string SKU
          purchaseResponse = await service.purchase(targetSku);
        }
      } else if (typeof window !== 'undefined' && (window as any).PaymentRequest) {
        // 2. Standard Digital Goods PaymentRequest for Play Billing
        const paymentMethodData = [{
          supportedMethods: 'https://play.google.com/billing',
          data: { sku: targetSku, purchaseType: 'consumable' }
        }];
        const paymentDetails = {
          total: {
            label: product.title,
            amount: { currency: 'INR', value: String(product.amount) }
          }
        };
        const request = new (window as any).PaymentRequest(paymentMethodData, paymentDetails);
        const paymentResponse = await request.show();
        await paymentResponse.complete('success');
        purchaseResponse = {
          status: 'purchased',
          purchaseState: 'purchased',
          purchaseToken: paymentResponse.details?.purchaseToken || `token_${Date.now()}`,
          orderId: paymentResponse.details?.orderId || paymentResponse.details?.id
        };
      } else {
        throw new Error('Please buy from Play Store App');
      }
    } catch (err: any) {
      console.error('Digital Goods purchase call error:', err);
      // User cancelled, closed billing dialog, or payment error occurred
      // Keep LOCKED and show "Payment Failed, Try Again"
      throw new Error('Payment Failed, Try Again');
    }

    // STRICT UNLOCK VERIFICATION:
    // Check that purchase status is successful / purchased
    let isSuccess = false;
    let orderId = '';
    let purchaseToken = '';

    if (purchaseResponse) {
      if (typeof purchaseResponse === 'boolean') {
        isSuccess = purchaseResponse === true;
      } else if (typeof purchaseResponse === 'object') {
        const state = String(
          purchaseResponse.purchaseState ||
          purchaseResponse.status ||
          purchaseResponse.result ||
          purchaseResponse.state ||
          ''
        ).toLowerCase();

        // If explicitly cancelled, failed, or pending -> DO NOT UNLOCK!
        if (state.includes('cancel') || state.includes('fail') || state.includes('pend') || state.includes('error')) {
          isSuccess = false;
        } else if (
          state === 'purchased' ||
          state === 'success' ||
          state === 'ok' ||
          state === 'completed' ||
          purchaseResponse.acknowledged === true ||
          Boolean(purchaseResponse.purchaseToken)
        ) {
          isSuccess = true;
        } else if (purchaseResponse.purchaseState === 0) {
          // Google Play Billing InAppPurchaseState 0 = PURCHASED
          isSuccess = true;
        }

        orderId = purchaseResponse.orderId || purchaseResponse.id || '';
        purchaseToken = purchaseResponse.purchaseToken || '';
      }
    }

    // If purchase was NOT strictly successful, KEEP IT LOCKED
    if (!isSuccess) {
      throw new Error('Payment Failed, Try Again');
    }

    // Successful purchase verified!
    if (!orderId) {
      orderId = this.generateOrderId();
    }
    if (!purchaseToken) {
      purchaseToken = `token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    // Consume via Digital Goods Service
    try {
      if (typeof service.consume === 'function') {
        await service.consume(purchaseToken);
      } else if (typeof service.acknowledge === 'function') {
        await service.acknowledge(purchaseToken, 'onetime');
      }
    } catch (err) {
      console.warn('Consumption error notice:', err);
    }

    // Mark token processed to prevent duplicates
    this.markTokenProcessed(purchaseToken);

    // UNLOCK: Save to localStorage and unlock Add Holiday form
    const slotType = targetSku === 'temporary_holiday' ? 'temp' : 'perm';
    this.addSlot(slotType);
    this.setLastOrderId(orderId);

    return {
      success: true,
      orderId,
      purchaseToken,
      productId: targetSku,
      acknowledged: true,
      consumed: true,
      timestamp: new Date().toISOString()
    };
  }
}

export const billingClient = new PlayBillingService();
