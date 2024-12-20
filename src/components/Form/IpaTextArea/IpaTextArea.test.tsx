import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
// Component
import IpaTextArea from "./IpaTextArea";
// Utils
import { IPAParamDefinition } from "src/utils/ipaObjectUtils";

describe("IpaTextArea Component", () => {
  const mockOnChange = jest.fn();

  const mockIpaObject = {
    attributelevelrights: {},
    default_attributes: [],
    cn: "customipatextarea",
    customipatextarea: "This is a test content",
    dn: "",
    gidnumber: "1234",
    ipantsecurityidentifier: [],
    ipauniqueid: [],
    member: [],
    member_external: [],
    member_group: [],
    member_idoverrideuser: [],
    member_service: [],
    member_user: [],
    memberindirect_group: [],
    memberindirect_idoverrideuser: [],
    memberindirect_service: [],
    memberindirect_user: [],
    membermanager_group: [],
    membermanager_user: [],
    memberof_group: [],
    memberof_hbacrule: [],
    memberof_netgroup: [],
    memberof_role: [],
    memberof_subid: [],
    memberof_sudorule: [],
    memberofindirect_group: [],
    memberofindirect_hbacrule: [],
    memberofindirect_netgroup: [],
    memberofindirect_role: [],
    memberofindirect_subid: [],
    memberofindirect_sudorule: [],
    objectclass: [],
  };

  const mockMetadata = {
    objects: {
      group: {
        name: "group",
        takes_params: [
          {
            alwaysask: false,
            attribute: true,
            autofill: false,
            class: "String",
            cli_metavar: "CUSTOMIPATEXTAREA",
            cli_name: "customipatextarea",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Custom IpaTextArea.",
            flags: [],
            label: "Custom IpaTextArea",
            maxlength: 255,
            multivalue: false,
            name: "customipatextarea",
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

  const defaultProps: IPAParamDefinition = {
    name: "customipatextarea",
    ariaLabel: "customipatextarea",
    ipaObject: mockIpaObject,
    objectName: "group",
    onChange: mockOnChange,
    required: false,
    metadata: mockMetadata,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the TextArea component", () => {
    render(<IpaTextArea {...defaultProps} />);
    const textArea = screen.getByLabelText("customipatextarea");

    expect(textArea).toBeInTheDocument();
    expect(textArea).toHaveValue("This is a test content");
  });

  it("calls onChange when the value is changed", async () => {
    render(<IpaTextArea {...defaultProps} />);
    const textArea = screen.getByLabelText("customipatextarea");

    await act(async () => {
      fireEvent.change(textArea, { target: { value: "New content" } });
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(textArea).toHaveValue("New content");
  });

  it("sets the TextArea to readOnly when readOnly is true", () => {
    const propsDisabledField = {
      ...defaultProps,
      readOnly: true,
    };
    render(<IpaTextArea {...propsDisabledField} />);
    const textArea = screen.getByLabelText("customipatextarea");

    expect(textArea).toHaveAttribute("readonly");
  });
});
