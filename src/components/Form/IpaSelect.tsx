import React from "react";
// PatternFly
import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
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
  variant?:
    | "default"
    | "plain"
    | "primary"
    | "plainText"
    | "secondary"
    | "typeahead";
  options: string[];
  ariaLabelledBy?: string;
}

const IpaSelect = (props: IPAParamDefinitionSelect) => {
  // Obtains the metadata of the parameter
  const { readOnly, value } = getParamProperties(props);

  // Handle selected value
  let valueSelected = NO_SELECTION_OPTION;
  if (value !== undefined && value && value !== "") {
    valueSelected = value.toString();
  }

  const ipaObject = props.ipaObject || {};

  const [isOpen, setIsOpen] = React.useState(false);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
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

  // Toggle
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggle}
      isDisabled={readOnly}
      isExpanded={isOpen}
      variant={props.variant || "default"}
      className="pf-v5-u-w-100"
    >
      {valueSelected}
    </MenuToggle>
  );

  // Provide empty option at the beginning of the list
  const [optionsToSelect, setOptionsToSelect] = React.useState<string[]>(
    props.options || []
  );

  React.useEffect(() => {
    // Add empty option at the beginning of the list
    if (optionsToSelect[0] !== NO_SELECTION_OPTION) {
      optionsToSelect.unshift(NO_SELECTION_OPTION);
    }
  }, [optionsToSelect]);

  React.useEffect(() => {
    // Add empty option at the beginning of the list
    if (props.options !== optionsToSelect) {
      const optionsTemp = [...props.options];
      setOptionsToSelect(optionsTemp || []);
      optionsTemp.unshift(NO_SELECTION_OPTION);
    }
  }, [props.options]);

  return (
    <Select
      id={props.id}
      aria-label={props.name}
      onToggle={(_event, val) => setIsOpen(val)}
      onSelect={onSelect}
      selected={valueSelected}
      isOpen={isOpen}
      aria-labelledby={props.ariaLabelledBy || props.id}
    >
      {optionsToSelect.map((option, index) => {
        return (
          <SelectOption key={index} value={option}>
            {option}
          </SelectOption>
        );
      })}
    </Select>
  );
};

export default IpaSelect;
