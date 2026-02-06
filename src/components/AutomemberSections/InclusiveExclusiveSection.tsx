import React from "react";
// Patternfly
import { Td, Th, Tr } from "@patternfly/react-table";
import { Button } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  AddConditionPayload,
  Condition,
  RemoveConditionPayload,
  useAutomemberAddConditionMutation,
  useAutomemberRemoveConditionMutation,
} from "src/services/rpcAutomember";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Components
import SettingsTableLayout from "../layouts/SettingsTableLayout";
import InputRequiredText from "../layouts/InputRequiredText";
import ModalWithFormLayout, { Field } from "../layouts/ModalWithFormLayout";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import DeletedElementsTable from "../tables/DeletedElementsTable";
import SimpleSelector from "../layouts/SimpleSelector";

interface PropsToInclusiveExclusiveSection {
  entityId: string;
  automemberType: string;
  conditionType: "inclusive" | "exclusive";
  tableElements: Condition[];
  metadata: Metadata;
  columnNames: string[];
  onRefresh: () => void;
}

const InclusiveExclusiveSection = (props: PropsToInclusiveExclusiveSection) => {
  const dispatch = useAppDispatch();

  // ACI attributes to use in Inclusive/Exclusive sections
  const userAciAttrs = props.metadata.objects?.user?.aciattrs || [];

  // States
  const [selectedEntries, setSelectedEntries] = React.useState<Condition[]>([]);
  const [tableEntryList, setTableEntryList] = React.useState<Condition[]>(
    props.tableElements
  );
  const [page, setPage] = React.useState<number>(1);
  const [perPage, setPerPage] = React.useState<number>(5);
  const [shownElements, setShownElements] = React.useState<Condition[]>([]);

  // Keep the entries updated
  React.useEffect(() => {
    setTableEntryList(props.tableElements);

    // Pagination
    const startIdx = (page - 1) * perPage;
    const endIdx = page * perPage;
    const paginatedElements = props.tableElements.slice(startIdx, endIdx);
    setShownElements(paginatedElements);
  }, [page, perPage, props.tableElements]);

  // 'Delete' button is disabled if no row is selected
  const [isDeleteDisabled, setIsDeleteDisabled] = React.useState(true);

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = React.useState<
    number | null
  >(null);
  const [shifting, setShifting] = React.useState(false);

  // API calls
  const [addCondition] = useAutomemberAddConditionMutation();
  const [removeCondition] = useAutomemberRemoveConditionMutation();

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
  const setEntriesSelected = (entry: Condition, isSelecting = true) =>
    setSelectedEntries((prevSelected) => {
      const otherSelectedEntries = prevSelected.filter((r) => r !== entry);
      return isSelecting
        ? [...otherSelectedEntries, entry]
        : otherSelectedEntries;
    });

  // - On selecting one single row
  const onSelectEntry = (
    entry: Condition,
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
  const isEntrySelected = (entry: Condition) => selectedEntries.includes(entry);

  // Table - Header
  const headerNames = ["Attribute", "Expression"];

  const generateHeader = () => {
    return (
      <Tr>
        <Th
          select={{
            onSelect: (_event, isSelecting) => selectAllEntries(isSelecting),
            isSelected: areAllEntriesSelected,
            isDisabled: headerNames.length === 0 ? true : false,
          }}
          aria-label="Select entries"
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
    return shownElements.map((entry, rowIndex) => {
      return (
        <Tr key={entry.key + "-" + rowIndex} id={entry.key + "-" + rowIndex}>
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
          <Td dataLabel={entry.key}>{entry.key}</Td>
          <Td dataLabel={entry.automemberregex}>{entry.automemberregex}</Td>
        </Tr>
      );
    });
  };

  // Pagination prep
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
  const updateShownElementsList = (newShownEntriesList: Condition[]) => {
    setShownElements(newShownEntriesList);
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
  const [key, setkey] = React.useState<string>(userAciAttrs[0]);
  const [expression, setExpression] = React.useState<string>("");
  const [spinningOnAdd, setSpinningOnAdd] = React.useState<boolean>(false);

  // Change modal visibility
  const onChangeAddModalVisibility = () => {
    setShowAddModal(!showAddModal);
    setkey(userAciAttrs[0]);
  };

  // Reset values
  const resetValues = () => {
    setkey(userAciAttrs[0]);
    setExpression("");
  };

  // On add
  const onAddOption = () => {
    setSpinningOnAdd(true);
    const payload: AddConditionPayload = {
      automemberId: props.entityId,
      automemberType: props.automemberType,
      conditionType: props.conditionType,
      key: key,
      automemberregex: expression,
    };

    addCondition(payload).then((response) => {
      if ("data" in response) {
        const responseData = response.data;
        if (responseData?.result) {
          dispatch(
            addAlert({
              name: "add-automember-condition-success",
              title: "Automember condition added",
              variant: "success",
            })
          );
          props.onRefresh();
          resetValues();
          onChangeAddModalVisibility();
        } else if (responseData?.error) {
          dispatch(
            addAlert({
              name: "add-automember-condition-error",
              title:
                "Failed to add Automember condition: " + responseData.error,
              variant: "danger",
            })
          );
        }
      }
      setSpinningOnAdd(false);
    });
  };

  const addModalFields: Field[] = [
    {
      id: "attribute",
      name: "Attribute",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-attribute"
          id="attribute"
          selected={key}
          options={userAciAttrs.map((name) => ({
            key: name,
            value: name,
          }))}
          onSelectedChange={(selected: string) => setkey(selected)}
        />
      ),
    },
    {
      id: "expression",
      name: "Expression",
      fieldRequired: true,
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-expression"
          id="expression"
          name="expression"
          value={expression}
          onChange={setExpression}
        />
      ),
    },
  ];

  const addModalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-inclusive"
      variant="primary"
      form={"add-sudo-option-modal"}
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={spinningOnAdd}
      type="submit"
      isDisabled={expression === "" || spinningOnAdd}
    >
      {spinningOnAdd ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-add-" + props.conditionType}
      variant="link"
      onClick={onChangeAddModalVisibility}
    >
      Cancel
    </Button>,
  ];

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const onChangeDeleteModalVisibility = () =>
    setShowDeleteModal(!showDeleteModal);
  const [spinningOnDelete, setSpinningOnDelete] = React.useState(false);

  const onDeleteOptions = () => {
    setSpinningOnDelete(true);
    const payload: RemoveConditionPayload = {
      automemberId: props.entityId,
      automemberType: props.automemberType,
      conditionType: props.conditionType,
      conditions: selectedEntries,
    };

    removeCondition(payload).then((response) => {
      if ("data" in response) {
        const responseData = response.data;
        if (responseData?.result) {
          dispatch(
            addAlert({
              name: "remove-condition-success",
              title: "Item(s) removed",
              variant: "success",
            })
          );
          props.onRefresh();
          setSelectedEntries([]);
          onChangeDeleteModalVisibility();
        } else if (responseData?.error) {
          dispatch(
            addAlert({
              name: "remove-condition-error",
              title: "Failed to remove item(s): " + responseData.error,
              variant: "danger",
            })
          );
        }
        setSpinningOnDelete(false);
      }
    });
  };

  return (
    <>
      <SettingsTableLayout
        ariaLabel={"Options table in sudo rules settings page"}
        variant="compact"
        hasBorders={true}
        name={"automember" + props.conditionType + "regex"}
        tableId={"automember" + props.conditionType + "regex-table"}
        isStickyHeader={false}
        tableHeader={generateHeader()}
        tableBody={generateBody()}
        onDeleteModal={onChangeDeleteModalVisibility}
        isDeleteDisabled={isDeleteDisabled}
        onAddModal={onChangeAddModalVisibility}
        paginationData={paginationData}
        list={shownElements}
        entryCount={tableEntryList.length}
        entryType={"condition"}
        extraID={props.conditionType}
      />
      {/* Add option modal */}
      <ModalWithFormLayout
        dataCy="add-automember-condition-modal"
        variantType="medium"
        modalPosition="top"
        title={"Add " + props.conditionType + " conditions"}
        formId={"add-sudo-option-modal"}
        fields={addModalFields}
        show={showAddModal}
        onSubmit={onAddOption}
        onClose={onChangeAddModalVisibility}
        actions={addModalActions}
        isHorizontal={true}
      />
      {/* Delete confirmation modal */}
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={"Remove " + props.conditionType + " conditions"}
        onDelete={onDeleteOptions}
        spinning={spinningOnDelete}
      >
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={selectedEntries}
          columnNames={props.columnNames}
          elementType="Condition"
          idAttr="key"
          columnIds={["key", "automemberregex"]}
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default InclusiveExclusiveSection;
