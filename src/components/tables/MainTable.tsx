import React from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../layouts/TableLayout";
// Layouts
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";
// React router DOM
import { Link } from "react-router-dom";
import EmptyBodyTable from "./EmptyBodyTable";

/**
 * This component renders a table with the specified columns and rows.
 * It also allows the user to select rows and perform operations on them.
 *
 */

interface SelectedElementsData<T> {
  isElementSelectable: (element: T) => boolean;
  selectedElements: T[];
  selectableElementsTable: T[];
  setElementsSelected: (rule: T, isSelecting?: boolean) => void;
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

export interface PropsToTable<T> {
  tableTitle: string;
  shownElementsList: T[];
  pk: string; // E.g. Primary key for users --> "uid"
  keyNames: string[]; // E.g. for user.uid, user.description --> ["uid", "description"]
  columnNames: string[]; // E.g. ["User ID", "Description"]
  hasCheckboxes: boolean;
  pathname: string; // E.g. "active-users" (without the leading '/')
  showTableRows: boolean;
  showLink: boolean;
  elementsData?: SelectedElementsData<T>;
  buttonsData?: ButtonsData;
  paginationData?: PaginationData;
}

const MainTable = <T,>(props: PropsToTable<T>) => {
  // Retrieve elements data from props
  const shownElementsList = [...props.shownElementsList];
  const columnNames = [...props.columnNames];

  // When user status is updated, unselect selected rows
  React.useEffect(() => {
    if (props.buttonsData && props.buttonsData.isDisableEnableOp) {
      props.elementsData?.clearSelectedElements();
    }
  }, [props.buttonsData?.isDisableEnableOp]);

  const isElementSelected = (element: T) => {
    if (
      props.elementsData?.selectedElements.find(
        (selectedElement) =>
          selectedElement[props.pk].toString() === element[props.pk].toString()
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = React.useState<
    number | null
  >(null);
  const [shifting, setShifting] = React.useState(false);

  // On selecting one single row
  const onSelectElement = (
    element: T,
    rowIndex: number,
    isSelecting: boolean
  ) => {
    // If the element is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes = Array.from(
        new Array(Math.abs(numberSelected) + 1),
        (_, i) => i + Math.min(recentSelectedRowIndex, rowIndex)
      );
      intermediateIndexes.forEach((index) =>
        props.elementsData?.setElementsSelected(
          shownElementsList[index],
          isSelecting
        )
      );
    } else {
      props.elementsData?.setElementsSelected(element, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Resetting 'isDisableEnableOp'
    props.buttonsData?.updateIsDeleteButtonDisabled(false);

    // Update elementSelected array
    if (isSelecting) {
      // Increment the elements selected per page (++)
      props.paginationData?.updateSelectedPerPage(
        props.paginationData?.selectedPerPage + 1
      );
    } else {
      // Decrement the elements selected per page (--)
      props.paginationData?.updateSelectedPerPage(
        props.paginationData?.selectedPerPage - 1
      );
    }
  };

  // Reset 'selectedElements array if a delete operation has been done
  React.useEffect(() => {
    if (props.buttonsData?.isDeletion) {
      props.elementsData?.clearSelectedElements();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData?.isDeletion]);

  // Enable 'Delete' button (if any element selected)
  React.useEffect(() => {
    if (props.elementsData && props.elementsData.selectedElements.length > 0) {
      props.buttonsData?.updateIsDeleteButtonDisabled(false);
    }

    if (
      props.elementsData &&
      props.elementsData.selectedElements.length === 0
    ) {
      props.buttonsData?.updateIsDeleteButtonDisabled(true);
    }
  }, [props.elementsData?.selectedElements]);

  // Keyboard event
  React.useEffect(() => {
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
    <Tr key="header" id="table-header">
      {props.hasCheckboxes && <Th modifier="wrap"></Th>}
      {props.columnNames.map((columnName, idx) => (
        <Th modifier="wrap" key={idx}>
          {columnName}
        </Th>
      ))}
    </Tr>
  );

  const body = shownElementsList.map((element, rowIndex) => {
    const elementName = element[props.pk].toString();

    if (element !== undefined && element !== null) {
      return (
        <Tr key={"row-" + rowIndex} id={elementName} aria-label={elementName}>
          {/* Checkboxes (if specified) */}
          {props.hasCheckboxes && (
            <Td
              key={rowIndex}
              id={rowIndex.toString()}
              dataLabel="checkbox"
              aria-label="Select row"
              select={{
                rowIndex,
                onSelect: (_event, isSelecting) =>
                  onSelectElement(element, rowIndex, isSelecting),
                isSelected: isElementSelected(element),
                isDisabled: !props.elementsData?.isElementSelectable(element),
              }}
            />
          )}
          {/* Table rows */}
          {props.keyNames.map((keyName, idx) => (
            <Td dataLabel={columnNames[keyName]} key={idx} id={idx.toString()}>
              {idx === 0 && !!props.showLink ? (
                <Link
                  to={"/" + props.pathname + "/" + element[keyName]}
                  state={element}
                >
                  {element[keyName]}
                </Link>
              ) : (
                <>{element[keyName]}</>
              )}
            </Td>
          ))}
        </Tr>
      );
    } else {
      return (
        <EmptyBodyTable
          key={"empty-row-" + rowIndex}
          aria-label="Empty body table"
        />
      );
    }
  });

  const skeleton = (
    <SkeletonOnTableLayout
      rows={4}
      colSpan={9}
      screenreaderText={"Loading table rows"}
    />
  );

  return (
    <TableLayout
      ariaLabel={props.tableTitle}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v5-u-mt-md"}
      tableId={props.pathname + "-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default MainTable;
