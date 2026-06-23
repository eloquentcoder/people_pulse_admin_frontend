import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

const navigateSpy = vi.fn();
const statsMock = vi.fn();

vi.mock("react-router-dom", async (importActual) => {
  const actual = await importActual<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateSpy };
});

vi.mock("@/domains/portal/notifications/apis/notification.api", () => ({
  useGetNotificationStatsQuery: () => statsMock(),
}));

vi.mock("@/common/hooks/useAppSelector", () => ({
  useAppSelector: () => ({ user: { first_name: "Pat", last_name: "Admin" } }),
}));

vi.mock("@/domains/auth/login/apis/login.api", () => ({
  useLogoutMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock("@/common/hooks/useSidebar", () => ({
  useSidebar: () => ({ toggle: vi.fn() }),
}));

import { Navbar } from "./navbar";

describe("Navbar notifications bell", () => {
  beforeEach(() => {
    navigateSpy.mockReset();
    statsMock.mockReset();
  });

  it("shows the unread count badge", () => {
    statsMock.mockReturnValue({ data: { data: { unread_notifications: 3 } } });

    render(<Navbar />);

    expect(screen.getByTestId("notification-badge")).toHaveTextContent("3");
  });

  it("hides the badge when there are no unread notifications", () => {
    statsMock.mockReturnValue({ data: { data: { unread_notifications: 0 } } });

    render(<Navbar />);

    expect(screen.queryByTestId("notification-badge")).toBeNull();
  });

  it("navigates to /notifications when the bell is clicked", () => {
    statsMock.mockReturnValue({ data: { data: { unread_notifications: 1 } } });

    render(<Navbar />);

    fireEvent.click(screen.getByRole("button", { name: /notifications/i }));

    expect(navigateSpy).toHaveBeenCalledWith("/notifications");
  });
});
