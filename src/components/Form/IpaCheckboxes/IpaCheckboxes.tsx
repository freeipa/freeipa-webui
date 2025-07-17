import React from "react";
// PatternFly
import { Checkbox } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  toArray,
} from "src/utils/ipaObjectUtils";
import { updateCheckboxList as updateListUtil } from "src/utils/ipaObjectUtils";

interface CheckboxOption {
  value: string;
  text: string;
}

export interface IPAParamDefinitionCheckboxes extends IPAParamDefinition {
  dataCy: string;
  options: CheckboxOption[];
}

const IpaCheckboxes = (props: IPAParamDefinitionCheckboxes) => {
  const { required, readOnly, value } = getParamProperties(props);

  const valueAsArray = toArray(value).filter(
    (val): val is string => val !== undefined
  );

  // Updates the list of checked values when a specific checkbox is clicked
  //  - This is implemented here because we need to know which specific
  //     value (option.value) to add/remove from the list
  const updateList = (checked: boolean, elementToChange: string) => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      updateListUtil(
        checked,
        elementToChange,
        valueAsArray,
        props.ipaObject,
        props.onChange,
        props.name
      );
    }
  };

  return (
    <>
      {props.options.map((option, idx) => (
        <Checkbox
          data-cy={props.dataCy + "-" + option.value}
          key={props.name + "-" + option.value}
          id={props.name + "-" + option.value} // Mandatory
          name={props.name}
          label={option.text}
          onChange={(_event, checked) => updateList(checked, option.value)}
          isRequired={required}
          readOnly={readOnly}
          isChecked={
            valueAsArray.find((val) => val === option.value) !== undefined
          }
          aria-label={props.name}
          className={
            idx !== props.options.length - 1
              ? "pf-v5-u-mt-xs pf-v5-u-mb-sm"
              : ""
          }
          isDisabled={readOnly}
        />
      ))}
    </>
  );
};

export default IpaCheckboxes;
