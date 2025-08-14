import React from "react";
import {
  DualListSelector,
  DualListSelectorPane,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorControlsWrapper,
  DualListSelectorControl,
} from "@patternfly/react-core";
import AngleDoubleLeftIcon from "@patternfly/react-icons/dist/esm/icons/angle-double-left-icon";
import AngleLeftIcon from "@patternfly/react-icons/dist/esm/icons/angle-left-icon";
import AngleDoubleRightIcon from "@patternfly/react-icons/dist/esm/icons/angle-double-right-icon";
import AngleRightIcon from "@patternfly/react-icons/dist/esm/icons/angle-right-icon";

export interface DualListOption {
  text: string;
  selected: boolean;
  isVisible: boolean;
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
    text: option as string,
    selected: false,
    isVisible: true,
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
      setAvailableOptions([
        ...chosenOptions.filter((option) => option.isVisible),
        ...availableOptions,
      ]);
      setChosenOptions([
        ...chosenOptions.filter((option) => !option.isVisible),
      ]);
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
        status={`${availableOptions.filter((option) => option.selected && option.isVisible).length} of ${
          availableOptions.filter((option) => option.isVisible).length
        } options selected`}
      >
        <DualListSelectorList>
          {availableOptions.map((option, index) =>
            option.isVisible ? (
              <DualListSelectorListItem
                key={option.text.replace(/ /g, "-")}
                isSelected={option.selected}
                id={`basic-available-option-${option.text.replace(/ /g, "-")}`}
                onOptionSelect={(e) => onOptionSelect(e, index, false)}
              >
                {option.text}
              </DualListSelectorListItem>
            ) : null
          )}
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
        status={`${chosenOptions.filter((option) => option.selected && option.isVisible).length} of ${
          chosenOptions.filter((option) => option.isVisible).length
        } options selected`}
        isChosen
      >
        <DualListSelectorList>
          {chosenOptions.map((option, index) =>
            option.isVisible ? (
              <DualListSelectorListItem
                key={option.text.replace(/ /g, "-")}
                isSelected={option.selected}
                id={`composable-basic-chosen-option-${option.text.replace(/ /g, "-")}`}
                onOptionSelect={(e) => onOptionSelect(e, index, true)}
              >
                {option.text}
              </DualListSelectorListItem>
            ) : null
          )}
        </DualListSelectorList>
      </DualListSelectorPane>
    </DualListSelector>
  );
};

export default DualListSelectorGeneric;
