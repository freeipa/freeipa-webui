import React, { ReactNode, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Button,
  FormGroup,
  TextInput,
  DualListSelectorPane,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorControlsWrapper,
  DualListSelectorControl,
  DualListSelector,
} from "@patternfly/react-core";
// Layout
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
//Icons
import {
  AngleRightIcon,
  AngleDoubleRightIcon,
  AngleDoubleLeftIcon,
  AngleLeftIcon,
  InfoCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@patternfly/react-icons";
// RPC client
import { useGetIDListMutation, GenericPayload } from "src/services/rpc";

export type DualListTarget =
  | "user"
  | "group"
  | "host"
  | "hostgroup"
  | "netgroup"
  | "hbacsvc"
  | "hbacsvcgroup"
  | "sudorule"
  | "sudocmd"
  | "sudocmdgroup";

export interface DualListProps {
  entry: string;
  target: DualListTarget;
  showModal: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
  spinning: boolean;
  title: string;
  addBtnName: string;
  addSpinningBtnName: string;
  action: (items: string[]) => void;
  tableElementsList: string[];
  availableOptions?: string[];
  addExternalsOption?: boolean;
}

const searchItem = (onClick?: () => void) => {
  return (
    <DualListSelectorListItem
      key={"search"}
      data-cy={"item-search"}
      onClick={onClick}
      /* Omitting this will throw an error when selected */
      onOptionSelect={() => {}}
    >
      <div key="initial-list" data-cy="dual-list-search-link">
        <InfoCircleIcon className="pf-v6-u-info-color-100 pf-v6-u-mr-sm" />{" "}
        Click here, or use the search field to find entries
      </div>
    </DualListSelectorListItem>
  );
};

const searchingItem = () => {
  return (
    <DualListSelectorListItem
      key={"searching"}
      data-cy={"item-searching"}
      /* Omitting this will throw an error when selected */
      onOptionSelect={() => {}}
    >
      <div>
        <InfoCircleIcon className="pf-v6-u-info-color-100 pf-v6-u-mr-sm" />{" "}
        Searching ...
      </div>
    </DualListSelectorListItem>
  );
};

const emptyItem = () => {
  return (
    <DualListSelectorListItem
      key={"empty"}
      data-cy={"item-empty"}
      /* Omitting this will throw an error when selected */
      onOptionSelect={() => {}}
    >
      <div id="disabled" data-cy="dual-list-no-matching-results">
        <ExclamationTriangleIcon className="pf-v6-u-warning-color-100 pf-v6-u-mr-sm" />{" "}
        No matching results
      </div>
    </DualListSelectorListItem>
  );
};

type Status = "toSearch" | "searching" | "empty" | "valid";

interface Item {
  id: string;
  item: string;
  isSelected: boolean;
  dataCy: string;
}

const asItems = (options: string[]): Item[] =>
  options.map((option) => ({
    id: option,
    item: option,
    isSelected: false,
    dataCy: `item-${option}`,
  }));

// Dual list layout for updating an existing table, or for performing actions
// against entries
const DualListTableLayoutInner = (props: DualListProps) => {
  const [availableOptions, setAvailableOptions] = useState<Item[]>(
    asItems(props.availableOptions ?? [])
  );
  const [chosenOptions, setChosenOptions] = useState<Item[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>(
    props.availableOptions !== undefined ? "valid" : "toSearch"
  );

  const updateAvailableOptions = (newList: string[]) => {
    const filterData = newList.filter((item) => {
      if (item === props.entry) {
        return false;
      }
      return !props.tableElementsList.includes(item);
    });

    // Filter out options that have already been chosen
    const cleanList = filterData.filter((item) => {
      return !chosenOptions.some((itm) => {
        return item === itm.item || item === props.entry;
      });
    });

    if (cleanList.length === 0) {
      setStatus("empty");
    } else {
      setAvailableOptions(asItems(cleanList));
      setStatus("valid");
    }
  };

  // Issue a search using a specific search value
  const [retrieveIDs] = useGetIDListMutation({});
  const submitSearchValue = () => {
    setSearchIsDisabled(true);
    if (props.availableOptions === undefined) {
      retrieveIDs({
        searchValue: props.availableOptions || searchValue,
        sizeLimit: 200,
        startIdx: 0,
        stopIdx: 200,
        entryType: props.target,
      } as GenericPayload).then((result) => {
        if (result && "data" in result) {
          if (result.data && result.data.list) {
            updateAvailableOptions(result.data.list);
          } else {
            updateAvailableOptions([]);
          }
        } else {
          updateAvailableOptions([]);
        }
        setSearchIsDisabled(false);
      });
    } else {
      updateAvailableOptions(props.availableOptions);
      setSearchIsDisabled(false);
    }
  };

  function doSearch() {
    setStatus("searching");
    submitSearchValue();
  }

  const searchValueData = {
    searchValue: searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue: doSearch,
  };

  const onButtonClick = () => {
    props.action(
      chosenOptions
        .map((item) => item.item)
        .filter((item) => item !== null && item !== undefined)
    );
    props.onCloseModal();
  };

  const onOptionSelect = (
    _event: React.MouseEvent | React.ChangeEvent | React.KeyboardEvent,
    index: number,
    isChosen: boolean
  ) => {
    if (isChosen) {
      const newChosen = [...chosenOptions];
      newChosen[index].isSelected = !chosenOptions[index].isSelected;
      setChosenOptions(newChosen);
    } else {
      const newAvailable = [...availableOptions];
      newAvailable[index].isSelected = !availableOptions[index].isSelected;
      setAvailableOptions(newAvailable);
    }
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      dataCy="modal-button-add"
      key={"dual-list-" + props.target}
      isDisabled={chosenOptions.length === 0 || props.spinning}
      form="modal-form"
      onClickHandler={onButtonClick}
      spinnerAriaValueText={props.addSpinningBtnName}
      spinnerAriaLabel={props.addSpinningBtnName}
      isLoading={props.spinning}
    >
      {props.spinning ? props.addSpinningBtnName : props.addBtnName}
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-new-" + props.target}
      variant="link"
      onClick={props.onCloseModal}
    >
      Cancel
    </Button>,
  ];

  const moveSelected = (fromAvailable: boolean) => {
    const sourceOptions = fromAvailable ? availableOptions : chosenOptions;
    const destinationOptions = fromAvailable ? chosenOptions : availableOptions;
    for (let i = 0; i < sourceOptions.length; i++) {
      const option = sourceOptions[i];
      if (option.isSelected) {
        sourceOptions.splice(i, 1);
        destinationOptions.push(option);
        option.isSelected = false;
        i--;
      }
    }

    if (fromAvailable) {
      setAvailableOptions([...sourceOptions]);
      setChosenOptions([...destinationOptions]);
    } else {
      setChosenOptions([...sourceOptions]);
      setAvailableOptions([...destinationOptions]);
    }

    setStatus("valid");
  };

  const moveAll = (fromAvailable: boolean) => {
    availableOptions.forEach((option) => {
      option.isSelected = false;
    });
    chosenOptions.forEach((option) => {
      option.isSelected = false;
    });

    if (fromAvailable) {
      setChosenOptions([...availableOptions, ...chosenOptions]);
      setAvailableOptions([]);
    } else {
      setAvailableOptions([...chosenOptions, ...availableOptions]);
      setChosenOptions([]);
    }

    setStatus("valid");
  };

  const getListItems = (status: Status): ReactNode[] => {
    switch (status) {
      case "toSearch":
        return [searchItem(doSearch)];
      case "searching":
        return [searchingItem()];
      case "empty":
        return [emptyItem()];
      case "valid":
        return availableOptions.map((option, index) => (
          <DualListSelectorListItem
            key={option.id}
            onOptionSelect={(e) => onOptionSelect(e, index, false)}
            isSelected={option.isSelected}
            data-cy={option.dataCy}
          >
            {option.item}
          </DualListSelectorListItem>
        ));
    }
  };

  const getChosenOptionsStatus = (): string => {
    const selectedOptions = chosenOptions.filter((option) => option.isSelected);
    return `${selectedOptions.length} of ${chosenOptions.length} options selected`;
  };

  const getAvailableOptionsStatus = (): string => {
    if (status === "valid") {
      const selectedOptions = availableOptions.filter(
        (option) => option.isSelected
      );
      return `${selectedOptions.length} of ${availableOptions.length} options selected`;
    }
    return "";
  };

  const fields = [
    {
      id: "dual-list-search",
      pfComponent: (
        <SearchInputLayout
          dataCy="modal-search"
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
        <DualListSelector>
          <DualListSelectorPane status={getAvailableOptionsStatus()}>
            <DualListSelectorList>{getListItems(status)}</DualListSelectorList>
          </DualListSelectorPane>
          <DualListSelectorControlsWrapper>
            <DualListSelectorControl
              isDisabled={!availableOptions.some((option) => option.isSelected)}
              onClick={() => moveSelected(true)}
              aria-label="Add selected"
              data-cy="dual-list-add-selected"
            >
              <AngleRightIcon />
            </DualListSelectorControl>
            <DualListSelectorControl
              isDisabled={availableOptions.length === 0}
              onClick={() => moveAll(true)}
              aria-label="Add all"
              data-cy="dual-list-add-all"
            >
              <AngleDoubleRightIcon />
            </DualListSelectorControl>
            <DualListSelectorControl
              isDisabled={chosenOptions.length === 0}
              onClick={() => moveAll(false)}
              aria-label="Remove all"
              data-cy="dual-list-remove-all"
            >
              <AngleDoubleLeftIcon />
            </DualListSelectorControl>
            <DualListSelectorControl
              isDisabled={!chosenOptions.some((option) => option.isSelected)}
              onClick={() => moveSelected(false)}
              aria-label="Remove selected"
              data-cy="dual-list-remove-selected"
            >
              <AngleLeftIcon />
            </DualListSelectorControl>
          </DualListSelectorControlsWrapper>
          <DualListSelectorPane isChosen status={getChosenOptionsStatus()}>
            <DualListSelectorList>
              {chosenOptions.map((option, index) => (
                <DualListSelectorListItem
                  key={option.id}
                  onOptionSelect={(e) => onOptionSelect(e, index, true)}
                  isSelected={option.isSelected}
                  data-cy={option.dataCy}
                >
                  {option.item}
                </DualListSelectorListItem>
              ))}
            </DualListSelectorList>
          </DualListSelectorPane>
        </DualListSelector>
      ),
    },
  ];

  if (props.addExternalsOption) {
    const [externalValue, setExternalValue] = React.useState("");

    const onAddExternalValue = () => {
      setChosenOptions([...chosenOptions, ...asItems([externalValue])]);
      setExternalValue("");
    };

    fields.push({
      id: "form-externals",
      pfComponent: (
        <FormGroup
          label="External"
          fieldId="dual-list-external"
          style={{ width: "45%" }}
        >
          <Flex>
            <FlexItem>
              <TextInput
                data-cy="modal-textbox-external"
                type="text"
                id="dual-list-external"
                name="dual-list-external"
                aria-label="dual list external"
                value={externalValue}
                onChange={(_event, value) => setExternalValue(value)}
              />
            </FlexItem>
            <FlexItem>
              <Button
                data-cy="modal-button-external-add"
                title="Add external item to the chosen list"
                size="sm"
                variant="secondary"
                icon={<ArrowRightIcon />}
                iconPosition="right"
                onClick={onAddExternalValue}
                isDisabled={externalValue === ""}
              >
                Add
              </Button>
            </FlexItem>
          </Flex>
        </FormGroup>
      ),
    });
  }

  // Render component
  return (
    <ModalWithFormLayout
      dataCy="dual-list-modal"
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

const DualListTableLayout = (props: DualListProps) => {
  if (!props.showModal) return null;
  return <DualListTableLayoutInner {...props} />;
};

export default DualListTableLayout;
