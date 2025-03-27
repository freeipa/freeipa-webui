import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
// Component
import IpaTextboxList, { PropsToIpaTextboxList } from "./IpaTextboxList";

describe("IpaTextboxList Component", () => {
  const mockSetIpaObject = vi.fn();

  const defaultProps: PropsToIpaTextboxList = {
    ipaObject: {},
    setIpaObject: mockSetIpaObject,
    name: "customipatextboxlist",
    ariaLabel: "customipatextboxlist",
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should render the component", () => {
    // Initially, the component contains just an 'Add' button
    render(<IpaTextboxList {...defaultProps} />);
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("should add an element to the list", () => {
    render(<IpaTextboxList {...defaultProps} />);
    fireEvent.click(screen.getByText("Add"));
    expect(mockSetIpaObject).toHaveBeenCalledTimes(1);
  });

  it("should remove an element from the list", () => {
    render(<IpaTextboxList {...defaultProps} />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Delete"));
    expect(mockSetIpaObject).toHaveBeenCalledTimes(2);
  });

  it("should change the value of an element in the list", () => {
    render(<IpaTextboxList {...defaultProps} />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "test" },
    });
    expect(mockSetIpaObject).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("textbox")).toHaveValue("test");
  });

  it("should validate there are no duplicated elements", () => {
    // Mock validatior function should check if entries contain a MAC address
    const mockValidator = vi.fn((value: string) => {
      const mac_regex = /^([a-fA-F0-9]{2}[:|\\-]?){5}[a-fA-F0-9]{2}$/;
      return value.match(mac_regex) !== null ? true : false;
    });

    const props: PropsToIpaTextboxList = {
      ...defaultProps,
      validator: mockValidator,
    };
    render(<IpaTextboxList {...props} />);
    expect(screen.getByText("Add")).toBeInTheDocument();
    const AddButton = screen.getByText("Add");

    // Add a valid MAC address
    fireEvent.click(AddButton);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "00:00:00:00:00:00" },
    });

    // Add an invalid MAC address
    fireEvent.click(AddButton);
    // Get second textbox
    const secondTextbox = screen.getAllByRole("textbox")[1];
    fireEvent.change(secondTextbox, {
      target: { value: "invalid" },
    });

    // The valid address should not be highlighted in red
    const textboxes = screen.getAllByRole("textbox");
    screen.debug(textboxes);

    // Expect first textbox to be valid and second to be invalid
    expect(textboxes[0]).toHaveAttribute("aria-invalid", "false");
    expect(textboxes[1]).toHaveAttribute("aria-invalid", "true");
  });
});
