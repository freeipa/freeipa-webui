import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
// Component
import IpaTextInput from "./IpaTextInput";
// Utils
import { IPAParamDefinition } from "src/utils/ipaObjectUtils";

describe("IpaTextInput Component", () => {
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
            cli_metavar: "CUSTOMIPATEXTINPUT",
            cli_name: "customipatextinput",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Custom IpaTextInput.",
            flags: [],
            label: "Custom IpaTextInput",
            maxlength: 255,
            multivalue: false,
            name: "customipatextinput",
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

  const mockIpaObject = {
    attributelevelrights: {},
    default_attributes: [],
    cn: "customipatextinput",
    customipatextinput: "Initial value",
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

  const defaultProps: IPAParamDefinition = {
    name: "customipatextinput",
    ariaLabel: "Custom IpaTextInput",
    ipaObject: mockIpaObject,
    objectName: "user",
    onChange: mockOnChange,
    required: false,
    readOnly: false,
    metadata: mockMetadata,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders IpaTextInput with default props", () => {
    render(<IpaTextInput {...defaultProps} />);
    expect(screen.getByLabelText("Custom IpaTextInput")).toBeInTheDocument();
  });

  it("calls onChange when input value changes", async () => {
    render(<IpaTextInput {...defaultProps} />);
    const textInput = screen.getByLabelText("Custom IpaTextInput");

    act(() => {
      fireEvent.change(textInput, { target: { value: "new value" } });
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(textInput).toHaveValue("new value");
  });

  it("renders disabled input", () => {
    render(<IpaTextInput {...defaultProps} readOnly={true} />);
    expect(screen.getByLabelText("Custom IpaTextInput")).toHaveAttribute(
      "readonly"
    );
  });
});
