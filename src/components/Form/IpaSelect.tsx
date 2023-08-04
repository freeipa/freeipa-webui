import React from "react";
// PatternFly
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinitionSelect,
  getParamPropertiesSelect,
} from "src/utils/ipaObjectUtils";

const IpaSelect = (props: IPAParamDefinitionSelect) => {
  const { required, readOnly, value } = getParamPropertiesSelect(props);

  return (
    <Select
      id={props.id}
      name={props.name}
      variant={props.variant || SelectVariant.single}
      aria-label={props.name}
      onToggle={props.onToggle}
      onSelect={props.onSelect}
      selections={value?.toString()}
      isOpen={props.isOpen}
      aria-labelledby={props.ariaLabelledBy || props.id}
      readOnly={readOnly}
      isDisabled={readOnly}
      required={required}
    >
      {props.elementsOptions.map((option, index) => (
        <SelectOption key={index} value={option} />
      ))}
    </Select>
  );
};

export default IpaSelect;
