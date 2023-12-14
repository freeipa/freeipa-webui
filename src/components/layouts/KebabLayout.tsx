/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import { Dropdown } from "@patternfly/react-core/deprecated";
import { MenuToggle } from "@patternfly/react-core";
// Icons
import EllipsisVIcon from "@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon";

interface PropsToKebab {
  // Dropdown
  onDropdownSelect?:
    | ((
        event?: React.SyntheticEvent<HTMLDivElement, Event> | undefined
      ) => void)
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
  const KebabToggleWithRef = (
    <MenuToggle
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
      toggle={KebabToggleWithRef}
      isOpen={props.isKebabOpen}
      isPlain={props.isPlain}
      dropdownItems={props.dropdownItems}
      direction={props.direction}
    />
  );
};

export default KebabLayout;
