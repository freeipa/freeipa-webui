import React from "react";
// Patternfly
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";

export interface SelectOptionProps {
  key: string;
  value: string;
}

interface PropsToSimpleSelector {
  dataCy: string;
  id: string;
  selected: string;
  options: SelectOptionProps[];
  onSelectedChange: (selected: string) => void;
  ariaLabel?: string;
}

const SimpleSelector = (props: PropsToSimpleSelector) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>(props.selected);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    props.onSelectedChange(value as string);
    setSelected(value as string);
    setIsOpen(false);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy={props.dataCy + "-select-toggle"}
      id={props.id}
      ref={toggleRef}
      aria-label={
        props.ariaLabel ? props.ariaLabel : "Basic selector menu toggle"
      }
      onClick={onToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      {selected}
    </MenuToggle>
  );

  return (
    <Select
      data-cy={props.dataCy + "-select"}
      id={props.id + "-select"}
      isOpen={isOpen}
      selected={props.selected}
      onSelect={onSelect}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={toggle}
      isScrollable
    >
      <SelectList id={props.id + "-selector-list"}>
        {props.options.map((option, idx) => (
          <SelectOption
            data-cy={props.dataCy + "-select-" + option.key}
            id={option.key + "-" + idx}
            key={option.key + "-" + idx}
            tabIndex={idx}
            value={option.value}
          >
            {option.value}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};

export default SimpleSelector;
