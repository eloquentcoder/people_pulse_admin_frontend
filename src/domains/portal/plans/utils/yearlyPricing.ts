/**
 * Mirror of the backend's App\Services\Billing\CyclePricing.
 *
 * A plan's price is a monthly per-employee rate. Paying a year up front bills
 * twelve months less the plan's yearly_discount_percent. Both values arrive from
 * Laravel's decimal cast as strings, so everything here coerces first.
 */

const YEARLY_MONTHS = 12;

type Numeric = number | string | null | undefined;

const toNumber = (value: Numeric): number => {
  const parsed = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const roundToKobo = (value: number): number => Math.round(value * 100) / 100;

/** Clamped to 0-100 so a bad stored value can never produce a negative charge. */
export const normalizeDiscountPercent = (discountPercent: Numeric): number =>
  Math.min(100, Math.max(0, toNumber(discountPercent)));

export const hasYearlyDiscount = (discountPercent: Numeric): boolean =>
  normalizeDiscountPercent(discountPercent) > 0;

/** What the customer pays for a year up front. */
export const yearlyTotal = (monthlyPrice: Numeric, discountPercent: Numeric): number => {
  const undiscounted = toNumber(monthlyPrice) * YEARLY_MONTHS;
  const multiplier = 1 - normalizeDiscountPercent(discountPercent) / 100;

  return roundToKobo(undiscounted * multiplier);
};

/** What the customer saves versus paying month by month for the same year. */
export const yearlySavings = (monthlyPrice: Numeric, discountPercent: Numeric): number => {
  const undiscounted = roundToKobo(toNumber(monthlyPrice) * YEARLY_MONTHS);

  return roundToKobo(undiscounted - yearlyTotal(monthlyPrice, discountPercent));
};
