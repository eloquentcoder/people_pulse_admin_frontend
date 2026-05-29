import { describe, it, expect } from "vitest";
import { computeExtendedTrialDate } from "./extendTrial";

const from = new Date("2026-05-28T00:00:00Z");

describe("computeExtendedTrialDate", () => {
  it("extends from the current trial end when it is still in the future", () => {
    expect(computeExtendedTrialDate("2026-06-15T00:00:00Z", 14, from)).toBe(
      "2026-06-29"
    );
  });

  it("extends from today when the current trial end is in the past", () => {
    expect(computeExtendedTrialDate("2026-05-01T00:00:00Z", 7, from)).toBe(
      "2026-06-04"
    );
  });

  it("extends from today when there is no current trial end", () => {
    expect(computeExtendedTrialDate(null, 30, from)).toBe("2026-06-27");
  });

  it("returns a plain yyyy-mm-dd date string", () => {
    expect(computeExtendedTrialDate(null, 7, from)).toMatch(
      /^\d{4}-\d{2}-\d{2}$/
    );
  });
});
