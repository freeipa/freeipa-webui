import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, expect, it, afterEach, vi } from "vitest";
// Component
import MainTable from "./MainTable";

interface MockType {
  cn: string;
  description: string;
}

const makeItems = (count: number): MockType[] =>
  Array.from({ length: count }, (_, i) => ({
    cn: "item-" + i,
    description: "Item " + i,
  }));

const makeTable = (
  items: MockType[],
  setElementsSelected: ReturnType<typeof vi.fn>
) => (
  <MainTable
    tableTitle="Test table"
    shownElementsList={items}
    pk="cn"
    keyNames={["cn", "description"]}
    columnNames={["Name", "Description"]}
    hasCheckboxes={true}
    pathname="test"
    showTableRows={true}
    showLink={false}
    elementsData={{
      isElementSelectable: () => true,
      selectedElements: [],
      selectableElementsTable: items,
      setElementsSelected,
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
    const { rerender } = render(makeTable(longList, setElementsSelected));

    // Anchor the range on the last row of the long list
    fireEvent.click(screen.getAllByRole("checkbox")[9]);

    // Simulate a page/list change with fewer rows
    const shortList = makeItems(3);
    rerender(makeTable(shortList, setElementsSelected));
    setElementsSelected.mockClear();

    // Shift-select the first row of the new list
    fireEvent.keyDown(document, { key: "Shift" });
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.keyUp(document, { key: "Shift" });

    // The stale anchor must not produce a range over the old list
    expect(setElementsSelected).toHaveBeenCalledTimes(1);
    expect(setElementsSelected).toHaveBeenCalledWith(shortList[0], true);
    expect(
      setElementsSelected.mock.calls.every(([element]) => element !== undefined)
    ).toBe(true);
  });
});
