import React from "react";
// PatternFly
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
} from "src/utils/ipaObjectUtils";
import { updateIpaObject } from "src/utils/ipaObjectUtils";
import { NO_SELECTION_OPTION } from "src/utils/constUtils";

export interface IPAParamDefinitionSelect extends IPAParamDefinition {
  dataCy: string;
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
  defaultValue?: string; // Custom default value (otherwise, NO_SELECTION_OPTION will be used)
}

const IpaSelect = (props: IPAParamDefinitionSelect) => {
  // Obtains the metadata of the parameter
  const { readOnly, value, onChange } = getParamProperties(props);

  // Handle selected value
  const [valueSelected, setValueSelected] = React.useState(
    value !== undefined && value && value !== ""
      ? value.toString()
      : props.defaultValue || NO_SELECTION_OPTION
  );

  React.useEffect(() => {
    setValueSelected(
      value !== undefined && value && value !== ""
        ? value.toString()
        : props.defaultValue || NO_SELECTION_OPTION
    );
  }, [value]);

  const ipaObject = props.ipaObject || {};

  const [isOpen, setIsOpen] = React.useState(false);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    let valueToUpdate = props.defaultValue || "";

    if (selection !== NO_SELECTION_OPTION && selection !== props.defaultValue) {
      valueToUpdate = selection as string;
    }

    setValueSelected(
      valueToUpdate ||
        (props.defaultValue !== undefined && props.defaultValue !== undefined
          ? props.defaultValue
          : NO_SELECTION_OPTION)
    );

    // Update the ipaObject via onChange (IPAParamDefinition pattern)
    onChange(valueToUpdate);

    // Also support the setIpaObject prop for backward compatibility
    if (ipaObject && props.setIpaObject !== undefined) {
      updateIpaObject(ipaObject, props.setIpaObject, valueToUpdate, props.name);
    }

    setIsOpen(false);
  };

  // Toggle
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy={props.dataCy}
      id={props.id}
      ref={toggleRef}
      onClick={onToggle}
      isDisabled={readOnly}
      isExpanded={isOpen}
      variant={props.variant || "default"}
      className="pf-v6-u-w-100"
    >
      {valueSelected}
    </MenuToggle>
  );

  // Provide empty option at the beginning of the list
  const [optionsToSelect, setOptionsToSelect] = React.useState<string[]>(
    props.options || []
  );

  React.useEffect(() => {
    // Add empty/default option at the beginning of the list
    const selection = props.defaultValue ?? NO_SELECTION_OPTION;
    if (optionsToSelect[0] !== selection) {
      setOptionsToSelect([selection, ...optionsToSelect]);
    }
  }, [optionsToSelect]);

  React.useEffect(() => {
    // Add empty/default option at the beginning of the list
    if (props.options !== optionsToSelect) {
      const optionsTemp = [...props.options];
      const selection = props.defaultValue ?? NO_SELECTION_OPTION;
      optionsTemp.unshift(selection);
      setOptionsToSelect(optionsTemp);
    }
  }, [props.options]);

  return (
    <Select
      data-cy={props.dataCy + "-select"}
      aria-label={props.name}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={toggle}
      onSelect={onSelect}
      selected={valueSelected}
      isOpen={isOpen}
      aria-labelledby={props.ariaLabelledBy || props.id}
    >
      <SelectList>
        {optionsToSelect.map((option, index) => {
          return (
            <SelectOption
              data-cy={props.dataCy + "-select-" + option}
              key={index}
              value={option}
            >
              {option}
            </SelectOption>
          );
        })}
      </SelectList>
    </Select>
  );
};

export default IpaSelect;
