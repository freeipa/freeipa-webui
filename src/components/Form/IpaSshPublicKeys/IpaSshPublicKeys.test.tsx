import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import { vi, describe, expect, it, afterEach } from "vitest";
// Component
import IpaSshPublicKeys, {
  PropsToSshPublicKeysModal,
} from "./IpaSshPublicKeys";

/**
 * Checks whether payload argument for updateSSHKey contains string *fail create*
 * or *fail delete* to mock failure either at creation or deletion
 */
const shouldFail = (payload) => {
  // For create
  if ("ipasshpubkey" in payload["params"][1]) {
    return (payload["params"][1]["ipasshpubkey"][0] as string).includes(
      "fail create"
    );
  }

  // For delete
  if ("delattr" in payload["params"][1]) {
    return (payload["params"][1]["delattr"] as string)
      .replace(/^(ipasshpubkey=)/, "")
      .includes("fail delete");
  }

  return false;
};

// Mock of rpc: useSimpleMutCommandMutation
vi.mock("src/services/rpc", () => ({
  useSimpleMutCommandMutation: vi.fn(() => [
    // updateSSHKey
    async (payload) => {
      console.log("updateSSHKey called with:", payload);

      if (shouldFail(payload)) {
        // Return mock error
        return {
          data: {
            error: true,
          },
        };
      }

      // Return mock success
      return {
        data: {
          result: true,
        },
      };
    },
  ]),
}));

