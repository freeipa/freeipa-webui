import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
// Component
import TableLayout from "./TableLayout";

const tableBody = [
  <div key="1">Table Body Item</div>,
  <div key="2">Table Body Item</div>,
];

describe("TableLayout Component", () => {
  test("should display the TableLayout with required props with table body", () => {
    render(
      <TableLayout
        ariaLabel="test-table"
        variant="compact"
        hasBorders={true}
        tableId="test-table"
        isStickyHeader={true}
        tableBody={tableBody}
      />
    );
    expect(screen.getByLabelText("test-table")).toBeInTheDocument();
    expect(screen.getAllByText("Table Body Item")).toHaveLength(2);
  });

  test("should display the EmptyBodyTable when there is no table body", () => {
    render(
      <TableLayout
        ariaLabel="test-table2"
        variant="compact"
        hasBorders={true}
        tableId="test-table2"
        isStickyHeader={true}
        tableBody={[]}
      />
    );

    expect(screen.getByLabelText("test-table2")).toBeInTheDocument();
    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByText("Clear all filters and try again.")
    ).toBeInTheDocument();
  });
});
