import React from "react";
// PatternFly
import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from "@patternfly/react-core";
import type { HelperTextItemProps } from "@patternfly/react-core";

type HelperTextVariant = NonNullable<HelperTextItemProps["variant"]>;
type RuleState = {
  id: string;
  state: HelperTextVariant;
  message: string;
};
type RuleProps = {
  id: string;
  message: string;
  validate: (value: string) => boolean;
};

interface InputWithValidationProps {
  dataCy: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  rules: Array<RuleProps>;
  showAlways?: boolean; // if true, show helper text even if value is empty
}

const InputWithValidation = (props: InputWithValidationProps) => {
  const hasRules = props.rules.length > 0;

  const ruleStates = React.useMemo<RuleState[]>(() => {
    if (!hasRules || props.isDisabled) return [];
    if (props.value === "") {
      return props.rules.map((r) => ({
        id: r.id,
        state: "indeterminate",
        message: r.message,
      }));
    }
    return props.rules.map((r) => ({
      id: r.id,
      state: r.validate(props.value) ? "success" : "error",
      message: r.message,
    }));
  }, [props.value, hasRules, props.rules]);

  const nonSuccessRuleIds = React.useMemo<string[]>(
    () =>
      hasRules
        ? ruleStates
            .filter((s) => s.state !== "success")
            .map((s) => `${props.id}-${s.id}`)
        : [],
    [hasRules, ruleStates, props.id]
  );

  const ariaInvalid = hasRules
    ? ruleStates.some((s) => s.state === "error")
    : false;

  return (
    <>
      <TextInput
        data-cy={props.dataCy}
        id={props.id}
        name={props.name}
        value={props.value}
        type="text"
        isRequired={props.isRequired}
        isDisabled={props.isDisabled}
        aria-label={props.name}
        placeholder={props.placeholder}
        aria-describedby={nonSuccessRuleIds.join(" ")}
        aria-invalid={ariaInvalid}
        onChange={(_event, value) => props.onChange(value)}
      />
      {(props.value || props.showAlways) && (
        <FormHelperText>
          <HelperText component="ul">
            {ruleStates.map((r) => (
              <HelperTextItem
                key={r.id}
                component="li"
                id={`${props.id}-${r.id}`}
                variant={r.state}
              >
                {r.message}
              </HelperTextItem>
            ))}
          </HelperText>
        </FormHelperText>
      )}
    </>
  );
};

export default InputWithValidation;
