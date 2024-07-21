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
  textNode?: React.ReactNode;
  className?: string;
  altTrue?: string; // Alternate True value
  altFalse?: string; // Alternate False value
}

const IpaCheckbox = (props: CheckboxOption) => {
  const { required, readOnly, value } = getParamProperties(props);

  const handleChange = (checked: boolean) => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      let value = checked.toString();

      if (props.altTrue && checked) {
        value = props.altTrue;
      } else if (props.altFalse !== undefined && !checked) {
        value = props.altFalse;
      }

      updateIpaObject(props.ipaObject, props.onChange, value, props.name);
    }
  };

  const checked =
    value &&
    ((typeof value === "string" &&
      (value.toLowerCase() === "true" ||
        (props.altTrue && props.altTrue === value))) ||
      value === true)
      ? true
      : false;

  return (
    <Checkbox
      id={props.name + "-" + props.value}
      className={props.className}
      name={props.name}
      label={props.textNode ? props.textNode : props.text}
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
