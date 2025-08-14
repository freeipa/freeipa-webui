import React from "react";
import {
  DualListSelector,
  DualListSelectorPane,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorControlsWrapper,
  DualListSelectorControl,
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
}

// Helper function: Parse data to 'DualListOption'
export const optionsToDualListOptions = (
  options: string[]
): DualListOption[] => {
  return options.map((option) => ({
    text: option,
    selected: false,
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
      if (option.selected) {
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
      setChosenOptions([...availableOptions, ...chosenOptions]);
      setAvailableOptions([]);
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
    >
      <DualListSelectorPane
        title={props.availableOptionsTitle || "Available options"}
        status={`${availableOptions.filter((option) => option.selected).length} of ${
          availableOptions.length
        } options selected`}
      >
        <DualListSelectorList>
          {availableOptions.map((option, index) => (
            <DualListSelectorListItem
              key={index}
              isSelected={option.selected}
              id={`basic-available-option-${index}`}
              onOptionSelect={(e) => onOptionSelect(e, index, false)}
            >
              {option.text}
            </DualListSelectorListItem>
          ))}
        </DualListSelectorList>
      </DualListSelectorPane>
      <DualListSelectorControlsWrapper>
        <DualListSelectorControl
          isDisabled={!availableOptions.some((option) => option.selected)}
          onClick={() => moveSelected(true)}
          aria-label="Add selected"
          icon={<AngleRightIcon />}
        />
        <DualListSelectorControl
          isDisabled={availableOptions.length === 0}
          onClick={() => moveAll(true)}
          aria-label="Add all"
          icon={<AngleDoubleRightIcon />}
        />
        <DualListSelectorControl
          isDisabled={chosenOptions.length === 0}
          onClick={() => moveAll(false)}
          aria-label="Remove all"
          icon={<AngleDoubleLeftIcon />}
        />
        <DualListSelectorControl
          onClick={() => moveSelected(false)}
          isDisabled={!chosenOptions.some((option) => option.selected)}
          aria-label="Remove selected"
          icon={<AngleLeftIcon />}
        />
      </DualListSelectorControlsWrapper>
      <DualListSelectorPane
        title={props.chosenOptionsTitle || "Chosen options"}
        status={`${chosenOptions.filter((option) => option.selected).length} of ${
          chosenOptions.length
        } options selected`}
        isChosen
      >
        <DualListSelectorList>
          {chosenOptions.map((option, index) => (
            <DualListSelectorListItem
              key={index}
              isSelected={option.selected}
              id={`composable-basic-chosen-option-${index}`}
              onOptionSelect={(e) => onOptionSelect(e, index, true)}
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
