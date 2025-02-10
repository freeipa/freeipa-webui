import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";
// Data types
import { AutomemberEntry } from "src/utils/datatypes/globalDataTypes";
import { Link } from "react-router-dom";

interface ElementData {
  isElementSelectable: (element: AutomemberEntry) => boolean;
  selectedElements: AutomemberEntry[];
  selectableElementsTable: AutomemberEntry[];
  setElementsSelected: (rule: AutomemberEntry, isSelecting?: boolean) => void;
  clearSelectedElements: () => void;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  isDeletion: boolean;
  updateIsDeletion: (value: boolean) => void;
  updateIsEnableButtonDisabled?: (value: boolean) => void;
  updateIsDisableButtonDisabled?: (value: boolean) => void;
  isDisableEnableOp?: boolean;
  updateIsDisableEnableOp?: (value: boolean) => void;
}

interface PaginationData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

export interface PropsToTable {
  shownElementsList: AutomemberEntry[];
  showTableRows: boolean;
  elementsData: ElementData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const MainTable = (props: PropsToTable) => {
  // Retrieve elements data from props
  const shownElementsList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    automemberRule: "Automember rule",
    description: "Description",
  };

  // When user status is updated, unselect selected rows
  useEffect(() => {
    if (props.buttonsData.isDisableEnableOp) {
      props.elementsData.clearSelectedElements();
    }
  }, [props.buttonsData.isDisableEnableOp]);

  const isElementSelected = (element: AutomemberEntry) => {
    if (
      props.elementsData.selectedElements.find(
        (selectedElement) =>
          selectedElement.automemberRule === element.automemberRule
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // On selecting one single row
  const onSelectElement = (
    element: AutomemberEntry,
    rowIndex: number,
    isSelecting: boolean
  ) => {
    // If the element is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
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
        props.elementsData.setElementsSelected(
          shownElementsList[index],
          isSelecting
        )
      );
    } else {
      props.elementsData.setElementsSelected(element, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Resetting 'isDisableEnableOp'
    props.buttonsData.updateIsDeleteButtonDisabled(false);

    // Update elementSelected array
    if (isSelecting) {
      // Increment the elements selected per page (++)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage + 1
      );
    } else {
      // Decrement the elements selected per page (--)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage - 1
      );
    }
  };

  // Reset 'selectedElements array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.elementsData.clearSelectedElements();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any element selected)
  useEffect(() => {
    if (props.elementsData.selectedElements.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.elementsData.selectedElements.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.elementsData.selectedElements]);

  // Enable 'Delete' and 'Enable|Disable' option buttons (if any element selected)
  useEffect(() => {
    if (props.elementsData.selectedElements.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.elementsData.selectedElements.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
      if (
        props.buttonsData.updateIsEnableButtonDisabled !== undefined &&
        props.buttonsData.updateIsDisableButtonDisabled !== undefined
      ) {
        props.buttonsData.updateIsDisableButtonDisabled(true);
        props.buttonsData.updateIsEnableButtonDisabled(true);
      }
    }
  }, [props.elementsData.selectedElements]);

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

  // Defining table header and body from here to avoid passing specific names to the Table Layout
  const header = (
    <Tr>
      <Th modifier="wrap"></Th>
      <Th modifier="wrap">{columnNames.automemberRule}</Th>
      <Th modifier="wrap">{columnNames.description}</Th>
    </Tr>
  );

  const body = shownElementsList.map((element, rowIndex) => (
    <Tr key={element.automemberRule} id={element.automemberRule}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectElement(element, rowIndex, isSelecting),
          isSelected: isElementSelected(element),
          isDisabled: !props.elementsData.isElementSelectable(element),
        }}
      />

      <Td dataLabel={columnNames.automemberRule}>
        <Link
          to={"/user-group-rules/" + element.automemberRule}
          state={element}
        >
          {element.automemberRule}
        </Link>
      </Td>
      <Td dataLabel={columnNames.description}>{element.description}</Td>
    </Tr>
  ));

  const skeleton = (
    <SkeletonOnTableLayout
      rows={4}
      colSpan={9}
      screenreaderText={"Loading table rows"}
    />
  );

  return (
    <TableLayout
      ariaLabel={"Automember user groups table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v5-u-mt-md"}
      tableId={"automember-user-groups-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default MainTable;
