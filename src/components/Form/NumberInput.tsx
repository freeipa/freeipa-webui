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
  const normalizeBetween = (value, min, max) => {
    if (min !== undefined && max !== undefined) {
      return Math.max(Math.min(value, max), min);
    } else if (value <= min) {
      return min;
    } else if (value >= max) {
      return max;
    }
    return value;
  };

  const onMinus = () => {
    const num = props.value ? parseInt(props.value.toString(), 10) : 0;
    const newValue = normalizeBetween(num - 1, props.minValue, props.maxValue);
    props.setValue(newValue);
  };

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    props.setValue(value === "" ? "" : +value);

    // Return to max and min values if the input is beyond those values
    if (props.minValue && +value < props.minValue) {
      props.setValue(props.minValue);
    } else if (props.maxValue && +value > props.maxValue) {
      props.setValue(props.maxValue);
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const blurVal = +event.target.value;

    if (props.minValue && blurVal < props.minValue) {
      props.setValue(props.minValue);
    } else if (props.maxValue && blurVal > props.maxValue) {
      props.setValue(props.maxValue);
    }
  };

  const onPlus = () => {
    const num = props.value ? parseInt(props.value.toString(), 10) : 0;
    const newValue = normalizeBetween(num + 1, props.minValue, props.maxValue);
    props.setValue(newValue);
  };

  return (
    <NumberInput
      id={props.id + "-group"}
      name={props.name}
      value={props.value}
      onMinus={onMinus}
      onChange={onChangeHandler}
      min={props.minValue}
      max={props.maxValue}
      onBlur={onBlur}
      onPlus={onPlus}
      aria-label={props.name}
      inputName={props.name}
      inputAriaLabel="number input"
      minusBtnAriaLabel="minus"
      plusBtnAriaLabel="plus"
      isDisabled={props.isDisabled || false}
      widthChars={props.numCharsShown || 1}
      className={props.className || ""}
      inputProps={{ id: props.id, "data-cy": props.dataCy }}
    />
  );
};

export default NumberSelector;
