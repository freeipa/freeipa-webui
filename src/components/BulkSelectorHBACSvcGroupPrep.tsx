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
import { HBACServiceGroup } from "src/utils/datatypes/globalDataTypes";
// Layouts
import BulkSelectorLayout from "src/components/layouts/BulkSelectorLayout";

interface ServicesData {
  selectedServices: HBACServiceGroup[];
  selectableServicesTable: HBACServiceGroup[];
  isHbacServiceSelectable: (grp: HBACServiceGroup) => boolean;
  updateSelectedServices: (
    grp: HBACServiceGroup[],
    isSelected: boolean
  ) => void;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
}

interface SelectedPerPageData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

interface PropsToBulkSelectorPrep {
  list: HBACServiceGroup[];
  shownElementsList: HBACServiceGroup[];
  elementData: ServicesData;
  buttonsData: ButtonsData;
  selectedPerPageData: SelectedPerPageData;
}

const BulkSelectorHBACServiceGroupsPrep = (props: PropsToBulkSelectorPrep) => {
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
    props.elementData.isHbacServiceSelectable
  );

  // - Methods to manage the Bulk selector options
  // -- Unselect all items on the table
  const unselectPageItems = () => {
    props.elementData.updateSelectedServices(props.shownElementsList, false);
  };

  const unselectAllItems = () => {
    props.elementData.updateSelectedServices(
      props.elementData.selectedServices,
      false
    );
    props.buttonsData.updateIsDeleteButtonDisabled(true);
  };

  // Select all elements (Page)
  const selectAllElementsPage = (
    isSelecting = true,
    selectableServicesList: HBACServiceGroup[]
  ) => {
    // Enable/disable 'Delete' button
    if (isSelecting) {
      props.elementData.updateSelectedServices(selectableServicesList, true);

      // Enable delete button
      props.buttonsData.updateIsDeleteButtonDisabled(false);
      // Update the 'selectedPerPage' counter
      props.selectedPerPageData.updateSelectedPerPage(
        selectableServicesList.length
      );
    } else {
      props.elementData.updateSelectedServices(props.shownElementsList, false);
      props.buttonsData.updateIsDeleteButtonDisabled(true);
      // Restore the 'selectedPerPage' counter
      props.selectedPerPageData.updateSelectedPerPage(0);
    }
  };

  // Helper method to manage the checkbox icon symbol
  // - All rows selected: true (full check)
  // - Some rows selected: null (-)
  // - None selected: false (empty)
  const areAllElementsSelected: boolean | null =
    props.elementData.selectedServices.length > 0 &&
    props.elementData.selectedServices.length ===
      props.elementData.selectableServicesTable.length
      ? true
      : props.elementData.selectedServices.length > 0
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
              event: FormEvent<HTMLInputElement>
            ) =>
              selectAllElementsPage(
                isSelecting,
                props.elementData.selectableServicesTable
              )
            }
            isChecked={areAllElementsSelected}
          >
            {props.elementData.selectedServices.length > 0 && (
              <p>{props.elementData.selectedServices.length + " selected"}</p>
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
    const found = props.shownElementsList.every((group) =>
      props.elementData.selectedServices.find(
        (selectedService) => selectedService.cn === group.cn
      )
    );

    if (found) {
      // All the elements on that page are been selected
      setCurrentPageAlreadySelected(true);
    } else {
      // The elements on that page are not been selected (yet)
      setCurrentPageAlreadySelected(false);
      // If there is no elements selected on the page yet, reset 'selectedPerPage'
      if (
        !props.shownElementsList.some((service) =>
          props.elementData.selectedServices.find(
            (selectedService) => selectedService.cn === service.cn
          )
        )
      ) {
        props.selectedPerPageData.updateSelectedPerPage(0);
      }
    }
  }, [props.elementData.selectedServices.length, props.shownElementsList]);

  // Set the messages displayed in the 'Select page' option (bulk selector)
  const getSelectedElements = () => {
    let msg =
      "Select page (" + props.elementData.selectedServices.length + " items)";
    const remainingElements = Math.min(
      props.elementData.selectedServices.length +
        props.shownElementsList.length -
        props.selectedPerPageData.selectedPerPage,
      props.list.length
    );

    if (
      props.list.length > props.elementData.selectedServices.length &&
      !currentPageAlreadySelected
    ) {
      msg = "Select page (" + remainingElements + " items)";
    }

    return msg;
  };

  const service_id_list = props.elementData.selectedServices.map((service) => {
    return service.cn;
  });

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
          <MenuItem itemId={0} onClick={unselectPageItems}>
            Unselect page (0 items)
          </MenuItem>
          <MenuItem itemId={1} onClick={unselectAllItems}>
            Unselect all (0 items)
          </MenuItem>
          <MenuItem
            itemId={2}
            onClick={() => selectAllElementsPage(true, selectableElementsPage)}
            // NOTE: The line below disables this BS option when all the page rows have been selected.
            // This can benefit the user experience as it provides extra context of the already selected elements.
            // isDisabled={currentPageAlreadySelected}
          >
            {getSelectedElements()}
          </MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  // Renders component with the elements' data
  return (
    <BulkSelectorLayout
      menuKey="menu-all-hbacservicegroup-table"
      containerRefMenu={containerRefMenu}
      toggle={toggle}
      menuToolbar={menuToolbar}
      appendTo={containerRefMenu.current || undefined}
      isOpenMenu={isOpenMenu}
      ariaLabel="Menu toggle with checkbox split button"
      title={service_id_list.join(", ")}
    />
  );
};

export default BulkSelectorHBACServiceGroupsPrep;
