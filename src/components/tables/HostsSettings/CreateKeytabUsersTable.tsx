import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableWithButtonsLayout from "src/components/layouts/TableWithButtonsLayout";
// Modals
import CreateKeytabElementsAddModal from "src/components/modals/HostsSettings/CreateKeytabElementsAddModal";
import CreateKeytabElementsDeleteModal from "src/components/modals/HostsSettings/CreateKeytabElementsDeleteModal";
// Redux
import { useAppSelector } from "src/store/hooks";

interface PropsToTable {
  host: string;
}

const CreateKeytabUsersTable = (props: PropsToTable) => {
  // Full users list -> Initial data
  const fullUsersList = useAppSelector((state) => state.activeUsers.usersList);
  const fullUserIdsList = fullUsersList.map((user) => user.uid);

  // Users list on the table
  const [tableUsersList, setTableUsersList] = useState<string[]>([]);

  const updateTableUsersList = (newTableUsersList: string[]) => {
    setTableUsersList(newTableUsersList);
  };

  // Filter function to compare the available data with the data that
  //  is in the table already. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterUsersData = () => {
    return fullUserIdsList.filter((item) => {
      return !tableUsersList.some((itm) => {
        return item === itm;
      });
    });
  };

  // const usersFilteredData = filterUsersData();
  const [usersFilteredData, setUsersFilteredData] = useState(filterUsersData());

  const updateUsersFilteredData = (newFilteredUsers: unknown[]) => {
    setUsersFilteredData(newFilteredUsers as string[]);
  };

  // 'Delete' button is disabled if no row is selected
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  // Column names (String)
  const usersColumnNamesArray = ["User"];

  // Selected rows are tracked
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const updateSelectedUsers = (newSelectedUsers: string[]) => {
    setSelectedUsers(newSelectedUsers);
  };

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // Keyboard event to select rows
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

  // - Returns 'True' if a specific table user has been selected
  const isUserSelected = (user: string) => selectedUsers.includes(user);

  const areAllUsersSelected =
    selectedUsers.length === tableUsersList.length &&
    tableUsersList.length !== 0;

  // - Select all users
  const selectAllUsers = (isSelecting = true) => {
    setSelectedUsers(isSelecting ? tableUsersList.map((elem) => elem) : []);
    setIsDeleteDisabled(false);
  };

  // - Helper method to set the selected users from the table
  const setUserSelected = (user: string, isSelecting = true) =>
    setSelectedUsers((prevSelected) => {
      const otherSelectedUsers = prevSelected.filter((r) => r !== user);
      return isSelecting ? [...otherSelectedUsers, user] : otherSelectedUsers;
    });

  // - On selecting one single row
  const onSelectUser = (
    user: string,
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
        setUserSelected(tableUsersList[index], isSelecting)
      );
    } else {
      setUserSelected(user, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
    // Enable 'Delete' button
    setIsDeleteDisabled(false);
  };

  // Disable 'Delete' button when no elements selected
  useEffect(() => {
    if (selectedUsers.length === 0) {
      setIsDeleteDisabled(true);
    }
  }, [selectedUsers]);

  // Header
  const usersHeader = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllUsers(isSelecting),
          isSelected: areAllUsersSelected,
          isDisabled: tableUsersList.length === 0 ? true : false,
        }}
      />
      <Th width={10}>{usersColumnNamesArray[0]}</Th>
    </Tr>
  );

  // Body
  const usersBody = tableUsersList.map((user, rowIndex) => (
    <Tr key={user} id={user}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectUser(user, rowIndex, isSelecting),
          isSelected: isUserSelected(user),
          isDisabled: false,
        }}
      />
      <Td dataLabel={usersColumnNamesArray[0]}>{user}</Td>
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
        ariaLabel="user table in host settings"
        variant="compact"
        hasBorders={true}
        name="ipaallowedtoperform_write_keys_user"
        tableId="host-settings-user-table"
        isStickyHeader={false}
        tableHeader={usersHeader}
        tableBody={usersBody}
        tableClasses="pf-v5-u-mb-3xl"
        deleteButtonClasses="pf-v5-u-mr-sm"
        onDeleteModal={onClickDeleteHandler}
        isDeleteDisabled={isDeleteDisabled}
        addButtonClasses="pf-v5-u-mr-sm"
        onAddModal={onClickAddHandler}
      />
      {showAddModal && (
        <CreateKeytabElementsAddModal
          host={props.host}
          elementType="user"
          operationType="create"
          showModal={showAddModal}
          onCloseModal={onCloseAddHandler}
          onOpenModal={onClickAddHandler}
          availableData={usersFilteredData}
          updateAvailableData={updateUsersFilteredData}
          updateSelectedElements={updateSelectedUsers}
          tableElementsList={tableUsersList}
          updateTableElementsList={updateTableUsersList}
        />
      )}
      {showDeleteModal && (
        <CreateKeytabElementsDeleteModal
          host={props.host}
          elementType="user"
          operationType="create"
          columnNames={usersColumnNamesArray}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedUsers}
          updateIsDeleteButtonDisabled={updateIsDeleteButtonDisabled}
          updateSelectedElements={updateSelectedUsers}
          tableElementsList={tableUsersList}
          updateTableElementsList={updateTableUsersList}
          availableData={usersFilteredData}
          updateAvailableData={updateUsersFilteredData}
        />
      )}
    </>
  );
};

export default CreateKeytabUsersTable;
