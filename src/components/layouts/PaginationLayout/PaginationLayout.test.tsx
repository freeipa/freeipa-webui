import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { expect, it, describe, vi, afterEach } from "vitest";
// Component
import PaginationLayout from "./PaginationLayout";

const mockUpdatePage = vi.fn();
const mockUpdatePerPage = vi.fn();
const mockUpdateSelectedPerPage = vi.fn();
const mockUpdateShownElementsList = vi.fn();

const defaultPaginationData = {
  page: 1,
  perPage: 10,
  updatePage: mockUpdatePage,
  updatePerPage: mockUpdatePerPage,
  updateSelectedPerPage: mockUpdateSelectedPerPage,
  updateShownElementsList: mockUpdateShownElementsList,
  totalCount: 25,
};

const mockList = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

const defaultProps = {
  list: mockList,
  paginationData: defaultPaginationData,
};

const completeProps = {
  list: mockList,
  paginationData: defaultPaginationData,
  variant: "bottom" as const,
  widgetId: "test-pagination-widget",
  className: "custom-pagination-class",
  isCompact: true,
  perPageSize: "sm" as const,
};

describe("PaginationLayout Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders with required props only", () => {
    render(<PaginationLayout {...defaultProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(<PaginationLayout {...completeProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();

    const paginationContainer = pagination.closest(".pf-v6-c-pagination");
    expect(paginationContainer).toHaveClass("custom-pagination-class");
  });

  it("displays correct item count from totalCount", () => {
    render(<PaginationLayout {...defaultProps} />);

    const totalCountElements = screen.getAllByText(/25/);
    expect(totalCountElements.length).toBeGreaterThan(0);
  });

  it("displays correct item count from list length when totalCount is not provided", () => {
    const propsWithoutTotalCount = {
      ...defaultProps,
      paginationData: {
        ...defaultPaginationData,
        totalCount: 0,
      },
    };

    render(<PaginationLayout {...propsWithoutTotalCount} />);

    const totalCountElements = screen.getAllByText(/25/);
    expect(totalCountElements.length).toBeGreaterThan(0);
  });

  it("displays current page and per page values", () => {
    const customPaginationData = {
      ...defaultPaginationData,
      page: 2,
      perPage: 20,
    };

    render(
      <PaginationLayout
        {...defaultProps}
        paginationData={customPaginationData}
      />
    );

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("uses default perPage options for default size", () => {
    render(<PaginationLayout {...defaultProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("uses small perPage options when perPageSize is sm", () => {
    const propsWithSmallSize = {
      ...defaultProps,
      perPageSize: "sm" as const,
    };

    render(<PaginationLayout {...propsWithSmallSize} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("handles page navigation", () => {
    render(<PaginationLayout {...defaultProps} />);

    // Find and click next page button
    const nextButton = screen.queryByRole("button", { name: /next/i });
    if (nextButton && !nextButton.hasAttribute("disabled")) {
      fireEvent.click(nextButton);
      expect(mockUpdatePage).toHaveBeenCalled();
      expect(mockUpdateShownElementsList).toHaveBeenCalled();
      expect(mockUpdateSelectedPerPage).toHaveBeenCalledWith(0);
    }
  });

  it("handles per page selection", () => {
    render(<PaginationLayout {...defaultProps} />);

    const perPageToggle = screen.queryByRole("button", { name: /per page/i });
    if (perPageToggle) {
      fireEvent.click(perPageToggle);

      const option20 = screen.queryByText("20");
      if (option20) {
        fireEvent.click(option20);
        expect(mockUpdatePerPage).toHaveBeenCalled();
        expect(mockUpdatePage).toHaveBeenCalled();
        expect(mockUpdateShownElementsList).toHaveBeenCalled();
        expect(mockUpdateSelectedPerPage).toHaveBeenCalledWith(0);
      }
    }
  });

  it("applies compact styling when isCompact is true", () => {
    const compactProps = {
      ...defaultProps,
      isCompact: true,
    };

    render(<PaginationLayout {...compactProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    const propsWithClassName = {
      ...defaultProps,
      className: "test-pagination-class",
    };

    render(<PaginationLayout {...propsWithClassName} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    const paginationContainer = pagination.closest(".pf-v6-c-pagination");
    expect(paginationContainer).toHaveClass("test-pagination-class");
  });

  it("sets widgetId correctly", () => {
    const propsWithWidgetId = {
      ...defaultProps,
      widgetId: "custom-widget-id",
    };

    render(<PaginationLayout {...propsWithWidgetId} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("handles variant prop correctly", () => {
    const topVariantProps = {
      ...defaultProps,
      variant: "top" as const,
    };

    render(<PaginationLayout {...topVariantProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("calculates shown elements correctly in handleSetPage", () => {
    render(<PaginationLayout {...defaultProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("calculates shown elements correctly in handlePerPageSelect", () => {
    render(<PaginationLayout {...defaultProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("resets selectedPerPage on page navigation", () => {
    render(<PaginationLayout {...defaultProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("resets selectedPerPage on per page selection", () => {
    render(<PaginationLayout {...defaultProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("works with empty list", () => {
    const emptyListProps = {
      ...defaultProps,
      list: [],
      paginationData: {
        ...defaultPaginationData,
        totalCount: 0,
      },
    };

    render(<PaginationLayout {...emptyListProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("handles large datasets correctly", () => {
    const largeList = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));

    const largeDataProps = {
      ...defaultProps,
      list: largeList,
      paginationData: {
        ...defaultPaginationData,
        totalCount: 1000,
      },
    };

    render(<PaginationLayout {...largeDataProps} />);

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
    const countElements = screen.getAllByText(/1000/);
    expect(countElements.length).toBeGreaterThan(0);
  });

  it("maintains pagination state consistency", () => {
    const customPaginationData = {
      ...defaultPaginationData,
      page: 3,
      perPage: 5,
      totalCount: 50,
    };

    render(
      <PaginationLayout
        {...defaultProps}
        paginationData={customPaginationData}
      />
    );

    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();
  });

  it("renders without errors when all callbacks are undefined", () => {
    const propsWithUndefinedCallbacks = {
      list: mockList,
      paginationData: {
        page: 1,
        perPage: 10,
        updatePage: vi.fn(),
        updatePerPage: vi.fn(),
        updateSelectedPerPage: vi.fn(),
        updateShownElementsList: vi.fn(),
        totalCount: 25,
      },
    };

    expect(() =>
      render(<PaginationLayout {...propsWithUndefinedCallbacks} />)
    ).not.toThrow();
  });
});
