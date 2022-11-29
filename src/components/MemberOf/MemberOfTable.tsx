import React, { useEffect, useState } from "react";
import {
  Title,
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
  Button,
} from "@patternfly/react-core";
import { Td, Th, Tr } from "@patternfly/react-table";
// Icons
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";
// Layouts
import TableLayout from "../layouts/TableLayout";
import SkeletonOnTableLayout from "../layouts/Skeleton/SkeletonOnTableLayout";

interface ColumnNames {
  name: string;
  gid?: string;
  status?: string;
  description: string;
}

// Although tabs data types habe been already defined, it is not possible to access to all
//  its variables. Just the mandatory ones ('name' and 'description') are accessible at this point.
// To display all the possible data types for all the tabs (and not only the mandatory ones)
//   an extra interface 'MemberOfElement' will be defined. This will be called in the 'PropsToTable'
//   interface instead of each type (UserGroup | Netgroup | Roles | HBACRules | SudoRules).
interface MemberOfElement {
  name: string;
  gid?: string;
  status?: string;
  description: string;
}

interface ButtonData {
  isDeletion: boolean;
  updateIsDeletion: (option: boolean) => void;
  changeIsDeleteButtonDisabled: (updatedDeleteButton: boolean) => void;
}

export interface PropsToTable {
  group: MemberOfElement[];
  // columnNames: ColumnNames;
  tableName: string;
  activeTabKey: number;
  changeSelectedGroups: (groups: string[]) => void;
  buttonData: ButtonData;
  showTableRows: boolean;
}

