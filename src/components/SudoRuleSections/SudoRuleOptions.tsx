import React from "react";
// Patternfly
import { Td, Th, Tr } from "@patternfly/react-table";
import { Button, TextInput } from "@patternfly/react-core";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
// RPC
import {
  useAddOptionToSudoRuleMutation,
  useRemoveOptionsFromSudoRuleMutation,
} from "src/services/rpcSudoRules";
// Components
import SettingsTableLayout from "../layouts/SettingsTableLayout";
import ModalWithFormLayout, { Field } from "../layouts/ModalWithFormLayout";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import DeletedElementsTable from "../tables/DeletedElementsTable";

interface PropsToSudoRuleOptions {
  sudoRuleId: string;
  options: string[];
}

const SudoRuleOptions = (props: PropsToSudoRuleOptions) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // States
  const [selectedEntries, setSelectedEntries] = React.useState<string[]>([]);
  const [tableEntryList, setTableEntryList] = React.useState<string[]>(
    props.options
  );
  let fullEntryList = props.options;
  // 'Delete' button is disabled if no row is selected
  const [isDeleteDisabled, setIsDeleteDisabled] = React.useState(true);
  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = React.useState<
    number | null
  >(null);
  const [shifting, setShifting] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<string>("");

  // API calls
  const [addOption] = useAddOptionToSudoRuleMutation();
  const [removeOption] = useRemoveOptionsFromSudoRuleMutation();

  // Helper methods
  // - on search change
  const onSearchChange = (value: string) => {
    setSearchValue(value);
    if (value === "") {
      // Reset back to original list
      setTableEntryList(fullEntryList);
      return;
    }

    // Filter our current list
    const newEntryList: string[] = [];
    const firstIdx = (page - 1) * perPage;
    const lastIdx = page * perPage;
    let count = 0;
    for (let i = firstIdx; i < fullEntryList.length && count < lastIdx; i++) {
      if (fullEntryList[i].toLowerCase().includes(value.toLowerCase())) {
        newEntryList.push(fullEntryList[i]);
        count += 1;
      }
    }
    setTableEntryList(newEntryList);
  };

  // - Keyboard event to select rows
  React.useEffect(() => {
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

  // - Check if all entries are selected
  const areAllEntriesSelected =
    selectedEntries.length === tableEntryList.length &&
    tableEntryList.length !== 0;

  // - Select all entries
  const selectAllEntries = (isSelecting = true) => {
    setSelectedEntries(isSelecting ? tableEntryList.map((elem) => elem) : []);
    setIsDeleteDisabled(false);
  };

  // - Set the selected entries from the table
  const setEntriesSelected = (entry: string, isSelecting = true) =>
    setSelectedEntries((prevSelected) => {
      const otherSelectedEntries = prevSelected.filter((r) => r !== entry);
      return isSelecting
        ? [...otherSelectedEntries, entry]
        : otherSelectedEntries;
    });

  // - On selecting one single row
  const onSelectEntry = (
    entry: string,
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
        setEntriesSelected(tableEntryList[index], isSelecting)
      );
    } else {
      setEntriesSelected(entry, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
    // Enable 'Delete' button
    setIsDeleteDisabled(false);
  };

  // Disable 'Delete' button when no elements selected
  React.useEffect(() => {
    if (selectedEntries.length === 0) {
      setIsDeleteDisabled(true);
    }
  }, [selectedEntries]);

  // - Returns 'True' if a specific table entry has been selected
  const isEntrySelected = (entry: string) => selectedEntries.includes(entry);

  // Table - Header
  const headerNames = ["Sudo option"];

  const generateHeader = () => {
    return (
      <Tr>
        <Th
          select={{
            onSelect: (_event, isSelecting) => selectAllEntries(isSelecting),
            isSelected: areAllEntriesSelected,
            isDisabled: headerNames.length === 0 ? true : false,
          }}
        />
        {headerNames.map((headerName, index) => (
          <Th key={index} width={10}>
            {headerName}
          </Th>
        ))}
      </Tr>
    );
  };

  // Table - Body
  const generateBody = () => {
    return tableEntryList.map((entry, rowIndex) => {
      return (
        <Tr key={entry} id={entry}>
          <Td
            dataLabel="checkbox"
            select={{
              rowIndex,
              onSelect: (_event, isSelecting) =>
                onSelectEntry(entry, rowIndex, isSelecting),
              isSelected: isEntrySelected(entry),
              isDisabled: false,
            }}
          />
          <Td dataLabel={entry}>{entry}</Td>
        </Tr>
      );
    });
  };

  // Pagination prep
  const [page, setPage] = React.useState<number>(1);
  const [perPage, setPerPage] = React.useState<number>(5);
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
  const updateShownElementsList = (newShownEntriesList: string[]) => {
    setTableEntryList(newShownEntriesList);
  };

  // Pagination data required by the Table Layout
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList,
    totalCount: tableEntryList.length,
  };

  // Add modal
  const [showAddModal, setShowAddModal] = React.useState(false);
  const onChangeAddModalVisibility = () => setShowAddModal(!showAddModal);
  const [newOption, setNewOption] = React.useState<string>("");
  const [spinningOnAdd, setSpinningOnAdd] = React.useState<boolean>(false);

  // On add option to sudo rule
  const onAddOption = () => {
    setSpinningOnAdd(true);
    const payload = {
      option: newOption,
      toSudoRule: props.sudoRuleId,
    };
    addOption(payload).then((response) => {
      if ("data" in response) {
        const responseData = response.data;
        if (responseData?.result) {
          alerts.addAlert(
            "add-sudo-option-success",
            "Sudo option added",
            "success"
          );
          setTableEntryList([...tableEntryList, newOption]);
          fullEntryList = [...fullEntryList, newOption];
          setNewOption("");
          onChangeAddModalVisibility();
        } else if (responseData?.error) {
          alerts.addAlert(
            "add-sudo-option-error",
            "Failed to add sudo option: " + responseData.error,
            "danger"
          );
        }
      }
      setSpinningOnAdd(false);
    });
  };

  const addModalFields: Field[] = [
    {
      id: "sudo-option",
      name: "Sudo option",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-sudo-option"
          type="text"
          id="sudo-option"
          name="ipasudoopt"
          aria-label="Sudo option"
          value={newOption}
          onChange={(_event, value) => setNewOption(value)}
          isRequired
        />
      ),
    },
  ];

  const addModalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="delete-groups"
      variant="primary"
      form={"add-sudo-option-modal"}
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={spinningOnAdd}
      isDisabled={newOption === "" || spinningOnAdd}
      onClick={onAddOption}
    >
      {spinningOnAdd ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-remove-group"
      variant="link"
      onClick={onChangeAddModalVisibility}
    >
      Cancel
    </Button>,
  ];

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const onChangeDeleteModalVisibility = () =>
    setShowDeleteModal(!showDeleteModal);
  const [spinningOnDelete, setSpinningOnDelete] = React.useState(false);

  const onDeleteOptions = () => {
    setSpinningOnDelete(true);
    const payload = {
      options: selectedEntries,
      fromSudoRule: props.sudoRuleId,
    };
    removeOption(payload).then((response) => {
      if ("data" in response) {
        const responseData = response.data;
        if (responseData?.result) {
          alerts.addAlert(
            "remove-sudo-option-success",
            "Sudo option(s) removed",
            "success"
          );
          setTableEntryList(
            tableEntryList.filter((entry) => !selectedEntries.includes(entry))
          );
          fullEntryList = fullEntryList.filter(
            (entry) => !selectedEntries.includes(entry)
          );
          setSelectedEntries([]);
          onChangeDeleteModalVisibility();
        } else if (responseData?.error) {
          alerts.addAlert(
            "remove-sudo-option-error",
            "Failed to remove sudo option: " + responseData.error,
            "danger"
          );
        }
        setSpinningOnDelete(false);
      }
    });
  };

  return (
    <>
      <alerts.ManagedAlerts />
      <SettingsTableLayout
        ariaLabel={"Options table in sudo rules settings page"}
        variant="compact"
        hasBorders={true}
        name={"ipasudoopt"}
        tableId={"ipasudoopt-table"}
        isStickyHeader={false}
        tableHeader={generateHeader()}
        tableBody={generateBody()}
        onDeleteModal={onChangeDeleteModalVisibility}
        isDeleteDisabled={isDeleteDisabled}
        onAddModal={onChangeAddModalVisibility}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        paginationData={paginationData}
        list={tableEntryList} // Filtered list
        entryType={"option"}
      />
      {/* Add option modal */}
      <ModalWithFormLayout
        dataCy="add-sudo-option-modal"
        variantType="medium"
        modalPosition="top"
        title={"Add sudo option"}
        formId={"add-sudo-option-modal"}
        fields={addModalFields}
        show={showAddModal}
        onClose={onChangeAddModalVisibility}
        actions={addModalActions}
        isHorizontal={true}
      />
      {/* Delete confirmation modal */}
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={"Remove sudo options"}
        onDelete={onDeleteOptions}
        spinning={spinningOnDelete}
      >
        <DeletedElementsTable
          mode="passing_id"
          elementsToDelete={selectedEntries}
          columnNames={["Sudo option"]}
          elementType="Sudo rule"
          idAttr="cn"
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default SudoRuleOptions;
