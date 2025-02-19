import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
// Component
import IpaDropdownSearch, {
  IPAParamDefinitionDropdown,
} from "./IpaDropdownSearch";

describe("IpaDropdownSearch Component", () => {
  const mockOnchange = jest.fn();
  const mockOnSearch = jest.fn();

  const mockMetadata = {
    objects: {
      config: {
        name: "config",
        takes_params: [
          {
            cli_name: "ca_renewal_master_server",
            deprecated_cli_aliases: [],
            label: "IPA CA renewal master",
            doc: "Renewal master for IPA certificate authority",
            required: false,
            multivalue: false,
            primary_key: false,
            autofill: false,
            query: false,
            attribute: false,
            flags: ["no_create", "virtual_attribute"],
            alwaysask: false,
            sortorder: 2,
            cli_metavar: "STR",
            no_convert: false,
            deprecated: false,
            confirm: true,
            noextrawhitespace: true,
            class: "Str",
            maxlength: 255,
            pattern_errmsg: "",
            pattern: "",
            name: "ca_renewal_master_server",
            type: "str",
          },
        ],
      },
    },
  };

  const mockIpaObject = {
    dn: "cn=ipaConfig,cn=etc,dc=dom-ipa,dc=demo",
    cn: "ipaConfig",
    ipamaxusernamelength: "32",
    ipahomesrootdir: "/home",
    ipadefaultloginshell: "/bin/sh",
    ipadefaultprimarygroup: "ipausers",
    ipadefaultemaildomain: "dom-server.ipa.demo",
    ipasearchtimelimit: "2",
    ipasearchrecordslimit: "100",
    ipausersearchfields: "uid,givenname,sn,telephonenumber,ou,title",
    ipagroupsearchfields: "cn,description",
    ipacertificatesubjectbase: "O=DOM-IPA.DEMO",
    ipapwdexpadvnotify: "4",
    ipaselinuxusermapdefault: "unconfined_u:s0-s0:c0.c1023",
    ipadomainresolutionorder: "",
    ipamaxhostnamelength: "64",
    ipaselinuxusermaporder:
      "guest_u:s0$xguest_u:s0$user_u:s0$staff_u:s0-s0:c0.c1023$sysadm_u:s0-s0:c0.c1023$unconfined_u:s0-s0:c0.c1023",
    ca_renewal_master_server: "server.ipa.demo",
    ipaconfigstring: ["AllowNThash", "KDC:Disable Last Success"],
    ipakrbauthzdata: ["MS-PAC", "nfs:NONE"],
    ipauserauthtype: [],
    ca_server_server: ["server.ipa.demo"],
    kra_server_server: ["server.ipa.demo"],
    ipa_master_server: ["server.ipa.demo"],
    pkinit_server_server: ["server.ipa.demo"],
    dns_server_server: ["server.ipa.demo"],
    ipamigrationenabled: "false",
    ipauserdefaultsubordinateid: false,
  };

  const defaultProps: IPAParamDefinitionDropdown = {
    name: "ca_renewal_master_server",
    ariaLabel: "IPA CA renewal master",
    ipaObject: mockIpaObject,
    objectName: "config",
    onChange: mockOnchange,
    required: false,
    readOnly: false,
    metadata: mockMetadata,
    options: ["server.ipa.demo", "server2.ipa.demo"],
    onSearch: mockOnSearch,
  };

  it("should render the component", () => {
    render(<IpaDropdownSearch {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should call onSearch when the input is provided", async () => {
    render(<IpaDropdownSearch {...defaultProps} />);
    const input = screen.getByRole("button");
    // Click to open the dropdown
    await act(async () => {
      fireEvent.click(input);
    });
    // Search for server2
    fireEvent.change(input, { target: { value: "server2" } });
    // Click search button
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    // Expect onSearch to be called
    expect(mockOnSearch).toHaveBeenCalled();
  });

  it("should search for a given value and select it", async () => {
    render(<IpaDropdownSearch {...defaultProps} />);
    const input = screen.getByRole("button");
    // Click to open the dropdown
    await act(async () => {
      fireEvent.click(input);
    });
    // Search for server2
    fireEvent.change(input, { target: { value: "server2" } });
    // Click search button
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    // Expect to find the server2
    const server2Entry = screen.getByText("server2.ipa.demo");
    expect(server2Entry).toBeInTheDocument();
    // Select the server2
    fireEvent.click(server2Entry);
    // Expect the value to be selected
    expect(server2Entry).toBeInTheDocument();
  });
});
