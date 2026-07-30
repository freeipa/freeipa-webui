import React from "react";
import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Component
import PaginationLayout from "./PaginationLayout";
import { renderWithRouter } from "src/utils/testUtils";

const list = Array.from({ length: 50 }, (_, i) => `item-${i + 1}`);

describe("PaginationLayout Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("reads page and perPage from URL search params", () => {
    renderWithRouter(
      <PaginationLayout list={list} totalCount={50} />,
      "/?p=3&size=20"
    );

    expect(
      screen.getByRole("spinbutton", { name: /Current page/i })
    ).toHaveValue(3);
    // Page 3 with size 20 → items 41-50 (shown in total items + menu toggle)
    expect(
      screen.getAllByText((_, el) => el?.textContent === "41 - 50").length
    ).toBeGreaterThan(0);
  });

  it("writes page to URL when navigating", () => {
    const { getParams } = renderWithRouter(
      <PaginationLayout list={list} totalCount={50} />,
      "/?size=10"
    );

    fireEvent.click(screen.getByRole("button", { name: /Go to next page/i }));

    expect(getParams().get("p")).toBe("2");
    expect(getParams().get("size")).toBe("10");
  });

  it("omits p from URL when returning to page 1", () => {
    const { getParams } = renderWithRouter(
      <PaginationLayout list={list} totalCount={50} />,
      "/?p=2&size=10"
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Go to previous page/i })
    );

    expect(getParams().get("p")).toBeNull();
    expect(getParams().get("size")).toBe("10");
  });

  it("writes size and recalculated page to URL on per-page change", () => {
    const { getParams } = renderWithRouter(
      <PaginationLayout
        list={list}
        totalCount={50}
        widgetId="test-pagination"
      />,
      "/?size=10"
    );

    fireEvent.click(document.getElementById("test-pagination-top-toggle")!);
    fireEvent.click(screen.getByRole("menuitem", { name: /20 per page/i }));

    expect(getParams().get("size")).toBe("20");
    expect(getParams().get("p")).toBeNull();
  });

  it("uses local paginationData override instead of URL", () => {
    const onUpdatePage = vi.fn();
    const onUpdatePerPage = vi.fn();

    const { getParams } = renderWithRouter(
      <PaginationLayout
        list={list}
        totalCount={50}
        paginationData={{
          page: 2,
          perPage: 10,
          onUpdatePage,
          onUpdatePerPage,
        }}
      />,
      "/?p=5&size=50"
    );

    expect(
      screen.getByRole("spinbutton", { name: /Current page/i })
    ).toHaveValue(2);

    fireEvent.click(screen.getByRole("button", { name: /Go to next page/i }));

    expect(onUpdatePage).toHaveBeenCalledWith(3);
    expect(getParams().get("p")).toBe("5");
    expect(getParams().get("size")).toBe("50");
  });
});
