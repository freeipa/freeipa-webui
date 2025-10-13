import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { UserGroup } from "../../utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";
// React Router DOM
import { Link } from "react-router";

interface GroupsData {
  isUserGroupSelectable: (group: UserGroup) => boolean;
  selectedGroups: UserGroup[];
  selectableGroupsTable: UserGroup[];
  setGroupSelected: (group: UserGroup, isSelecting?: boolean) => void;
  clearSelectedGroups: () => void;
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

interface PropsToTable {
  elementsList: UserGroup[];
  shownElementsList: UserGroup[];
  showTableRows: boolean;
  groupsData: GroupsData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const UserGroupsTable = (props: PropsToTable) => {
  // Retrieve groups data from props
  const shownGroupsList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    cn: "Group Name",
    gidnumber: "GID",
    description: "Description",
  };

  const isGroupSelected = (group: UserGroup) => {
    if (
      props.groupsData.selectedGroups.find(
        (selectedGroup) => selectedGroup.cn[0] === group.cn[0]
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
  const onSelectGroup = (
    group: UserGroup,
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
        props.groupsData.setGroupSelected(shownGroupsList[index], isSelecting)
      );
    } else {
      props.groupsData.setGroupSelected(group, isSelecting);
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

  // Reset 'selectedGroupIds' array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.groupsData.clearSelectedGroups();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any host selected)
  useEffect(() => {
    if (props.groupsData.selectedGroups.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.groupsData.selectedGroups.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.groupsData.selectedGroups]);

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
      <Th modifier="wrap" aria-label="Select rows"></Th>
      <Th modifier="wrap">{columnNames.cn}</Th>
      <Th modifier="wrap">{columnNames.gidnumber}</Th>
      <Th modifier="wrap">{columnNames.description}</Th>
    </Tr>
  );

  const body = shownGroupsList.map((group, rowIndex) => (
    <Tr key={group.cn} id={group.cn}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectGroup(group, rowIndex, isSelecting),
          isSelected: isGroupSelected(group),
          isDisabled: !props.groupsData.isUserGroupSelectable(group),
        }}
      />
      <Td dataLabel={columnNames.cn}>
        <Link to={"/user-groups/" + group.cn} state={group}>
          {group.cn}
        </Link>
      </Td>
      <Td dataLabel={columnNames.gidnumber}>{group.gidnumber}</Td>
      <Td dataLabel={columnNames.description}>{group.description}</Td>
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
      ariaLabel={"User groups table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v6-u-mt-md"}
      tableId={"hosts-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default UserGroupsTable;
