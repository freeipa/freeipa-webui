import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";

const IpaPasswordInput = (props: IPAParamDefinition) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);

  const [textInputValue, setTextInputValue] = React.useState<string>(
    convertToString(value)
  );

  React.useEffect(() => {
    setTextInputValue(convertToString(value));
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
