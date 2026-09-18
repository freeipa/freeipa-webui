import React from "react";
import { SelectOptionProps } from "@patternfly/react-core";
import {
  IPAParamDefinition,
  getParamProperties,
  toArray,
} from "src/utils/ipaObjectUtils";
import { TypeAheadWithCheckbox } from "src/components/TypeAheadWithCheckbox";

interface IPAParamDefinitionTypeAheadWithCheckbox extends IPAParamDefinition {
  dataCy: string;
  id: string;
  options: SelectOptionProps[];
}

const IpaTypeAheadWithCheckbox = (
  props: IPAParamDefinitionTypeAheadWithCheckbox
) => {
  const propName = props.propertyName || props.name;
  const { readOnly, value } = getParamProperties(props);

  const selectedValues = React.useMemo(() => {
    return toArray(value) as string[];
  }, [value]);

  // Merge static options with any currently-selected values that are
  // not present in the predefined list (e.g., attrs added via CLI)
  const mergedOptions = React.useMemo(() => {
    const knownValues = new Set(props.options.map((opt) => opt.value));
    const extraOptions: SelectOptionProps[] = selectedValues
      .filter((val) => !knownValues.has(val))
      .map((val) => ({
        value: val,
        children: val,
        "data-cy": `${props.dataCy}-${val}`,
      }));
    return [...props.options, ...extraOptions];
  }, [props.options, selectedValues, props.dataCy]);

  const setSelected = (selected: string[]) => {
    if (props.onChange) {
      props.onChange({ ...props.ipaObject, [propName]: selected });
    }
  };

  return (
    <TypeAheadWithCheckbox
      id={props.id}
      dataCy={props.dataCy}
      options={mergedOptions}
      selected={selectedValues}
      setSelected={setSelected}
      isDisabled={readOnly}
    />
  );
};

export default IpaTypeAheadWithCheckbox;
