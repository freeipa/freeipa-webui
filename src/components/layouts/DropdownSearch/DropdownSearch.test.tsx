import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
// Component
import DropdownSearch from "./DropdownSearch";

interface MockReturn {
  data: { list: string[] } | { error: { message: string } };
}

const mockList: string[] = ["first", "second", "third"];

/**
 * DropdownSearch.tsx
 */
const retrieveList: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { list: mockList } };
});

vi.mock("src/services/rpc", () => ({
  useGetIDListMutation: () => [retrieveList],
}));

describe("DropdownSearch Component", () => {
  const mockOnSelect = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the DropdownSearch component with items", async () => {
    render(
      <DropdownSearch
        id="test"
        onSelect={mockOnSelect}
        options={mockList}
        searchType="test"
        value=""
      />
    );

    // Get Dropdown
    const dropdownButton = screen.getByRole("button");
    expect(dropdownButton).toBeInTheDocument();

    // Click on Dropdown
    fireEvent.click(dropdownButton);

    // Check menuitems
    for (const item of mockList) {
      const button = screen.getByRole("menuitem", { name: item });
      expect(button).toBeInTheDocument();
    }
  });

  it("select in DropdownSearch Component works", async () => {
    render(
      <DropdownSearch
        id="test"
        onSelect={mockOnSelect}
        options={mockList}
        searchType="test"
        value=""
      />
    );

    // Get Dropdown
    const dropdownButton = screen.getByRole("button");
    expect(dropdownButton).toBeInTheDocument();

    // Click on Dropdown
    fireEvent.click(dropdownButton);

    // Get menuitem
    const button = screen.getByRole("menuitem", { name: mockList[0] });
    expect(button).toBeInTheDocument();

    // Select item
    fireEvent.click(button);

    expect(mockOnSelect).toBeCalledWith(mockList[0]);
  });

  it("search in DropdownSearch Component works", async () => {
    render(
      <DropdownSearch
        id="test"
        onSelect={mockOnSelect}
        options={mockList}
        searchType="test"
        value=""
      />
    );

    // Get Dropdown
    const dropdownButton = screen.getByRole("button");
    expect(dropdownButton).toBeInTheDocument();

    // Click on Dropdown
    fireEvent.click(dropdownButton);

    // Check menuitems
    for (const item of mockList) {
      const button = screen.getByRole("menuitem", { name: item });
      expect(button).toBeInTheDocument();
    }

    // Get search
    const searchTextbox = screen.getByRole("textbox", {
      name: /Search input/i,
    });
    expect(searchTextbox).toBeInTheDocument();

    // Mock search
    fireEvent.change(searchTextbox, { target: { value: mockList[0] } });

    const searchButton = screen.getByRole("button", {
      name: /Search/i,
    });
    expect(searchButton).toBeInTheDocument();
    fireEvent.click(searchButton);

    // Check menuitems
    expect(retrieveList).toHaveBeenCalled();
    expect(retrieveList).toHaveBeenCalledWith(
      expect.objectContaining({
        searchValue: mockList[0],
      })
    );

    // Mock clear search
    fireEvent.change(searchTextbox, { target: { value: "" } });
    fireEvent.click(searchButton);
  });

  it("failing search in DropdownSearch Component works", async () => {
    render(
      <DropdownSearch
        id="test"
        onSelect={mockOnSelect}
        options={mockList}
        searchType="test"
        value=""
      />
    );

    // Get Dropdown
    const dropdownButton = screen.getByRole("button");
    expect(dropdownButton).toBeInTheDocument();

    // Click on Dropdown
    fireEvent.click(dropdownButton);

    // Check menuitems
    for (const item of mockList) {
      const button = screen.getByRole("menuitem", { name: item });
      expect(button).toBeInTheDocument();
    }

    // Get search
    const searchTextbox = screen.getByRole("textbox", {
      name: /Search input/i,
    });
    expect(searchTextbox).toBeInTheDocument();

    retrieveList.mockReturnValueOnce(
      new Promise((resolve) =>
        resolve({ data: { error: { message: "error" } } })
      )
    );

    // Mock search
    fireEvent.change(searchTextbox, { target: { value: mockList[0] } });

    const searchButton = screen.getByRole("button", {
      name: /Search/i,
    });
    expect(searchButton).toBeInTheDocument();
    fireEvent.click(searchButton);

    // Validate search works and filters
    const buttons = screen.getAllByRole("menuitem");
    expect(buttons).toHaveLength(1);

    // Check menuitems
    expect(retrieveList).toHaveBeenCalled();
    expect(retrieveList).toHaveBeenCalledWith(
      expect.objectContaining({
        searchValue: mockList[0],
      })
    );

    // Mock clear search
    fireEvent.change(searchTextbox, { target: { value: "" } });
    fireEvent.click(searchButton);

    // Validate search works and clearing the box allows items to reappear
    const buttonsAll = screen.getAllByRole("menuitem");
    expect(buttonsAll).toHaveLength(3);
  });
});
