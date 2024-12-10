import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// Component
import IpaCheckboxes, { IPAParamDefinitionCheckboxes } from "./IpaCheckboxes";
// Utils
import { updateCheckboxList } from "src/utils/ipaObjectUtils";

// Mock of util function: updateIpaObject
jest.mock("src/utils/ipaObjectUtils", () => ({
  ...jest.requireActual("src/utils/ipaObjectUtils.ts"),
  updateIpaObject: jest.fn(),
  updateCheckboxList: jest.fn(),
}));

describe("IpaCheckboxes Component", () => {
  const mockOnChange = jest.fn((ipaObject) => {
    console.log("mockOnChange called with:", ipaObject);
  });

  const mockMetadata = {
    objects: {
      user: {
        name: "user",
        takes_params: [
          {
            alwaysask: false,
            attribute: true,
            autofill: false,
            class: "StrEnum",
            cli_metavar:
              "['password', 'radius', 'otp', 'pkinit', 'hardened', 'idp', 'passkey']",
            cli_name: "ipauserauthtype2",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Types of supported user authentication",
            flags: [],
            label: "User authentication types",
            maxlength: 255,
            multivalue: false,
            name: "ipauserauthtype2",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 1,
            type: "str",
            values: [
              "password",
              "radius",
              "otp",
              "pkinit",
              "hardened",
              "idp",
              "passkey",
            ],
            writable: true,
          },
        ],
      },
    },
  };

  const defaultProps: IPAParamDefinitionCheckboxes = {
    name: "ipauserauthtype2",
    ariaLabel: "ipauserauthtype2",
    ipaObject: {},
    objectName: "user",
    onChange: mockOnChange,
    required: true,
    readOnly: false,
    metadata: mockMetadata,
    options: [
      { value: "password", text: "Password" },
      { value: "radius", text: "RADIUS" },
      { value: "otp", text: "Two-factor authentication" },
      { value: "pkinit", text: "PKINIT" },
      { value: "hardened", text: "Hardened password" },
      { value: "idp", text: "External Identity Provider" },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the IpaCheckboxes component with correct props", () => {
    render(<IpaCheckboxes {...defaultProps} />);
    const checkboxesElems = screen.getAllByLabelText("ipauserauthtype2");

    // Returns an array
    expect(Array.isArray(checkboxesElems)).toBe(true);

    // Is not empty
    expect(checkboxesElems.length).toBeGreaterThan(0);

    // It has 5 elements (options.length)
    expect(checkboxesElems).toHaveLength(defaultProps.options.length);

    // Validate individual properties of each checkbox
    checkboxesElems.forEach((checkbox, idx) => {
      // Is an 'input' element of type 'checkbox
      expect(checkbox.tagName).toBe("INPUT");
      expect(checkbox).toHaveAttribute("type", "checkbox");

      // Has aria label
      expect(checkbox).toHaveAttribute("aria-label", "ipauserauthtype2");

      // Has ID and name
      expect(checkbox).toHaveAttribute(
        "id",
        "ipauserauthtype2-" + defaultProps.options[idx].value
      );
      expect(checkbox).toHaveAttribute("name", "ipauserauthtype2");
    });
  });

  it("toggles the Checkboxes when clicking on them", () => {
    render(<IpaCheckboxes {...defaultProps} />);
    const checkboxesElems = screen.getAllByLabelText("ipauserauthtype2");

    // By default: checkboxes are not checked
    checkboxesElems.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });

    // First checkbox is clicked
    fireEvent.click(checkboxesElems[0]);

    expect(updateCheckboxList).toHaveBeenCalledWith(
      true, // Checkbox was checked
      "password",
      [], // Initial array is empty
      defaultProps.ipaObject,
      defaultProps.onChange,
      "ipauserauthtype2"
    );
  });

  it("calls updateCheckboxList on change with the correct arguments", () => {
    render(<IpaCheckboxes {...defaultProps} />);
    const checkboxesElems = screen.getAllByLabelText("ipauserauthtype2");

    // Second and third checkbox are clicked
    fireEvent.click(checkboxesElems[1]);
    fireEvent.click(checkboxesElems[2]);

    // Trigger the `onChange` by blurring
    fireEvent.blur(checkboxesElems[2]);

    // Verify that updateCheckboxList` is being called
    expect(updateCheckboxList).toHaveBeenCalledTimes(2);
    expect(updateCheckboxList).toHaveBeenCalledWith(
      true,
      "radius",
      [],
      defaultProps.ipaObject,
      defaultProps.onChange,
      "ipauserauthtype2"
    );
    expect(updateCheckboxList).toHaveBeenCalledWith(
      true,
      "otp",
      [],
      defaultProps.ipaObject,
      defaultProps.onChange,
      "ipauserauthtype2"
    );
  });
});
