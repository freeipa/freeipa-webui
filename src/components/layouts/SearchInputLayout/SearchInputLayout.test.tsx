import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Component
import SearchInputLayout from "./SearchInputLayout";

const mockUpdateSearchValue = vi.fn();
const mockSubmitSearchValue = vi.fn();

const defaultSearchValueData = {
  searchValue: "",
  updateSearchValue: mockUpdateSearchValue,
  submitSearchValue: mockSubmitSearchValue,
};

describe("SearchInputLayout Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders correctly with all optional props", () => {
    const searchValueData = {
      ...defaultSearchValueData,
      searchValue: "test search",
    };

    render(
      <SearchInputLayout
        name="search-field"
        dataCy="search-input"
        ariaLabel="Search users"
        placeholder="Enter search term"
        searchValueData={searchValueData}
        isDisabled={false}
      />
    );

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toHaveAttribute("name", "search-field");
    expect(searchInput).toHaveAttribute("aria-label", "Search users");
    expect(searchInput).toHaveAttribute("placeholder", "Enter search term");
    expect(searchInput).toHaveValue("test search");
    expect(searchInput).not.toBeDisabled();
  });

  it("displays the current search value", () => {
    const searchValueData = {
      ...defaultSearchValueData,
      searchValue: "current search value",
    };

    render(
      <SearchInputLayout
        dataCy="search-input"
        searchValueData={searchValueData}
      />
    );

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toHaveValue("current search value");
  });

  it("does not call updateSearchValue on keystroke (buffers locally)", () => {
    render(
      <SearchInputLayout
        dataCy="search-input"
        searchValueData={defaultSearchValueData}
      />
    );

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "new search value" } });

    expect(mockUpdateSearchValue).not.toHaveBeenCalled();
    expect(searchInput).toHaveValue("new search value");
  });

  it("calls updateSearchValue with empty string when reset button is clicked", () => {
    const searchValueData = {
      ...defaultSearchValueData,
      searchValue: "search to clear",
    };

    render(
      <SearchInputLayout
        dataCy="search-input"
        searchValueData={searchValueData}
      />
    );

    const clearButton = screen.getByRole("button", { name: /Reset/i });
    fireEvent.click(clearButton);

    expect(mockUpdateSearchValue).toHaveBeenCalledWith("");
  });

  it("calls updateSearchValue and submitSearchValue with input value on search submit", () => {
    render(
      <SearchInputLayout
        dataCy="search-input"
        searchValueData={defaultSearchValueData}
      />
    );

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "typed value" } });

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    expect(mockUpdateSearchValue).toHaveBeenCalledWith("typed value");
    expect(mockSubmitSearchValue).toHaveBeenCalledWith("typed value");
  });
});
