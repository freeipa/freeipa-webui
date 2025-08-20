import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";

export interface IpaTextInputProps extends IPAParamDefinition {
  dataCy: string;
}

const IpaTextInput = (props: IpaTextInputProps) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);

  const [textInputValue, setTextInputValue] = React.useState<string>(
    convertToString(value)
  );

  React.useEffect(() => {
    setTextInputValue(convertToString(value));
  }, [value]);

  return (
    <TextInput
      data-cy={props.dataCy}
      id={props.name}
      name={props.name}
      value={textInputValue}
      onChange={(_event, value) => {
        setTextInputValue(value);
        onChange(value);
      }}
      type="text"
      aria-label={props.ariaLabel !== undefined ? props.ariaLabel : props.name}
      isRequired={required}
      readOnlyVariant={readOnly ? "plain" : undefined}
    />
  );
};

export default IpaTextInput;
