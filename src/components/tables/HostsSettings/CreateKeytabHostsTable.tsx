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

const CreateKeytabHostsTable = (props: PropsToTable) => {
  // Full elements list -> Initial data
  const fullHostsList = useAppSelector((state) => state.hosts.hostsList);
  const fullHostIdsList = fullHostsList.map((host) => host.fqdn);

  // Elements on the table
  const [tableHostsList, setTableHostsList] = useState<string[]>([]);

  const updateTableHostsList = (newTableHostsList: string[]) => {
    setTableHostsList(newTableHostsList);
  };

  // Filter function to compare the available data with the data that
  //  is in the table already. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterHostsData = () => {
    return fullHostIdsList.filter((item) => {
      return !tableHostsList.some((itm) => {
        return item === itm;
      });
    });
  };

  // const usersFilteredData = filterUsersData();
  const [hostsFilteredData, setHostsFilteredData] = useState(filterHostsData());

  const updateHostsFilteredData = (newFilteredHosts: unknown[]) => {
    setHostsFilteredData(newFilteredHosts as string[]);
  };

  // 'Delete' button is disabled if no row is selected
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  // Column names (Array)
  const hostsColumnNamesArray = ["Host"];

  // - Selected rows are tracked
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);

  const updateSelectedHosts = (newSelectedHosts: string[]) => {
    setSelectedHosts(newSelectedHosts);
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

  // - Returns 'True' if a specific table host has been selected
  const isHostSelected = (host: string) => selectedHosts.includes(host);

  const areAllHostsSelected =
    selectedHosts.length === tableHostsList.length &&
    tableHostsList.length !== 0;

  // - Select all elements
  const selectAllHosts = (isSelecting = true) => {
    setSelectedHosts(isSelecting ? tableHostsList.map((elem) => elem) : []);
    setIsDeleteDisabled(false);
  };

  // - Helper method to set the selected elements from the table
  const setHostSelected = (host: string, isSelecting = true) =>
    setSelectedHosts((prevSelected) => {
      const otherSelectedHosts = prevSelected.filter((r) => r !== host);
      return isSelecting ? [...otherSelectedHosts, host] : otherSelectedHosts;
    });

  // - On selecting one single row
  const onSelectHost = (
    host: string,
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
        setHostSelected(selectedHosts[index], isSelecting)
      );
    } else {
      setHostSelected(host, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
    // Enable 'Delete' button
    setIsDeleteDisabled(false);
  };

  // Disable 'Delete' button when no elements selected
  useEffect(() => {
    if (selectedHosts.length === 0) {
      setIsDeleteDisabled(true);
    }
  }, [selectedHosts]);

  // Header
  const hostsHeader = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllHosts(isSelecting),
          isSelected: areAllHostsSelected,
          isDisabled: tableHostsList.length === 0 ? true : false,
        }}
      />
      <Th width={10}>{hostsColumnNamesArray[0]}</Th>
    </Tr>
  );

  const hostsBody = tableHostsList.map((host, rowIndex) => (
    <Tr key={host} id={host}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectHost(host, rowIndex, isSelecting),
          isSelected: isHostSelected(host),
          isDisabled: false,
        }}
      />
      <Td dataLabel={hostsColumnNamesArray[0]}>{host}</Td>
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
        ariaLabel="hosts table in host settings"
        variant="compact"
        hasBorders={true}
        name="ipaallowedtoperform_write_keys_host"
        tableId="host-settings-hosts-table"
        isStickyHeader={false}
        tableHeader={hostsHeader}
        tableBody={hostsBody}
        tableClasses="pf-v5-u-mb-2xl"
        deleteButtonClasses="pf-v5-u-mr-sm"
        onDeleteModal={onClickDeleteHandler}
        isDeleteDisabled={isDeleteDisabled}
        addButtonClasses="pf-v5-u-mr-sm"
        onAddModal={onClickAddHandler}
      />
      {showAddModal && (
        <CreateKeytabElementsAddModal
          host={props.host}
          elementType="host"
          operationType="create"
          showModal={showAddModal}
          onCloseModal={onCloseAddHandler}
          onOpenModal={onClickAddHandler}
          availableData={hostsFilteredData}
          updateAvailableData={updateHostsFilteredData}
          updateSelectedElements={updateSelectedHosts}
          tableElementsList={tableHostsList}
          updateTableElementsList={updateTableHostsList}
        />
      )}
      {showDeleteModal && (
        <CreateKeytabElementsDeleteModal
          host={props.host}
          elementType="host"
          operationType="create"
          columnNames={hostsColumnNamesArray}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedHosts}
          updateIsDeleteButtonDisabled={updateIsDeleteButtonDisabled}
          updateSelectedElements={updateSelectedHosts}
          tableElementsList={tableHostsList}
          updateTableElementsList={updateTableHostsList}
          availableData={hostsFilteredData}
          updateAvailableData={updateHostsFilteredData}
        />
      )}
    </>
  );
};

export default CreateKeytabHostsTable;
