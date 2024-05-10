import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import SettingsTableLayout from "../layouts/SettingsTableLayout";
// Modals
import KeytabElementsAddModal from "../modals/HostsSettings/KeytabElementsAddModal";
import KeytabElementsDeleteModal from "../modals/HostsSettings/KeytabElementsDeleteModal";
// Hooks
import { useAlerts } from "../../hooks/useAlerts";
// Data types
import {
  Host,
  HostGroup,
  Service,
  User,
  UserGroup,
} from "../../utils/datatypes/globalDataTypes";
// React Router DOM
import { Link } from "react-router-dom";
// Utils
import { API_VERSION_BACKUP } from "../../utils/utils";
// Navigation
import { URL_PREFIX } from "../../navigation/NavRoutes";
// RPC
import {
  ErrorResult,
  GetEntriesPayload,
  useGetEntriesMutation,
} from "../../services/rpc";
import {
  KeyTabPayload,
  useUpdateKeyTabMutation,
} from "../../services/rpcSettings";

interface PropsToTable {
  from: "host" | "service";
  id: string;
  entry: Partial<Service> | Partial<Host>;
  onRefresh: () => void;
  className?: string | "";
  opType: "create" | "retrieve";
  entryAttr: string;
  entryType: "user" | "group" | "host" | "hostgroup";
}

