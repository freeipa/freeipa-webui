import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";
// Component
import IpaCheckboxListWithFilter, {
  IPAParamDefinitionCheckboxListWithFilter,
} from "./IpaCheckboxListWithFilter";
// Utils
import { updateCheckboxList } from "src/utils/ipaObjectUtils";

// Mock of util function: updateCheckboxList
vi.mock("src/utils/ipaObjectUtils", async () => ({
  ...(await vi.importActual("src/utils/ipaObjectUtils.ts")),
  updateIpaObject: vi.fn(),
  updateCheckboxList: vi.fn(),
}));

describe("IpaCheckboxListWithFilter Component", () => {
  const mockOnChange = vi.fn((ipaObject) => {
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

  const defaultProps: IPAParamDefinitionCheckboxListWithFilter = {
    dataCy: "ipa-checkbox-list-filter",
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
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the IpaCheckboxListWithFilter component with all options", () => {
    render(<IpaCheckboxListWithFilter {...defaultProps} />);

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
    render(<IpaCheckboxListWithFilter {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");

    // Filter by "password"
    fireEvent.change(filterInput, { target: { value: "password" } });

    // Should show "Password" and "Hardened password"
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Hardened password")).toBeInTheDocument();

    // Should not show other options
    expect(screen.queryByLabelText("RADIUS")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Two-factor authentication")
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("PKINIT")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("External Identity Provider")
    ).not.toBeInTheDocument();
  });

  it("shows 'No options match' message when filter has no results", () => {
    render(<IpaCheckboxListWithFilter {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");

    // Filter by something that doesn't exist
    fireEvent.change(filterInput, { target: { value: "nonexistent" } });

    expect(
      screen.getByText("No options match the filter.")
    ).toBeInTheDocument();
  });

  it("toggles checkbox when clicking on it", () => {
    render(<IpaCheckboxListWithFilter {...defaultProps} />);

    const passwordCheckbox = screen.getByLabelText("Password");

    // Click the checkbox
    fireEvent.click(passwordCheckbox);

    expect(updateCheckboxList).toHaveBeenCalledWith(
      true,
      "password",
      [],
      defaultProps.ipaObject,
      defaultProps.onChange,
      "ipauserauthtype2"
    );
  });

  it("clears filter when clear button is clicked", () => {
    render(<IpaCheckboxListWithFilter {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");

    // Add filter
    fireEvent.change(filterInput, { target: { value: "password" } });

    // Verify filter is applied (only 2 options visible)
    expect(screen.queryByLabelText("RADIUS")).not.toBeInTheDocument();

    // Clear the filter using the reset button
    const clearButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(clearButton);

    // All options should be visible again
    expect(screen.getByLabelText("RADIUS")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("filters case-insensitively", () => {
    render(<IpaCheckboxListWithFilter {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");

    // Filter with uppercase
    fireEvent.change(filterInput, { target: { value: "RADIUS" } });

    // Should still find the option
    expect(screen.getByLabelText("RADIUS")).toBeInTheDocument();
  });

  it("respects readOnly prop", () => {
    render(<IpaCheckboxListWithFilter {...defaultProps} readOnly={true} />);

    const filterInput = screen.getByPlaceholderText("Filter options...");
    expect(filterInput).toBeDisabled();

    const passwordCheckbox = screen.getByLabelText("Password");
    expect(passwordCheckbox).toBeDisabled();
  });
});
