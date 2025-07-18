import React from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// React Router DOM
import { Link } from "react-router-dom";
// Layout
import DualListLayout, {
  DualListTarget,
} from "src/components/layouts/DualListLayout";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import { usePagination } from "src/hooks/usePagination";
import useShifting from "src/hooks/useShifting";
// RPC
import { GenericPayload, useGetIDListMutation } from "src/services/rpc";
// Components
import { paginate } from "src/utils/utils";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import DeletedElementsTable from "./DeletedElementsTable";
import SettingsTableLayout from "../layouts/SettingsTableLayout";

export interface TableEntry {
  entry: string;
  showLink: boolean;
}

interface PropsToKeytabTable {
  className: string;
  id: string;
  extraId?: string; // In some cases (e.g. buttons with the same name) it is necessary to add an extra ID
  from: string;
  name: string; // Name used in IPA
  isSpinning: boolean;
  entityType: DualListTarget; // Name used by the DualSelector and IDs
  operationTitle: string;
  // Table data
  tableEntryList: TableEntry[];
  columnNames: string[];
  onRefresh: () => void;
  onAdd: (newEntries: string[]) => void;
  onDelete: (entriesToDelete: string[]) => void;
  checkboxesDisabled?: boolean;
  // Add external option
  externalOption?: boolean;
}

