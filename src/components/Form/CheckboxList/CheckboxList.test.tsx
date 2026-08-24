import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";
import CheckboxList, { CheckboxListProps } from "./CheckboxList";

describe("CheckboxList Component", () => {
  const mockSetSelectedValues = vi.fn();

  const defaultProps: CheckboxListProps = {
    dataCy: "checkbox-list",
    name: "test-checkboxes",
    options: ["read", "write", "delete"],
    selectedValues: [],
    setSelectedValues: mockSetSelectedValues,
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders a checkbox for each option", () => {
    render(<CheckboxList {...defaultProps} />);

    expect(screen.getByLabelText("read")).toBeInTheDocument();
    expect(screen.getByLabelText("write")).toBeInTheDocument();
    expect(screen.getByLabelText("delete")).toBeInTheDocument();
  });

  it("capitalizes the first letter of each option label", () => {
    render(<CheckboxList {...defaultProps} />);

    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.getByText("Write")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls setSelectedValues with added value when checkbox is checked", () => {
    render(<CheckboxList {...defaultProps} />);

    fireEvent.click(screen.getByLabelText("read"));

    expect(mockSetSelectedValues).toHaveBeenCalledWith(["read"]);
  });

  it("calls setSelectedValues with removed value when checkbox is unchecked", () => {
    render(
      <CheckboxList {...defaultProps} selectedValues={["read", "write"]} />
    );

    fireEvent.click(screen.getByLabelText("read"));

    expect(mockSetSelectedValues).toHaveBeenCalledWith(["write"]);
  });

  it("shows checkboxes as checked when in selectedValues", () => {
    render(
      <CheckboxList {...defaultProps} selectedValues={["read", "delete"]} />
    );

    expect(screen.getByLabelText("read")).toBeChecked();
    expect(screen.getByLabelText("write")).not.toBeChecked();
    expect(screen.getByLabelText("delete")).toBeChecked();
  });

  it("respects isDisabled prop", () => {
    render(<CheckboxList {...defaultProps} isDisabled={true} />);

    expect(screen.getByLabelText("read")).toBeDisabled();
    expect(screen.getByLabelText("write")).toBeDisabled();
    expect(screen.getByLabelText("delete")).toBeDisabled();
  });

  it("renders data-cy attributes on individual checkboxes", () => {
    const { container } = render(<CheckboxList {...defaultProps} />);

    expect(
      container.querySelector('[data-cy="checkbox-list-read"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-cy="checkbox-list-write"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-cy="checkbox-list-delete"]')
    ).toBeInTheDocument();
  });

  it("handles empty options array", () => {
    const { container } = render(
      <CheckboxList {...defaultProps} options={[]} />
    );

    const wrapper = container.querySelector('[data-cy="checkbox-list"]');
    expect(wrapper).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
