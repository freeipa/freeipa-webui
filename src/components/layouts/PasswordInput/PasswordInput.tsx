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
// Layout helpers
import InputRequiredText from "src/components/layouts/InputRequiredText";
import InputWithValidation, {
  RuleProps,
} from "src/components/layouts/InputWithValidation";

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
  // Optional validation rules to enable helper messages rendering
  rules?: Array<RuleProps>;
  requiredHelperText?: string;
}

// Note - onChange function should trigger validation check (validated prop)

const RevealButton = (props: {
  dataCy: string;
  passwordHidden?: boolean;
  onRevealHandler: (value: boolean) => void;
}) => (
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
);

const PasswordInput = (props: PropsToPasswordInput) => {
  if (props.rules && props.rules.length > 0) {
    return (
      <InputGroup>
        <div className="pf-v6-u-display-block">
          <InputWithValidation
            dataCy={props.dataCy}
            id={props.id as string}
            name={props.name as string}
            value={props.value || ""}
            onChange={props.onChange}
            isRequired={props.isRequired}
            isDisabled={props.isDisabled}
            rules={props.rules!}
            type={props.passwordHidden ? "password" : "text"}
          />
        </div>
        <RevealButton
          dataCy={props.dataCy}
          passwordHidden={props.passwordHidden}
          onRevealHandler={props.onRevealHandler}
        />
      </InputGroup>
    );
  }

  if (props.isRequired) {
    return (
      <InputGroup>
        <div className="pf-v6-u-display-block">
          <InputRequiredText
            dataCy={props.dataCy}
            id={props.id as string}
            name={props.name as string}
            value={props.value || ""}
            onChange={props.onChange}
            isDisabled={props.isDisabled}
            requiredHelperText={props.requiredHelperText}
            type={props.passwordHidden ? "password" : "text"}
          />
        </div>
        <RevealButton
          dataCy={props.dataCy}
          passwordHidden={props.passwordHidden}
          onRevealHandler={props.onRevealHandler}
        />
      </InputGroup>
    );
  }

  return (
    <InputGroup>
      <InputGroupItem>
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
          isRequired={props.isRequired || false}
          isDisabled={props.isDisabled || false}
        />
      </InputGroupItem>
      <RevealButton
        dataCy={props.dataCy}
        passwordHidden={props.passwordHidden}
        onRevealHandler={props.onRevealHandler}
      />
    </InputGroup>
  );
};

export default PasswordInput;
