import React, { useEffect, useState } from "react";
// PatternFly
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
  Button, EmptyStateHeader, EmptyStateFooter,
} from "@patternfly/react-core";
import { Td, Th, Tr } from "@patternfly/react-table";
// Icons
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";
// Layouts
import TableLayout from "../layouts/TableLayout";
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
// Data type
import { Host } from "src/utils/datatypes/globalDataTypes";

interface ColumnNames {
  name: string;
}

interface ButtonData {
  isDeletion: boolean;
  updateIsDeletion: (option: boolean) => void;
  changeIsDeleteButtonDisabled: (updatedDeleteButton: boolean) => void;
}

interface PropsToTable {
  list: Host[];
  tableName: string;
  showTableRows: boolean;
  updateElementsSelected: (newElementsSelected: string[]) => void;
  buttonData: ButtonData;
}

const ManagedByTable = (props: PropsToTable) => {
  // Define column names
  // - Hosts
  const hostsColumnNames: ColumnNames = {
    name: "Host name",
  };

  // State for column names
  const [columnNames] = useState<ColumnNames>(hostsColumnNames);

  // selected element ID state
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);

  // Selectable checkboxes on table
  const isElementSelectable = (element: Host) => element.fqdn !== "";
  const selectableElements = props.list.filter(isElementSelectable);

  // Selected rows are tracked. Primary key: hostName
  const [selectedElementNames, setSelectedElementNames] = useState<string[]>(
    []
  );

  const setElementSelected = (element: Host, isSelecting = true) =>
    setSelectedElementNames((prevSelected) => {
      const otherSelectedElementNames = prevSelected.filter(
        (r) => r !== element.fqdn
      );
      return isSelecting && isElementSelectable(element)
        ? [...otherSelectedElementNames, element.fqdn]
        : otherSelectedElementNames;
    });

  const areAllElementsSelected =
    selectedElementNames.length === selectableElements.length;

  const isElementSelected = (element: Host) =>
    selectedElementNames.includes(element.fqdn);

  // Multiple selection
  const selectAllElements = (isSelecting = true) => {
    setSelectedElementNames(
      isSelecting ? selectableElements.map((g) => g.fqdn) : []
    );

    // Enable/disable 'Delete' button
    if (isSelecting) {
      const groupsNameArray: string[] = [];
      selectableElements.map((element) => groupsNameArray.push(element.fqdn));
      setSelectedElementIds(groupsNameArray);
      props.updateElementsSelected(groupsNameArray);
      props.buttonData.changeIsDeleteButtonDisabled(false);
    } else {
      props.updateElementsSelected([]);
      props.buttonData.changeIsDeleteButtonDisabled(true);
    }
  };

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // On selecting one single row
  const onSelectElement = (
    element: Host,
    rowIndex: number,
    isSelecting: boolean
  ) => {
    // If the group is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(
              new Array(numberSelected + 1),
              (_x, i) => i + recentSelectedRowIndex
            )
          : Array.from(
              new Array(Math.abs(numberSelected) + 1),
              (_x, i) => i + rowIndex
            );
      intermediateIndexes.forEach((index) =>
        setElementSelected(props.list[index], isSelecting)
      );
    } else {
      setElementSelected(element, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Update selectedElements array
    let selectedElementsArray = selectedElementNames;
    if (isSelecting) {
      selectedElementsArray.push(element.fqdn);
      setSelectedElementIds(selectedElementsArray);
      props.updateElementsSelected(selectedElementsArray);
    } else {
      selectedElementsArray = selectedElementsArray.filter(
        (elementName) => elementName !== element.fqdn
      );
      setSelectedElementIds(selectedElementsArray);
      props.updateElementsSelected(selectedElementsArray);
    }
  };

  // Reset 'updateIsDeletion' when a delete operation has been done
  useEffect(() => {
    if (props.buttonData.isDeletion) {
      setSelectedElementNames([]);
      setSelectedElementIds([]);
      props.buttonData.updateIsDeletion(false);
    }
  }, [props.buttonData.isDeletion]);

  // Enable 'Delete' button if any group on the table is selected
  useEffect(() => {
    if (selectedElementIds.length > 0) {
      props.buttonData.changeIsDeleteButtonDisabled(false);
    }
    if (selectedElementIds.length === 0) {
      props.buttonData.changeIsDeleteButtonDisabled(true);
    }
  }, [selectedElementIds]);

  // Keyboard event
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Define body for empty tables
  const emptyBody = (
    <Tr>
      <Td colSpan={8}>
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.sm}>
            <EmptyStateHeader titleText="No results found" icon={<EmptyStateIcon icon={SearchIcon} />} headingLevel="h2" />
            <EmptyStateBody>Clear all filters and try again.</EmptyStateBody><EmptyStateFooter>
            <Button variant="link">Clear all filters</Button>
          </EmptyStateFooter></EmptyState>
        </Bullseye>
      </Td>
    </Tr>
  );

  // Define table header
  const header = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllElements(isSelecting),
          isSelected: areAllElementsSelected,
        }}
      />
      <Th key={columnNames.name} modifier="wrap">
        {columnNames.name}
      </Th>
    </Tr>
  );

  // Define table body
  const body = props.list.map((element, rowIndex) => (
    <Tr key={element.fqdn} id={element.fqdn}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectElement(element, rowIndex, isSelecting),
          isSelected: isElementSelected(element),
          isDisabled: !isElementSelectable(element),
        }}
      />
      <Td dataLabel={element.fqdn}>{element.fqdn}</Td>
    </Tr>
  ));

  // Define skeleton
  const skeleton = (
    <SkeletonOnTableLayout
      rows={4}
      colSpan={9}
      screenreaderText={"Loading table rows"}
    />
  );

  // Render component
  return (
    <TableLayout
      ariaLabel={props.tableName + " table"}
      name="fqdn"
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v5-u-mt-md"}
      tableId={props.tableName.replace(" ", "-").toLowerCase() + "-table"}
      isStickyHeader={true}
      tableHeader={props.list.length === 0 ? undefined : header}
      tableBody={
        !props.showTableRows
          ? skeleton
          : props.list.length === 0
          ? emptyBody
          : body
      }
    />
  );
};

export default ManagedByTable;
