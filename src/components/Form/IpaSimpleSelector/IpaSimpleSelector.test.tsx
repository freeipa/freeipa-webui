import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";
import IpaSimpleSelector, {
  IPAParamDefinitionSimpleSelector,
} from "./IpaSimpleSelector";

describe("IpaSimpleSelector Component", () => {
  const mockOnChange = vi.fn();

  const mockMetadata = {
    objects: {
      permission: {
        name: "permission",
        takes_params: [
          {
            alwaysask: false,
            attribute: true,
            autofill: false,
            class: "StrEnum",
            cli_metavar: "['permission', 'all', 'anonymous', 'self']",
            cli_name: "bindtype",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Bind rule type",
            flags: [],
            label: "Bind rule type",
            maxlength: 255,
            multivalue: false,
            name: "ipapermbindruletype",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 1,
            type: "str",
            values: ["permission", "all", "anonymous", "self"],
            writable: true,
          },
        ],
      },
    },
  };

  const defaultProps: IPAParamDefinitionSimpleSelector = {
    dataCy: "ipa-simple-selector",
    name: "ipapermbindruletype",
    ariaLabel: "ipapermbindruletype",
    ipaObject: { ipapermbindruletype: "permission" },
    objectName: "permission",
    onChange: mockOnChange,
    required: true,
    readOnly: false,
    metadata: mockMetadata,
    options: [
      { key: "permission", value: "permission" },
      { key: "all", value: "all" },
      { key: "anonymous", value: "anonymous" },
      { key: "self", value: "self" },
    ],
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders a select option for each provided option", async () => {
    render(<IpaSimpleSelector {...defaultProps} />);

    const selectToggle = screen.getByRole("button");
    expect(selectToggle).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(selectToggle);
    });

    const selectOptions = screen.getAllByRole("option");
    expect(selectOptions).toHaveLength(defaultProps.options.length);

    defaultProps.options.forEach((option, idx) => {
      expect(selectOptions[idx]).toHaveTextContent(option.value);
      expect(selectOptions[idx]).toHaveAttribute("id", option.key);
    });
  });

  it("shows the current value on the toggle", () => {
    render(<IpaSimpleSelector {...defaultProps} />);

    const selectToggle = screen.getByRole("button", {
      name: "ipapermbindruletype",
    });
    expect(selectToggle).toBeInTheDocument();
    expect(selectToggle).toHaveTextContent("permission");
  });

  it("calls onChange with the selected option", async () => {
    render(<IpaSimpleSelector {...defaultProps} />);

    const selectToggle = screen.getByRole("button", {
      name: "ipapermbindruletype",
    });

    await act(async () => {
      fireEvent.click(selectToggle);
    });

    const options = screen.getAllByRole("option");
    await act(async () => {
      fireEvent.click(options[1]);
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      ipapermbindruletype: "all",
    });
    expect(selectToggle).toHaveTextContent("all");
  });

  it("disables the select when readOnly is true", () => {
    render(<IpaSimpleSelector {...defaultProps} readOnly={true} />);

    const selectToggle = screen.getByRole("button");
    expect(selectToggle).toBeDisabled();
  });
});