const KeytabTableWithFilter = (props: PropsToKeytabTable) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // URL handling
  let entryURL = "";
  if (props.entityType === "user") {
    entryURL = "/active-users/";
  } else if (props.entityType === "group") {
    entryURL = "/user-groups/";
  } else if (props.entityType === "host") {
    entryURL = "/hosts/";
  } else {
    // Host group
    entryURL = "/host-groups/";
  }

  // Checkboxes are disabled when 'checkboxesDisabled' is true
  const [disabledCheckboxes, setDisabledCheckboxes] = React.useState(
    props.checkboxesDisabled
  );

  // - Checkboxes are disabled when 'checkboxesDisabled' is true
  React.useEffect(() => {
    setDisabledCheckboxes(props.checkboxesDisabled);
    if (props.checkboxesDisabled) {
      setSelectedEntries([]);
    }
  }, [props.checkboxesDisabled]);

  // Shown list of elements
  const [tableEntryList, setTableEntryList] = React.useState<TableEntry[]>(
    props.tableEntryList
  );
  const [tableEntriesFilteredList, setTableEntriesFilteredList] =
    React.useState<TableEntry[]>(props.tableEntryList);

  // Update 'tableEntryList' when 'props.tableEntryList' changes
  React.useEffect(() => {
    setTableEntryList(props.tableEntryList);
    setTableEntriesFilteredList(props.tableEntryList);
    setTotalCount(props.tableEntryList.length);
  }, [props.tableEntryList]);

  // Get pagination data and functions
  const {
    page,
    updatePage,
    perPage,
    updatePerPage,
    firstIdx,
    setFirstIdx,
    lastIdx,
    setLastIdx,
    totalCount,
    setTotalCount,
    updateSelectedPerPage,
  } = usePagination(tableEntryList, 5);

  const resetEntries = () => {
    const idList: TableEntry[] = [];

    for (let i = firstIdx; i < tableEntryList.length && i < lastIdx; i++) {
      idList.push(tableEntryList[i]);
    }
    setTableEntriesFilteredList(idList);
    updatePage(1);
    setTotalCount(tableEntryList.length);
  };

  // Page indexes
  React.useEffect(() => {
    setFirstIdx((page - 1) * perPage);
    setLastIdx(page * perPage);
    setTableEntryList(paginate(tableEntryList, page, perPage));
    setTotalCount(tableEntryList.length);
    resetEntries();
  }, [page, perPage]);

  // Search
  const [searchValue, setSearchValue] = React.useState<string>("");

  // Selected entries on table
  const [selectedEntries, setSelectedEntries] = React.useState<string[]>([]);

  // Modal functionality
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const onChangeAddModal = () => setShowAddModal(!showAddModal);
  const onChangeDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  // Computed states
  const isDeleteDisabled = selectedEntries.length === 0;
  const isAddDisabled = props.checkboxesDisabled;

  // Entries displayed on the first page
  const updateShownEntriesList = (newShownEntriesList: TableEntry[]) => {
    setTableEntriesFilteredList(newShownEntriesList);
  };

  // on Search change
  const onSearchChange = (value: string) => {
    const entryList: TableEntry[] = [];

    setSearchValue(value);

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
      if (tableEntryList[i].entry.toLowerCase().includes(value.toLowerCase())) {
        entryList.push(tableEntryList[i]);
        count += 1;
      }
    }
    setTotalCount(entryList.length);
    setTableEntriesFilteredList(entryList);
  };

  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownEntriesList,
    totalCount,
  };

  // - Returns true if all entries are selected and entry list is not empty
  const areAllEntriesSelected =
    selectedEntries.length === tableEntryList.length &&
    tableEntryList.length !== 0;

  // - Returns 'True' if a specific table user has been selected
  const isEntrySelected = (user: string) => selectedEntries.includes(user);

  // - Select all users
  const selectAllUsers = (isSelecting = true) => {
    setSelectedEntries(
      isSelecting ? tableEntryList.map((elem) => elem.entry) : []
    );
  };

  // - On selecting one single row
  const onSelectRow = useShifting(tableEntryList, setSelectedEntries);

  // Header
  const tableHeader = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllUsers(isSelecting),
          isSelected: areAllEntriesSelected,
          isDisabled:
            tableEntryList.length === 0 || disabledCheckboxes ? true : false,
        }}
      />
      <Th width={10}>{props.columnNames[0]}</Th>
    </Tr>
  );

  // Body
  const tableBody = tableEntriesFilteredList.map((entry, rowIndex) => (
    <Tr key={entry.entry} id={entry.entry}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectRow(entry.entry, rowIndex, isSelecting),
          isSelected: isEntrySelected(entry.entry),
          isDisabled: disabledCheckboxes,
        }}
      />
      <Td dataLabel={props.columnNames[0]}>
        {entry.showLink ? (
          <Link
            to={entryURL + entry.entry}
            state={tableEntriesFilteredList[rowIndex]}
          >
            {entry.entry}
          </Link>
        ) : (
          entry.entry
        )}
      </Td>
    </Tr>
  ));

  // on Add new items
  const onAddNewItems = (chosenItems) => {
    props.onAdd(chosenItems);
  };

  // on Remove items
  const onRemoveItems = () => {
    props.onDelete(selectedEntries);
    setSelectedEntries([]);
    onChangeDeleteModal();
  };

  // Issue a search using a specific search value
  const [fullListElements, setFullListElements] = React.useState<string[]>([]);
  const [retrieveIDs] = useGetIDListMutation({});

  React.useEffect(() => {
    retrieveIDs({
      searchValue: "",
      sizeLimit: 200,
      startIdx: 0,
      stopIdx: 200,
      entryType: props.entityType,
    } as GenericPayload).then((result) => {
      if (result && "data" in result) {
        setFullListElements(result.data?.list ?? []);
      } else {
        setFullListElements([]);
      }
    });
  }, [props.entityType]);

  // Entry elements
  const entryElements = tableEntryList.map((element) => element.entry);

  // Filter which elements are not in the table
  const filteredEntryElementsList = fullListElements.filter(
    (element) => !entryElements.includes(element)
  );

  // Render component
  return (
    <div className={props.className}>
      <alerts.ManagedAlerts />
      {/* Table */}
      <SettingsTableLayout
        ariaLabel={props.entityType + " table in " + props.from + " keytabs"}
        variant="compact"
        hasBorders={true}
        name={props.name}
        tableId={"keytab-" + props.entityType + "-table"}
        isStickyHeader={false}
        tableHeader={tableHeader}
        tableBody={tableBody}
        onDeleteModal={onChangeDeleteModal}
        isDeleteDisabled={isDeleteDisabled}
        onAddModal={onChangeAddModal}
        isAddDisabled={isAddDisabled}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        paginationData={paginationData}
        list={tableEntriesFilteredList}
        entryType={props.entityType}
        extraID={props.extraId}
      />
      {/* Add modal */}
      <DualListLayout
        entry={props.id}
        target={props.entityType}
        showModal={showAddModal}
        onCloseModal={onChangeAddModal}
        onOpenModal={onChangeAddModal}
        tableElementsList={entryElements}
        availableOptions={filteredEntryElementsList}
        action={onAddNewItems}
        title={props.operationTitle}
        spinning={props.isSpinning}
        addBtnName="Add"
        addSpinningBtnName="Adding"
        addExternalsOption={props.externalOption || false}
      />
      {/* Delete modal */}
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={onChangeDeleteModal}
        title={
          "Remove " +
          props.entityType.toLowerCase() +
          "s from " +
          props.from +
          " '" +
          props.id +
          "'"
        }
        onDelete={onRemoveItems}
        spinning={props.isSpinning}
      >
        <DeletedElementsTable
          mode="passing_id"
          elementsToDelete={selectedEntries}
          columnNames={props.columnNames}
          elementType={props.entityType}
          idAttr="cn"
        />
      </MemberOfDeleteModal>
    </div>
  );
};

export default KeytabTableWithFilter;
