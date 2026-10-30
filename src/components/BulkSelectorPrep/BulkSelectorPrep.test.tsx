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

const mockElementsData = {
  selected: [], // Initially no items selected
  updateSelected: vi.fn(),
  selectableTable: mockList,
  nameAttr: "cn",
};

const mockButtonsData = {
  updateIsDeleteButtonDisabled: vi.fn(),
};

const mockSelectedPerPageData = {
  selectedPerPage: 0,
  updateSelectedPerPage: vi.fn(),
};

describe("BulkSelectorPrep Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders component with default props and interacts with the menu", async () => {
    render(
      <BulkSelectorPrep
        list={mockList}
        shownElementsList={mockShownElementsList}
        elementData={mockElementsData}
        buttonsData={mockButtonsData}
        selectedPerPageData={mockSelectedPerPageData}
      />
    );

    // Find toggle button and click on it
    const toggleButton = screen.getByRole("button", {
      name: /Menu toggle with checkbox split button and text/i,
    });
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);

    // Wait for the menu to open
    const selectPageItem = await screen.findByText(
      /^Select page \(1 items\)$/i
    );
    expect(selectPageItem).toBeInTheDocument();

    // Click on "Select page" option
    fireEvent.click(selectPageItem);

    // Verify mock  function calls
    expect(mockElementsData.updateSelected).toHaveBeenCalledWith(
      mockShownElementsList,
      true
    );
    expect(mockButtonsData.updateIsDeleteButtonDisabled).toHaveBeenCalledWith(
      false
    );
    expect(mockSelectedPerPageData.updateSelectedPerPage).toHaveBeenCalledWith(
      mockShownElementsList.length
    );
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
        list={shownWithExcluded}
        shownElementsList={shownWithExcluded}
        elementData={{
          selected: [],
          updateSelected: vi.fn(),
          selectableTable: selectableOnPage,
          nameAttr: "cn",
        }}
        buttonsData={mockButtonsData}
        selectedPerPageData={{
          selectedPerPage: 1,
          updateSelectedPerPage: vi.fn(),
        }}
      />
    );

    const toggleButton = screen.getByRole("button", {
      name: /Menu toggle with checkbox split button and text/i,
    });
    fireEvent.click(toggleButton);

    // 2 selectable rows on page, 1 already selected → "Select page (1 items)"
    const selectPageItem = await screen.findByText(
      /^Select page \(1 items\)$/i
    );
    expect(selectPageItem).toBeInTheDocument();
  });
});
