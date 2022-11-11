// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import { Dropdown, DropdownToggle } from "@patternfly/react-core";
// Icons
import OutlinedClockIcon from "@patternfly/react-icons/dist/esm/icons/outlined-clock-icon";

interface PropsToDataTimePicker {
  dropdownOnSelect: any;
  dropdownClassName?: string;
  dropdownIsOpen?: boolean;
  dropdownItems: any[];
  toggleAriaLabel?: string;
  toggleIndicator?: React.ElementType | null;
  toggleOnToggle?: (value: boolean, event: any) => void;
  toggleStyle?: React.CSSProperties | undefined;
}

const DataTimePickerLayout = (props: PropsToDataTimePicker) => {
  return (
    <Dropdown
      onSelect={props.dropdownOnSelect}
      toggle={
        <DropdownToggle
          aria-label={props.toggleAriaLabel}
          toggleIndicator={props.toggleIndicator}
          onToggle={props.toggleOnToggle}
          style={props.toggleStyle}
        >
          <OutlinedClockIcon />
        </DropdownToggle>
      }
      isOpen={props.dropdownIsOpen}
      dropdownItems={props.dropdownItems}
    />
  );
};

export default DataTimePickerLayout;
