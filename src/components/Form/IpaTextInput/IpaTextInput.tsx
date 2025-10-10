import React from "react";
// PatternFly
import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from "@patternfly/react-core";
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";

export interface IpaTextInputProps extends IPAParamDefinition {
  dataCy: string;
  // Validation state to control helper text visibility and aria-invalid
  validationState?: "default" | "success" | "warning" | "error";
  // IDs/messages for helper text when shown
  helperTextMessage?: string;
  errorMessage?: string;
}

const IpaTextInput = (props: IpaTextInputProps) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);
  const inputValidation = React.useMemo<
    "default" | "success" | "warning" | "error"
  >(() => {
    if (value === "") return "default";
    if (value === "johndoe") return "error";
    return "success";
  }, [value]);

  const [textInputValue, setTextInputValue] = React.useState<string>(
    convertToString(value)
  );

  React.useEffect(() => {
    setTextInputValue(convertToString(value));
  }, [value]);

  const helperTextId = props.helperTextMessage
    ? `${props.helperTextMessage}-helper`
    : undefined;

  return (
    <>
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
        readOnlyVariant={readOnly ? "plain" : undefined}
        aria-describedby={helperTextId}
        aria-invalid={inputValidation === "error"}
      />
      <FormHelperText>
        {props.helperTextMessage && (
          <HelperText id={helperTextId} aria-live="polite">
            {inputValidation !== "success" && (
              <HelperTextItem
                variant={
                  inputValidation as "default" | "success" | "warning" | "error"
                }
              >
                {inputValidation === "default"
                  ? props.helperTextMessage
                  : props.errorMessage}
              </HelperTextItem>
            )}
          </HelperText>
        )}
      </FormHelperText>
    </>
  );
};

export default IpaTextInput;
