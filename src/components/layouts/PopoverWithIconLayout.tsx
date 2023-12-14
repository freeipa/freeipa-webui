import React from "react";
// PatternFly
import { Popover } from "@patternfly/react-core";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";

interface PropsToPopover {
  message: React.ReactNode | ((hide: () => void) => React.ReactNode);
  showClose?: boolean;
  ariaLabel?: string;
  hasNoPadding?: boolean;
  withFocusTrap?: boolean;
  hasAutoWidth?: boolean;
}

const PopoverWithIconLayout = (props: PropsToPopover) => {
  return (
    <Popover
      aria-label={
        props.ariaLabel || "Popover with no header, footer, and close button"
      }
      hasNoPadding={props.hasNoPadding || false}
      showClose={props.showClose || false}
      bodyContent={props.message}
      withFocusTrap={props.withFocusTrap || false}
      hasAutoWidth={props.hasAutoWidth || false}
    >
      <OutlinedQuestionCircleIcon className="pf-v5-u-color-200" />
    </Popover>
  );
};

export default PopoverWithIconLayout;
