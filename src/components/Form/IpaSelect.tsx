import React from "react";
// PatternFly
import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
} from "src/utils/ipaObjectUtils";
import { updateIpaObject } from "src/utils/ipaObjectUtils";
import { NO_SELECTION_OPTION } from "src/utils/constUtils";

interface IPAParamDefinitionSelect extends IPAParamDefinition {
  id?: string;
  setIpaObject?: (ipaObject: Record<string, unknown>) => void;
  variant?: "single" | "checkbox" | "typeahead" | "typeaheadmulti";
  options: string[];
  ariaLabelledBy?: string;
}

const IpaSelect = (props: IPAParamDefinitionSelect) => {
  // Obtains the metadata of the parameter
  const { required, readOnly, value } = getParamProperties(props);

  // Handle selected value
  let valueSelected = NO_SELECTION_OPTION;
  if (value !== undefined && value && value !== "") {
    valueSelected = value.toString();
  }

  const ipaObject = props.ipaObject || {};

  const [isOpen, setIsOpen] = React.useState(false);

  const onSelect = (
    _event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject
  ) => {
    let valueToUpdate = "";

    if (selection !== NO_SELECTION_OPTION) {
      valueToUpdate = selection as string;
    }

    if (ipaObject && props.setIpaObject !== undefined) {
      updateIpaObject(ipaObject, props.setIpaObject, valueToUpdate, props.name);
    }

    setIsOpen(false);
  };

  // Provide empty option at the beginning of the list
  const optionsToSelect: string[] = [...(props.options || [])];
  optionsToSelect.unshift(NO_SELECTION_OPTION);

  return (
    <Select
      id={props.id}
      name={props.name}
      variant={props.variant || SelectVariant.single}
      aria-label={props.name}
      onToggle={setIsOpen}
      onSelect={onSelect}
      selections={valueSelected}
      isOpen={isOpen}
      aria-labelledby={props.ariaLabelledBy || props.id}
      readOnly={readOnly}
      isDisabled={readOnly}
      required={required}
    >
      {optionsToSelect.map((option, index) => {
        return <SelectOption key={index} value={option} />;
      })}
    </Select>
  );
};

export default IpaSelect;
