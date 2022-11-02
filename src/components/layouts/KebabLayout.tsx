/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import { Dropdown, KebabToggle } from "@patternfly/react-core";

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
  onKebabToggle?: ((value: boolean, event: any) => void) | undefined;
  idKebab: string;
}

const KebabLayout = (props: PropsToKebab) => {
  return (
    <Dropdown
      onSelect={props.onDropdownSelect}
      className={props.className}
      toggle={<KebabToggle onToggle={props.onKebabToggle} id={props.idKebab} />}
      isOpen={props.isKebabOpen}
      isPlain={props.isPlain}
      dropdownItems={props.dropdownItems}
    />
  );
};

export default KebabLayout;
