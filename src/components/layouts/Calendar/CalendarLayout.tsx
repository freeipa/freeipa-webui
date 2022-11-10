import React from "react";
// PatternFly
import { InputGroup, Popover, TextInput } from "@patternfly/react-core";

interface PropsToCalendar {
  name?: string;
  position:
    | "auto"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  bodyContent: React.ReactNode | ((hide: () => void) => React.ReactNode);
  showClose?: boolean;
  isVisible?: boolean;
  hasNoPadding?: boolean;
  hasAutoWidth?: boolean;
  textInputId?: string;
  textInputAriaLabel?: string;
  textInputValue: string | number;
  children: JSX.Element[];
}

const CalendarLayout = (props: PropsToCalendar) => {
  return (
    <Popover
      position={props.position}
      bodyContent={props.bodyContent}
      showClose={props.showClose}
      isVisible={props.isVisible}
      hasNoPadding={props.hasNoPadding}
      hasAutoWidth={props.hasAutoWidth}
    >
      <InputGroup>
        <TextInput
          type="text"
          id={props.textInputId}
          name={props.name}
          aria-label={props.textInputAriaLabel}
          value={props.textInputValue}
        />
        {props.children}
      </InputGroup>
    </Popover>
  );
};

export default CalendarLayout;
