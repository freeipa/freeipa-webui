import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { expect, it, describe, vi, afterEach } from "vitest";
import { DropdownItem } from "@patternfly/react-core";
// Component
import KebabLayout from "./KebabLayout";

const defaultProps = {
  dataCy: "test-kebab",
  idKebab: "test-kebab-id",
  isDisabled: false,
};

describe("KebabLayout Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with required props only", () => {
    render(<KebabLayout {...defaultProps} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it("handles toggle click events", () => {
    const mockOnKebabToggle = vi.fn();
    const props = { ...defaultProps, onKebabToggle: mockOnKebabToggle };
    render(<KebabLayout {...props} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    fireEvent.click(toggleButton);

    expect(mockOnKebabToggle).toHaveBeenCalledTimes(1);
  });

  it("sets aria-expanded based on isKebabOpen prop", () => {
    const { rerender } = render(
      <KebabLayout {...defaultProps} isKebabOpen={true} />
    );

    let toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    rerender(<KebabLayout {...defaultProps} isKebabOpen={false} />);

    toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders dropdown items when provided", () => {
    const props = {
      ...defaultProps,
      isKebabOpen: true,
      dropdownItems: [
        <DropdownItem key="test1" data-cy="test-item-1">
          Test Item 1
        </DropdownItem>,
        <DropdownItem key="test2" data-cy="test-item-2">
          Test Item 2
        </DropdownItem>,
      ],
    };

    render(<KebabLayout {...props} />);

    expect(screen.getByText("Test Item 1")).toBeInTheDocument();
    expect(screen.getByText("Test Item 2")).toBeInTheDocument();
  });

  it("disables toggle when isDisabled is true", () => {
    const props = { ...defaultProps, isDisabled: true };
    render(<KebabLayout {...props} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toBeDisabled();
  });
});
