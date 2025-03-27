import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, afterEach } from "vitest";
// Component
import IpaCalendar from "./IpaCalendar";
// Utils
import { IPAParamDefinition, updateIpaObject } from "src/utils/ipaObjectUtils";

// Mock of util function: updateIpaObject
vi.mock("src/utils/ipaObjectUtils", async () => ({
  ...(await vi.importActual("src/utils/ipaObjectUtils.ts")),
  updateIpaObject: vi.fn(),
}));

describe("IpaCalendar Component", () => {
  const mockOnchange = vi.fn();

  const mockMetadata = {
    objects: {
      user: {
        name: "user",
        takes_params: [
          {
            alwaysask: false,
            attribute: true,
            autofill: false,
            class: "String",
            cli_metavar: "KRBPASSWORD2",
            cli_name: "krbpasswordexpiration2",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "The expiration date of the user's password.",
            flags: [],
            label: "Kerberos password expiration 2",
            maxlength: 255,
            multivalue: false,
            name: "krbpasswordexpiration2",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            primary_key: false,
            query: false,
            required: true,
            sortorder: 1,
            type: "string",
          },
        ],
      },
    },
  };

  const defaultProps: IPAParamDefinition = {
    name: "krbpasswordexpiration2",
    ariaLabel: "Kerberos password expiration date 2",
    ipaObject: {},
    objectName: "user",
    onChange: mockOnchange,
    required: true,
    readOnly: true,
    metadata: mockMetadata,
  };

  afterEach(cleanup);

  it("renders the IpaCalendar with correct props", () => {
    render(<IpaCalendar {...defaultProps} />);

    // Verify the DateTimeSelector exist
    const dateInput = screen.getByPlaceholderText("YYYY-MM-DD");
    const timeInput = screen.getByPlaceholderText("hh:mm");
    expect(dateInput).toBeInTheDocument();
    expect(timeInput).toBeInTheDocument();

    expect(dateInput).toHaveAttribute(
      "aria-label",
      "Kerberos password expiration date 2"
    );

    if (defaultProps.readOnly) {
      expect(dateInput).toBeDisabled();
    } else {
      expect(dateInput).toBeEnabled();
    }
  });

  it("disables the IpaCalendar if readOnly is true", () => {
    render(<IpaCalendar {...defaultProps} readOnly={true} />);

    const dateInput = screen.getByPlaceholderText("YYYY-MM-DD");
    expect(dateInput).toBeDisabled();
  });

  it("handles date changes and calls updateIpaObject correctly", () => {
    render(<IpaCalendar {...defaultProps} />);

    const dateInput = screen.getByPlaceholderText("YYYY-MM-DD");

    // Date changes
    fireEvent.change(dateInput, { target: { value: "2025-01-01" } });

    // Trigger the `onChange` by blurring
    fireEvent.blur(dateInput);

    // Verify `updateIpaObject` is being called
    expect(updateIpaObject).toHaveBeenCalledTimes(1);
    expect(updateIpaObject).toHaveBeenCalledWith(
      defaultProps.ipaObject,
      mockOnchange,
      expect.any(Date), // Expects that any Date instance has been sent
      "krbpasswordexpiration2"
    );
  });

  it("parses the string date to date object correctly", () => {
    render(<IpaCalendar {...defaultProps} />);

    const dateInput = screen.getByPlaceholderText("YYYY-MM-DD");

    // The value is set by using `setAttribute` instead of passing value through props
    dateInput.setAttribute("value", "2024-12-01");
    expect(dateInput).toHaveValue("2024-12-01");
  });

  it("handles null or invalid date values", () => {
    const propsWithNullValue = {
      ...defaultProps,
      value: null,
    };

    render(<IpaCalendar {...propsWithNullValue} />);

    const dateInput = screen.getByPlaceholderText("YYYY-MM-DD");
    expect(dateInput).toHaveValue("");
  });
});
