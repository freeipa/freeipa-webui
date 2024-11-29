import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// Component
import DateTimeSelector from "./DateTimeSelector";

describe("DateTimeSelector Component", () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    datetime: null,
    onChange: mockOnChange,
    name: "krbpasswordexpiration",
    ariaLabel: "Kerberos password expiration date",
    isDisabled: false,
  };

  it("renders the date and time inputs correctly", () => {
    render(<DateTimeSelector {...defaultProps} />);

    // Verify there is a date entry field
    const dateInput = screen.getByPlaceholderText("YYYY-MM-DD");
    expect(dateInput).toBeInTheDocument();

    // Verify there is a time entry field
    const timeInput = screen.getByPlaceholderText("hh:mm");
    expect(timeInput).toBeInTheDocument();

    // Verify there is selector of the date toggle button
    const dateToggleButton = screen.getByLabelText("Toggle date picker");
    expect(dateToggleButton).toBeInTheDocument();
  });

  it("allows user to enter a date and time and triggers onChange", () => {
    render(<DateTimeSelector {...defaultProps} />);

    const dateInput = screen.getByPlaceholderText("YYYY-MM-DD");
    const timeInput = screen.getByPlaceholderText("hh:mm");

    // Simulates the user writes a valid date
    fireEvent.change(dateInput, { target: { value: "2023-12-25" } });
    expect(dateInput).toHaveValue("2023-12-25");

    // Simulates the user writes a valid time
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    expect(timeInput).toHaveValue("14:30");

    // Triggers the `onChange` function (by blurring)
    fireEvent.blur(dateInput);
    fireEvent.blur(timeInput);

    expect(mockOnChange).toHaveBeenCalledTimes(2);
    // Validates that value provided by the `onChange` function returns a valid datetime
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it("disables inputs when isDisabled is true", () => {
    render(<DateTimeSelector {...defaultProps} isDisabled={true} />);

    const dateInput = screen.getByPlaceholderText("YYYY-MM-DD");
    const timeInput = screen.getByPlaceholderText("hh:mm");

    expect(dateInput).toBeDisabled();
    expect(timeInput).toBeDisabled();
  });

  it("toggles the date picker when the button is clicked", async () => {
    render(<DateTimeSelector {...defaultProps} />);

    const dateToggleButton = screen.getByLabelText("Toggle date picker");

    // Toggle is clicked
    fireEvent.click(dateToggleButton);

    // As the Popper.js (component used by the PatternFly component) is
    // using state updates, this should be wrapped inside of an `act()`.
    // The `waitFor()` already uses `act()` internally.
    await waitFor(() => {
      // Verifies that the calendar popup is shown
      const datePickerPopup = screen.getByRole("dialog");
      expect(datePickerPopup).toBeInTheDocument();
    });
  });
});
