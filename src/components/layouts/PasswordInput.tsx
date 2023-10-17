/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import { Button, InputGroup, TextInput } from "@patternfly/react-core";
import EyeSlashIcon from "@patternfly/react-icons/dist/esm/icons/eye-slash-icon";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";

interface PropsToPasswordInput {
  classname?: string;
  name?: string;
  id?: string;
  value?: string;
  passwordHidden?: boolean | true;
  onFocus?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onChange?: (value: string) => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onRevealHandler: (value: boolean) => void;
  validated?: "success" | "warning" | "error" | "default";
}

// Note - onChange function should trigger validation check (validated prop)

const PasswordInput = (props: PropsToPasswordInput) => {
  return (
    <InputGroup>
      <TextInput
        type={props.passwordHidden ? "password" : "text"}
        id={props.id}
        name={props.name}
        value={props.value}
        onFocus={props.onFocus}
        onChange={props.onChange}
        validated={props.validated}
      />
      <Button
        variant="control"
        onClick={() => props.onRevealHandler(!props.passwordHidden)}
        aria-label={props.passwordHidden ? "Show password" : "Hide password"}
      >
        {props.passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
      </Button>
    </InputGroup>
  );
};

export default PasswordInput;
