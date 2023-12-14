import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableWithButtonsLayout from "src/components/layouts/TableWithButtonsLayout";
// Modals
import RetrieveKeytabElementsAddModal from "src/components/modals/HostsSettings/RetrieveKeytabElementsAddModal";
import RetrieveKeytabElementsDeleteModal from "src/components/modals/HostsSettings/RetrieveKeytabElementsDeleteModal";

interface PropsToTable {
  host: string;
}

const RetrieveKeytabUserGroupsTable = (props: PropsToTable) => {
  // TODO: Retrieve data from Redux when available
  // Full user groups list -> Initial data
  const fullUserGroupsIdsList = [
    "userGroup1",
    "userGroup2",
    "userGroup3",
    "userGroup4",
    "userGroup5",
    "userGroup6",
    "userGroup7",
    "userGroup8",
  ];

  // User groups on the table
  const [tableUserGroupsList, setTableUserGroupsList] = useState<string[]>([]);

  const updateTableUserGroupsList = (newTableUserGroupsList: string[]) => {
    setTableUserGroupsList(newTableUserGroupsList);
  };

  // Filter function to compare the available data with the data that
  //  is in the table already. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterUserGroupsData = () => {
    return fullUserGroupsIdsList.filter((item) => {
      return !tableUserGroupsList.some((itm) => {
        return item === itm;
      });
    });
  };

  // const usersFilteredData = filterUsersData();
  const [userGroupsFilteredData, setUserGroupsFilteredData] = useState(
    filterUserGroupsData()
  );

  const updateUserGroupsFilteredData = (newFilteredUsers: unknown[]) => {
    setUserGroupsFilteredData(newFilteredUsers as string[]);
  };

  // 'Delete' button is disabled if no row is selected
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  // Column names (Array)
  const userGroupsColumnNamesArray = ["User groups"];

  // - Selected rows are tracked
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);

  const updateSelectedUserGroups = (newSelectedUserGroups: string[]) => {
    setSelectedUserGroups(newSelectedUserGroups);
  };

  // - To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

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

  // - Returns 'True' if a specific table user group has been selected
  const isUserGroupSelected = (userGroup: string) =>
    selectedUserGroups.includes(userGroup);

  const areAllUserGroupsSelected =
    selectedUserGroups.length === tableUserGroupsList.length &&
    tableUserGroupsList.length !== 0;

  // - Select all user groups
  const selectAllUserGroups = (isSelecting = true) => {
    setSelectedUserGroups(
      isSelecting ? tableUserGroupsList.map((elem) => elem) : []
    );
    setIsDeleteDisabled(false);
  };

  // - Helper method to set the selected users from the table
  const setUserGroupSelected = (userGroup: string, isSelecting = true) =>
    setSelectedUserGroups((prevSelected) => {
      const otherSelectedUserGroups = prevSelected.filter(
        (r) => r !== userGroup
      );
      return isSelecting
        ? [...otherSelectedUserGroups, userGroup]
        : otherSelectedUserGroups;
    });

  // - On selecting one single row
  const onSelectUserGroup = (
    userGroup: string,
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
        setUserGroupSelected(selectedUserGroups[index], isSelecting)
      );
    } else {
      setUserGroupSelected(userGroup, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
    // Enable 'Delete' button
    setIsDeleteDisabled(false);
  };

  // Disable 'Delete' button when no elements selected
  useEffect(() => {
    if (selectedUserGroups.length === 0) {
      setIsDeleteDisabled(true);
    }
  }, [selectedUserGroups]);

  // Header
  const userGroupsHeader = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllUserGroups(isSelecting),
          isSelected: areAllUserGroupsSelected,
          isDisabled: tableUserGroupsList.length === 0 ? true : false,
        }}
      />
      <Th width={10}>{userGroupsColumnNamesArray[0]}</Th>
    </Tr>
  );

  const userGroupsBody = tableUserGroupsList.map((userGroup, rowIndex) => (
    <Tr key={userGroup} id={userGroup}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectUserGroup(userGroup, rowIndex, isSelecting),
          isSelected: isUserGroupSelected(userGroup),
          isDisabled: false,
        }}
      />
      <Td dataLabel={userGroupsColumnNamesArray[0]}>{userGroup}</Td>
    </Tr>
  ));

  // Modal functionality
  // - Show modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // - Close 'Add' modal
  const onCloseAddHandler = () => {
    setShowAddModal(false);
  };

  // - close 'Delete' button
  const onCloseDeleteHandler = () => {
    setShowDeleteModal(false);
  };

  // - 'Add' button -> Open modal
  const onClickAddHandler = () => {
    setShowAddModal(true);
  };

  // - 'Delete' button -> Remove table entry
  const onClickDeleteHandler = () => {
    setShowDeleteModal(true);
  };

  // - Update 'Delete' button
  const updateIsDeleteButtonDisabled = (newValue: boolean) => {
    setIsDeleteDisabled(newValue);
  };

  return (
    <>
      <TableWithButtonsLayout
        ariaLabel="user group table in host settings"
        variant="compact"
        hasBorders={true}
        name="ipaallowedtoperform_read_keys_group"
        tableId="host-settings-user-group-table"
        isStickyHeader={false}
        tableHeader={userGroupsHeader}
        tableBody={userGroupsBody}
        tableClasses="pf-v5-u-mb-3xl"
        deleteButtonClasses="pf-v5-u-mr-sm"
        onDeleteModal={onClickDeleteHandler}
        isDeleteDisabled={isDeleteDisabled}
        addButtonClasses="pf-v5-u-mr-sm"
        onAddModal={onClickAddHandler}
      />
      {showAddModal && (
        <RetrieveKeytabElementsAddModal
          host={props.host}
          elementType="user group"
          operationType="retrieve"
          showModal={showAddModal}
          onCloseModal={onCloseAddHandler}
          onOpenModal={onClickAddHandler}
          availableData={userGroupsFilteredData}
          updateAvailableData={updateUserGroupsFilteredData}
          updateSelectedElements={updateSelectedUserGroups}
          tableElementsList={tableUserGroupsList}
          updateTableElementsList={updateTableUserGroupsList}
        />
      )}
      {showDeleteModal && (
        <RetrieveKeytabElementsDeleteModal
          host={props.host}
          elementType="user group"
          operationType="retrieve"
          columnNames={userGroupsColumnNamesArray}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedUserGroups}
          updateIsDeleteButtonDisabled={updateIsDeleteButtonDisabled}
          updateSelectedElements={updateSelectedUserGroups}
          tableElementsList={tableUserGroupsList}
          updateTableElementsList={updateTableUserGroupsList}
          availableData={userGroupsFilteredData}
          updateAvailableData={updateUserGroupsFilteredData}
        />
      )}
    </>
  );
};

export default RetrieveKeytabUserGroupsTable;
