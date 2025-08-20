import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { expect, it, describe, vi, afterEach } from "vitest";
import { Tr, Th, Td } from "@patternfly/react-table";
// Component
import SettingsTableLayout from "./SettingsTableLayout";

describe("SettingsTableLayout Component", () => {
  const mockOnAddModal = vi.fn();
  const mockOnDeleteModal = vi.fn();
  const mockUpdatePage = vi.fn();
  const mockUpdatePerPage = vi.fn();
  const mockOnSearchChange = vi.fn();

  const paginationData = {
    page: 1,
    perPage: 10,
    updatePage: mockUpdatePage,
    updatePerPage: mockUpdatePerPage,
    updateSelectedPerPage: vi.fn(),
    updateShownElementsList: vi.fn(),
    totalCount: 25,
  };

  const mockList = ["item1", "item2", "item3"];

  const testTableHeader = (
    <Tr>
      <Th>Test Header</Th>
    </Tr>
  );

  const testTableBody = [
    <Tr key="1">
      <Td>Test Table Content</Td>
    </Tr>,
  ];

  const defaultProps = {
    ariaLabel: "Settings Table",
    variant: "compact" as const,
    hasBorders: true,
    tableId: "settings-table",
    isStickyHeader: true,
    tableBody: testTableBody,
    onAddModal: mockOnAddModal,
    onDeleteModal: mockOnDeleteModal,
    onSearchChange: mockOnSearchChange,
    tableHeader: testTableHeader,
    paginationData: paginationData,
    tableClasses: "test-table-class",
    list: mockList,
    entryType: "User",
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should render SettingsTableLayout with table when length of list > 0", () => {
    render(<SettingsTableLayout {...defaultProps} />);

    // Check table is rendered
    expect(screen.getByLabelText("Settings Table")).toBeInTheDocument();
    expect(screen.getByText("Test Table Content")).toBeInTheDocument();
    expect(screen.getByText("Test Header")).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toHaveAttribute(
      "id",
      "add-user"
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();

    // Check pagination is rendered
    expect(
      screen.getByRole("navigation", { name: /pagination/i })
    ).toBeInTheDocument();
  });

  it("should render EmptyState when length of list == 0", () => {
    const emptyProps = {
      ...defaultProps,
      list: [],
      paginationData: { ...paginationData, totalCount: 0 },
    };

    render(<SettingsTableLayout {...emptyProps} />);

    // Check EmptyState is rendered
    expect(screen.getByText("No users")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add users/i })
    ).toBeInTheDocument();
  });

  it("should disable Add button in EmptyState when isAddDisabled is true", () => {
    const emptyProps = {
      ...defaultProps,
      list: [],
      isAddDisabled: true,
      paginationData: { ...paginationData, totalCount: 0 },
    };

    render(<SettingsTableLayout {...emptyProps} />);

    const addButton = screen.getByRole("button", { name: /Add users/i });
    expect(addButton).toBeDisabled();
  });

  it("should call onAddModal when Add button is clicked", () => {
    render(<SettingsTableLayout {...defaultProps} />);

    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addButton);
    expect(mockOnAddModal).toHaveBeenCalled();
  });

  it("should call onDeleteModal when Delete button is clicked", () => {
    render(<SettingsTableLayout {...defaultProps} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockOnDeleteModal).toHaveBeenCalled();
  });

  it("should search for an item in the list", () => {
    render(<SettingsTableLayout {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/Filter by .../i);
    fireEvent.change(searchInput, { target: { value: "item1" } });
    expect(mockOnSearchChange).toHaveBeenCalledWith("item1");
  });

  it("should clear the search input when clear button is clicked", () => {
    render(<SettingsTableLayout {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/Filter by .../i);
    fireEvent.change(searchInput, { target: { value: "item1" } });
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(mockOnSearchChange).toHaveBeenCalledWith("");
  });

  it("should generate correct button ID when extraID is provided", () => {
    const propsWithExtraId = {
      ...defaultProps,
      extraID: "keytab",
      entryType: "User",
    };

    render(<SettingsTableLayout {...propsWithExtraId} />);

    // Check that the Add button has the correct ID with extraID
    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toHaveAttribute("id", "add-keytab-user");
  });

  it("should handle entryType with spaces in extraID", () => {
    const propsWithSpaces = {
      ...defaultProps,
      extraID: "host-group",
      entryType: "Host Group",
    };

    render(<SettingsTableLayout {...propsWithSpaces} />);

    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toHaveAttribute("id", "add-host-group-host-group");
  });
});
