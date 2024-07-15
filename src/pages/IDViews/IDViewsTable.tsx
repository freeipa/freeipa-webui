import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { IDView } from "../../utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";

interface IDViewsData {
  isViewSelectable: (view: IDView) => boolean;
  selectedViews: IDView[];
  selectableViewsTable: IDView[];
  setViewSelected: (view: IDView, isSelecting?: boolean) => void;
  clearSelectedViews: () => void;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  isDeletion: boolean;
  updateIsDeletion: (value: boolean) => void;
}

interface PaginationData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

export interface PropsToTable {
  elementsList: IDView[];
  shownElementsList: IDView[];
  showTableRows: boolean;
  idViewsData: IDViewsData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const IDViewsTable = (props: PropsToTable) => {
  // Retrieve views data from props
  const shownViewsList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    cn: "ID view name",
    description: "Description",
  };

  const isViewSelected = (view: IDView) => {
    if (
      props.idViewsData.selectedViews.find(
        (selectedView) => selectedView.cn[0] === view.cn[0]
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
  const onSelectView = (
    view: IDView,
    rowIndex: number,
    isSelecting: boolean
  ) => {
    // If the host is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
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
        props.idViewsData.setViewSelected(shownViewsList[index], isSelecting)
      );
    } else {
      props.idViewsData.setViewSelected(view, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Resetting 'isDisableEnableOp'
    props.buttonsData.updateIsDeleteButtonDisabled(false);

    // Update hostIdsSelected array
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

  // Reset 'selectedViewIds' array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.idViewsData.clearSelectedViews();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any host selected)
  useEffect(() => {
    if (props.idViewsData.selectedViews.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.idViewsData.selectedViews.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.idViewsData.selectedViews]);

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
      <Th modifier="wrap">{columnNames.cn}</Th>
      <Th modifier="wrap">{columnNames.description}</Th>
    </Tr>
  );

  const body = shownViewsList.map((view, rowIndex) => (
    <Tr key={view.cn} id={view.cn}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectView(view, rowIndex, isSelecting),
          isSelected: isViewSelected(view),
          isDisabled: !props.idViewsData.isViewSelectable(view),
        }}
      />
      <Td dataLabel={columnNames.cn}>{view.cn}</Td>
      <Td dataLabel={columnNames.description}>{view.description}</Td>
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
      ariaLabel={"ID views table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v5-u-mt-md"}
      tableId={"id-views-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default IDViewsTable;
