// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Icons
import OutlinedCalendarAltIcon from "@patternfly/react-icons/dist/esm/icons/outlined-calendar-alt-icon";

interface PropsToCalendarButton {
  ariaLabel?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const CalendarButton = (props: PropsToCalendarButton) => {
  return (
    <Button
      variant="control"
      aria-label={props.ariaLabel}
      onClick={props.onClick}
    >
      <OutlinedCalendarAltIcon />
    </Button>
  );
};

export default CalendarButton;
