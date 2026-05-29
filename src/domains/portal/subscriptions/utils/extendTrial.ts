// Compute a new trial-end date when extending a trial by a number of days.
// The extension is measured from the later of the current trial end (if it is
// still in the future) or `from` (today), so extending never shortens a trial.
// Returns a plain `yyyy-mm-dd` string suitable for a date input / the API.
export const computeExtendedTrialDate = (
  currentTrialEndsAt: string | null | undefined,
  days: number,
  from: Date = new Date()
): string => {
  const current = currentTrialEndsAt ? new Date(currentTrialEndsAt) : null;
  const base = current && current.getTime() > from.getTime() ? current : from;

  const result = new Date(base);
  result.setUTCDate(result.getUTCDate() + days);

  return result.toISOString().split("T")[0];
};
