import React from "react";
import { screen, fireEvent, act, cleanup } from "@testing-library/react";
import { Mock, vi, describe, afterEach, it, expect } from "vitest";
// Component
import PrincipalAliasMultiTextBox, {
  PrincipalAliasMultiTextBoxProps,
} from "./PrincipalAliasMultiTextBox";
import { renderWithAlerts } from "src/utils/testAlertsUtils";

interface MockReturn {
  data: { result: boolean } | { error: { message: string } };
}

/**
 * PrincipalAliasMultiTextBox.tsx
 */
const addPrincipalAlias: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { result: true } };
});

/**
 * PrincipalAliasMultiTextBox.tsx
 */
const removePrincipalAlias: Mock<() => Promise<MockReturn>> = vi.fn(
  async () => {
    return { data: { result: true } };
  }
);

// Mock of rpc functions
vi.mock("src/services/rpcHosts", () => ({
  useAddHostPrincipalAliasMutation: () => [addPrincipalAlias],
  useRemoveHostPrincipalAliasMutation: () => [removePrincipalAlias],
}));

describe("PrincipalAliasMultiTextBox Component", () => {
  const mockOnRefresh = vi.fn();

  const mockMetadata = {
    objects: {
      krbtpolicy: {
        name: "krbtpolicy",
        container_dn: "cn=DOM-IPA.DEMO,cn=kerberos",
        takes_params: [],
      },
      host: {
        name: "host",
        container_dn: "cn=computers,cn=accounts",
        takes_params: [
          {
            alwaysask: false,
            attribute: false,
            autofill: false,
            class: "Principal",
            cli_metavar: "PRINCIPAL",
            cli_name: "krbprincipalname",
            confirm: true,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Principal alias",
            flags: ["no_create", "no_search"],
            label: "Principal alias",
            maxlength: 255,
            multivalue: true,
            name: "krbprincipalname",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 2,
            type: "Principal",
          },
        ],
      },
    },
  };

  const mockIpaObject = {
    krbprincipalname: [],
  };

  const defaultProps: PrincipalAliasMultiTextBoxProps = {
    dataCy: "principal-alias-multi-textbox",
    ipaObject: mockIpaObject,
    metadata: mockMetadata,
    onRefresh: mockOnRefresh,
    from: "hosts",
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders empty PrincipalAliasMultiTextBox", async () => {
    await act(async () => {
      renderWithAlerts(<PrincipalAliasMultiTextBox {...defaultProps} />);
    });

    // Add button exists
    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton).toBeEnabled();

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Modal should be open now
    // Validate input box
    const TEST_VALUE = "test value";
    const krbTextbox = screen.getByRole("textbox", {
      name: "krbprincipalname",
    });
    expect(krbTextbox).toBeEnabled();

    // Change input box value
    await act(async () => {
      fireEvent.change(krbTextbox, { target: { value: TEST_VALUE } });
    });
    expect(krbTextbox).toHaveValue(TEST_VALUE);

    // Add button exists
    screen.getByRole("button", { name: "Add" });

    // Cancel button exists
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeEnabled();

    // Click Cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(addPrincipalAlias).not.toHaveBeenCalled();
  });

  it("adds new entry when Add button is clicked", async () => {
    await act(async () => {
      renderWithAlerts(<PrincipalAliasMultiTextBox {...defaultProps} />);
    });

    // Add button exists
    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton).toBeEnabled();

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Modal should be open now
    // Validate input box
    const TEST_VALUE = "test value";
    const krbTextbox = screen.getByRole("textbox", {
      name: "krbprincipalname",
    });
    expect(krbTextbox).toBeEnabled();

    // Change input box value
    await act(async () => {
      fireEvent.change(krbTextbox, { target: { value: TEST_VALUE } });
    });
    expect(krbTextbox).toHaveValue(TEST_VALUE);

    // Add button exists
    const addButtonModal = screen.getByRole("button", { name: "Add" });

    // Click Add button
    await act(async () => {
      fireEvent.click(addButtonModal);
    });

    expect(addPrincipalAlias).toHaveBeenCalledWith([undefined, [TEST_VALUE]]);

    // Validate success
    const alert = screen.getByRole("alert");
    expect(alert).toContainHTML("Success");
  });

  it("doesn't add new entry when Add button is clicked and error happens", async () => {
    await act(async () => {
      renderWithAlerts(<PrincipalAliasMultiTextBox {...defaultProps} />);
    });

    // Add button exists
    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton).toBeEnabled();

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Modal should be open now
    // Validate input box
    const TEST_VALUE = "test value";
    const krbTextbox = screen.getByLabelText("krbprincipalname");

    expect(krbTextbox).toBeEnabled();

    // Change input box value
    await act(async () => {
      fireEvent.change(krbTextbox, { target: { value: TEST_VALUE } });
    });
    expect(krbTextbox).toHaveValue(TEST_VALUE);

    // Add button exists
    const addButtonModal = screen.getByRole("button", { name: "Add" });

    // Mock error
    addPrincipalAlias.mockReturnValue(
      new Promise((resolve) =>
        resolve({ data: { error: { message: "error" } } })
      )
    );

    // Click Add button
    await act(async () => {
      fireEvent.click(addButtonModal);
    });

    expect(addPrincipalAlias).toHaveBeenCalledWith([undefined, [TEST_VALUE]]);

    // Validate error
    const alert = screen.getByRole("alert", { hidden: true });
    expect(alert).toContainHTML("Danger");
  });

  it("renders PrincipalAliasMultiTextBox with entries correctly", async () => {
    const TEST_PRINCIPAL = "test principal";
    const props = {
      ...defaultProps,
      ipaObject: { krbprincipalname: [TEST_PRINCIPAL] },
    };

    await act(async () => {
      renderWithAlerts(<PrincipalAliasMultiTextBox {...props} />);
    });

    // Principal textbox exists
    const krbTextbox = screen.getByRole("textbox", {
      name: "krbprincipalname",
    });
    expect(krbTextbox).toHaveAttribute("readonly");

    // Add Delete exists
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    expect(deleteButton).toBeEnabled();

    // Click Delete button
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Modal should be open now
    // Delete button exists
    const deleteButtonModal = screen.getByRole("button", { name: "Delete" });
    expect(deleteButtonModal).toBeEnabled();

    // Cancel button exists
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeEnabled();

    // Click Cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(removePrincipalAlias).not.toHaveBeenCalled();
  });

  it("removes entry when Delete button is clicked", async () => {
    const TEST_PRINCIPAL = "test principal";
    const props = {
      ...defaultProps,
      ipaObject: { krbprincipalname: [TEST_PRINCIPAL] },
    };

    await act(async () => {
      renderWithAlerts(<PrincipalAliasMultiTextBox {...props} />);
    });

    // Add Delete exists
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    expect(deleteButton).toBeEnabled();

    // Click Delete button
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Modal should be open now
    // Delete button exists
    const deleteButtonModal = screen.getByRole("button", { name: "Delete" });
    expect(deleteButtonModal).toBeEnabled();

    // Click Delete button
    await act(async () => {
      fireEvent.click(deleteButtonModal);
    });

    expect(removePrincipalAlias).toHaveBeenCalledWith([
      undefined,
      [TEST_PRINCIPAL],
    ]);

    // Validate success
    const alert = screen.getByRole("alert");
    expect(alert).toContainHTML("Success");
  });

  it("does not remove entry when Delete button is clicked and error happens", async () => {
    const TEST_PRINCIPAL = "test principal";
    const props = {
      ...defaultProps,
      ipaObject: { krbprincipalname: [TEST_PRINCIPAL] },
    };

    await act(async () => {
      renderWithAlerts(<PrincipalAliasMultiTextBox {...props} />);
    });

    // Add Delete exists
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    expect(deleteButton).toBeEnabled();

    // Click Delete button
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Modal should be open now
    // Delete button exists
    const deleteButtonModal = screen.getByRole("button", { name: "Delete" });
    expect(deleteButtonModal).toBeEnabled();

    // Mock error
    removePrincipalAlias.mockReturnValue(
      new Promise((resolve) =>
        resolve({ data: { error: { message: "error" } } })
      )
    );

    // Click Delete button
    await act(async () => {
      fireEvent.click(deleteButtonModal);
    });

    expect(removePrincipalAlias).toHaveBeenCalledWith([
      undefined,
      [TEST_PRINCIPAL],
    ]);

    // Validate error
    const alert = screen.getByRole("alert", { hidden: true });
    expect(alert).toContainHTML("Danger");
  });
});
