import React from "react";
// PatternFly
import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";

export interface InputWithHelperTextProps {
  dataCy: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  requiredHelperText?: string;
}

const InputWithHelperText = (props: InputWithHelperTextProps) => {
  const helperTextId = `${props.id}-helper`;

  return (
    <>
      <TextInput
        data-cy={props.dataCy}
        id={props.id}
        name={props.name}
        value={props.value}
        type="text"
        isRequired={props.isRequired}
        aria-label={props.name}
        aria-describedby={helperTextId}
        onChange={(_event, value) => props.onChange(value)}
      />
      <FormHelperText>
        {props.isRequired && props.value === "" ? (
          <HelperText id={helperTextId} aria-live="polite">
            <HelperTextItem variant={ValidatedOptions.default}>
              {props.requiredHelperText || "This field is required"}
            </HelperTextItem>
          </HelperText>
        ) : null}
      </FormHelperText>
    </>
  );
};

export default InputWithHelperText;
