import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { SudoCmdGroup } from "../../utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout/SkeletonOnTableLayout";
// React Router DOM
import { Link } from "react-router-dom";

interface CmdGroupsData {
  isSudoCmdGroupSelectable: (group: SudoCmdGroup) => boolean;
  selectedCmdGroups: SudoCmdGroup[];
  selectableCmdGroupsTable: SudoCmdGroup[];
  setCmdGroupsSelected: (group: SudoCmdGroup, isSelecting?: boolean) => void;
  clearSelectedCmdGroups: () => void;
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
  shownElementsList: SudoCmdGroup[];
  showTableRows: boolean;
  cmdGroupsData: CmdGroupsData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const SudoCmdGroupsTable = (props: PropsToTable) => {
  // Retrieve data from props
  const shownCmdsList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    cn: "Sudo command group",
    description: "Description",
  };

  const isSudoCmdSelected = (cmd: SudoCmdGroup) => {
    if (
      props.cmdGroupsData.selectedCmdGroups.find(
        (selectedCmdGroup) => selectedCmdGroup.cn[0] === cmd.cn[0]
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
  const onSelectCmdGroup = (
    sudocmdgroup: SudoCmdGroup,
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
        props.cmdGroupsData.setCmdGroupsSelected(
          shownCmdsList[index],
          isSelecting
        )
      );
    } else {
      props.cmdGroupsData.setCmdGroupsSelected(sudocmdgroup, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    props.buttonsData.updateIsDeleteButtonDisabled(false);

    // Update selected array
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

  // Reset selected array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.cmdGroupsData.clearSelectedCmdGroups();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any entry is selected)
  useEffect(() => {
    if (props.cmdGroupsData.selectedCmdGroups.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.cmdGroupsData.selectedCmdGroups.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.cmdGroupsData.selectedCmdGroups]);

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

  // Defining table header and body from here to avoid passing specific names
  // to the Table Layout
  const header = (
    <Tr>
      <Th modifier="wrap"></Th>
      <Th modifier="wrap">{columnNames.cn}</Th>
      <Th modifier="wrap">{columnNames.description}</Th>
    </Tr>
  );

  const body = shownCmdsList.map((cmdgroup, rowIndex) => (
    <Tr key={cmdgroup.cn} id={cmdgroup.cn}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectCmdGroup(cmdgroup, rowIndex, isSelecting),
          isSelected: isSudoCmdSelected(cmdgroup),
          isDisabled: !props.cmdGroupsData.isSudoCmdGroupSelectable(cmdgroup),
        }}
      />
      <Td dataLabel={columnNames.cn}>
        <Link to={"/sudo-command-groups/" + cmdgroup.cn} state={cmdgroup}>
          {cmdgroup.cn}
        </Link>
      </Td>
      <Td dataLabel={columnNames.description}>{cmdgroup.description}</Td>
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
      ariaLabel={"Sudo command groups table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v5-u-mt-md"}
      tableId={"sudo-cmd-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default SudoCmdGroupsTable;
