import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import { Mock, vi, describe, afterEach, it, expect } from "vitest";
// Component
import IpaCertificateMappingData, {
  PropsToIpaCertificateMappingData,
} from "./IpaCertificateMappingData";

interface MockReturn {
  data:
    | {
        result: boolean;
      }
    | {
        error: { message: string };
      };
}

const addCertMapData: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { result: true } };
});

const removeCertMapData: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { result: true } };
});

vi.mock("src/services/rpcUsers", () => ({
  useAddCertMapDataMutation: () => [addCertMapData],
  useRemoveCertMapDataMutation: () => [removeCertMapData],
}));

describe("IpaCertificateMappingData", () => {
  const mockOnChange = vi.fn((ipaObject) => {
    console.log("mockOnChange called with:", ipaObject);
  });

  const mockOnRefresh = vi.fn(() => {
    console.log("mockOnRefresh called");
  });

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
            cli_name: "certmapdata",
            confirm: true,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Certificate mapping data",
            flags: ["no_search", "no_create", "no_update"],
            label: "User authentication types",
            maxlength: 255,
            multivalue: true,
            name: "ipacertmapdata",
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

  const defaultProps: PropsToIpaCertificateMappingData = {
    ipaObject: {},
    onChange: mockOnChange,
    metadata: mockMetadata,
    onRefresh: mockOnRefresh,
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should render the component", async () => {
    await act(async () => {
      render(<IpaCertificateMappingData {...defaultProps} />);
    });

    // Validate Add button
    const addButton = screen.getByRole("button", {
      name: /Add/i,
    });
    expect(addButton).toBeInTheDocument();

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Validate two Radio buttons
    const radioButtonsElems = screen.getAllByRole("radio");

    // Returns an array
    expect(Array.isArray(radioButtonsElems)).toBe(true);

    // It has two elements
    expect(radioButtonsElems.length).toBe(2);

    // Validate Add buttons
    const addButtonElems = screen.getAllByRole("button", {
      name: /Add/i,
    });

    // There is 3 of them (Certificate mapping data, Certificate, Modal)
    expect(Array.isArray(addButtonElems)).toBe(true);
    expect(addButtonElems.length).toBe(3);

    // Certificate mapping data Add is enabled
    expect(addButtonElems[0]).toBeEnabled();

    // Certificate Add is enabled
    expect(addButtonElems[1]).toBeEnabled();

    // Modal Add is disabled (inputs are empty)
    expect(addButtonElems[2]).toBeDisabled();

    // Switch radio button to Issuer and subject
    await act(async () => {
      fireEvent.click(radioButtonsElems[1]);
    });

    // Validate Issuer exists
    const issuerInputBox = screen.getByRole("textbox", {
      name: /issuer textbox/i,
    });
    expect(issuerInputBox).toBeInTheDocument();
    expect(issuerInputBox.tagName).toBe("INPUT");
    expect(issuerInputBox).toBeEnabled();

    // Validate Subject exists
    const subjectInputBox = screen.getByRole("textbox", {
      name: /subject textbox/i,
    });
    expect(subjectInputBox).toBeInTheDocument();
    expect(subjectInputBox.tagName).toBe("INPUT");
    expect(subjectInputBox).toBeEnabled();

    // Certificate mapping data Add is disabled
    expect(addButtonElems[0]).toBeDisabled();

    // Certificate Add is disabled
    expect(addButtonElems[1]).toBeDisabled();

    // Switch back, validate Issuer and Subject are disabled
    await act(async () => {
      fireEvent.click(radioButtonsElems[0]);
    });

    expect(issuerInputBox).toBeDisabled();
    expect(subjectInputBox).toBeDisabled();

    // Validate Cancel button
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });

    // Click Cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });
  });

  it("should add certificate mapping data", async () => {
    const TEST_NAME = "test_certificate";

    await act(async () => {
      render(<IpaCertificateMappingData {...defaultProps} />);
    });

    // Validate Add button
    const addButton = screen.getByRole("button", {
      name: /Add/i,
    });

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Click Add buttons for Certificate mapping data
    const addButtonElems = screen.getAllByRole("button", {
      name: /Add/i,
    });

    expect(addButtonElems.length).toBe(3);

    await act(async () => {
      fireEvent.click(addButtonElems[0]);
    });

    // First test remove
    const deleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Now add for real
    await act(async () => {
      fireEvent.click(addButtonElems[0]);
    });

    // Change Certificate mapping data
    const certificateMappingDataInputBox = screen.getByRole("textbox", {
      name: /certificate mapping data textbox/i,
    });

    await act(async () => {
      fireEvent.change(certificateMappingDataInputBox, {
        target: { value: TEST_NAME },
      });
    });

    // Click Add in Modal
    await act(async () => {
      fireEvent.click(addButtonElems[2]);
    });

    expect(addCertMapData).toHaveBeenCalledWith([
      [undefined],
      { ipacertmapdata: [TEST_NAME] },
    ]);
  });

  it("should add certificate", async () => {
    const TEST_NAME = "test_certificate";

    await act(async () => {
      render(<IpaCertificateMappingData {...defaultProps} />);
    });

    // Validate Add button
    const addButton = screen.getByRole("button", {
      name: /Add/i,
    });

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Click Add buttons for Certificate
    const addButtonElems = screen.getAllByRole("button", {
      name: /Add/i,
    });

    expect(addButtonElems.length).toBe(3);

    await act(async () => {
      fireEvent.click(addButtonElems[1]);
    });

    // First test remove
    const deleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Now add for real
    await act(async () => {
      fireEvent.click(addButtonElems[1]);
    });

    // Change Certificate
    const certificateInputBox = screen.getByRole("textbox", {
      name: /certificate textarea/i,
    });

    await act(async () => {
      fireEvent.change(certificateInputBox, {
        target: { value: TEST_NAME },
      });
    });

    // Click Add in Modal
    await act(async () => {
      fireEvent.click(addButtonElems[2]);
    });

    expect(addCertMapData).toHaveBeenCalledWith([
      [undefined],
      { certificate: [TEST_NAME] },
    ]);
  });

  it("should add issuer and subject", async () => {
    const TEST_ISSUER = "test_issuer";
    const TEST_SUBJECT = "test_subject";

    await act(async () => {
      render(<IpaCertificateMappingData {...defaultProps} />);
    });

    // Validate Add button
    const addButton = screen.getByRole("button", {
      name: /Add/i,
    });

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Switch radio to Issuer and subject
    const radioButtonsElems = screen.getAllByRole("radio");

    await act(async () => {
      fireEvent.click(radioButtonsElems[1]);
    });

    // Change Issuer
    const issuerInputBox = screen.getByRole("textbox", {
      name: /issuer textbox/i,
    });

    await act(async () => {
      fireEvent.change(issuerInputBox, {
        target: { value: TEST_ISSUER },
      });
    });

    // Change Subject
    const subjectInputBox = screen.getByRole("textbox", {
      name: /subject textbox/i,
    });

    await act(async () => {
      fireEvent.change(subjectInputBox, {
        target: { value: TEST_SUBJECT },
      });
    });

    // Click Add in Modal
    const addButtonElems = screen.getAllByRole("button", {
      name: /Add/i,
    });

    expect(addButtonElems.length).toBe(3);

    await act(async () => {
      fireEvent.click(addButtonElems[2]);
    });

    expect(addCertMapData).toHaveBeenCalledWith([
      [undefined],
      { issuer: TEST_ISSUER, subject: TEST_SUBJECT },
    ]);
  });

  it("should handle failure when adding", async () => {
    const TEST_NAME = "fail create";
    const TEST_ERROR_MESSAGE = "test error message";

    await act(async () => {
      render(<IpaCertificateMappingData {...defaultProps} />);
    });

    // Validate Add button
    const addButton = screen.getByRole("button", {
      name: /Add/i,
    });

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Click Add buttons for Certificate mapping data
    const addButtonElems = screen.getAllByRole("button", {
      name: /Add/i,
    });

    expect(addButtonElems.length).toBe(3);

    await act(async () => {
      fireEvent.click(addButtonElems[0]);
    });

    // First test remove
    const deleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Now add for real
    await act(async () => {
      fireEvent.click(addButtonElems[0]);
    });

    // Change Certificate mapping data
    const certificateMappingDataInputBox = screen.getByRole("textbox", {
      name: /certificate mapping data textbox/i,
    });

    await act(async () => {
      fireEvent.change(certificateMappingDataInputBox, {
        target: { value: TEST_NAME },
      });
    });

    addCertMapData.mockReturnValue(
      new Promise((resolve) => {
        return resolve({
          data: { error: { message: TEST_ERROR_MESSAGE } },
        });
      })
    );

    // Click Add in Modal
    await act(async () => {
      fireEvent.click(addButtonElems[2]);
    });

    // Ensure Modal is still open by looking up Cancel
    screen.getByRole("button", {
      name: /Cancel/i,
    });
  });

  it("should delete record when delete is clicked", async () => {
    const TEST_NAME = "test_cert";
    const props: PropsToIpaCertificateMappingData = {
      ...defaultProps,
      ipaObject: { ipacertmapdata: [TEST_NAME] },
    };

    await act(async () => {
      render(<IpaCertificateMappingData {...props} />);
    });

    // Contains record
    const deleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });

    // CLick Delete
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Cancel exists
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });

    // First cancel
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // CLick Delete
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Confirm deletion
    const deleteButtonModal = screen.getByRole("button", {
      name: /Delete/i,
    });

    await act(async () => {
      fireEvent.click(deleteButtonModal);
    });

    expect(removeCertMapData).toHaveBeenCalledWith([
      [undefined],
      {
        ipacertmapdata: "test_cert",
      },
    ]);
  });

  it("should handle failure when deleting", async () => {
    const TEST_NAME = "test_cert";
    const TEST_ERROR_MESSAGE = "test error message";
    const props: PropsToIpaCertificateMappingData = {
      ...defaultProps,
      ipaObject: { ipacertmapdata: [TEST_NAME] },
    };

    await act(async () => {
      render(<IpaCertificateMappingData {...props} />);
    });

    // Contains record
    const deleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });

    // CLick Delete
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Confirm deletion
    const deleteButtonModal = screen.getByRole("button", {
      name: /Delete/i,
    });

    removeCertMapData.mockReturnValue(
      new Promise((resolve) => {
        return resolve({
          data: { error: { message: TEST_ERROR_MESSAGE } },
        });
      })
    );

    await act(async () => {
      fireEvent.click(deleteButtonModal);
    });

    // Ensure record still exists by looking up Delete button
    const recordDeleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });
    expect(
      recordDeleteButton.parentElement?.parentElement?.children[0].innerHTML
    ).toContain(TEST_NAME);
  });
});
