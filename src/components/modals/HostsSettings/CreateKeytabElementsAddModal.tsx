import React, { ReactNode, useEffect, useState } from "react";
// PatternFly
import {
  Button,
  DualListSelector,
  DualListSelectorListItem,
} from "@patternfly/react-core";
// Layout
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import SearchInputLayout from "../../layouts/SearchInputLayout";
//Icons
import InfoCircleIcon from "@patternfly/react-icons/dist/esm/icons/info-circle-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";
// RPC client
import { useGetIDListMutation, GenericPayload } from "../../../services/rpc";

interface PropsToAddModal {
  host: string;
  elementType: string;
  operationType: string;
  showModal: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
  availableData: string[];
  updateAvailableData: (newAvailableData: unknown[]) => void;
  updateSelectedElements: (newSelectedElements: string[]) => void;
  tableElementsList: string[];
  updateTableElementsList: (newTableElementsList: string[]) => void;
}

const CreateKeytabElementsAddModal = (props: PropsToAddModal) => {
  // Dual list selector
  const initialList = (
    <div>
      <InfoCircleIcon className="pf-v5-u-info-color-100 pf-v5-u-mr-sm" /> Please
      enter a search value
    </div>
  );

  const [availableOptions, setAvailableOptions] = useState<any[]>([
    initialList,
  ]);
  const [chosenOptions, setChosenOptions] = useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  const updateAvailableOptions = (newList: string[]) => {
    if (newList.length === 0) {
      const emptyList = (
        <div id="disabled">
          <ExclamationTriangleIcon className="pf-v5-u-warning-color-100 pf-v5-u-mr-sm" />{" "}
          No matching results
        </div>
      );
      setAvailableOptions([emptyList]);
      return;
    }
    // Filter out options already in the table
    const filterUsersData = newList.filter((item) => {
      return !props.tableElementsList.some((itm) => {
        return item === itm;
      });
    });

    // Filter out options that have already been chosen
    const cleanList = filterUsersData.filter((item) => {
      return !chosenOptions.some((itm) => {
        return item === itm;
      });
    });
    setAvailableOptions(cleanList);
  };

  // Issue a search using a specific search value
  const [retrieveIDs] = useGetIDListMutation({});
  const submitSearchValue = () => {
    setSearchIsDisabled(true);
    retrieveIDs({
      searchValue: searchValue,
      sizeLimit: 200,
      startIdx: 0,
      stopIdx: 200,
      entryType: props.elementType,
    } as GenericPayload).then((result) => {
      if ("data" in result) {
        updateAvailableOptions(result.data.list);
      }
      setSearchIsDisabled(false);
    });
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const searchValueData = {
    searchValue: searchValue,
    updateSearchValue: updateSearchValue,
    submitSearchValue: submitSearchValue,
  };

  const listChange = (
    newAvailableOptions: ReactNode[],
    newChosenOptions: ReactNode[]
  ) => {
    // Only "message" options are actually react nodes,
    // revise the lists as needed.
    for (let idx = 0; idx < newChosenOptions.length; idx++) {
      // if not typeof string, remove from list
      if (typeof newChosenOptions[idx] !== "string") {
        return;
      }
    }
    let newNewAvailOptions: string[] = [];
    for (let idx = 0; idx < newAvailableOptions.length; idx++) {
      // Revise avail list to only includue valid string options
      if (typeof newAvailableOptions[idx] === "string") {
        const option = newAvailableOptions[idx] as string;
        newNewAvailOptions.push(option);
      }
    }

    setAvailableOptions(newNewAvailOptions.sort() as string[]);
    setChosenOptions(newChosenOptions.sort() as string[]);
    // The recently added entries are removed from the available data options
    props.updateAvailableData(newNewAvailOptions.sort());
  };

  let availOptions;
  if (availableOptions.length === 0) {
    // No option, should display some info about this
    if (searchValue === "") {
      availOptions = [initialList];
    }
  } else {
    availOptions = availableOptions;
  }

  const fields = [
    {
      id: "dual-list-search",
      pfComponent: (
        <SearchInputLayout
          name="search"
          ariaLabel="Search dual select list"
          placeholder="Search for entries"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
    },
    {
      id: "dual-list-selector",
      pfComponent: (
        <DualListSelector
          availableOptions={availOptions}
          chosenOptions={chosenOptions}
          onListChange={(
            _event,
            newAvailableOptions: ReactNode[],
            newChosenOptions: ReactNode[]
          ) => listChange(newAvailableOptions, newChosenOptions)}
          id="basicSelectorWithSearch"
        />
      ),
    },
  ];

  // When clean data, set to original values
  const cleanData = () => {
    setAvailableOptions([]);
    setChosenOptions([]);
    props.updateSelectedElements([]);
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanData();
    props.onCloseModal();
  };

  // Buttons are disabled until all the required fields are filled
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (chosenOptions.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [chosenOptions]);

  // Add element to the list
  const addElementToList = () => {
    const itemsToAdd: string[] = [];
    chosenOptions.map((opt) => {
      if (opt !== undefined && opt !== null) {
        itemsToAdd.push(opt.toString());
      }
    });
    props.updateTableElementsList(itemsToAdd);
    props.updateSelectedElements([]);
    cleanAndCloseModal();
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      key={"add-new-" + props.elementType}
      isDisabled={buttonDisabled}
      form="modal-form"
      onClickHandler={addElementToList}
    >
      Add
    </SecondaryButton>,
    <Button
      key={"cancel-new-" + props.elementType}
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      title={
        "Allow " +
        props.elementType +
        "s to " +
        props.operationType +
        " keytab for " +
        props.host
      }
      formId={
        props.operationType + "-keytab-" + props.elementType + "s-add-modal"
      }
      fields={fields}
      show={props.showModal}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default CreateKeytabElementsAddModal;
