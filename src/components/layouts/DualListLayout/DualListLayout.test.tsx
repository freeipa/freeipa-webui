import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
// Component
import DualListLayout, { DualListProps } from "./DualListLayout";

interface MockReturn {
  data: { list: string[] } | { error: { message: string } };
}

const mockOnOpenModal = vi.fn();
const mockOnCloseModal = vi.fn();
const mockOnAction = vi.fn();

const mockItems = ["first", "second", "third"];

/**
 * DualListLayout
 */
const retrieveIDs: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { list: mockItems } };
});

vi.mock("src/services/rpc", () => ({
  useGetIDListMutation: () => [retrieveIDs],
}));

const initialProps: DualListProps = {
  entry: "",
  target: "user",
  showModal: true,
  onCloseModal: mockOnCloseModal,
  onOpenModal: mockOnOpenModal,
  spinning: false,
  title: "test",
  addBtnName: "Action",
  addSpinningBtnName: "Acting...",
  action: mockOnAction,
  tableElementsList: [],
  addExternalsOption: false,
};

describe("DualListLayout Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the DualListLayout component", async () => {
    render(<DualListLayout {...initialProps} />);

    // Search exists
    const searchEntry = screen.getByRole("textbox", {
      name: /Search dual select list/i,
    });
    expect(searchEntry).toBeInTheDocument();

    // We can fetch new entries
    const clickButton = screen.getByRole("option", {
      name: /Click here.*/i,
    });
    expect(clickButton).toBeInTheDocument();

    // Action button exists and is disabled
    const actionButton = screen.getByRole("button", {
      name: initialProps.addBtnName,
    });
    expect(actionButton).toBeDisabled();

    // Cancel button exists
    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });
    expect(cancelButton).toBeEnabled();
  });

  it("renders the DualListLayout component without items", async () => {
    render(<DualListLayout {...initialProps} />);

    // Mock no entries
    retrieveIDs.mockReturnValueOnce(
      new Promise((resolve) =>
        resolve({
          data: {
            list: [],
          },
        })
      )
    );

    // Fetch no new entries
    const clickButton = screen.getByRole("option", {
      name: /Click here.*/i,
    });
    expect(clickButton).toBeInTheDocument();
    fireEvent.click(clickButton);

    // Await search disappearance
    await waitForElementToBeRemoved(() =>
      screen.getByRole("option", { name: "Searching ..." })
    );

    // No entries
    const noEntriesButton = screen.getByRole("option", {
      name: /No matching.*/i,
    });
    expect(noEntriesButton).toBeInTheDocument();
  });

  it("renders the DualListLayout component with items", async () => {
    render(<DualListLayout {...initialProps} />);

    // Fetch new entries
    const clickButton = screen.getByRole("option", {
      name: /Click here.*/i,
    });
    expect(clickButton).toBeInTheDocument();
    fireEvent.click(clickButton);

    // Await search disappearance
    await waitForElementToBeRemoved(() =>
      screen.getByRole("option", { name: "Searching ..." })
    );

    // View entries
    for (const item of mockItems) {
      const itemButton = screen.getByRole("option", {
        name: item,
      });
      expect(itemButton).toBeInTheDocument();
    }
  });

  it("renders the DualListLayout component using search", async () => {
    render(<DualListLayout {...initialProps} />);

    // Use search bar
    const searchEntry = screen.getByRole("textbox", {
      name: /Search dual select list/i,
    });
    fireEvent.change(searchEntry, { target: { value: mockItems[0] } });

    // Click search
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    // Await search disappearance
    await waitForElementToBeRemoved(() =>
      screen.getByRole("option", { name: "Searching ..." })
    );

    for (const item of mockItems) {
      const itemButton = screen.getByRole("option", {
        name: item,
      });
      expect(itemButton).toBeInTheDocument();
    }
  });

  it("renders the DualListLayout with moved items", async () => {
    render(<DualListLayout {...initialProps} />);

    // Fetch new entries
    const clickButton = screen.getByRole("option", {
      name: /Click here.*/i,
    });
    expect(clickButton).toBeInTheDocument();
    fireEvent.click(clickButton);

    // Await search disappearance
    await waitForElementToBeRemoved(() =>
      screen.getByRole("option", { name: "Searching ..." })
    );

    // Select entries
    for (const item of mockItems) {
      const itemButton = screen.getByRole("option", {
        name: item,
      });
      expect(itemButton).toBeInTheDocument();
      fireEvent.click(itemButton);
    }

    // Click move button
    fireEvent.click(screen.getByRole("button", { name: "Add selected" }));

    // Action button exists and is enabled
    const actionButton = screen.getByRole("button", {
      name: initialProps.addBtnName,
    });
    expect(actionButton).toBeEnabled();
    fireEvent.click(actionButton);

    expect(mockOnAction).toHaveBeenCalled();
  });

  it("renders the DualListLayout with externals correctly", async () => {
    render(<DualListLayout {...initialProps} addExternalsOption={true} />);

    const TEST_EXTERNAL = "test";

    // Find external input
    const externalTextbox = screen.getByRole("textbox", {
      name: "dual list external",
    });
    expect(externalTextbox).toBeEnabled();

    // Add external item
    fireEvent.change(externalTextbox, { target: { value: TEST_EXTERNAL } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    const testButton = screen.getByRole("option", {
      name: TEST_EXTERNAL,
    });
    expect(testButton).toBeInTheDocument();
  });
});
