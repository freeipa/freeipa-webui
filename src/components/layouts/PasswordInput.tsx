/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import {
  Button,
  InputGroup,
  TextInput,
  InputGroupItem,
} from "@patternfly/react-core";
import EyeSlashIcon from "@patternfly/react-icons/dist/esm/icons/eye-slash-icon";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";

interface PropsToPasswordInput {
  classname?: string;
  name?: string;
  id?: string;
  value?: string;
  passwordHidden?: boolean | true;
  onFocus?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onChange: (value: string) => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onRevealHandler: (value: boolean) => void;
  validated?: "success" | "warning" | "error" | "default";
  isRequired?: boolean;
  isDisabled?: boolean;
}

// Note - onChange function should trigger validation check (validated prop)

const PasswordInput = (props: PropsToPasswordInput) => {
  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          type={props.passwordHidden ? "password" : "text"}
          id={props.id}
          name={props.name}
          value={props.value}
          onFocus={props.onFocus}
          onChange={(_event, value) => props.onChange(value)}
          validated={props.validated}
        />
      </InputGroupItem>
      <InputGroupItem>
        <Button
          variant="control"
          onClick={() => props.onRevealHandler(!props.passwordHidden)}
          aria-label={props.passwordHidden ? "Show password" : "Hide password"}
        >
          {props.passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
        </Button>
      </InputGroupItem>
    </InputGroup>
  );
};

export default PasswordInput;
