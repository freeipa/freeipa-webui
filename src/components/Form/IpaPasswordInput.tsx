import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";
import { HIDDEN_PASSWORD } from "src/utils/utils";

const IpaPasswordInput = (props: IPAParamDefinition) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);

  const [textInputValue, setTextInputValue] = React.useState<string>(
    convertToString(value)
  );

  // Parse the value to be shown in the input field
  // - Some passwords are encoded, so those must be shown as hidden
  // - Undefined passwords must be shown as empty
  React.useEffect(() => {
    console.log("value", value);
    console.log("typeof value", typeof value);
    if (typeof value === "object") {
      setTextInputValue(HIDDEN_PASSWORD);
    } else if (typeof value === "undefined") {
      setTextInputValue("");
    } else {
      setTextInputValue(convertToString(value));
    }
  }, [value]);

  return (
    <TextInput
      type="password"
      id={props.name}
      name={props.name}
      value={textInputValue}
      onChange={(_event, value) => {
        setTextInputValue(value);
        onChange(value);
      }}
      aria-label={props.ariaLabel !== undefined ? props.ariaLabel : props.name}
      isRequired={required}
      readOnlyVariant={readOnly ? "plain" : undefined}
    />
  );
};

export default IpaPasswordInput;
