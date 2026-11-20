import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, expect, it, afterEach, vi } from "vitest";
// Component
import BulkSelectorPrep from "./BulkSelectorPrep";

interface MockType {
  id: number;
  cn: string;
  dn: string;
  description: string;
}

const mockList: MockType[] = [
  {
    id: 1,
    cn: "Test Group",
    dn: "cn=Test Group,ou=Groups,dc=example,dc=com",
    description: "This is a test group",
  },
  {
    id: 2,
    cn: "Sample Group",
    dn: "cn=Sample Group,ou=Groups,dc=example,dc=com",
    description: "This is a sample group",
  },
  {
    id: 3,
    cn: "Demo Group",
    dn: "cn=Demo Group,ou=Groups,dc=example,dc=com",
    description: "This is a demo group",
  },
];

const mockShownElementsList: MockType[] = [
  {
    id: 1,
    cn: "Test Group",
    dn: "cn=Test Group,ou=Groups,dc=example,dc=com",
    description: "This is a test group",
  },
];

describe("BulkSelectorPrep Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders component with default props and interacts with the menu", async () => {
    const updateSelected = vi.fn();

    render(
      <BulkSelectorPrep
        selected={[]}
        totalCount={mockList.length}
        selectableOnPage={mockShownElementsList}
        updateSelected={updateSelected}
      />
    );

    const toggleButton = screen.getByRole("button", {
      name: /Menu toggle with checkbox split button and text/i,
    });
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);

    const selectPageItem = await screen.findByText(/^Select page \(1 item\)$/i);
    expect(selectPageItem).toBeInTheDocument();

    fireEvent.click(selectPageItem);

    expect(updateSelected).toHaveBeenCalledWith(mockShownElementsList, true);
  });

  it("advertises selectable page count excluding empty selection keys", async () => {
    const shownWithExcluded: MockType[] = [
      {
        id: 1,
        cn: "Selectable Group",
        dn: "cn=Selectable Group,ou=Groups,dc=example,dc=com",
        description: "Selectable",
      },
      {
        id: 2,
        cn: "",
        dn: "cn=,ou=Groups,dc=example,dc=com",
        description: "Not selectable",
      },
      {
        id: 3,
        cn: "Another Group",
        dn: "cn=Another Group,ou=Groups,dc=example,dc=com",
        description: "Also selectable",
      },
    ];
    const selectableOnPage = shownWithExcluded.filter((el) => el.cn !== "");

    render(
      <BulkSelectorPrep
        selected={[]}
        totalCount={shownWithExcluded.length}
        selectableOnPage={selectableOnPage}
        updateSelected={vi.fn()}
      />
    );

    const toggleButton = screen.getByRole("button", {
      name: /Menu toggle with checkbox split button and text/i,
    });
    fireEvent.click(toggleButton);

    const selectPageItem = await screen.findByText(
      /^Select page \(2 items\)$/i
    );
    expect(selectPageItem).toBeInTheDocument();
  });

  it("split checkbox selects the page when nothing is selected", () => {
    const updateSelected = vi.fn();
    render(
      <BulkSelectorPrep
        selected={[]}
        totalCount={mockList.length}
        selectableOnPage={mockShownElementsList}
        updateSelected={updateSelected}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(updateSelected).toHaveBeenCalledWith(mockShownElementsList, true);
  });

  it("split checkbox is indeterminate on a partial selection and clears all", () => {
    const updateSelected = vi.fn();
    const selected = [mockList[0]];
    render(
      <BulkSelectorPrep
        selected={selected}
        totalCount={mockList.length}
        selectableOnPage={mockList}
        updateSelected={updateSelected}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBePartiallyChecked();
    fireEvent.click(checkbox);
    expect(updateSelected).toHaveBeenCalledWith(selected, false);
  });

  it("split checkbox is checked when every entry is selected", () => {
    render(
      <BulkSelectorPrep
        selected={mockList}
        totalCount={mockList.length}
        selectableOnPage={mockList}
        updateSelected={vi.fn()}
      />
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});
