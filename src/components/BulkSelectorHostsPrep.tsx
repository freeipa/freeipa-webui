/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useEffect, useRef, useState } from "react";
// PatternFly
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
  MenuToggleCheckbox,
} from "@patternfly/react-core";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Layouts
import BulkSelectorLayout from "src/components/layouts/BulkSelectorLayout";

interface HostsData {
  selectedHosts: string[];
  updateSelectedHosts: (newSelectedHosts: string[]) => void;
  changeSelectedHostIds: (newSelectedHostIds: string[]) => void;
  selectableHostsTable: Host[];
  isHostSelectable: (host: Host) => boolean;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
}

interface SelectedPerPageData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

interface PropsToBulkSelectorHostsPrep {
  list: Host[];
  shownElementsList: Host[];
  elementData: HostsData;
  buttonsData: ButtonsData;
  selectedPerPageData: SelectedPerPageData;
}

const BulkSelectorHostsPrep = (props: PropsToBulkSelectorHostsPrep) => {
  // Table functionality (from parent component) to manage the bulk selector functionality
  // - Menu
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const toggleRefMenu = useRef<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRefMenu = useRef<HTMLDivElement>(null);

  const handleMenuKeys = (event: KeyboardEvent) => {
    if (!isOpenMenu) {
      return;
    }
    if (
      menuRef.current?.contains(event.target as Node) ||
      toggleRefMenu.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsOpenMenu(!isOpenMenu);
        toggleRefMenu.current?.focus();
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isOpenMenu && !menuRef.current?.contains(event.target as Node)) {
      setIsOpenMenu(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleMenuKeys);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpenMenu, menuRef]);

  // - When a bulk selector element is selected, it remains highlighted
  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    setIsOpenMenu(!isOpenMenu);
  };

  // - Selectable checkboxes on table (elements per page)
  const selectableElementsPage = props.shownElementsList.filter(
    props.elementData.isHostSelectable
  );

  // - Methods to manage the Bulk selector options
  // -- Unselect all items on the table
  const unselectAllItems = () => {
    props.elementData.changeSelectedHostIds([]);
    props.elementData.updateSelectedHosts([]);
    props.buttonsData.updateIsDeleteButtonDisabled(true);
  };

  // - Helper method: Remove duplicates in a list
  const removeDuplicates = (hostsList: string[]) => {
    return hostsList.filter((host, index) => hostsList.indexOf(host) === index);
  };

  // Select all elements (Page)
  const selectAllElementsPage = (
    isSelecting = true,
    selectableHostsList: Host[]
  ) => {
    props.elementData.changeSelectedHostIds(
      isSelecting ? selectableHostsList.map((r) => r.id) : []
    );

    // Update selected elements
    const hostNamesArray: string[] = [];
    selectableHostsList.map((host) => {
      hostNamesArray.push(host.id);
    });
    props.elementData.updateSelectedHosts(hostNamesArray);

    // Enable/disable 'Delete' button
    if (isSelecting) {
      let hostsIdArray: string[] = [];

      // if all page selected, the original 'selectedHosts' data is preserved
      if (
        selectableHostsList.length <=
        props.elementData.selectableHostsTable.length
      ) {
        props.elementData.selectedHosts.map((host) => {
          hostsIdArray.push(host);
        });
        selectableHostsList.map((host) => {
          hostsIdArray.push(host.id);
        });
      }

      // Correct duplicates (if any)
      hostsIdArray = removeDuplicates(hostsIdArray);
      props.elementData.updateSelectedHosts(hostsIdArray);

      // Update data
      props.elementData.changeSelectedHostIds(hostsIdArray);
      props.elementData.updateSelectedHosts(hostsIdArray);
      // Enable delete button
      props.buttonsData.updateIsDeleteButtonDisabled(false);
      // Update the 'selectedPerPage' counter
      props.selectedPerPageData.updateSelectedPerPage(
        selectableHostsList.length
      );
    } else {
      props.elementData.changeSelectedHostIds([]);
      props.elementData.updateSelectedHosts([]);
      props.buttonsData.updateIsDeleteButtonDisabled(true);
      // Restore the 'selectedPerPage' counter
      props.selectedPerPageData.updateSelectedPerPage(0);
    }
  };

  // Select all elements (Table)
  const selectAllElementsTable = (
    isSelecting = true,
    selectableHostsList: Host[]
  ) => {
    props.elementData.changeSelectedHostIds(
      isSelecting ? selectableHostsList.map((r) => r.id) : []
    );

    // Update selected elements
    const hostNamesArray: string[] = [];
    selectableHostsList.map((host) => {
      hostNamesArray.push(host.id);
    });
    props.elementData.updateSelectedHosts(hostNamesArray);

    // Enable/disable 'Delete' button
    if (isSelecting) {
      const hostsIdArray: string[] = [];
      selectableHostsList.map((host) => hostsIdArray.push(host.id));
      props.elementData.changeSelectedHostIds(hostsIdArray);
      props.elementData.updateSelectedHosts(hostsIdArray);
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    } else {
      props.elementData.changeSelectedHostIds([]);
      props.elementData.updateSelectedHosts([]);
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  };

  // Helper method to manage the checkbox icon symbol
  // - All rows selected: true (full check)
  // - Some rows selected: null (-)
  // - None selected: false (empty)
  const areAllElementsSelected: boolean | null =
    props.elementData.selectedHosts.length ===
    props.elementData.selectableHostsTable.length
      ? true
      : props.elementData.selectedHosts.length > 0
      ? null
      : false;

  // Menu toggle element with checkbox
  const toggle = (
    <MenuToggle
      ref={toggleRefMenu}
      onClick={onToggleClick}
      isExpanded={isOpenMenu}
      splitButtonOptions={{
        items: [
          <MenuToggleCheckbox
            id="split-button-checkbox-with-text-disabled-example"
            key="split-checkbox-with-text-disabled"
            aria-label="Select all"
            onChange={(
              isSelecting: boolean | undefined,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              event: FormEvent<HTMLInputElement>
            ) =>
              selectAllElementsTable(
                isSelecting,
                props.elementData.selectableHostsTable
              )
            }
            isChecked={areAllElementsSelected}
          >
            {props.elementData.selectedHosts.length > 0 && (
              <p>{props.elementData.selectedHosts.length + " selected"}</p>
            )}
          </MenuToggleCheckbox>,
        ],
      }}
      aria-label="Menu toggle with checkbox split button and text"
    />
  );

  // Checks wether all the elements on the currect page have been selected or not
  const [currentPageAlreadySelected, setCurrentPageAlreadySelected] =
    useState(false);

  // The 'currentPageAlreadySelected' should be set when elements are selected
  useEffect(() => {
    const found = props.shownElementsList.every(
      (host) => props.elementData.selectedHosts.indexOf(host.id) >= 0
    );

    if (found) {
      // All the elements on that page are been selected
      setCurrentPageAlreadySelected(true);
    } else {
      // The elements on that page are not been selected (yet)
      setCurrentPageAlreadySelected(false);
      // If there is no elements selected on the page yet, reset 'selectedPerPage'
      if (
        !props.shownElementsList.some(
          (host) => props.elementData.selectedHosts.indexOf(host.id) >= 0
        )
      ) {
        props.selectedPerPageData.updateSelectedPerPage(0);
      }
    }
  }, [props.elementData.selectedHosts.length, props.shownElementsList]);

  // Set the messages displayed in the 'Select page' option (bulk selector)
  const getSelectedElements = () => {
    let msg =
      "Select page (" + props.elementData.selectedHosts.length + " items)";
    const remainingElements = Math.min(
      props.elementData.selectedHosts.length +
        props.shownElementsList.length -
        props.selectedPerPageData.selectedPerPage,
      props.list.length
    );

    if (
      props.list.length > props.elementData.selectedHosts.length &&
      !currentPageAlreadySelected
    ) {
      msg = "Select page (" + remainingElements + " items)";
    }

    return msg;
  };

  // Menu options
  const menuToolbar = (
    <Menu
      ref={menuRef}
      style={{ minWidth: "fit-content" }}
      onSelect={(_ev) => {
        setIsOpenMenu(!isOpenMenu);
        toggleRefMenu.current?.querySelector("button").focus();
      }}
    >
      <MenuContent>
        <MenuList>
          <MenuItem itemId={0} onClick={unselectAllItems}>
            Select none (0 items)
          </MenuItem>
          <MenuItem
            itemId={1}
            onClick={() => selectAllElementsPage(true, selectableElementsPage)}
            // NOTE: The line below disables this BS option when all the page rows have been selected.
            // This can benefit the user experience as it provides extra context of the already selected elements.
            // isDisabled={currentPageAlreadySelected}
          >
            {getSelectedElements()}
          </MenuItem>
          <MenuItem
            itemId={2}
            onClick={() =>
              selectAllElementsTable(
                true,
                props.elementData.selectableHostsTable
              )
            }
          >
            Select all ({props.list.length} items)
          </MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  // Renders 'BulkSelectorLayout' with the elements' data
  return (
    <BulkSelectorLayout
      menuKey="menu-all-hosts-table"
      containerRefMenu={containerRefMenu}
      toggle={toggle}
      menuToolbar={menuToolbar}
      appendTo={containerRefMenu.current || undefined}
      isOpenMenu={isOpenMenu}
      ariaLabel="Menu toggle with checkbox split button"
    />
  );
};

export default BulkSelectorHostsPrep;
