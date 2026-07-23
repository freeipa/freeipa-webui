import React from "react";
import { MemoryRouter, useSearchParams } from "react-router";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Component
import SearchInputLayout from "./SearchInputLayout";

const SearchParamsProbe = ({
  onParams,
}: {
  onParams: (params: URLSearchParams) => void;
}) => {
  const [params] = useSearchParams();
  onParams(params);
  return null;
};

const renderWithRouter = (ui: React.ReactElement, initialEntry = "/") => {
  let latestParams = new URLSearchParams();
  const result = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      {ui}
      <SearchParamsProbe
        onParams={(params) => {
          latestParams = params;
        }}
      />
    </MemoryRouter>
  );
  return {
    ...result,
    getParams: () => latestParams,
  };
};

describe("SearchInputLayout Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders correctly with all optional props", () => {
    renderWithRouter(
      <SearchInputLayout
        name="search-field"
        dataCy="search-input"
        ariaLabel="Search users"
        placeholder="Enter search term"
        isDisabled={false}
      />,
      "/?search=test%20search"
    );

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toHaveAttribute("name", "search-field");
    expect(searchInput).toHaveAttribute("aria-label", "Search users");
    expect(searchInput).toHaveAttribute("placeholder", "Enter search term");
    expect(searchInput).toHaveValue("test search");
    expect(searchInput).not.toBeDisabled();
  });

  it("displays the current URL search value", () => {
    renderWithRouter(
      <SearchInputLayout dataCy="search-input" />,
      "/?search=current%20search%20value"
    );

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toHaveValue("current search value");
  });

  it("does not update URL on keystroke (buffers locally)", () => {
    const { getParams } = renderWithRouter(
      <SearchInputLayout dataCy="search-input" />
    );

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "new search value" } });

    expect(getParams().get("search")).toBeNull();
    expect(searchInput).toHaveValue("new search value");
  });

  it("commits empty string to URL when reset button is clicked", () => {
    const { getParams } = renderWithRouter(
      <SearchInputLayout dataCy="search-input" />,
      "/?search=search%20to%20clear&p=3"
    );

    const clearButton = screen.getByRole("button", { name: /Reset/i });
    fireEvent.click(clearButton);

    expect(getParams().get("search")).toBeNull();
    expect(getParams().get("p")).toBeNull();
  });

  it("commits input value to URL on search submit and resets page", () => {
    const { getParams } = renderWithRouter(
      <SearchInputLayout dataCy="search-input" />,
      "/?p=3"
    );

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "typed value" } });

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    expect(getParams().get("search")).toBe("typed value");
    expect(getParams().get("p")).toBeNull();
  });

  it("uses local searchValueData override instead of URL", () => {
    const mockOnSubmit = vi.fn();

    const { getParams } = renderWithRouter(
      <SearchInputLayout
        dataCy="search-input"
        searchValueData={{
          searchValue: "local value",
          onSubmit: mockOnSubmit,
        }}
      />,
      "/?search=url%20value"
    );

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toHaveValue("local value");

    fireEvent.change(searchInput, { target: { value: "typed local" } });
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    expect(mockOnSubmit).toHaveBeenCalledWith("typed local");
    expect(getParams().get("search")).toBe("url value");
  });
});
