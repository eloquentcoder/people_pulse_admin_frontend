/**
 * One formatter for plan money, so the table, the details drawer and the form
 * hint cannot disagree about currency or decimals.
 */
export const formatPlanPrice = (
  amount: number | string | null | undefined,
  currency?: string | null,
): string => {
  const value = typeof amount === 'number' ? amount : parseFloat(String(amount ?? ''));
  const safeValue = Number.isFinite(value) ? value : 0;
  const resolvedCurrency = (currency || 'NGN').toUpperCase();

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: resolvedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(safeValue);
  } catch {
    // An unknown currency code should not blank the price out.
    return `${resolvedCurrency} ${safeValue.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
  }
};
