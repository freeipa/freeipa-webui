import React from "react";
import { Checkbox, Flex, FlexItem } from "@patternfly/react-core";

export interface CheckboxListProps {
  dataCy: string;
  name: string;
  options: string[];
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  isDisabled?: boolean;
}

const CheckboxList = (props: CheckboxListProps) => {
  const updateSelection = (checked: boolean, value: string) => {
    const updatedList = [...props.selectedValues];
    if (checked) {
      updatedList.push(value);
    } else {
      const index = updatedList.indexOf(value);
      if (index > -1) {
        updatedList.splice(index, 1);
      }
    }
    props.setSelectedValues(updatedList);
  };

  return (
    <Flex direction={{ default: "column" }} data-cy={props.dataCy}>
      {props.options.map((option) => (
        <FlexItem key={props.name + "-" + option}>
          <Checkbox
            data-cy={props.dataCy + "-" + option}
            id={props.name + "-" + option}
            name={props.name}
            label={option.charAt(0).toUpperCase() + option.slice(1)}
            onChange={(_event, checked) => updateSelection(checked, option)}
            isChecked={props.selectedValues.includes(option)}
            aria-label={option}
            isDisabled={props.isDisabled}
          />
        </FlexItem>
      ))}
    </Flex>
  );
};

export default CheckboxList;
