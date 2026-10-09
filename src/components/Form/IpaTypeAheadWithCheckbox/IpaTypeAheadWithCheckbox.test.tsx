import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import { vi, describe, it, expect, afterEach } from "vitest";
// Component
import IpaTypeAheadWithCheckbox from "./IpaTypeAheadWithCheckbox";
import { createMetadata } from "src/services/types/metadata";

vi.mock("src/utils/ipaObjectUtils", async () => ({
  ...(await vi.importActual("src/utils/ipaObjectUtils.ts")),
}));

describe("IpaTypeAheadWithCheckbox Component", () => {
  const mockOnChange = vi.fn();

  const mockMetadata = createMetadata({
    objects: {
      selfservice: {
        name: "selfservice",
        methods: [],
        primary_key: "aciname",
        takes_params: [
          {
            alwaysask: false,
            attribute: true,
            autofill: false,
            class: "Str",
            cli_metavar: "ATTRS",
            cli_name: "attrs",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Attributes to which the permission applies.",
            flags: [],
            label: "Attributes",
            maxlength: 255,
            multivalue: true,
            name: "attrs",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 1,
            type: "str",
          },
        ],
      },
    },
    methods: {},
    commands: {},
  });

  const mockOptions = [
    { value: "cn", children: "cn", "data-cy": "attrs-cn" },
    { value: "sn", children: "sn", "data-cy": "attrs-sn" },
    {
      value: "givenname",
      children: "givenname",
      "data-cy": "attrs-givenname",
    },
    { value: "mail", children: "mail", "data-cy": "attrs-mail" },
  ];

  const defaultProps = {
    dataCy: "attrs",
    id: "attrs",
    name: "attrs",
    ipaObject: { attrs: ["cn", "sn"] },
    objectName: "selfservice",
    onChange: mockOnChange,
    options: mockOptions,
    metadata: mockMetadata,
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("displays the correct placeholder with selected item count", () => {
    render(<IpaTypeAheadWithCheckbox {...defaultProps} />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("placeholder", "2 items selected");
  });

  it("opens the dropdown and shows all options sorted alphabetically", async () => {
    render(<IpaTypeAheadWithCheckbox {...defaultProps} />);

    const toggle = screen.getByRole("button", {
      name: /multi typeahead checkbox menu toggle/i,
    });

    await act(async () => {
      fireEvent.click(toggle);
    });

    const options = screen.getAllByRole("menuitem");
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("cn");
    expect(options[1]).toHaveTextContent("givenname");
    expect(options[2]).toHaveTextContent("mail");
    expect(options[3]).toHaveTextContent("sn");
  });

  it("shows pre-selected options as checked in the list", async () => {
    render(<IpaTypeAheadWithCheckbox {...defaultProps} />);

    const toggle = screen.getByRole("button", {
      name: /multi typeahead checkbox menu toggle/i,
    });

    await act(async () => {
      fireEvent.click(toggle);
    });

    const cnCheckbox = screen.getByRole("checkbox", { name: /cn/i });
    const snCheckbox = screen.getByRole("checkbox", { name: /sn/i });

    expect(cnCheckbox).toBeChecked();
    expect(snCheckbox).toBeChecked();
  });

  it("calls onChange when selecting a new option", async () => {
    render(<IpaTypeAheadWithCheckbox {...defaultProps} />);

    const toggle = screen.getByRole("button", {
      name: /multi typeahead checkbox menu toggle/i,
    });

    await act(async () => {
      fireEvent.click(toggle);
    });

    const mailCheckbox = screen.getByRole("checkbox", { name: /mail/i });

    await act(async () => {
      fireEvent.click(mailCheckbox);
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      attrs: expect.arrayContaining(["cn", "sn", "mail"]),
    });
  });

  it("calls onChange when deselecting an option", async () => {
    render(<IpaTypeAheadWithCheckbox {...defaultProps} />);

    const toggle = screen.getByRole("button", {
      name: /multi typeahead checkbox menu toggle/i,
    });

    await act(async () => {
      fireEvent.click(toggle);
    });

    const cnCheckbox = screen.getByRole("checkbox", { name: /^cn$/i });

    await act(async () => {
      fireEvent.click(cnCheckbox);
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      attrs: ["sn"],
    });
  });

  it("filters options based on text input", async () => {
    render(<IpaTypeAheadWithCheckbox {...defaultProps} />);

    const input = screen.getByRole("combobox");

    await act(async () => {
      fireEvent.click(input);
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: "ma" } });
    });

    const options = screen.getAllByRole("menuitem");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("mail");
  });

  it("shows 'No results found' when filter has no matches", async () => {
    render(<IpaTypeAheadWithCheckbox {...defaultProps} />);

    const input = screen.getByRole("combobox");

    await act(async () => {
      fireEvent.click(input);
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: "nonexistent" } });
    });

    expect(
      screen.getByText('No results found for "nonexistent"')
    ).toBeInTheDocument();
  });

  it("merges extra selected values not in predefined options", async () => {
    const propsWithExtraAttr = {
      ...defaultProps,
      ipaObject: { attrs: ["cn", "sn", "customattr"] },
    };

    render(<IpaTypeAheadWithCheckbox {...propsWithExtraAttr} />);

    const toggle = screen.getByRole("button", {
      name: /multi typeahead checkbox menu toggle/i,
    });

    await act(async () => {
      fireEvent.click(toggle);
    });

    const options = screen.getAllByRole("menuitem");
    expect(options).toHaveLength(5);
    expect(
      screen.getByRole("menuitem", { name: /customattr/i })
    ).toBeInTheDocument();
  });

  it("renders as read-only when metadata indicates non-writable", () => {
    const readOnlyMetadata = createMetadata({
      objects: {
        selfservice: {
          name: "selfservice",
          methods: [],
          primary_key: "aciname",
          takes_params: [],
        },
      },
      methods: {},
      commands: {},
    });

    const readOnlyProps = {
      ...defaultProps,
      metadata: readOnlyMetadata,
    };

    render(<IpaTypeAheadWithCheckbox {...readOnlyProps} />);

    const toggle = screen.getByRole("button", {
      name: /multi typeahead checkbox menu toggle/i,
    });
    expect(toggle).toBeInTheDocument();
  });

  it("displays singular 'item' for a single selected value", () => {
    const singleProps = {
      ...defaultProps,
      ipaObject: { attrs: ["cn"] },
    };

    render(<IpaTypeAheadWithCheckbox {...singleProps} />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("placeholder", "1 item selected");
  });

  it("displays '0 items selected' when nothing is selected", () => {
    const emptyProps = {
      ...defaultProps,
      ipaObject: { attrs: [] },
    };

    render(<IpaTypeAheadWithCheckbox {...emptyProps} />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("placeholder", "0 items selected");
  });
});
