import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import SettingsTableLayout from "../../../components/layouts/SettingsTableLayout";
// Modals
import KeytabElementsAddModal from "../../../components/modals/HostsSettings/KeytabElementsAddModal";
import KeytabElementsDeleteModal from "../../../components/modals/HostsSettings/KeytabElementsDeleteModal";
// Hooks
import { useAlerts } from "../../../hooks/useAlerts";
// Data types
import { Host, Service, User } from "../../../utils/datatypes/globalDataTypes";
// React Router DOM
import { Link } from "react-router-dom";
// Utils
import { API_VERSION_BACKUP } from "../../../utils/utils";
// Navigation
import { URL_PREFIX } from "../../../navigation/NavRoutes";

import {
  ErrorResult,
  KeyTabPayload,
  GetEntriesPayload,
  useUpdateKeyTabMutation,
  useGetEntriesMutation,
} from "../../../services/rpc";

interface PropsToTable {
  from: "host" | "service";
  id: string;
  entry: Partial<Service> | Partial<Host>;
  onRefresh: () => void;
  className?: string | "";
  opType: "create" | "retrieve";
  entryAttr: string;
}

const KeytabUsersTable = (props: PropsToTable) => {
  let users: string[] = [];
  if (props.entry[props.entryAttr] !== undefined) {
    users = [...props.entry[props.entryAttr]].sort();
  }

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Users list on the table
  const [tableUsersList, setTableUsersList] = useState<string[]>(users);
  const [fullUser, setFullUsers] = useState<User[]>([]);

  const [tableUsersFilteredList, setTableUsersFilteredList] =
    useState<string[]>(users);
  const [fullUsersFiltered, setFullUsersFiltered] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  // PaginationPrep
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [totalCount, setUsersTotalCount] = useState<number>(0);
  const updateSelectedPerPage = () => {
    // Nothing to do since we are not using bulk selector comp
    return;
  };
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Users displayed on the first page
  const updateShownUsersList = (newShownUsersList: User[]) => {
    setFullUsersFiltered(newShownUsersList);
  };

  const resetUsers = () => {
    const firstUserIdx = (page - 1) * perPage;
    const lastUserIdx = page * perPage;
    const idList: string[] = [];
    const userList: User[] = [];
    for (
      let i = firstUserIdx;
      i < tableUsersList.length && i < lastUserIdx;
      i++
    ) {
      idList.push(tableUsersList[i]);
      userList.push(fullUser[i]);
    }
    setTableUsersFilteredList(idList);
    setFullUsersFiltered(userList);
    setUsersTotalCount(tableUsersList.length);
  };

  // Page indexes
  useEffect(() => {
    resetUsers();
  }, [page, perPage]);

  const onSearchChange = (value: string) => {
    const userList: string[] = [];
    const fullUserList: User[] = [];

    if (value === "") {
      // Reset back to original list
      resetUsers();
      return;
    }

    // Filter our current list
    const firstUserIdx = (page - 1) * perPage;
    const lastUserIdx = page * perPage;
    let count = 0;
    for (
      let i = firstUserIdx;
      i < tableUsersList.length && count < lastUserIdx;
      i++
    ) {
      if (tableUsersList[i].toLowerCase().includes(value.toLowerCase())) {
        userList.push(tableUsersList[i]);
        fullUserList.push(fullUser[i]);
        count += 1;
      }
    }
    setUsersTotalCount(userList.length);
    setTableUsersFilteredList(userList);
    setFullUsersFiltered(fullUserList);
  };

  // Gather User objects
  const [getEntries] = useGetEntriesMutation({});
  useEffect(() => {
    if (tableUsersList.length > 0) {
      getEntries({
        idList: tableUsersList,
        entryType: "user",
        apiVersion: API_VERSION_BACKUP,
      } as GetEntriesPayload).then((result) => {
        if ("data" in result) {
          const usersListResult = result.data.result.results;
          const usersListSize = result.data.result.count;
          const usersList: User[] = [];
          for (let i = 0; i < usersListSize; i++) {
            usersList.push(usersListResult[i].result);
          }
          setUsersTotalCount(usersListSize);

          // Ok apply pagination to the results
          const firstUserIdx = (page - 1) * perPage;
          const lastUserIdx = page * perPage;
          const idList: string[] = [];
          const userList: User[] = [];
          for (
            let i = firstUserIdx;
            i < tableUsersList.length && i < lastUserIdx;
            i++
          ) {
            idList.push(tableUsersList[i]);
            userList.push(usersList[i]);
          }
          setTableUsersFilteredList(idList);
          setFullUsersFiltered(userList);
          setFullUsers(usersList);
        }
      });
    }
  }, [tableUsersList]);

  const [executeUpdate] = useUpdateKeyTabMutation({});
  let add_method = "";
  let remove_method = "";
  if (props.from === "host") {
    if (props.opType === "create") {
      add_method = "host_allow_create_keytab";
      remove_method = "host_disallow_create_keytab";
    } else {
      // retrieve
      add_method = "host_allow_retrieve_keytab";
      remove_method = "host_disallow_retrieve_keytab";
    }
  } else {
    // Service
    if (props.opType === "create") {
      add_method = "service_allow_create_keytab";
      remove_method = "service_disallow_create_keytab";
    } else {
      // retrieve
      add_method = "service_allow_retrieve_keytab";
      remove_method = "service_disallow_retrieve_keytab";
    }
  }

  const addUserList = (newUsers: string[]) => {
    executeUpdate({
      id: props.id,
      entryType: "user",
      entries: newUsers,
      method: add_method,
    } as KeyTabPayload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          alerts.addAlert(
            "add-users-allow-keytab",
            "Successfully added users that are allowed to " +
              props.opType +
              " keytabs",
            "success"
          );
          // Update table
          const users = [...tableUsersList, ...newUsers].sort();
          setTableUsersList(users);
          setTableUsersFilteredList(users);
          setSearchValue("");
          setShowAddModal(false);
          setUsersTotalCount(users.length);
          props.onRefresh();
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "add-users-keytab",
            "Failed to add users that are allowed to " +
              props.opType +
              " keytabs: " +
              errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  const removeUserList = () => {
    executeUpdate({
      id: props.id,
      entryType: "user",
      entries: selectedUsers,
      method: remove_method,
    } as KeyTabPayload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          alerts.addAlert(
            "remove-users-allow-create-keytab",
            "Removed users that are allowed to " + props.opType + " keytabs",
            "success"
          );
          // Filter out removed users
          const users = tableUsersList.filter(function (user) {
            return selectedUsers.indexOf(user) < 0;
          });
          // Update table
          users.sort();
          setTableUsersList(users);
          setTableUsersFilteredList(users);
          setSearchValue("");
          setShowAddModal(false);
          setUsersTotalCount(users.length);
          props.onRefresh();
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "remove-users-allow-create-keytab",
            "Failed to remove users that are allowed to " +
              props.opType +
              " keytabs: " +
              errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  const [usersFilteredData, setUsersFilteredData] = useState<string[]>([]);
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

  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownUsersList,
    totalCount,
  };

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
  const usersBody = tableUsersFilteredList.map((user, rowIndex) => (
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
      <Td dataLabel={usersColumnNamesArray[0]}>
        <Link
          to={URL_PREFIX + "/active-users/settings"}
          state={fullUsersFiltered[rowIndex]}
        >
          {user}
        </Link>
      </Td>
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
    <div className={props.className}>
      <alerts.ManagedAlerts />
      <SettingsTableLayout
        ariaLabel="user table in host create keytabs"
        variant="compact"
        hasBorders={true}
        name="ipaallowedtoperform_write_keys_user"
        tableId="create-keytab-user-table"
        isStickyHeader={false}
        tableHeader={usersHeader}
        tableBody={usersBody}
        onDeleteModal={onClickDeleteHandler}
        isDeleteDisabled={isDeleteDisabled}
        onAddModal={onClickAddHandler}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        paginationData={paginationData}
        list={tableUsersFilteredList}
      />
      {showAddModal && (
        <KeytabElementsAddModal
          host={props.id}
          elementType="user"
          operationType={props.opType}
          showModal={showAddModal}
          onCloseModal={onCloseAddHandler}
          onOpenModal={onClickAddHandler}
          availableData={usersFilteredData}
          updateAvailableData={updateUsersFilteredData}
          updateSelectedElements={updateSelectedUsers}
          tableElementsList={tableUsersList}
          updateTableElementsList={addUserList}
        />
      )}
      {showDeleteModal && (
        <KeytabElementsDeleteModal
          host={props.id}
          elementType="user"
          operationType={props.opType}
          columnNames={usersColumnNamesArray}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedUsers}
          updateIsDeleteButtonDisabled={updateIsDeleteButtonDisabled}
          updateSelectedElements={updateSelectedUsers}
          tableElementsList={tableUsersList}
          updateTableElementsList={removeUserList}
          availableData={usersFilteredData}
          updateAvailableData={updateUsersFilteredData}
        />
      )}
    </div>
  );
};

export default KeytabUsersTable;
