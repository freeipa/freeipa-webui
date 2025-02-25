import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// Component
import IpaToggleGroup, { ToggleOptionProps } from "./IpaToggleGroup";
// Utils
import { updateIpaObject } from "src/utils/ipaObjectUtils";

// Mock of util function: updateIpaObject
jest.mock("src/utils/ipaObjectUtils", () => ({
  ...jest.requireActual("src/utils/ipaObjectUtils.ts"),
  updateIpaObject: jest.fn(),
}));

describe("IpaToggleGroup Component", () => {
  const mockOnChange = jest.fn((ipaObject) => {
    console.log("mockOnChange called with:", ipaObject);
  });

  const mockSetOptionSelected = jest.fn((option: string) => {
    console.log("mockSetOptionSelected called with:", option);
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
            cli_metavar: "['all', '']",
            cli_name: "usercategory2",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Types of supported user authentication",
            flags: [],
            label: "User authentication types",
            maxlength: 255,
            multivalue: false,
            name: "usercategory2",
            no_convert: false,
            noextrawhitespace: true,
            optionSelected: "all",
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 1,
            type: "str",
            values: ["all", ""],
            writable: true,
          },
        ],
      },
    },
  };

  const defaultProps: ToggleOptionProps = {
    name: "usercategory2",
    ariaLabel: "User Category",
    ipaObject: {},
    onChange: mockOnChange,
    required: true,
    readOnly: false,
    metadata: mockMetadata,
    objectName: "user",
    options: [
      { value: "all", label: "Anyone" },
      {
        value: "",
        label: "Specified Users and Groups",
      },
    ],
    optionSelected: "Anyone",
    setOptionSelected: mockSetOptionSelected,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    render(<IpaToggleGroup {...defaultProps} />);
    // Validate group
    const toggleGroupElems = screen.getAllByRole("group");

    // Returns an array
    expect(Array.isArray(toggleGroupElems)).toBe(true);

    // Is single element
    expect(toggleGroupElems.length).toBe(1);

    // Validate properties of the group
    const toggleGroupElem = toggleGroupElems[0];
    expect(toggleGroupElem.tagName).toBe("DIV");
    expect(toggleGroupElem).toHaveAttribute("role", "group");

    // Validate group items
    const toggleGroupItemElems = screen.getAllByRole("button");

    // Returns an array
    expect(Array.isArray(toggleGroupItemElems)).toBe(true);

    // Is not empty
    expect(toggleGroupItemElems.length).toBeGreaterThan(0);

    // It has 2 elements (options.length)
    expect(toggleGroupItemElems).toHaveLength(defaultProps.options.length);

    // Validate individual properties of each group item
    toggleGroupItemElems.forEach((toggleGroupItem, idx) => {
      // Is a button
      expect(toggleGroupItem.tagName).toBe("BUTTON");
      expect(toggleGroupItem).toHaveAttribute("type", "button");

      // Has correct id
      expect(toggleGroupItem).toHaveAttribute(
        "id",
        defaultProps.options[idx].label
      );

      // Check inner span text
      expect(toggleGroupItem.children.length).toBe(1);
      const span = toggleGroupItem.children[0];
      expect(span.innerHTML).toBe(defaultProps.options[idx].label);
    });
  });

  it("disables buttons if readOnly is true", () => {
    render(<IpaToggleGroup {...defaultProps} readOnly={true} />);

    // Validate group items
    const toggleGroupItemElems = screen.getAllByRole("button");

    // Validate individual properties of each group item
    toggleGroupItemElems.forEach((toggleGroupItem, idx) => {
      // Is a button
      expect(toggleGroupItem.tagName).toBe("BUTTON");
      expect(toggleGroupItem).toHaveAttribute("type", "button");

      // Has correct id
      expect(toggleGroupItem).toHaveAttribute(
        "id",
        defaultProps.options[idx].label
      );

      // Check inner span text
      expect(toggleGroupItem.children.length).toBe(1);
      const span = toggleGroupItem.children[0];
      expect(span.innerHTML).toBe(defaultProps.options[idx].label);

      // Is disabled
      expect(toggleGroupItem).toBeDisabled();
    });
  });

  it("does nothing if already selected", () => {
    render(<IpaToggleGroup {...defaultProps} />);

    const toggleGroupItemElems = screen.getAllByRole("button");

    // Click the already selected
    fireEvent.click(toggleGroupItemElems[0]);

    // Verify nothing has changed
    expect(updateIpaObject).toHaveBeenCalledTimes(0);
  });

  it("handles correctly different default value", () => {
    render(
      <IpaToggleGroup
        {...defaultProps}
        optionSelected="Specified Users and Groups"
      />
    );

    const toggleGroupItemElems = screen.getAllByRole("button");

    // Click the already selected
    fireEvent.click(toggleGroupItemElems[1]);

    // Verify nothing has changed
    expect(updateIpaObject).toHaveBeenCalledTimes(0);
  });

  it("updates if selecting new element", () => {
    render(<IpaToggleGroup {...defaultProps} />);

    const toggleGroupItemElems = screen.getAllByRole("button");
    fireEvent.click(toggleGroupItemElems[1]);

    // Verify item has been updated exactly once
    expect(updateIpaObject).toHaveBeenCalledTimes(1);
  });

  it("handles correctly bigger group", () => {
    const biggerProps: ToggleOptionProps = {
      ...defaultProps,
      options: [
        { value: "all", label: "Anyone" },
        {
          value: "",
          label: "Specified Users and Groups",
        },
        {
          value: "another",
          label: "Another option",
        },
        {
          value: "yet_another",
          label: "Yet another option",
        },
      ],
    };

    render(<IpaToggleGroup {...biggerProps} />);

    // Validate group items
    const toggleGroupItemElems = screen.getAllByRole("button");

    // Returns an array
    expect(Array.isArray(toggleGroupItemElems)).toBe(true);

    // Is not empty
    expect(toggleGroupItemElems.length).toBeGreaterThan(0);

    // It has 4 elements (options.length)
    expect(toggleGroupItemElems).toHaveLength(biggerProps.options.length);

    // Validate individual properties of each group item
    toggleGroupItemElems.forEach((toggleGroupItem, idx) => {
      // Is a button
      expect(toggleGroupItem.tagName).toBe("BUTTON");
      expect(toggleGroupItem).toHaveAttribute("type", "button");

      // Has correct id
      expect(toggleGroupItem).toHaveAttribute(
        "id",
        biggerProps.options[idx].label
      );

      // Check inner span text
      expect(toggleGroupItem.children.length).toBe(1);
      const span = toggleGroupItem.children[0];
      expect(span.innerHTML).toBe(biggerProps.options[idx].label);
    });

    fireEvent.click(toggleGroupItemElems[1]);
    // This one shouldn't count
    fireEvent.click(toggleGroupItemElems[1]);
    fireEvent.click(toggleGroupItemElems[3]);
    fireEvent.click(toggleGroupItemElems[2]);
    fireEvent.click(toggleGroupItemElems[0]);

    // Verify item has been updated
    expect(updateIpaObject).toHaveBeenCalledTimes(4);
  });
});
