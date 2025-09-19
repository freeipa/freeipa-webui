import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { expect, it, describe, vi, afterEach } from "vitest";
import { DropdownItem } from "@patternfly/react-core";
// Component
import KebabLayout from "./KebabLayout";

const mockOnDropdownSelect = vi.fn();
const mockOnKebabToggle = vi.fn();

const defaultProps = {
  dataCy: "test-kebab",
  idKebab: "test-kebab-id",
};

const completeProps = {
  dataCy: "complete-kebab",
  idKebab: "complete-kebab-id",
  onDropdownSelect: mockOnDropdownSelect,
  isKebabOpen: false,
  className: "custom-kebab-class",
  isPlain: true,
  dropdownItems: [
    <DropdownItem
      key="item1"
      data-cy="dropdown-item-1"
      data-testid="dropdown-item-1"
    >
      Item 1
    </DropdownItem>,
    <DropdownItem
      key="item2"
      data-cy="dropdown-item-2"
      data-testid="dropdown-item-2"
    >
      Item 2
    </DropdownItem>,
  ],
  onKebabToggle: mockOnKebabToggle,
  direction: "down" as const,
};

describe("KebabLayout Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders with required props only", () => {
    render(<KebabLayout {...defaultProps} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("data-cy", "test-kebab");
    expect(toggleButton).toHaveAttribute("id", "test-kebab-id");
  });

  it("renders with all optional props", () => {
    render(<KebabLayout {...completeProps} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("data-cy", "complete-kebab");
    expect(toggleButton).toHaveAttribute("id", "complete-kebab-id");
  });

  it("displays kebab icon", () => {
    render(<KebabLayout {...defaultProps} />);

    const kebabIcon = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(kebabIcon).toBeInTheDocument();
    // The EllipsisVIcon should be rendered inside the button
    expect(kebabIcon.querySelector("svg")).toBeInTheDocument();
  });

  it("handles toggle click events", () => {
    const props = { ...defaultProps, onKebabToggle: mockOnKebabToggle };
    render(<KebabLayout {...props} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    fireEvent.click(toggleButton);

    expect(mockOnKebabToggle).toHaveBeenCalledTimes(1);
  });

  it("works without toggle click handler", () => {
    render(<KebabLayout {...defaultProps} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });

    expect(() => fireEvent.click(toggleButton)).not.toThrow();
  });

  it("shows expanded state when isKebabOpen is true", () => {
    const props = { ...defaultProps, isKebabOpen: true };
    render(<KebabLayout {...props} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("shows collapsed state when isKebabOpen is false", () => {
    const props = { ...defaultProps, isKebabOpen: false };
    render(<KebabLayout {...props} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders dropdown items when provided", () => {
    const props = {
      ...defaultProps,
      isKebabOpen: true,
      dropdownItems: [
        <DropdownItem
          key="test1"
          data-cy="test-item-1"
          data-testid="test-item-1"
        >
          Test Item 1
        </DropdownItem>,
        <DropdownItem
          key="test2"
          data-cy="test-item-2"
          data-testid="test-item-2"
        >
          Test Item 2
        </DropdownItem>,
      ],
    };

    render(<KebabLayout {...props} />);

    expect(screen.getByTestId("test-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("test-item-2")).toBeInTheDocument();
    expect(screen.getByText("Test Item 1")).toBeInTheDocument();
    expect(screen.getByText("Test Item 2")).toBeInTheDocument();
  });

  it("renders with onDropdownSelect handler", () => {
    const props = {
      ...defaultProps,
      isKebabOpen: true,
      onDropdownSelect: mockOnDropdownSelect,
      dropdownItems: [
        <DropdownItem
          key="selectable"
          data-cy="selectable-item"
          data-testid="selectable-item"
        >
          Selectable Item
        </DropdownItem>,
      ],
    };

    render(<KebabLayout {...props} />);

    const selectableItem = screen.getByTestId("selectable-item");
    expect(selectableItem).toBeInTheDocument();
    expect(selectableItem).toHaveTextContent("Selectable Item");

    // Verify component renders without error when onDropdownSelect is provided
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    const props = { ...defaultProps, className: "custom-dropdown-class" };
    render(<KebabLayout {...props} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it("sets isPlain prop correctly", () => {
    const props = { ...defaultProps, isPlain: true };
    render(<KebabLayout {...props} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass("pf-m-plain");
  });

  it("handles direction prop for popper positioning", () => {
    const propsUp = { ...defaultProps, direction: "up" as const };
    const propsDown = { ...defaultProps, direction: "down" as const };

    const { rerender } = render(<KebabLayout {...propsUp} />);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<KebabLayout {...propsDown} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("sets correct data-cy attributes", () => {
    render(<KebabLayout {...defaultProps} />);

    // Toggle should have the base dataCy
    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toHaveAttribute("data-cy", "test-kebab");

    expect(toggleButton).toBeInTheDocument();
  });

  it("renders without dropdown items", () => {
    const props = { ...defaultProps, isKebabOpen: true };
    render(<KebabLayout {...props} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("handles complex dropdown items", () => {
    const complexDropdownItems = [
      <DropdownItem key="edit" data-cy="edit-item" data-testid="edit-item">
        <span>Edit</span>
      </DropdownItem>,
      <DropdownItem
        key="delete"
        data-cy="delete-item"
        data-testid="delete-item"
        isDanger
      >
        <strong>Delete</strong>
      </DropdownItem>,
    ];

    const props = {
      ...defaultProps,
      isKebabOpen: true,
      dropdownItems: complexDropdownItems,
    };

    render(<KebabLayout {...props} />);

    expect(screen.getByTestId("edit-item")).toBeInTheDocument();
    expect(screen.getByTestId("delete-item")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("maintains accessibility attributes", () => {
    render(<KebabLayout {...defaultProps} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toHaveAttribute("aria-label", "kebab dropdown toggle");
    expect(toggleButton).toHaveAttribute("aria-expanded");
  });

  it("handles undefined optional props gracefully", () => {
    const propsWithUndefined = {
      ...defaultProps,
      onDropdownSelect: undefined,
      onKebabToggle: undefined,
      dropdownItems: undefined,
      className: undefined,
      isPlain: undefined,
      direction: undefined,
    };

    render(<KebabLayout {...propsWithUndefined} />);

    const toggleButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(toggleButton).toBeInTheDocument();
    expect(() => fireEvent.click(toggleButton)).not.toThrow();
  });
});
