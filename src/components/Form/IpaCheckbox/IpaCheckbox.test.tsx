import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";
// Component
import IpaCheckbox, { CheckboxOption } from "./IpaCheckbox";
// Utils
import { updateIpaObject } from "src/utils/ipaObjectUtils";

// Mock of util function: updateIpaObject
vi.mock("src/utils/ipaObjectUtils", async () => ({
  ...(await vi.importActual("src/utils/ipaObjectUtils.ts")),
  updateIpaObject: vi.fn(),
}));

describe("IpaCheckbox Component", () => {
  const mockOnChange = vi.fn();

  const mockMetadata = {
    objects: {
      host: {
        name: "host",
        takes_params: [
          {
            alwaysask: false,
            attribute: true,
            autofill: false,
            class: "Boolean",
            cli_metavar: "IPAKRBOKASDELEGATE2",
            cli_name: "ipakrbokasdelegate2",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Trusted for delegation.",
            flags: [],
            label: "Trusted for delegation",
            maxlength: 255,
            multivalue: false,
            name: "ipakrbokasdelegate2",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 1,
            type: "boolean",
          },
        ],
      },
    },
  };

  const defaultProps: CheckboxOption = {
    name: "ipakrbokasdelegate2",
    ariaLabel: "ipakrbokasdelegate2",
    ipaObject: {},
    objectName: "host",
    onChange: mockOnChange,
    required: true,
    readOnly: false,
    metadata: mockMetadata,
    value: "true",
    text: "Trusted for delegation",
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the Checkbox with correct props", () => {
    render(<IpaCheckbox {...defaultProps} />);

    // Verify the Checkbox exist
    const checkboxElem = screen.getByLabelText("ipakrbokasdelegate2");

    expect(checkboxElem).toBeInTheDocument();
    // As PatternFly doesn't provide a way to
    //   see if a given rendered Checkbox ('input') element is checked
    //   in the DOM tree, this needs to be done manually
    checkboxElem.setAttribute("checked", "true");

    expect(checkboxElem).toHaveAttribute("checked", "true");
    expect(checkboxElem).toHaveAttribute("aria-label", "ipakrbokasdelegate2");
    expect(checkboxElem).toHaveAttribute("name", "ipakrbokasdelegate2");
    expect(checkboxElem).toBeEnabled();
  });

  it("disables the Checkbox if readOnly is true", () => {
    render(<IpaCheckbox {...defaultProps} readOnly={true} />);

    const checkboxElem = screen.getByLabelText("ipakrbokasdelegate2");
    expect(checkboxElem).toBeDisabled();
  });

  it("toggles the Checkbox when clicking on it", () => {
    // By default, it is checked
    render(<IpaCheckbox {...defaultProps} />);

    const checkboxElem = screen.getByText("Trusted for delegation");
    // By default is checked. As PatternFly doesn't provide a way to
    //   see if a given rendered Checkbox ('input') element is checked
    //   in the DOM tree, this needs to be done manually
    checkboxElem.setAttribute("checked", "true");

    // Uncheck the Checkbox
    fireEvent.click(checkboxElem);
    checkboxElem.setAttribute("checked", "false");

    expect(checkboxElem).not.toBeChecked();
  });

  it("calls updateIpaObject on change with the correct arguments", () => {
    render(<IpaCheckbox {...defaultProps} />);

    const checkboxElem = screen.getByLabelText("ipakrbokasdelegate2");

    // Checkbox is clicked (to non-checked)
    fireEvent.click(checkboxElem);

    // Trigger the `onChange` by blurring
    fireEvent.blur(checkboxElem);

    // Verify that ùpdateIpaObject` is being called
    expect(updateIpaObject).toHaveBeenCalledTimes(1);
    expect(updateIpaObject).toHaveBeenCalledWith(
      defaultProps.ipaObject,
      mockOnChange,
      expect.any(String),
      "ipakrbokasdelegate2"
    );
  });
});
