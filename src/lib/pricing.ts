import type { OrderPricing } from "@/types/order";
import type { Product } from "./products";

const CONSULTATION_FEE = 49;
const SHIPPING_FEE = 15;
const TAX_RATE = 0.08;

/**
 * When true, checkout totals (and the PrescribeRx payment amount) are zeroed.
 * We now record the real curated price instead, so this stays false.
 */
export const CHECKOUT_DEMO_ZERO = false;

/**
 * Sandbox mode: keep the PrescribeRx test-card prefill and "no real charge"
 * messaging on. Payments still post as `reference_captured` (external sale),
 * so no card is actually charged even though we record the real curated price.
 * Set to false for production with a live payment gateway.
 */
export const CHECKOUT_SANDBOX = true;

export function calculateOrderPricing(product: Product): OrderPricing {
  if (CHECKOUT_DEMO_ZERO) {
    return {
      treatmentMonthly: 0,
      consultationFee: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    };
  }

  const treatmentMonthly = product.monthlyPrice;
  const consultationFee = CONSULTATION_FEE;
  const shipping = SHIPPING_FEE;
  const subtotal = treatmentMonthly + consultationFee + shipping;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return { treatmentMonthly, consultationFee, shipping, tax, total };
}

/** Catalog list price shown on PDPs / for order-summary context (not charged in demo). */
export function getCatalogListPrice(product: Product): number {
  return product.monthlyPrice;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
