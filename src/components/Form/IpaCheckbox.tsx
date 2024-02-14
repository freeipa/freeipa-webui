import React from "react";
// PatternFly
import { Checkbox } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "../../utils/ipaObjectUtils";

interface CheckboxOption extends IPAParamDefinition {
  value: string;
  text: string;
}

const IpaCheckbox = (props: CheckboxOption) => {
  const { required, readOnly, value } = getParamProperties(props);

  const handleChange = (checked: boolean) => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      updateIpaObject(
        props.ipaObject,
        props.onChange,
        checked.toString(),
        props.name
      );
    }
  };

  const checked =
    value && typeof value === "string" && value.toLowerCase() === "true"
      ? true
      : false;

  return (
    <Checkbox
      id={props.name + "-" + props.value}
      name={props.name}
      label={props.text}
      aria-label={props.name}
      isRequired={required}
      readOnly={readOnly}
      isDisabled={readOnly}
      isChecked={checked}
      onChange={(_event, checked) => handleChange(checked)}
    />
  );
};

export default IpaCheckbox;
