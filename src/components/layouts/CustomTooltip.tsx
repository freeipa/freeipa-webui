import React from "react";
// PatternFly
import { Tooltip } from "@patternfly/react-core";

interface PropsToPopover {
  message: React.ReactNode;
  children: React.ReactElement; // Icon to show
  id: string;
  ariaLabel?: string;
  maxWidth?: string;
  minWidth?: string;
  isVisible?: boolean;
  isContentLeftAligned?: boolean;
  position?:
    | "auto"
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
}

const CustomTooltip = (props: PropsToPopover) => {
  return (
    <Tooltip
      id={props.id}
      aria-label={
        props.ariaLabel || "Popover with no header, footer, and close button"
      }
      content={props.message}
      maxWidth={props.maxWidth || "none"}
      minWidth={props.minWidth || "none"}
      isVisible={props.isVisible || false}
      isContentLeftAligned={props.isContentLeftAligned || false}
      position={props.position || "top"}
    >
      {props.children}
    </Tooltip>
  );
};

export default CustomTooltip;
