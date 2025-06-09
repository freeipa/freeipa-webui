import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { SudoCmd } from "../../utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";
// React Router DOM
import { Link } from "react-router-dom";

interface CmdsData {
  isSudoCmdSelectable: (cmd: SudoCmd) => boolean;
  selectedCmds: SudoCmd[];
  selectableCmdsTable: SudoCmd[];
  setCmdsSelected: (cmd: SudoCmd, isSelecting?: boolean) => void;
  clearSelectedCmds: () => void;
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
  shownElementsList: SudoCmd[];
  showTableRows: boolean;
  cmdsData: CmdsData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const SudoCmdsTable = (props: PropsToTable) => {
  // Retrieve data from props
  const shownCmdsList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    sudocmd: "Sudo command",
    description: "Description",
  };

  const isSudoCmdSelected = (cmd: SudoCmd) => {
    if (
      props.cmdsData.selectedCmds.find(
        (selectedCmd) => selectedCmd.sudocmd[0] === cmd.sudocmd[0]
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
  const onSelectCmd = (
    sudocmd: SudoCmd,
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
        props.cmdsData.setCmdsSelected(shownCmdsList[index], isSelecting)
      );
    } else {
      props.cmdsData.setCmdsSelected(sudocmd, isSelecting);
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
      props.cmdsData.clearSelectedCmds();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any entry is selected)
  useEffect(() => {
    if (props.cmdsData.selectedCmds.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.cmdsData.selectedCmds.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.cmdsData.selectedCmds]);

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
      <Th modifier="wrap">{columnNames.sudocmd}</Th>
      <Th modifier="wrap">{columnNames.description}</Th>
    </Tr>
  );

  const body = shownCmdsList.map((cmd, rowIndex) => (
    <Tr key={cmd.sudocmd} id={cmd.sudocmd}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectCmd(cmd, rowIndex, isSelecting),
          isSelected: isSudoCmdSelected(cmd),
          isDisabled: !props.cmdsData.isSudoCmdSelectable(cmd),
        }}
      />
      <Td dataLabel={columnNames.sudocmd}>
        <Link to={"/sudo-commands/" + cmd.sudocmd} state={cmd}>
          {cmd.sudocmd}
        </Link>
      </Td>
      <Td dataLabel={columnNames.description}>{cmd.description}</Td>
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
      ariaLabel={"Sudo commands table"}
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

export default SudoCmdsTable;
