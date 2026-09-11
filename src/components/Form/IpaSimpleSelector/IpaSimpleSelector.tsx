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
  convertToString,
  getParamProperties,
  IPAParamDefinition,
} from "src/utils/ipaObjectUtils";
import { SelectOptionProps } from "src/components/layouts/SimpleSelector";

export interface IPAParamDefinitionSimpleSelector extends IPAParamDefinition {
  dataCy: string;
  id?: string;
  options: SelectOptionProps[];
  returnedProperty?: keyof SelectOptionProps;
  noOptionsMessage?: string;
}

const IpaSimpleSelector = (props: IPAParamDefinitionSimpleSelector) => {
  const { readOnly, value, onChange } = getParamProperties(props);
  const id = props.id || props.name;
  const returnedProperty = props.returnedProperty ?? "value";
  const currentValue = convertToString(value);

  const getDisplayValue = (raw: string) => {
    const match = props.options.find(
      (option) => option[returnedProperty] === raw || option.value === raw
    );
    return match?.value ?? raw;
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>(
    getDisplayValue(currentValue)
  );

  React.useEffect(() => {
    const match = props.options.find(
      (option) =>
        option[returnedProperty] === currentValue ||
        option.value === currentValue
    );
    setSelected(match?.value ?? currentValue);
  }, [currentValue, props.options, returnedProperty]);

  const onToggleClick = () => {
    if (readOnly) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    option: SelectOptionProps
  ) => {
    onChange(option[returnedProperty]);
    setSelected(option.value);
    setIsOpen(false);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy={props.dataCy + "-select-toggle"}
      id={id}
      ref={toggleRef}
      aria-label={
        props.ariaLabel ? props.ariaLabel : "Basic selector menu toggle"
      }
      onClick={onToggleClick}
      isExpanded={isOpen}
      isDisabled={readOnly}
      isFullWidth
    >
      {selected}
    </MenuToggle>
  );

  return (
    <Select
      data-cy={props.dataCy + "-select"}
      id={id + "-select"}
      isOpen={isOpen}
      selected={selected}
      onSelect={onSelect}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={toggle}
      isScrollable
    >
      <SelectList id={id + "-selector-list"}>
        {props.options.length === 0 ? (
          <SelectOption
            data-cy={props.dataCy + "-select-no-options"}
            isDisabled
            value="no-options"
          >
            {props.noOptionsMessage || "No options available"}
          </SelectOption>
        ) : (
          props.options.map((option, idx) => (
            <SelectOption
              data-cy={props.dataCy + "-select-" + option.key}
              id={option.key}
              key={option.key}
              tabIndex={idx}
              value={option}
            >
              {option.value}
            </SelectOption>
          ))
        )}
      </SelectList>
    </Select>
  );
};

export default IpaSimpleSelector;
