import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { ExtendTrialDialog } from "./ExtendTrialDialog";
import type { Subscription } from "../types";

// Far-future trial end so the computed result is independent of "today".
const trialSub = {
  id: 1,
  status: "trial",
  trial_ends_at: "2099-06-15T00:00:00Z",
} as unknown as Subscription;

describe("ExtendTrialDialog", () => {
  it("confirms with the date computed from a preset (+14 days)", () => {
    const onConfirm = vi.fn();
    render(
      <ExtendTrialDialog
        open
        subscription={trialSub}
        onClose={() => {}}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /14 days/i }));
    fireEvent.click(screen.getByRole("button", { name: /^extend trial$/i }));

    expect(onConfirm).toHaveBeenCalledWith("2099-06-29");
  });

  it("confirms with a custom date when one is chosen", () => {
    const onConfirm = vi.fn();
    render(
      <ExtendTrialDialog
        open
        subscription={trialSub}
        onClose={() => {}}
        onConfirm={onConfirm}
      />
    );

    fireEvent.change(screen.getByLabelText(/custom date/i), {
      target: { value: "2099-07-01" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^extend trial$/i }));

    expect(onConfirm).toHaveBeenCalledWith("2099-07-01");
  });
});
