import React from "react";
// PatternFly
import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from "@patternfly/react-core";

export interface InputWithValidationProps {
  dataCy: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  rules: Array<{
    id: string;
    message: string;
    validate: (value: string) => boolean;
  }>;
}

const InputWithValidation = (props: InputWithValidationProps) => {
  const hasRules = Array.isArray(props.rules) && props.rules.length > 0;

  const ruleVariants = React.useMemo(() => {
    const variants: Record<string, "indeterminate" | "success" | "error"> = {};
    if (!hasRules) return variants;
    if (props.value === "") {
      (props.rules ?? []).forEach((r) => (variants[r.id] = "indeterminate"));
      return variants;
    }
    (props.rules ?? []).forEach((r) => {
      variants[r.id] = r.validate(props.value) ? "success" : "error";
    });
    return variants;
  }, [props.value, hasRules, props.rules]);

  const nonSuccessRuleIds = React.useMemo(
    () =>
      hasRules
        ? (props.rules ?? [])
            .filter((r) => ruleVariants[r.id] !== "success")
            .map((r) => `${props.id}-${r.id}`)
        : [],
    [hasRules, props.rules, ruleVariants, props.id]
  );

  const ariaInvalid = hasRules
    ? Object.values(ruleVariants).some((v) => v === "error")
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
        aria-label={props.name}
        aria-describedby={nonSuccessRuleIds.join(" ")}
        aria-invalid={ariaInvalid}
        onChange={(_event, value) => props.onChange(value)}
      />
      <FormHelperText>
        <HelperText component="ul">
          {(props.rules ?? []).map((r) => (
            <HelperTextItem
              key={r.id}
              component="li"
              id={`${props.id}-${r.id}`}
              variant={ruleVariants[r.id]}
            >
              {r.message}
            </HelperTextItem>
          ))}
        </HelperText>
      </FormHelperText>
    </>
  );
};

export default InputWithValidation;
