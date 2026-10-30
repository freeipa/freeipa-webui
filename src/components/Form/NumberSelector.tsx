import React from "react";
// PatternFly
import { NumberInput } from "@patternfly/react-core";

interface NumberSelectorProps {
  dataCy: string;
  id: string;
  name: string;
  value: number | "";
  setValue: (value: number | "") => void;
  className?: string;
  numCharsShown?: number;
  minValue?: number;
  maxValue?: number;
  isDisabled?: boolean;
}

const NumberSelector = (props: NumberSelectorProps) => {
  const clamp = (value: number, min?: number, max?: number) =>
    Math.max(Math.min(value, max ?? Infinity), min ?? -Infinity);

  const onChange = (value: string | number) => {
    if (value === "") {
      props.setValue(value);
      return;
    }

    const clampedValue = clamp(+value, props.minValue, props.maxValue);
    props.setValue(clampedValue);
  };

  const onMinus = () => onChange(+props.value - 1);
  const onPlus = () => onChange(+props.value + 1);
  const onChangeHandler = (event: React.FormEvent<HTMLInputElement>) =>
    onChange(event.currentTarget.value);

  return (
    <NumberInput
      id={props.id + "-group"}
      name={props.name}
      value={props.value}
      onMinus={onMinus}
      onChange={onChangeHandler}
      min={props.minValue}
      max={props.maxValue}
      onPlus={onPlus}
      aria-label={props.name}
      inputName={props.name}
      inputAriaLabel="number input"
      minusBtnAriaLabel="minus"
      plusBtnAriaLabel="plus"
      isDisabled={props.isDisabled || false}
      widthChars={props.numCharsShown || 1}
      className={props.className || ""}
      inputProps={{ id: props.id, "data-cy": props.dataCy + "-input" }}
    />
  );
};

export default NumberSelector;
