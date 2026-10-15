import React from "react";
// PatternFly
import { NumberInput } from "@patternfly/react-core";
// IPA Object
import {
  getParamProperties,
  IPAParamDefinition,
} from "src/utils/ipaObjectUtils";

/**
 * Interface for the IPA Number Input
 * @param {string} className - The class name for the input (Optional. Default: "")
 * @param {number} numCharsShown - The number of characters shown in the input (Optional. Default: 1)
 * @param {number} minValue - The minimum value allowed (Optional)
 * @param {number} maxValue - The maximum value allowed (Optional)
 * @param {number} defaultValue - Value used when the field is empty or out of boundaries (Optional.
 *   Falls back to minValue if not specified)
 * @param {IPAParamDefinition} IPAParamDefinition - IPA Object parameters
 * @param {boolean} isDisabled - Overrides the `readOnly` value (Optional. Default: readOnly)
 * @returns {React.ReactNode} The IPA Number Input component
 *
 */

export interface IPAParamDefinitionNumberInput extends IPAParamDefinition {
  dataCy: string;
  id?: string;
  className?: string;
  numCharsShown?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  isDisabled?: boolean;
}

const IpaNumberInput = (props: IPAParamDefinitionNumberInput) => {
  const { readOnly, value, onChange } = getParamProperties(props);

  // Resolve the fallback: explicit defaultValue takes priority, then minValue
  const fallbackValue = props.defaultValue ?? props.minValue;

  // Compute display value, clamping to boundaries when out of range
  const computeNumberValue = () => {
    if (value === "" || value === null || value === undefined) {
      return fallbackValue ?? "";
    }
    const num = parseInt(value.toString(), 10);
    if (isNaN(num)) return "";
    if (props.minValue !== undefined && num < props.minValue) {
      return fallbackValue ?? props.minValue;
    }
    if (props.maxValue !== undefined && num > props.maxValue) {
      return props.maxValue;
    }
    return num;
  };

  const numberValue = computeNumberValue();

  const isDisabled =
    props.isDisabled !== undefined ? props.isDisabled : readOnly;

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
    const num = value ? parseInt(value as string, 10) : (fallbackValue ?? 0);
    const newValue = normalizeBetween(num - 1, props.minValue, props.maxValue);
    onChange(newValue);
  };

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    onChange(value === "" ? value : +value);

    // Return to max and min values if the input is beyond those values
    if (props.minValue !== undefined && +value < props.minValue) {
      onChange(props.minValue);
    } else if (props.maxValue !== undefined && +value > props.maxValue) {
      onChange(props.maxValue);
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const blurVal = event.target.value;

    if (blurVal === "" && fallbackValue !== undefined) {
      onChange(fallbackValue);
    } else if (props.minValue !== undefined && +blurVal < props.minValue) {
      onChange(props.minValue);
    } else if (props.maxValue !== undefined && +blurVal > props.maxValue) {
      onChange(props.maxValue);
    }
  };

  const onPlus = () => {
    const num = value ? parseInt(value as string, 10) : (fallbackValue ?? 0);
    const newValue = normalizeBetween(num + 1, props.minValue, props.maxValue);
    onChange(newValue);
  };

  return (
    <NumberInput
      id={props.id + "-group"}
      name={props.name}
      value={numberValue}
      onMinus={onMinus}
      onChange={onChangeHandler}
      min={props.minValue}
      max={props.maxValue}
      onBlur={onBlur}
      onPlus={onPlus}
      aria-label={props.name}
      inputName="input"
      inputAriaLabel="number input"
      minusBtnAriaLabel="minus"
      plusBtnAriaLabel="plus"
      isDisabled={isDisabled}
      widthChars={props.numCharsShown || 1}
      className={props.className || ""}
      inputProps={{ id: props.id, "data-cy": props.dataCy }}
    />
  );
};

export default IpaNumberInput;
