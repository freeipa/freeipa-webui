import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, vi, it, expect, afterEach } from "vitest";
// Component
import IpaTextInputFromList, {
  PropsToTextInputFromList,
} from "./IpaTextInputFromList";

describe("IpaTextInputFromList Component", () => {
  const mockOnOpenModal = vi.fn();
  const mockOnRemove = vi.fn();

  const mockMetadata = {
    objects: {
      user: {
        name: "user",
        takes_params: [
          {
            cli_name: "principal",
            deprecated_cli_aliases: [],
            label: "Principal alias",
            doc: "Principal alias",
            required: false,
            multivalue: true,
            primary_key: false,
            autofill: true,
            query: false,
            attribute: false,
            flags: [],
            alwaysask: false,
            sortorder: 2,
            cli_metavar: "PRINCIPAL",
            no_convert: false,
            deprecated: false,
            confirm: true,
            require_service: false,
            class: "Principal",
            name: "krbprincipalname",
            type: "Principal",
            maxlength: 255,
            noextrawhitespace: false,
            pattern_errmsg: "",
            pattern: "",
          },
        ],
      },
    },
  };

  afterEach(cleanup);

  const defaultProps: PropsToTextInputFromList = {
    dataCy: "ipa-text-input-from-list",
    name: "krbprincipalname",
    elementsList: ["test1", "test2"],
    ipaObject: { krbprincipalname: ["test1", "test2"] },
    metadata: mockMetadata,
    onOpenModal: mockOnOpenModal,
    onRemove: mockOnRemove,
    from: "user",
    isPrincipalAlias: true,
  };

  it("should render the component", () => {
    render(<IpaTextInputFromList {...defaultProps} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  it("should call onOpenModal when the Add button is clicked", () => {
    render(<IpaTextInputFromList {...defaultProps} />);
    const button = screen.getByRole("button", {
      name: "Add",
    });
    fireEvent.click(button);
    expect(mockOnOpenModal).toHaveBeenCalled();
  });

  it("should call onRemove when the delete button is clicked", () => {
    render(<IpaTextInputFromList {...defaultProps} />);
    const deleteButton = screen.getAllByRole("button", {
      name: "Delete",
    })[0];
    fireEvent.click(deleteButton);
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it("should render the component with the correct number of elements", () => {
    render(<IpaTextInputFromList {...defaultProps} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });
});