describe("IpaSshPublicKeys Component", () => {
  const mockOnChange = vi.fn((ipaObject) => {
    console.log("mockOnChange called with:", ipaObject);
  });
  const mockOnRefresh = vi.fn();

  const mockMetadata = {
    objects: {
      user: {
        name: "user",
        takes_params: [
          {
            alwaysask: false,
            attribute: false,
            autofill: false,
            class: "Str",
            cli_metavar: "STR",
            cli_name: "sshpubkey",
            confirm: true,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "SSH public key",
            flags: ["no_search"],
            label: "SSH public key",
            maxlength: 255,
            multivalue: true,
            name: "ipasshpubkey",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 2,
            type: "str",
          },
        ],
      },
    },
  };

  const defaultProps: PropsToSshPublicKeysModal = {
    ipaObject: {},
    onChange: mockOnChange,
    metadata: mockMetadata,
    onRefresh: mockOnRefresh,
    from: "active-users",
  };

  const genericAddKey = async (key: string) => {
    render(<IpaSshPublicKeys {...defaultProps} />);

    // Verify Add Key exists
    const addKeyButton = screen.getByRole("button");
    expect(addKeyButton).toBeInTheDocument();

    // Open Add Key modal
    await act(async () => {
      fireEvent.click(addKeyButton);
    });

    // Modal should be open now
    // Verify textarea exists
    const sshKeyTextarea = screen.getByRole("textbox");
    expect(sshKeyTextarea).toBeInTheDocument();

    // Modify input
    await act(async () => {
      fireEvent.change(sshKeyTextarea, { target: { value: key } });
    });

    // Verify Set button exists
    const setButton = screen.getByRole("button", {
      name: /Set/i,
    });
    expect(setButton).toBeInTheDocument();

    // Click Set button
    await act(async () => {
      fireEvent.click(setButton);
    });
  };

  afterEach(cleanup);

  it("renders empty keys correctly", () => {
    render(<IpaSshPublicKeys {...defaultProps} />);

    // Add Key Button
    const addKeyButtonElems = screen.getAllByRole("button");

    // Returns an array
    expect(Array.isArray(addKeyButtonElems)).toBe(true);

    // Is single element
    expect(addKeyButtonElems.length).toBe(1);

    // Contains Add Key text
    expect(addKeyButtonElems[0].innerHTML).toBe("Add Key");
  });

  it("renders add key correctly", async () => {
    const TEST_KEY = "test";
    render(<IpaSshPublicKeys {...defaultProps} />);

    // Verify Add Key exists
    const addKeyButton = screen.getByRole("button");
    expect(addKeyButton).toBeInTheDocument();

    // Open Add Key modal
    await act(async () => {
      fireEvent.click(addKeyButton);
    });

    // Modal should be open now
    // Verify textarea exists
    const sshKeyTextarea = screen.getByRole("textbox");
    expect(sshKeyTextarea).toBeInTheDocument();

    // Verify we can edit
    fireEvent.change(sshKeyTextarea, { target: { value: TEST_KEY } });
    expect(sshKeyTextarea).toHaveValue(TEST_KEY);

    // Verify we can remove and add again
    fireEvent.change(sshKeyTextarea, { target: { value: "" } });
    fireEvent.change(sshKeyTextarea, { target: { value: TEST_KEY } });

    // Verify Set button exists
    const setButton = screen.getByRole("button", {
      name: /Set/i,
    });
    expect(setButton).toBeInTheDocument();

    // Verify Cancel button exists
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });
    expect(cancelButton).toBeInTheDocument();

    // Click Cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });
  });

  it("should add key", async () => {
    const TEST_KEY = "test";
    await genericAddKey(TEST_KEY);

    // Verify Show Key button exists
    const showKeyButton = screen.getByRole("button", {
      name: /Show Key/i,
    });
    expect(showKeyButton).toBeInTheDocument();

    // Click Show Key
    await act(async () => {
      fireEvent.click(showKeyButton);
    });

    // Modal should be open now
    // Verify key is correct
    const sshKeyShowTextarea = screen.getByRole("textbox");
    expect(sshKeyShowTextarea).toBeInTheDocument();

    // Correct text
    expect(sshKeyShowTextarea.textContent).toEqual(TEST_KEY);
  });

  it("does not create an entry on failure", async () => {
    const FAIL_KEY = "fail create";
    await genericAddKey(FAIL_KEY);

    // Verify Show Key button does not exist
    const showKeyButton = screen.queryByRole("button", {
      name: /Show Key/i,
    });
    expect(showKeyButton).not.toBeInTheDocument();
  });

  it("should delete key", async () => {
    const TEST_KEY = "test";
    await genericAddKey(TEST_KEY);

    // Verify Delete button exists
    const deleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });
    expect(deleteButton).toBeInTheDocument();

    // Click Delete Key
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Modal should be open now
    // Verify key is correct
    const keyCard = await screen.findByText(TEST_KEY);
    expect(keyCard).toBeInTheDocument();

    // Verify Delete button exists
    const deleteButtonConfirm = screen.getByRole("button", {
      name: /Delete/i,
    });
    expect(deleteButtonConfirm).toBeInTheDocument();

    // Click Delete Key
    await act(async () => {
      fireEvent.click(deleteButtonConfirm);
    });

    // Verify Delete button no longer exists
    const deleteNewButton = screen.queryByRole("button", {
      name: /Delete/i,
    });
    expect(deleteNewButton).not.toBeInTheDocument();
  });

  it("does not delete an entry on failure", async () => {
    const FAIL_KEY = "fail delete";
    await genericAddKey(FAIL_KEY);

    // Verify Delete button exists
    const deleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });
    expect(deleteButton).toBeInTheDocument();

    // Click Delete Key
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Modal should be open now
    // Verify key is correct
    const keyCard = await screen.findByText(FAIL_KEY);
    expect(keyCard).toBeInTheDocument();

    // Verify Delete button exists
    const deleteButtonConfirm = screen.getByRole("button", {
      name: /Delete/i,
    });
    expect(deleteButtonConfirm).toBeInTheDocument();

    // Click Delete Key
    await act(async () => {
      fireEvent.click(deleteButtonConfirm);
    });

    // Verify Delete button still exists
    const deleteNewButton = screen.queryByRole("button", {
      name: /Delete/i,
    });
    expect(deleteNewButton).toBeInTheDocument();
  });
});
