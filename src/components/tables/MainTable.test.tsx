import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, expect, it, afterEach, vi } from "vitest";
import { MemoryRouter } from "react-router";
// Component
import MainTable from "./MainTable";

interface MockType {
  cn: string;
  description: string;
}

interface TableOptions {
  setElementsSelected: ReturnType<typeof vi.fn>;
  isElementSelectable?: (element: MockType) => boolean;
  showLink?: boolean;
}

const makeItems = (count: number): MockType[] =>
  Array.from({ length: count }, (_, i) => ({
    cn: "item-" + i,
    description: "Item " + i,
  }));

const makeTable = (items: MockType[], options: TableOptions) => (
  <MainTable
    tableTitle="Test table"
    shownElementsList={items}
    pk="cn"
    keyNames={["cn", "description"]}
    columnNames={["Name", "Description"]}
    hasCheckboxes={true}
    pathname="test"
    showTableRows={true}
    showLink={options.showLink ?? false}
    elementsData={{
      isElementSelectable: options.isElementSelectable ?? (() => true),
      selectedElements: [],
      selectableElementsTable: items,
      setElementsSelected: options.setElementsSelected,
      clearSelectedElements: vi.fn(),
    }}
    buttonsData={{
      updateIsDeleteButtonDisabled: vi.fn(),
      isDeletion: false,
      updateIsDeletion: vi.fn(),
    }}
    paginationData={{
      selectedPerPage: 0,
      updateSelectedPerPage: vi.fn(),
    }}
  />
);

describe("MainTable shift selection", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not pass undefined rows after the shown list shrinks", () => {
    const setElementsSelected = vi.fn();
    const longList = makeItems(10);
    const { rerender } = render(makeTable(longList, { setElementsSelected }));

    // Anchor the range on the last row of the long list
    fireEvent.click(screen.getAllByRole("checkbox")[9]);

    // Simulate a page/list change with fewer rows
    const shortList = makeItems(3);
    rerender(makeTable(shortList, { setElementsSelected }));
    setElementsSelected.mockClear();

    // Shift-select the first row of the new list
    fireEvent.keyDown(document, { key: "Shift" });
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.keyUp(document, { key: "Shift" });

    // The stale anchor must not produce a range over the old list
    expect(setElementsSelected).toHaveBeenCalledTimes(1);
    expect(setElementsSelected).toHaveBeenCalledWith([shortList[0]], true);
    expect(
      setElementsSelected.mock.calls.every(([elements]) =>
        elements.every((element: MockType) => element !== undefined)
      )
    ).toBe(true);
  });

  it("double-encodes slashes in the row link", () => {
    const items = [{ cn: "/usr/bin/ls", description: "ls" }];
    render(
      <MemoryRouter>
        {makeTable(items, {
          setElementsSelected: vi.fn(),
          showLink: true,
        })}
      </MemoryRouter>
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/test/%252Fusr%252Fbin%252Fls"
    );
  });

  it("uses the column display name as the cell data label", () => {
    render(makeTable(makeItems(1), { setElementsSelected: vi.fn() }));

    const row = screen.getByText("item-0").closest("tr") as HTMLElement;
    const nameCell = row.querySelector("td[data-label='Name']");
    const descriptionCell = row.querySelector("td[data-label='Description']");

    expect(nameCell).not.toBeNull();
    expect(descriptionCell).not.toBeNull();
    // Cell context comes from the headers, not a per-cell aria-label
    expect(nameCell?.hasAttribute("aria-label")).toBe(false);
  });

  it("applies a shift range in one update, skipping non-selectable rows", () => {
    const setElementsSelected = vi.fn();
    const items = makeItems(5);
    render(
      makeTable(items, {
        setElementsSelected,
        isElementSelectable: (item) => item.cn !== "item-2",
      })
    );

    // Anchor on the first row, then shift-select the last one
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    setElementsSelected.mockClear();

    fireEvent.keyDown(document, { key: "Shift" });
    fireEvent.click(screen.getAllByRole("checkbox")[4]);
    fireEvent.keyUp(document, { key: "Shift" });

    expect(setElementsSelected).toHaveBeenCalledTimes(1);
    expect(setElementsSelected).toHaveBeenCalledWith(
      [items[0], items[1], items[3], items[4]],
      true
    );
  });
});
