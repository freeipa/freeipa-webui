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

const RetrieveKeytabHostGroupsTable = (props: PropsToTable) => {
  // TODO: Retrieve data from Redux when available
  // Full host groups list -> Initial data
  const fullHostGroupsIdsList = [
    "hostGroup3",
    "hostGroup4",
    "hostGroup5",
    "hostGroup6",
    "hostGroup7",
    "hostGroup8",
  ];

  // Host groups on the table
  const [tableHostGroupsList, setTableHostGroupsList] = useState<string[]>([]);

  const updateTableHostGroupsList = (newTableHostGroupsList: string[]) => {
    setTableHostGroupsList(newTableHostGroupsList);
  };

  // Filter function to compare the available data with the data that
  //  is in the table already. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterHostGroupsData = () => {
    return fullHostGroupsIdsList.filter((item) => {
      return !tableHostGroupsList.some((itm) => {
        return item === itm;
      });
    });
  };

  const [hostGroupsFilteredData, setHostGroupsFilteredData] = useState(
    filterHostGroupsData()
  );

  const updateHostGroupsFilteredData = (newFilteredHostGroups: unknown[]) => {
    setHostGroupsFilteredData(newFilteredHostGroups as string[]);
  };

  // 'Delete' button is disabled if no row is selected
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  // Column names
  const hostGroupsColumnNamesArray = ["Host group"];

  // - Selected rows are tracked
  const [selectedHostGroups, setSelectedHostGroups] = useState<string[]>([]);

  const updateSelectedHostGroups = (newSelectedHostGroups: string[]) => {
    setSelectedHostGroups(newSelectedHostGroups);
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

  // - Returns 'True' if a specific table host group has been selected
  const isHostGroupSelected = (hostGroup: string) =>
    selectedHostGroups.includes(hostGroup);

  const areAllHostGroupsSelected =
    selectedHostGroups.length === tableHostGroupsList.length &&
    tableHostGroupsList.length !== 0;

  // - Select all host groups
  const selectAllHostGroups = (isSelecting = true) => {
    setSelectedHostGroups(
      isSelecting ? tableHostGroupsList.map((elem) => elem) : []
    );
    setIsDeleteDisabled(false);
  };

  // - Helper method to set the selected hosts from the table
  const setHostGroupSelected = (hostGroup: string, isSelecting = true) =>
    setSelectedHostGroups((prevSelected) => {
      const otherSelectedHostGroups = prevSelected.filter(
        (r) => r !== hostGroup
      );
      return isSelecting
        ? [...otherSelectedHostGroups, hostGroup]
        : otherSelectedHostGroups;
    });

  // - On selecting one single row
  const onSelectHostGroup = (
    hostGroup: string,
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
        setHostGroupSelected(selectedHostGroups[index], isSelecting)
      );
    } else {
      setHostGroupSelected(hostGroup, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
    // Enable 'Delete' button
    setIsDeleteDisabled(false);
  };

  // Disable 'Delete' button when no elements selected
  useEffect(() => {
    if (selectedHostGroups.length === 0) {
      setIsDeleteDisabled(true);
    }
  }, [selectedHostGroups]);

  // Header
  const hostGroupsHeader = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllHostGroups(isSelecting),
          isSelected: areAllHostGroupsSelected,
          isDisabled: tableHostGroupsList.length === 0 ? true : false,
        }}
      />
      <Th width={10}>{hostGroupsColumnNamesArray[0]}</Th>
    </Tr>
  );

  const hostGroupsBody = tableHostGroupsList.map((hostGroup, rowIndex) => (
    <Tr key={hostGroup} id={hostGroup}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectHostGroup(hostGroup, rowIndex, isSelecting),
          isSelected: isHostGroupSelected(hostGroup),
          isDisabled: false,
        }}
      />
      <Td dataLabel={hostGroupsColumnNamesArray[0]}>{hostGroup}</Td>
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
        ariaLabel="host groups table in host settings"
        variant="compact"
        hasBorders={true}
        name="ipaallowedtoperform_read_keys_hostgroup"
        tableId="host-settings-host-groups-table"
        isStickyHeader={false}
        tableHeader={hostGroupsHeader}
        tableBody={hostGroupsBody}
        tableClasses="pf-v5-u-mb-2xl"
        deleteButtonClasses="pf-v5-u-mr-sm"
        onDeleteModal={onClickDeleteHandler}
        isDeleteDisabled={isDeleteDisabled}
        addButtonClasses="pf-v5-u-mr-sm"
        onAddModal={onClickAddHandler}
      />
      {showAddModal && (
        <RetrieveKeytabElementsAddModal
          host={props.host}
          elementType="host"
          operationType="retrieve"
          showModal={showAddModal}
          onCloseModal={onCloseAddHandler}
          onOpenModal={onClickAddHandler}
          availableData={hostGroupsFilteredData}
          updateAvailableData={updateHostGroupsFilteredData}
          updateSelectedElements={updateSelectedHostGroups}
          tableElementsList={tableHostGroupsList}
          updateTableElementsList={updateTableHostGroupsList}
        />
      )}
      {showDeleteModal && (
        <RetrieveKeytabElementsDeleteModal
          host={props.host}
          elementType="host"
          operationType="retrieve"
          columnNames={hostGroupsColumnNamesArray}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedHostGroups}
          updateIsDeleteButtonDisabled={updateIsDeleteButtonDisabled}
          updateSelectedElements={updateSelectedHostGroups}
          tableElementsList={tableHostGroupsList}
          updateTableElementsList={updateTableHostGroupsList}
          availableData={hostGroupsFilteredData}
          updateAvailableData={updateHostGroupsFilteredData}
        />
      )}
    </>
  );
};

export default RetrieveKeytabHostGroupsTable;
