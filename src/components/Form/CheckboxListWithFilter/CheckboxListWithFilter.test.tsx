import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";
// Component
import CheckboxListWithFilter, {
  CheckboxListWithFilterProps,
} from "./CheckboxListWithFilter";

describe("CheckboxListWithFilter Component", () => {
  const mockSetSelectedValues = vi.fn();

  const defaultProps: CheckboxListWithFilterProps = {
    dataCy: "checkbox-list-filter",
    name: "test-checkboxes",
    ariaLabel: "Test checkboxes",
    options: [
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" },
      { value: "option3", text: "Option 3" },
      { value: "special", text: "Special item" },
    ],
    selectedValues: [],
    setSelectedValues: mockSetSelectedValues,
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the CheckboxListWithFilter component with all options", () => {
    render(<CheckboxListWithFilter {...defaultProps} />);

    // Check that all checkboxes are rendered
    defaultProps.options.forEach((option) => {
      expect(screen.getByLabelText(option.text)).toBeInTheDocument();
    });

    // Check that the filter input is rendered
    expect(
      screen.getByPlaceholderText("Filter options...")
    ).toBeInTheDocument();
  });

  it("filters checkboxes based on search input", () => {
    render(<CheckboxListWithFilter {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");

    // Filter by "option"
    fireEvent.change(filterInput, { target: { value: "option" } });

    // Should show Options 1, 2, and 3
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 3")).toBeInTheDocument();

    // Should not show "Special item"
    expect(screen.queryByLabelText("Special item")).not.toBeInTheDocument();
  });

  it("shows 'No options match' message when filter has no results", () => {
    render(<CheckboxListWithFilter {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");

    // Filter by something that doesn't exist
    fireEvent.change(filterInput, { target: { value: "nonexistent" } });

    expect(
      screen.getByText("No options match the filter.")
    ).toBeInTheDocument();
  });

  it("calls setSelectedValues when checkbox is clicked", () => {
    render(<CheckboxListWithFilter {...defaultProps} />);

    const checkbox = screen.getByLabelText("Option 1");

    // Click the checkbox
    fireEvent.click(checkbox);

    expect(mockSetSelectedValues).toHaveBeenCalledWith(["option1"]);
  });

  it("removes value from selectedValues when checkbox is unchecked", () => {
    render(
      <CheckboxListWithFilter
        {...defaultProps}
        selectedValues={["option1", "option2"]}
      />
    );

    const checkbox = screen.getByLabelText("Option 1");

    // Uncheck the checkbox
    fireEvent.click(checkbox);

    expect(mockSetSelectedValues).toHaveBeenCalledWith(["option2"]);
  });

  it("shows checkboxes as checked when in selectedValues", () => {
    render(
      <CheckboxListWithFilter
        {...defaultProps}
        selectedValues={["option1", "option3"]}
      />
    );

    expect(screen.getByLabelText("Option 1")).toBeChecked();
    expect(screen.getByLabelText("Option 2")).not.toBeChecked();
    expect(screen.getByLabelText("Option 3")).toBeChecked();
    expect(screen.getByLabelText("Special item")).not.toBeChecked();
  });

  it("clears filter when reset button is clicked", () => {
    render(<CheckboxListWithFilter {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");

    // Add filter
    fireEvent.change(filterInput, { target: { value: "special" } });

    // Verify filter is applied (only 1 option visible)
    expect(screen.queryByLabelText("Option 1")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Special item")).toBeInTheDocument();

    // Clear the filter using the reset button
    const clearButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(clearButton);

    // All options should be visible again
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Special item")).toBeInTheDocument();
  });

  it("filters case-insensitively", () => {
    render(<CheckboxListWithFilter {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");

    // Filter with uppercase
    fireEvent.change(filterInput, { target: { value: "SPECIAL" } });

    // Should still find the option
    expect(screen.getByLabelText("Special item")).toBeInTheDocument();
  });

  it("respects isDisabled prop", () => {
    render(<CheckboxListWithFilter {...defaultProps} isDisabled={true} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");
    expect(filterInput).toBeDisabled();

    const checkbox = screen.getByLabelText("Option 1");
    expect(checkbox).toBeDisabled();
  });

  it("uses custom placeholder when provided", () => {
    render(
      <CheckboxListWithFilter {...defaultProps} placeholder="Search items..." />
    );

    expect(screen.getByPlaceholderText("Search items...")).toBeInTheDocument();
  });

  it("respects custom maxHeight", () => {
    const { container } = render(
      <CheckboxListWithFilter {...defaultProps} maxHeight="500px" />
    );

    const scrollableContainer = container.querySelector(
      ".pf-v6-u-overflow-y-auto"
    );
    expect(scrollableContainer).toHaveStyle({ maxHeight: "500px" });
  });
});
