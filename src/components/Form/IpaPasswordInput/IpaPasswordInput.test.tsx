import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
// Component
import IpaPasswordInput, { IpaPasswordInputProps } from "./IpaPasswordInput";
import { HIDDEN_PASSWORD } from "src/utils/utils";
import { createMetadata } from "src/services/types/metadata";

describe("IpaPasswordInput Component", () => {
  const mockMetadata = createMetadata({
    objects: {
      idp: {
        name: "idp",
        methods: [],
        primary_key: "cn",
        takes_params: [
          {
            alwaysask: false,
            attribute: false,
            autofill: false,
            class: "Password",
            cli_metavar: "PASSWORD",
            cli_name: "secret",
            confirm: true,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "OAuth 2.0 client secret",
            flags: ["no_search"],
            label: "Secret",
            multivalue: false,
            name: "ipaidpclientsecret",
            no_convert: false,
            noextrawhitespace: true,
            primary_key: false,
            query: false,
            required: false,
            sortorder: 2,
            type: "str",
          },
        ],
      },
    },
    methods: {},
    commands: {},
  });

  const defaultProps: IpaPasswordInputProps = {
    dataCy: "ipa-password-input",
    ariaLabel: "Secret",
    name: "ipaidpclientsecret",
    objectName: "idp",
    metadata: mockMetadata,
    ipaObject: {},
  };

  afterEach(cleanup);

  it("renders IpaPasswordInput correctly with password", async () => {
    const props: IpaPasswordInputProps = {
      ...defaultProps,
      ipaObject: {
        ipaidpclientsecret: ["Password"],
      },
    };

    render(<IpaPasswordInput {...props} />);

    const password = screen.getByLabelText("Secret");
    expect(password).toBeInTheDocument();

    waitFor(() => expect(password).toHaveTextContent("Password"));
  });

  it("renders IpaPasswordInput correctly without password", async () => {
    render(<IpaPasswordInput {...defaultProps} />);

    const password = screen.getByLabelText("Secret");
    expect(password).toBeInTheDocument();

    waitFor(() => expect(password).toHaveTextContent(""));
  });

  it("renders IpaPasswordInput correctly with encrypted password", async () => {
    const props: IpaPasswordInputProps = {
      ...defaultProps,
      ipaObject: {
        ipaidpclientsecret: [{ __base64__: "YWF3cmV3YQ==" } /* Secret123 */],
      },
    };

    render(<IpaPasswordInput {...props} />);

    const password = screen.getByLabelText("Secret");
    expect(password).toBeInTheDocument();

    waitFor(() => expect(password).toHaveTextContent(HIDDEN_PASSWORD));
  });
});
