import React from "react";
import {
  DualListSelector,
  DualListSelectorPane,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorControlsWrapper,
  DualListSelectorControl,
  SearchInput,
} from "@patternfly/react-core";
import {
  AngleDoubleLeftIcon,
  AngleLeftIcon,
  AngleDoubleRightIcon,
  AngleRightIcon,
} from "@patternfly/react-icons";

export interface DualListOption {
  text: string;
  selected: boolean;
  isVisible: boolean;
  dataCy: string;
}

interface DualListGenericProps {
  id: string;
  availableOptions: DualListOption[];
  setAvailableOptions: (options: DualListOption[]) => void;
  chosenOptions: DualListOption[];
  setChosenOptions: (options: DualListOption[]) => void;
  availableOptionsTitle?: string;
  chosenOptionsTitle?: string;
  ariaLabel?: string;
  isSearchable?: boolean;
  onSearchTextChange?: (searchText: string) => void;
}

// Helper function: Parse data to 'DualListOption'
export const optionsToDualListOptions = (
  options: string[]
): DualListOption[] => {
  return options.map((option) => ({
    text: option,
    selected: false,
    isVisible: true,
    dataCy: `item-${option}`,
  }));
};

const DualListSelectorGeneric = (props: DualListGenericProps) => {
  // Destructure props
  const {
    availableOptions,
    setAvailableOptions,
    chosenOptions,
    setChosenOptions,
  } = props;

  const [availableFilter, setAvailableFilter] = React.useState("");

  const onInputChange = (value: string) => {
    setAvailableFilter(value);
    if (!props.onSearchTextChange) {
      const toFilter = [...availableOptions];
      toFilter.forEach((option) => {
        option.isVisible =
          value === "" ||
          option.text.toLowerCase().includes(value.toLowerCase());
      });
      setAvailableOptions(toFilter);
    }
  };

  const onSubmitSearch = (value: string) => {
    if (props.onSearchTextChange) {
      props.onSearchTextChange(value);
    }
  };

  // callback for moving selected options between lists
  const moveSelected = (fromAvailable: boolean) => {
    const sourceOptions = fromAvailable
      ? props.availableOptions
      : chosenOptions;
    const destinationOptions = fromAvailable
      ? chosenOptions
      : props.availableOptions;
    for (let i = 0; i < sourceOptions.length; i++) {
      const option = sourceOptions[i];
      if (option.selected && option.isVisible) {
        sourceOptions.splice(i, 1);
        destinationOptions.push(option);
        option.selected = false;
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
  };

  // callback for moving all options between lists
  const moveAll = (fromAvailable: boolean) => {
    if (fromAvailable) {
      setChosenOptions([
        ...availableOptions.filter((option) => option.isVisible),
        ...chosenOptions,
      ]);
      setAvailableOptions([
        ...availableOptions.filter((option) => !option.isVisible),
      ]);
    } else {
      setAvailableOptions([...chosenOptions, ...availableOptions]);
      setChosenOptions([]);
    }
  };

  // callback when option is selected
  const onOptionSelect = (
    event: React.MouseEvent | React.ChangeEvent | React.KeyboardEvent,
    index: number,
    isChosen: boolean
  ) => {
    if (isChosen) {
      const newChosen = [...chosenOptions];
      newChosen[index].selected = !chosenOptions[index].selected;
      setChosenOptions(newChosen);
    } else {
      const newAvailable = [...availableOptions];
      newAvailable[index].selected = !availableOptions[index].selected;
      setAvailableOptions(newAvailable);
    }
  };

  return (
    <DualListSelector
      id={props.id}
      aria-label={props.ariaLabel || "Dual list selector"}
      data-cy="dual-list-selector"
    >
      <DualListSelectorPane
        title={props.availableOptionsTitle || "Available options"}
        status={`${availableOptions.filter((option) => option.selected && option.isVisible).length} of ${
          availableOptions.filter((option) => option.isVisible).length
        } options selected`}
        searchInput={
          props.isSearchable ? (
            <SearchInput
              value={availableFilter}
              onChange={(_event, value) => onInputChange(value)}
              onSearch={(_event, value) => onSubmitSearch(value)}
              onClear={() => {
                onInputChange("");
                onSubmitSearch("");
              }}
              aria-label="Search available options"
              data-cy="dual-list-available-search"
            />
          ) : undefined
        }
        data-cy="dual-list-left"
      >
        <DualListSelectorList>
          {availableOptions.map((option, index) =>
            option.isVisible ? (
              <DualListSelectorListItem
                key={index}
                isSelected={option.selected}
                id={`basic-available-option-${index}`}
                onOptionSelect={(e) => onOptionSelect(e, index, false)}
                data-cy={option.dataCy}
              >
                {option.text}
              </DualListSelectorListItem>
            ) : null
          )}
        </DualListSelectorList>
      </DualListSelectorPane>
      <DualListSelectorControlsWrapper>
        <DualListSelectorControl
          isDisabled={
            !availableOptions.some(
              (option) => option.selected && option.isVisible
            )
          }
          onClick={() => moveSelected(true)}
          aria-label="Add selected"
          data-cy="dual-list-add-selected"
          icon={<AngleRightIcon />}
        />
        <DualListSelectorControl
          isDisabled={
            availableOptions.filter((option) => option.isVisible).length === 0
          }
          onClick={() => moveAll(true)}
          aria-label="Add all"
          data-cy="dual-list-add-all"
          icon={<AngleDoubleRightIcon />}
        />
        <DualListSelectorControl
          isDisabled={chosenOptions.length === 0}
          onClick={() => moveAll(false)}
          aria-label="Remove all"
          data-cy="dual-list-remove-all"
          icon={<AngleDoubleLeftIcon />}
        />
        <DualListSelectorControl
          onClick={() => moveSelected(false)}
          isDisabled={!chosenOptions.some((option) => option.selected)}
          aria-label="Remove selected"
          data-cy="dual-list-remove-selected"
          icon={<AngleLeftIcon />}
        />
      </DualListSelectorControlsWrapper>
      <DualListSelectorPane
        title={props.chosenOptionsTitle || "Chosen options"}
        status={`${chosenOptions.filter((option) => option.selected).length} of ${
          chosenOptions.length
        } options selected`}
        isChosen
        data-cy="dual-list-right"
      >
        <DualListSelectorList>
          {chosenOptions.map((option, index) => (
            <DualListSelectorListItem
              key={index}
              isSelected={option.selected}
              id={`composable-basic-chosen-option-${index}`}
              onOptionSelect={(e) => onOptionSelect(e, index, true)}
              data-cy={option.dataCy}
            >
              {option.text}
            </DualListSelectorListItem>
          ))}
        </DualListSelectorList>
      </DualListSelectorPane>
    </DualListSelector>
  );
};

export default DualListSelectorGeneric;
