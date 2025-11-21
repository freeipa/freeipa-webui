/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import {
  Dropdown,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";
// Icons
import { EllipsisVIcon } from "@patternfly/react-icons";

interface PropsToKebab {
  dataCy: string;
  // Dropdown
  onDropdownSelect?:
    | ((event?: React.MouseEvent<Element, MouseEvent> | undefined) => void)
    | undefined;
  isKebabOpen?: boolean;
  className?: string;
  isDisabled?: boolean;
  isPlain?: boolean;
  dropdownItems?: any[] | undefined;
  // Toggle
  onKebabToggle?: () => void;
  idKebab: string;
  direction?: "up" | "down";
}

const KebabLayout = (props: PropsToKebab) => {
  // Toggle
  const toggleKebab = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy={props.dataCy}
      ref={toggleRef}
      id={props.idKebab}
      aria-label="kebab dropdown toggle"
      variant="plain"
      onClick={props.onKebabToggle}
      isExpanded={props.isKebabOpen}
      isDisabled={props.isDisabled}
    >
      <EllipsisVIcon />
    </MenuToggle>
  );

  return (
    <Dropdown
      data-cy={props.dataCy + "-kebab"}
      onSelect={props.onDropdownSelect}
      className={props.className}
      toggle={toggleKebab}
      isOpen={props.isKebabOpen}
      isPlain={props.isPlain || false}
      popperProps={{ direction: props.direction }}
    >
      {props.dropdownItems}
    </Dropdown>
  );
};

export default KebabLayout;