const MemberOfTable = (props: PropsToTable) => {
  // Define column names
  const userGroupsColumnNames: ColumnNames = {
    name: "Group name",
    gid: "GID",
    description: "Description",
  };
  const netgroupsColumnNames: ColumnNames = {
    name: "Netgroup name",
    description: "Description",
  };
  const rolesColumnNames: ColumnNames = {
    name: "Role name",
    description: "Description",
  };
  const hbacRulesColumnNames: ColumnNames = {
    name: "Rule name",
    status: "Status",
    description: "Description",
  };
  const sudoRulesColumnNames: ColumnNames = {
    name: "Rule name",
    status: "Status",
    description: "Description",
  };

  // State for column names
  const [columnNames, setColumnNames] = useState<ColumnNames>(
    userGroupsColumnNames
  );

  // When moving to another tab, the column names must change
  useEffect(() => {
    switch (props.activeTabKey) {
      case 0:
        setColumnNames(userGroupsColumnNames);
        break;
      case 1:
        setColumnNames(netgroupsColumnNames);
        break;
      case 2:
        setColumnNames(rolesColumnNames);
        break;
      case 3:
        setColumnNames(hbacRulesColumnNames);
        break;
      case 4:
        setColumnNames(sudoRulesColumnNames);
        break;
    }
  }, [props.activeTabKey]);

  // selected user ids state
  const [selectedGroupNameIds, setSelectedGroupNameIds] = useState<string[]>(
    []
  );

  // Selectable checkboxes on table
  const isGroupSelectable = (group: MemberOfElement) => group.name !== "";
  const selectableGroups = props.group.filter(isGroupSelectable);

  // Selected rows are tracked. Primary key: userLogin
  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>([]);

  const setGroupSelected = (group: MemberOfElement, isSelecting = true) =>
    setSelectedGroupNames((prevSelected) => {
      const otherSelectedGroupNames = prevSelected.filter(
        (r) => r !== group.name
      );
      return isSelecting && isGroupSelectable(group)
        ? [...otherSelectedGroupNames, group.name]
        : otherSelectedGroupNames;
    });

  const areAllGroupsSelected =
    selectedGroupNames.length === selectableGroups.length;

  const isGroupSelected = (group: MemberOfElement) =>
    selectedGroupNames.includes(group.name);

  // Multiple selection
  const selectAllGroups = (isSelecting = true) => {
    setSelectedGroupNames(
      isSelecting ? selectableGroups.map((g) => g.name) : []
    );

    // Enable/disable 'Delete' button
    if (isSelecting) {
      const groupsNameArray: string[] = [];
      selectableGroups.map((group) => groupsNameArray.push(group.name));
      setSelectedGroupNameIds(groupsNameArray);
      props.changeSelectedGroups(groupsNameArray);
      props.buttonData.changeIsDeleteButtonDisabled(false);
    } else {
      props.changeSelectedGroups([]);
      props.buttonData.changeIsDeleteButtonDisabled(true);
    }
  };

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // On selecting one single row
  const onSelectGroup = (
    group: MemberOfElement,
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
        setGroupSelected(props.group[index], isSelecting)
      );
    } else {
      setGroupSelected(group, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Update selectedGroups array
    let selectedGroupsArray = selectedGroupNames;
    if (isSelecting) {
      selectedGroupsArray.push(group.name);
      setSelectedGroupNameIds(selectedGroupsArray);
      props.changeSelectedGroups(selectedGroupsArray);
    } else {
      selectedGroupsArray = selectedGroupsArray.filter(
        (groupName) => groupName !== group.name
      );
      setSelectedGroupNameIds(selectedGroupsArray);
      props.changeSelectedGroups(selectedGroupsArray);
    }
  };

  // Reset 'updateIsDeletion' when a delete operation has been done
  useEffect(() => {
    if (props.buttonData.isDeletion) {
      setSelectedGroupNameIds([]);
      setSelectedGroupNames([]);
      props.buttonData.updateIsDeletion(false);
    }
  }, [props.buttonData.isDeletion]);

  // Enable 'Delete' button if any group on the table is selected
  useEffect(() => {
    if (selectedGroupNameIds.length > 0) {
      props.buttonData.changeIsDeleteButtonDisabled(false);
    }
    if (selectedGroupNameIds.length === 0) {
      props.buttonData.changeIsDeleteButtonDisabled(true);
    }
  }, [selectedGroupNameIds]);

  // When the tableName changes, the selected checkboxes are reset
  useEffect(() => {
    setSelectedGroupNameIds([]);
    setSelectedGroupNames([]);
  }, [props.activeTabKey]);

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
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={SearchIcon} />
            <Title headingLevel="h2" size="lg">
              No results found
            </Title>
            <EmptyStateBody>Clear all filters and try again.</EmptyStateBody>
            <Button variant="link">Clear all filters</Button>
          </EmptyState>
        </Bullseye>
      </Td>
    </Tr>
  );

  // Define table header
  const header = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllGroups(isSelecting),
          isSelected: areAllGroupsSelected,
        }}
      />
      <Th key={columnNames.name} modifier="wrap">
        {columnNames.name}
      </Th>
      {columnNames.gid && (
        <Th key={columnNames.gid} modifier="wrap">
          {columnNames.gid}
        </Th>
      )}
      {columnNames.status && (
        <Th key={columnNames.status} modifier="wrap">
          {columnNames.status}
        </Th>
      )}
      {columnNames.description && (
        <Th key={columnNames.description} modifier="wrap">
          {columnNames.description}
        </Th>
      )}
    </Tr>
  );

  // Define table body
  const body = props.group.map((group, rowIndex) => (
    <Tr key={group.name} id={group.name}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectGroup(group, rowIndex, isSelecting),
          isSelected: isGroupSelected(group),
          disable: !isGroupSelectable(group),
        }}
      />
      <Td dataLabel={group.name}>{group.name}</Td>
      {group.gid && <Td dataLabel={group.gid}>{group.gid}</Td>}
      {group.status && <Td dataLabel={group.status}>{group.status}</Td>}
      {group.description && (
        <Td dataLabel={group.description}>{group.description}</Td>
      )}
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

  // Render 'MemberOfTable'
  return (
    <TableLayout
      ariaLabel={props.tableName + " table"}
      name="cn"
      variant={"compact"}
      hasBorders={true}
      classes={"pf-u-mt-md"}
      tableId={props.tableName.replace(" ", "-").toLowerCase() + "-table"}
      isStickyHeader={true}
      tableHeader={props.group.length === 0 ? undefined : header}
      tableBody={
        !props.showTableRows
          ? skeleton
          : props.group.length === 0
          ? emptyBody
          : body
      }
    />
  );
};

export default MemberOfTable;
