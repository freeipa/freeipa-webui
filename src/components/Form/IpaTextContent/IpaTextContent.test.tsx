import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
// Component
import IpaTextContent, { IpaTextContentProps } from "./IpaTextContent";
import { BrowserRouter } from "react-router";

describe("IpaTextContent Component", () => {
  const mockMetadata = {
    objects: {
      pwpolicy: {
        name: "pwpolicy",
        takes_params: [
          {
            alwaysask: false,
            attribute: false,
            autofill: false,
            class: "Str",
            cli_metavar: "STR",
            cli_name: "group",
            confirm: true,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Manage password policy for specific group",
            flags: [],
            label: "Group",
            maxlength: 255,
            multivalue: false,
            name: "cn",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: true,
            query: false,
            required: false,
            sortorder: 2,
            type: "str",
          },
        ],
      },
    },
  };

  const mockCn = "TEST VALUE";
  const defaultProps: IpaTextContentProps = {
    dataCy: "ipa-text-content",
    ariaLabel: "test",
    name: "cn",
    objectName: "pwpolicy",
    metadata: mockMetadata,
    ipaObject: { cn: [mockCn] },
  };

  afterEach(cleanup);

  it("should render the component", async () => {
    await act(async () => {
      render(<IpaTextContent {...defaultProps} />);
    });

    // Ensure rendered content is correct
    const textContent = screen.getByText(mockCn);
    expect(textContent).toBeInTheDocument();
    expect(textContent).toBeEnabled();
  });

  it("should render link properly", async () => {
    const props: IpaTextContentProps = { ...defaultProps, linkTo: "test" };
    await act(async () => {
      render(
        <BrowserRouter>
          <IpaTextContent {...props} />
        </BrowserRouter>
      );
    });

    // Ensure rendered content is correct
    const textContent = screen.getByText(mockCn);
    expect(textContent).toBeInTheDocument();
    expect(textContent).toBeEnabled();

    // Ensure it's a link
    expect(textContent.tagName).toBe("A");
  });
});