const KeytabTable = (props: PropsToTable) => {
  let entries: string[] = [];
  if (props.entry[props.entryAttr] !== undefined) {
    entries = [...props.entry[props.entryAttr]].sort();
  }

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Users list on the table
  const [tableEntryList, setTableList] = useState<string[]>(entries);
  const [fullEntry, setFullEntries] = useState<
    User[] | UserGroup[] | Host[] | HostGroup[]
  >([]);

  const [tableEntriesFilteredList, setTableEntriesFilteredList] =
    useState<string[]>(entries);
  const [fullEntriesFiltered, setFullEntriesFiltered] = useState<
    User[] | UserGroup[] | Host[] | HostGroup[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>("");

  // URL handling
  let entryURL = "";
  if (props.entryType === "user") {
    entryURL = "/active-users/settings";
  } else if (props.entryType === "group") {
    entryURL = "/user-groups/settings";
  } else if (props.entryType === "host") {
    entryURL = "/hosts/settings";
  } else {
    // Host group
    entryURL = "/host-groups/settings";
  }

  // PaginationPrep
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [totalCount, setEntriesTotalCount] = useState<number>(0);
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

  // Entries displayed on the first page
  const updateShownEntriesList = (
    newShownEntriesList: User[] | UserGroup[] | Host[] | HostGroup[]
  ) => {
    setFullEntriesFiltered(newShownEntriesList);
  };

  const resetEntries = () => {
    const firstIdx = (page - 1) * perPage;
    const lastIdx = page * perPage;
    const idList: string[] = [];
    let entryList;
    if (props.entryType === "user") {
      entryList = [] as User[];
    } else if (props.entryType === "group") {
      entryList = [] as UserGroup[];
    } else if (props.entryType === "host") {
      entryList = [] as Host[];
    } else {
      // HostGroup
      entryList = [] as HostGroup[];
    }
    for (let i = firstIdx; i < tableEntryList.length && i < lastIdx; i++) {
      idList.push(tableEntryList[i]);
      entryList.push(fullEntry[i]);
    }
    setTableEntriesFilteredList(idList);
    setFullEntriesFiltered(entryList);
    setEntriesTotalCount(tableEntryList.length);
  };

  // Page indexes
  useEffect(() => {
    resetEntries();
  }, [page, perPage]);

  const onSearchChange = (value: string) => {
    const entryList: string[] = [];
    let fullEntryList;
    if (props.entryType === "user") {
      fullEntryList = [] as User[];
    } else if (props.entryType === "group") {
      fullEntryList = [] as UserGroup[];
    } else if (props.entryType === "host") {
      fullEntryList = [] as Host[];
    } else {
      // HostGroup
      fullEntryList = [] as HostGroup[];
    }

    if (value === "") {
      // Reset back to original list
      resetEntries();
      return;
    }

    // Filter our current list
    const firstIdx = (page - 1) * perPage;
    const lastIdx = page * perPage;
    let count = 0;
    for (let i = firstIdx; i < tableEntryList.length && count < lastIdx; i++) {
      if (tableEntryList[i].toLowerCase().includes(value.toLowerCase())) {
        entryList.push(tableEntryList[i]);
        fullEntryList.push(fullEntry[i]);
        count += 1;
      }
    }
    setEntriesTotalCount(entryList.length);
    setTableEntriesFilteredList(entryList);
    setFullEntriesFiltered(fullEntryList);
  };

  // Gather User objects
  const [getEntries] = useGetEntriesMutation({});
  useEffect(() => {
    if (tableEntryList.length > 0) {
      getEntries({
        idList: tableEntryList,
        entryType: props.entryType,
        apiVersion: API_VERSION_BACKUP,
      } as GetEntriesPayload).then((result) => {
        if ("data" in result) {
          const entryListResult = result.data.result.results;
          const entryListSize = result.data.result.count;
          let entriesList;
          if (props.entryType === "user") {
            entriesList = [] as User[];
          } else if (props.entryType === "group") {
            entriesList = [] as UserGroup[];
          } else if (props.entryType === "host") {
            entriesList = [] as Host[];
          } else {
            // HostGroup
            entriesList = [] as HostGroup[];
          }

          for (let i = 0; i < entryListSize; i++) {
            entriesList.push(entryListResult[i].result);
          }
          setEntriesTotalCount(entryListSize);

          // Ok apply pagination to the results
          const firstIdx = (page - 1) * perPage;
          const lastIdx = page * perPage;
          const idList: string[] = [];
          let entryList;
          if (props.entryType === "user") {
            entryList = [] as User[];
          } else if (props.entryType === "group") {
            entryList = [] as UserGroup[];
          } else if (props.entryType === "host") {
            entryList = [] as Host[];
          } else {
            // HostGroup
            entryList = [] as HostGroup[];
          }
          for (
            let i = firstIdx;
            i < tableEntryList.length && i < lastIdx;
            i++
          ) {
            idList.push(tableEntryList[i]);
            entryList.push(entriesList[i]);
          }
          setTableEntriesFilteredList(idList);
          setFullEntriesFiltered(entryList);
          setFullEntries(entriesList);
        }
      });
    }
  }, [tableEntryList]);

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

  const addEntry = (newEntries: string[]) => {
    let id = props.id;
    if (props.from === "service") {
      // Need to strip off domain for services
      id = props.id[0].split("@")[0];
    }
    executeUpdate({
      id: id,
      entryType: props.entryType,
      entries: newEntries,
      method: add_method,
    } as KeyTabPayload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          alerts.addAlert(
            "add-" + props.entryType + "s-allow-keytab",
            "Successfully added " +
              props.entryType +
              "s that are allowed to " +
              props.opType +
              " keytabs",
            "success"
          );
          // Update table
          const entries = [...tableEntryList, ...newEntries].sort();
          setTableList(entries);
          setTableEntriesFilteredList(entries);
          setSearchValue("");
          setShowAddModal(false);
          setEntriesTotalCount(entries.length);
          props.onRefresh();
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "add-" + props.entryType + "s-keytab",
            "Failed to add " +
              props.entryType +
              "s that are allowed to " +
              props.opType +
              " keytabs: " +
              errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  const removeEntry = () => {
    let id = props.id;
    if (props.from === "service") {
      // Need to strip off domain for services
      id = props.id[0].split("@")[0];
    }
    executeUpdate({
      id: id,
      entryType: props.entryType,
      entries: selectedEntries,
      method: remove_method,
    } as KeyTabPayload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          alerts.addAlert(
            "remove-" + props.entryType + "s-allow-create-keytab",
            "Removed " +
              props.entryType +
              "s that are allowed to " +
              props.opType +
              " keytabs",
            "success"
          );
          // Filter out removed users
          const entries = tableEntryList.filter(function (entry) {
            return selectedEntries.indexOf(entry) < 0;
          });
          // Update table
          entries.sort();
          setTableList(entries);
          setTableEntriesFilteredList(entries);
          setSearchValue("");
          setShowAddModal(false);
          setEntriesTotalCount(entries.length);
          props.onRefresh();
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "remove-" + props.entryType + "s-allow-create-keytab",
            "Failed to remove " +
              props.entryType +
              "s that are allowed to " +
              props.opType +
              " keytabs: " +
              errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  const [entryFilteredData, setEntryFilteredData] = useState<string[]>([]);
  const updateEntryFilteredData = (newFilteredEntries: unknown[]) => {
    setEntryFilteredData(newFilteredEntries as string[]);
  };

  // 'Delete' button is disabled if no row is selected
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  // Column names (String)
  const columnName =
    props.entryType.charAt(0).toUpperCase() + props.entryType.slice(1);
  const columnNamesArray = [columnName];

  // Selected rows are tracked
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  const updateSelectedEntries = (newSelectedEntries: string[]) => {
    setSelectedEntries(newSelectedEntries);
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
  const isEntrySelected = (user: string) => selectedEntries.includes(user);

  const areAllEntriesSelected =
    selectedEntries.length === tableEntryList.length &&
    tableEntryList.length !== 0;

  // - Select all users
  const selectAllUsers = (isSelecting = true) => {
    setSelectedEntries(isSelecting ? tableEntryList.map((elem) => elem) : []);
    setIsDeleteDisabled(false);
  };

  // - Helper method to set the selected users from the table
  const setUserSelected = (user: string, isSelecting = true) =>
    setSelectedEntries((prevSelected) => {
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
        setUserSelected(tableEntryList[index], isSelecting)
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
    if (selectedEntries.length === 0) {
      setIsDeleteDisabled(true);
    }
  }, [selectedEntries]);

  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownEntriesList,
    totalCount,
  };

  // Header
  const usersHeader = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllUsers(isSelecting),
          isSelected: areAllEntriesSelected,
          isDisabled: tableEntryList.length === 0 ? true : false,
        }}
      />
      <Th width={10}>{columnNamesArray[0]}</Th>
    </Tr>
  );

  // Body
  const usersBody = tableEntriesFilteredList.map((entry, rowIndex) => (
    <Tr key={entry} id={entry}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectUser(entry, rowIndex, isSelecting),
          isSelected: isEntrySelected(entry),
          isDisabled: false,
        }}
      />
      <Td dataLabel={columnNamesArray[0]}>
        <Link to={URL_PREFIX + entryURL} state={fullEntriesFiltered[rowIndex]}>
          {entry}
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
        ariaLabel={props.entryType + " table in host create keytabs"}
        variant="compact"
        hasBorders={true}
        name={"ipaallowedtoperform_write_keys_" + props.entryType}
        tableId={"create-keytab-" + props.entryType + "-table"}
        isStickyHeader={false}
        tableHeader={usersHeader}
        tableBody={usersBody}
        onDeleteModal={onClickDeleteHandler}
        isDeleteDisabled={isDeleteDisabled}
        onAddModal={onClickAddHandler}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        paginationData={paginationData}
        list={tableEntriesFilteredList}
        entryCount={tableEntryList.length}
        entryType={props.entryType}
      />
      {showAddModal && (
        <KeytabElementsAddModal
          host={props.id}
          elementType={props.entryType}
          operationType={props.opType}
          showModal={showAddModal}
          onCloseModal={onCloseAddHandler}
          onOpenModal={onClickAddHandler}
          availableData={entryFilteredData}
          updateAvailableData={updateEntryFilteredData}
          updateSelectedElements={updateSelectedEntries}
          tableElementsList={tableEntryList}
          updateTableElementsList={addEntry}
        />
      )}
      {showDeleteModal && (
        <KeytabElementsDeleteModal
          host={props.id}
          elementType={props.entryType}
          operationType={props.opType}
          columnNames={columnNamesArray}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedEntries}
          updateIsDeleteButtonDisabled={updateIsDeleteButtonDisabled}
          updateSelectedElements={updateSelectedEntries}
          tableElementsList={tableEntryList}
          updateTableElementsList={removeEntry}
          availableData={entryFilteredData}
          updateAvailableData={updateEntryFilteredData}
        />
      )}
    </div>
  );
};

export default KeytabTable;
