import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";
// Layout helpers
import InputRequiredText from "src/components/layouts/InputRequiredText";
import InputWithValidation, {
  RuleProps,
} from "src/components/layouts/InputWithValidation";

export interface IpaTextInputProps extends IPAParamDefinition {
  dataCy: string;
  helperTextMessage?: string;
  errorMessage?: string;
  rules?: Array<RuleProps>;
}

const IpaTextInput = (props: IpaTextInputProps) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);

  const [textInputValue, setTextInputValue] = React.useState<string>(
    convertToString(value)
  );

  React.useEffect(() => {
    setTextInputValue(convertToString(value));
  }, [value]);

  if (readOnly) {
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
        aria-label={
          props.ariaLabel !== undefined ? props.ariaLabel : props.name
        }
        isRequired={required}
        readOnlyVariant={"plain"}
      />
    );
  }

  if (props.rules && props.rules.length > 0) {
    return (
      <InputWithValidation
        dataCy={props.dataCy}
        id={props.name}
        name={props.name}
        value={textInputValue}
        onChange={(value) => {
          setTextInputValue(value);
          onChange(value);
        }}
        isRequired={required}
        isDisabled={false}
        rules={props.rules}
        type="text"
      />
    );
  }

  if (required) {
    return (
      <InputRequiredText
        dataCy={props.dataCy}
        id={props.name}
        name={props.name}
        value={textInputValue}
        onChange={(value) => {
          setTextInputValue(value);
          onChange(value);
        }}
        isDisabled={false}
        requiredHelperText={props.helperTextMessage}
        type="text"
      />
    );
  }

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
    />
  );
};

export default IpaTextInput;
