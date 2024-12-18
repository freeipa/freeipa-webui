import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
// Component
import IpaSelect, { IPAParamDefinitionSelect } from "./IpaSelect";

// Mock of util function: updateIpaObject
jest.mock("src/utils/ipaObjectUtils", () => ({
  ...jest.requireActual("src/utils/ipaObjectUtils.ts"),
  updateIpaObject: jest.fn((ipaObject, setIpaObject, valueToUpdate, name) => {
    console.log("Mock updateIpaObject called");
    console.log({ ipaObject, setIpaObject, valueToUpdate, name });
  }),
}));

describe("IpaSelect Component", () => {
  const mockOnChange = jest.fn();

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
            cli_metavar: "CUSTOMIPASELECT",
            cli_name: "customipaselect",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Custom IpaSelect.",
            flags: [],
            label: "Custom IpaSelect",
            maxlength: 255,
            multivalue: false,
            name: "customipaselect",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 1,
            type: "string",
          },
        ],
      },
    },
  };

  const defaultProps: IPAParamDefinitionSelect = {
    id: "customipaselect",
    name: "customipaselect",
    ariaLabel: "customipaselect",
    ipaObject: {},
    objectName: "user",
    onChange: mockOnChange,
    required: true,
    options: ["customOption1", "customOption2"],
    metadata: mockMetadata,
  };

  it("renders the select input correctly", async () => {
    render(<IpaSelect {...defaultProps} />);

    // Verify there is a select input
    const selectInput = screen.getByRole("button");
    expect(selectInput).toBeInTheDocument();

    // Click to open the dropdown
    await act(async () => {
      fireEvent.click(selectInput);
    });

    // Options are visible
    const selectOptions = await screen.getAllByRole("option");
    expect(selectOptions).toHaveLength(defaultProps.options.length);

    // Verify the text of the options
    expect(selectOptions[0]).toHaveTextContent("No selection");
    expect(selectOptions[1]).toHaveTextContent("customOption1");
    expect(selectOptions[2]).toHaveTextContent("customOption2");
  });

  it("allows user to select an option", async () => {
    render(<IpaSelect {...defaultProps} />);

    // Selector toggle button
    const menuToggleButton = screen.getByRole("button", {
      name: /no selection/i,
    });
    expect(menuToggleButton).toBeInTheDocument();

    // Open selector
    await act(async () => {
      fireEvent.click(menuToggleButton);
    });

    // Selector options
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);

    // Click on the second option
    await act(async () => {
      fireEvent.click(options[1]); // "customOption1"
    });

    // Check if button text has changed
    const updatedButton = screen.getByRole("button", {
      name: /customOption1/i,
    });
    expect(updatedButton).toBeInTheDocument();
  });

  it("disables select input when isDisabled is true", () => {
    render(<IpaSelect {...defaultProps} readOnly={true} />);

    const selectInput = screen.getByRole("button");
    expect(selectInput).toBeDisabled();
  });
});
