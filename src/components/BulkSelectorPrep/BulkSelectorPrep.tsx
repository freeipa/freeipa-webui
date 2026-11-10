import React, { useState } from "react";
// PatternFly
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleCheckbox,
  MenuToggleElement,
} from "@patternfly/react-core";

type PropsToBulkSelectorPrep<T> = {
  totalCount: number;
  selected: T[];
  selectableOnPage: T[];
  updateSelected: (entry: T[], isSelected: boolean) => void;
};

const BulkSelectorPrep = <T,>({
  totalCount,
  selected,
  selectableOnPage,
  updateSelected,
}: PropsToBulkSelectorPrep<T>) => {
  const [isBulkSelectDropdownOpen, setIsBulkSelectDropdownOpen] =
    useState(false);
  const numSelected = selected.length;
  const allSelected = numSelected > 0 && numSelected === totalCount;
  const anySelected = numSelected > 0;
  const someChecked = anySelected ? null : false;
  const isChecked = allSelected ? true : someChecked;

  const count = selectableOnPage.length;

  const items = (
    <>
      <DropdownItem value="none" data-cy="bulk-selector-prep-select-none">
        Select none (0 items)
      </DropdownItem>
      <DropdownItem value="page" data-cy="bulk-selector-prep-select-page">
        Select page ({count} item{count !== 1 ? "s" : ""})
      </DropdownItem>
    </>
  );

  return (
    <Dropdown
      role="menu"
      onSelect={(_event, value) => {
        if (value === "page") {
          updateSelected(selectableOnPage, true);
        } else {
          updateSelected(selected, false);
        }
        setIsBulkSelectDropdownOpen(false);
      }}
      isOpen={isBulkSelectDropdownOpen}
      onOpenChange={(isOpen: boolean) => setIsBulkSelectDropdownOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          data-cy="bulk-selector-prep"
          ref={toggleRef}
          isExpanded={isBulkSelectDropdownOpen}
          onClick={() => setIsBulkSelectDropdownOpen(!isBulkSelectDropdownOpen)}
          aria-label="Menu toggle with checkbox split button and text"
          splitButtonItems={[
            <MenuToggleCheckbox
              id="split-dropdown-checkbox"
              key="split-dropdown-checkbox"
              aria-label={anySelected ? "Deselect all" : "Select all"}
              isChecked={isChecked}
              onChange={() => {
                if (anySelected) {
                  updateSelected(selected, false);
                } else {
                  updateSelected(selectableOnPage, true);
                }
              }}
            >
              {numSelected !== 0 && `${numSelected} selected`}
            </MenuToggleCheckbox>,
          ]}
        />
      )}
      data-cy="bulk-selector-prep-dropdown"
    >
      <DropdownList>{items}</DropdownList>
    </Dropdown>
  );
};

export default BulkSelectorPrep;
