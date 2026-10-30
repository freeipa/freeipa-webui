import React from "react";
// IPA Object
import {
  getParamProperties,
  IPAParamDefinition,
} from "src/utils/ipaObjectUtils";
import NumberSelector from "../NumberSelector";

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
  id: string;
  className?: string;
  numCharsShown?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  isDisabled?: boolean;
}

const IpaNumberInput = (props: IPAParamDefinitionNumberInput) => {
  const { readOnly, value, onChange } = getParamProperties(props);

  const currentValue =
    value === ""
      ? ""
      : +(value as string) || props.defaultValue || props.minValue || 0;

  const isDisabled = props.isDisabled || readOnly;

  return (
    <NumberSelector
      dataCy={props.dataCy}
      id={props.id}
      className={props.className}
      numCharsShown={props.numCharsShown}
      minValue={props.minValue}
      maxValue={props.maxValue}
      isDisabled={isDisabled}
      value={currentValue}
      setValue={(value: number | "") => {
        onChange(value);
      }}
      name={props.name}
    />
  );
};

export default IpaNumberInput;
