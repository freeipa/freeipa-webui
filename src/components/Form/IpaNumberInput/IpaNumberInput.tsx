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

  const fallbackValue = props.defaultValue ?? props.minValue;

  const clamp = (n: number) => {
    if (props.minValue !== undefined && n < props.minValue)
      return fallbackValue ?? props.minValue;
    if (props.maxValue !== undefined && n > props.maxValue)
      return props.maxValue;
    return n;
  };

  const numberValue = (() => {
    if (value === "" || value === null || value === undefined)
      return fallbackValue ?? "";
    const num = parseInt(value.toString(), 10);
    return isNaN(num) ? "" : clamp(num);
  })();

  const isDisabled =
    props.isDisabled !== undefined ? props.isDisabled : readOnly;

  const onMinus = () => {
    const num = value ? parseInt(value as string, 10) : (fallbackValue ?? 0);
    onChange(clamp(num - 1));
  };

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const val = (event.target as HTMLInputElement).value;
    if (val === "") {
      onChange(val);
    } else {
      onChange(clamp(+val));
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const blurVal = event.target.value;
    if (blurVal === "" && fallbackValue !== undefined) {
      onChange(fallbackValue);
    } else if (blurVal !== "") {
      onChange(clamp(+blurVal));
    }
  };

  const onPlus = () => {
    const num = value ? parseInt(value as string, 10) : (fallbackValue ?? 0);
    onChange(clamp(num + 1));
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
