import React, { ReactNode, useEffect, useState } from "react";
// PatternFly
import { Button, DualListSelector } from "@patternfly/react-core";
// Layout
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
//Icons
import InfoCircleIcon from "@patternfly/react-icons/dist/esm/icons/info-circle-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";
// RPC client
import { useGetIDListMutation, GenericPayload } from "src/services/rpc";

interface PropsToAddModal {
  entry: string;
  target: "user" | "group" | "host" | "hostgroup" | "netgroup";
  showModal: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
  spinning: boolean;
  title: string;
  addBtnName: string;
  addSpinningBtnName: string;
  // Action (non-table update)
  action?: (items: string[]) => void;
  // Table updates
  tableElementsList?: string[];
  clearSelectedEntries?: () => void;
  updateTableElementsList?: (newTableElementsList: string[]) => void;
}

// Dual list layout for updating an existing table, or for performing actions
// against entries
const DualListTableLayout = (props: PropsToAddModal) => {
  // Dual list selector
  const initialList = (
    <div>
      <InfoCircleIcon className="pf-v5-u-info-color-100 pf-v5-u-mr-sm" /> Enter
      a value in the search field
    </div>
  );

  const [availableOptions, setAvailableOptions] = useState<
    string[] | ReactNode[]
  >([initialList]);
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
    let filterData: string[] = newList;
    if (props.tableElementsList !== undefined) {
      const list = props.tableElementsList;
      filterData = newList.filter((item) => {
        if (item === props.entry) {
          return false;
        }
        return !list.some((itm) => {
          return item === itm;
        });
      });
    }

    // Filter out options that have already been chosen
    let cleanList = filterData.filter((item) => {
      return !chosenOptions.some((itm) => {
        return item === itm || item === props.entry;
      });
    });

    let emptyList;
    if (cleanList.length === 0) {
      emptyList = (
        <div id="disabled">
          <ExclamationTriangleIcon className="pf-v5-u-warning-color-100 pf-v5-u-mr-sm" />{" "}
          No matching results
        </div>
      );
      cleanList = [emptyList];
    }

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
      entryType: props.target,
    } as GenericPayload).then((result) => {
      if (result && "data" in result) {
        updateAvailableOptions(result.data.list);
      } else {
        updateAvailableOptions([]);
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
    const newAvailOptions: string[] = [];
    for (let idx = 0; idx < newAvailableOptions.length; idx++) {
      // Revise avail list to only include valid string options
      if (typeof newAvailableOptions[idx] === "string") {
        const option = newAvailableOptions[idx] as string;
        newAvailOptions.push(option);
      }
    }

    setAvailableOptions(newAvailOptions.sort() as string[]);
    setChosenOptions(newChosenOptions.sort() as string[]);
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
  const doAction = () => {
    const itemsToAdd: string[] = [];
    chosenOptions.map((opt) => {
      if (opt !== undefined && opt !== null) {
        itemsToAdd.push(opt.toString());
      }
    });
    // Action update
    if (props.action) {
      props.action(itemsToAdd);
    }
    // Table updates
    if (props.updateTableElementsList) {
      props.updateTableElementsList(itemsToAdd);
    }
    if (props.clearSelectedEntries) {
      props.clearSelectedEntries();
    }
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      key={"dual-list-" + props.target}
      isDisabled={buttonDisabled || props.spinning}
      form="modal-form"
      onClickHandler={doAction}
      spinnerAriaValueText={props.addSpinningBtnName}
      spinnerAriaLabel={props.addSpinningBtnName}
      isLoading={props.spinning}
    >
      {props.spinning ? props.addSpinningBtnName : props.addBtnName}
    </SecondaryButton>,
    <Button
      key={"cancel-new-" + props.target}
      variant="link"
      onClick={props.onCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      title={props.title}
      formId={"dual-list-" + props.target + "-modal"}
      fields={fields}
      show={props.showModal}
      onClose={props.onCloseModal}
      actions={modalActions}
    />
  );
};

export default DualListTableLayout;
