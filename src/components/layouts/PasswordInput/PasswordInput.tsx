import React from "react";
// PatternFly
import {
  Button,
  InputGroup,
  TextInput,
  InputGroupItem,
} from "@patternfly/react-core";
import { EyeSlashIcon } from "@patternfly/react-icons";
import { EyeIcon } from "@patternfly/react-icons";

export interface PropsToPasswordInput {
  dataCy: string;
  ariaLabel?: string;
  name?: string;
  id?: string;
  value?: string;
  passwordHidden?: boolean;
  onFocus?: React.MouseEventHandler<HTMLButtonElement>;
  onChange: (value: string) => void;
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
          data-cy={props.dataCy}
          aria-label={props.ariaLabel ?? props.name}
          type={props.passwordHidden ? "password" : "text"}
          id={props.id}
          name={props.name}
          value={props.value}
          onFocus={props.onFocus}
          onChange={(_event, value) => props.onChange(value)}
          validated={props.validated}
          required={props.isRequired || false}
          isDisabled={props.isDisabled || false}
        />
      </InputGroupItem>
      <InputGroupItem>
        <Button
          data-cy={props.dataCy + "-reveal-button"}
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
