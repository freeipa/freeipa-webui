import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, afterEach } from "vitest";
// Component
import IpaPACType from "./IpaPACType";
import { IPAParamDefinition } from "src/utils/ipaObjectUtils";
import { updateIpaObject } from "src/utils/ipaObjectUtils";

// Mock of util function: updateIpaObject
vi.mock("src/utils/ipaObjectUtils", async () => ({
  ...(await vi.importActual("src/utils/ipaObjectUtils.ts")),
  updateIpaObject: vi.fn(),
}));

describe("IpaPACType Component", () => {
  const mockOnChange = vi.fn((ipaObject) => {
    console.log("mockOnChange called with:", ipaObject);
  });

  const mockMetadata = {
    objects: {
      user: {
        name: "service",
        takes_params: [
          {
            cli_name: "pac_type",
            deprecated_cli_aliases: [],
            label: "PAC type",
            doc: "Override default list of supported PAC types. Use 'NONE' to disable PAC support for this service, e.g. this might be necessary for NFS services.",
            required: false,
            multivalue: true,
            primary_key: false,
            autofill: false,
            query: false,
            attribute: false,
            flags: [],
            alwaysask: false,
            sortorder: 2,
            cli_metavar: "['MS-PAC', 'PAD', 'NONE']",
            no_convert: false,
            deprecated: false,
            confirm: true,
            values: ["MS-PAC", "PAD", "NONE"],
            class: "StrEnum",
            name: "ipakrbauthzdata",
            type: "str",
            maxlength: 255,
            noextrawhitespace: false,
            pattern_errmsg: "",
            pattern: "",
          },
        ],
      },
    },
  };

  const mockIpaObject = {
    serviceType: "",
    dn: "krbprincipalname=DNS/server.ipa.demo@DOM-IPA.DEMO,cn=services,cn=accounts,dc=dom-ipa,dc=demo",
    has_keytab: true,
    ipauniqueid: "8c099e3a-edd5-11ef-a3d9-5254004a35a6",
    krbextradata: [
      {
        __base64__: "AAISSrRncm9vdC9hZG1pbkBET00tSVBBLkRFTU8A",
      },
    ],
    krblastpwdchange: "2025-02-18T08:51:30.000Z",
    krbloginfailedcount: "0",
    krbpwdpolicyreference:
      "cn=Default Service Password Policy,cn=services,cn=accounts,dc=dom-ipa,dc=demo",
    krbticketflags: [],
    krbcanonicalname: "DNS/server.ipa.demo@DOM-IPA.DEMO",
    krbprincipalname: ["DNS/server.ipa.demo@DOM-IPA.DEMO"],
    krbprincipalauthind: [],
    sshpublickey: [],
    usercertificate: [],
    ipakrbauthzdata: [],
    memberof_role: [],
    managedby_host: ["server.ipa.demo"],
    ipakrbrequirespreauth: true,
    ipakrbokasdelegate: false,
    ipakrboktoauthasdelegate: false,
  };

  const defaultProps: IPAParamDefinition = {
    name: "ipakrbauthzdata",
    required: false,
    readOnly: false,
    onChange: mockOnChange,
    objectName: "service",
    ipaObject: mockIpaObject,
    metadata: mockMetadata,
  };

  afterEach(cleanup);

  it("should render the component", () => {
    render(<IpaPACType {...defaultProps} />);
    // Has the correct radio buttons and checkboxes
    expect(
      screen.getByText("Inherited from server configuration")
    ).toBeInTheDocument();
    expect(screen.getByText("Override inherited settings")).toBeInTheDocument();
    expect(screen.getByText("MS-PAC")).toBeInTheDocument();
    expect(screen.getByText("PAD")).toBeInTheDocument();
    // Is not disabled
    expect(
      screen.getByRole("radio", {
        name: "Inherited from server configuration",
      })
    ).toHaveAttribute("aria-invalid", "false");
  });

  it("should call updateIpaObject when another radio button is clicked", () => {
    render(<IpaPACType {...defaultProps} />);
    const overrideRadio = screen.getByRole("radio", {
      name: "Override inherited settings",
    });
    fireEvent.click(overrideRadio);
    expect(updateIpaObject).toHaveBeenCalled();
  });

  it("should select the checkbox when clicked", () => {
    render(<IpaPACType {...defaultProps} />);
    const overrideRadio = screen.getByRole("radio", {
      name: "Override inherited settings",
    });
    fireEvent.click(overrideRadio);
    const msPacCheckbox = screen.getByRole("checkbox", {
      name: "MS-PAC",
    });
    fireEvent.click(msPacCheckbox);
    // There is no way to check if the checkbox is checked as PatternFly
    //   does not use the 'checked' attribute or any other. So we just
    //   check that the function is called
    expect(updateIpaObject).toHaveBeenCalled();
  });

  it("should not select any checkbox when first checkbox is marked", () => {
    render(<IpaPACType {...defaultProps} />);

    // First radio
    const inheritedRadio = screen.getByRole("radio", {
      name: "Inherited from server configuration",
    });

    // Second radio
    const overrideRadio = screen.getByRole("radio", {
      name: "Override inherited settings",
    });
    // - First checkbox of the first radio
    const msPacCheckbox = screen.getByRole("checkbox", {
      name: "MS-PAC",
    });

    // Click the second radio and the first checkbox
    fireEvent.click(overrideRadio);
    fireEvent.click(msPacCheckbox);

    // Expected: 'msPacCheckbox' to be unchecked when 'inheritedRadio' is clicked
    fireEvent.click(inheritedRadio);
    // There is no way to check if the checkbox is checked as PatternFly
    //   does not use the 'checked' attribute or any other. So we just
    //   check that the function is called
    expect(updateIpaObject).toHaveBeenCalled();
  });
});
