/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import {
  Dropdown,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";
// Icons
import EllipsisVIcon from "@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon";

interface PropsToKebab {
  // Dropdown
  onDropdownSelect?:
    | ((event?: React.MouseEvent<Element, MouseEvent> | undefined) => void)
    | undefined;
  isKebabOpen?: boolean;
  className?: string;
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
      ref={toggleRef}
      id={props.idKebab}
      aria-label="kebab dropdown toggle"
      variant="plain"
      onClick={props.onKebabToggle}
      isExpanded={props.isKebabOpen}
    >
      <EllipsisVIcon />
    </MenuToggle>
  );

  return (
    <Dropdown
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
