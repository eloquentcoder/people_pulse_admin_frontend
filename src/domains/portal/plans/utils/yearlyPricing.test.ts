import { describe, it, expect } from 'vitest';
import { normalizeDiscountPercent, yearlyTotal, yearlySavings, hasYearlyDiscount } from './yearlyPricing';

describe('normalizeDiscountPercent', () => {
  it('returns 0 for a missing discount', () => {
    expect(normalizeDiscountPercent(null)).toBe(0);
    expect(normalizeDiscountPercent(undefined)).toBe(0);
  });

  it('parses the string the Laravel decimal cast returns', () => {
    expect(normalizeDiscountPercent('16.67')).toBe(16.67);
  });

  it('clamps out of range values the way the backend does', () => {
    expect(normalizeDiscountPercent(-20)).toBe(0);
    expect(normalizeDiscountPercent(180)).toBe(100);
  });

  it('treats unparseable values as no discount', () => {
    expect(normalizeDiscountPercent('half')).toBe(0);
    expect(normalizeDiscountPercent('')).toBe(0);
  });
});

describe('yearlyTotal', () => {
  it('bills twelve full months when there is no discount', () => {
    expect(yearlyTotal(2500, null)).toBe(30000);
    expect(yearlyTotal(2500, 0)).toBe(30000);
  });

  it('applies the discount to the twelve month total', () => {
    expect(yearlyTotal(2500, 16.67)).toBe(24999);
    expect(yearlyTotal(2500, 25)).toBe(22500);
    expect(yearlyTotal(2500, 100)).toBe(0);
  });

  it('matches the backend rounding to two decimal places', () => {
    // 1000 x 12 = 12000 less 16.67% = 9999.6
    expect(yearlyTotal(1000, 16.67)).toBe(9999.6);
  });

  it('accepts the string price the API returns', () => {
    expect(yearlyTotal('2500.00', '16.67')).toBe(24999);
  });

  it('treats a missing price as zero', () => {
    expect(yearlyTotal(undefined, 25)).toBe(0);
  });
});

describe('yearlySavings', () => {
  it('is zero without a discount', () => {
    expect(yearlySavings(2500, null)).toBe(0);
  });

  it('is the difference against paying monthly for a year', () => {
    expect(yearlySavings(2500, 16.67)).toBe(5001);
    expect(yearlySavings(2500, 25)).toBe(7500);
    expect(yearlySavings(2500, 100)).toBe(30000);
  });
});

describe('hasYearlyDiscount', () => {
  it('is only true for a positive discount', () => {
    expect(hasYearlyDiscount(16.67)).toBe(true);
    expect(hasYearlyDiscount(0)).toBe(false);
    expect(hasYearlyDiscount(null)).toBe(false);
    expect(hasYearlyDiscount(undefined)).toBe(false);
  });
});
