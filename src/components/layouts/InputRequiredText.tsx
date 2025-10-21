import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
import HelperTextWithIcon from "./HelperTextWithIcon";

interface InputRequiredTextProps {
  dataCy: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  requiredHelperText?: string;
  isDisabled?: boolean;
}

const InputRequiredText = (props: InputRequiredTextProps) => {
  const helperTextId = `${props.id}-helper`;

  return (
    <>
      <TextInput
        data-cy={props.dataCy}
        id={props.id}
        name={props.name}
        value={props.value}
        type="text"
        isRequired={true}
        aria-label={props.name}
        aria-describedby={helperTextId}
        onChange={(_event, value) => props.onChange(value)}
        isDisabled={props.isDisabled}
      />
      {props.value === "" && !props.isDisabled && (
        <HelperTextWithIcon
          message={props.requiredHelperText || "This field is required"}
        />
      )}
    </>
  );
};

export default InputRequiredText;
