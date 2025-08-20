import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
// Component
import PopoverWithIconLayout from "./PopoverWithIconLayout";

const TestMessage = <div>Popover Content</div>;

describe("PopoverWithIconLayout", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the question icon", () => {
    render(<PopoverWithIconLayout message={TestMessage} />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it("displays popover content on click", async () => {
    render(<PopoverWithIconLayout message={TestMessage} />);
    const icon = screen.getByRole("img", { hidden: true });
    fireEvent.click(icon);

    expect(await screen.findByText("Popover Content")).toBeInTheDocument();
  });

  it("displays popover content on hover if triggerHover is true", async () => {
    const user = userEvent.setup();
    render(<PopoverWithIconLayout message={TestMessage} triggerHover={true} />);
    const icon = screen.getByRole("img", { hidden: true });

    await user.hover(icon);

    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument();
    });
  });
});
