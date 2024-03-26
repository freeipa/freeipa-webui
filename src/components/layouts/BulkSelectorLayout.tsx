import React from "react";
// PatternFly
import { Popper } from "@patternfly/react-core";

interface PropsToBulkSelector {
  menuKey: string;
  selectorClassName?: string;
  containerRefMenu?: React.RefObject<HTMLDivElement>;
  toggle?: JSX.Element;
  menuToolbar: JSX.Element;
  appendTo?: HTMLElement | (() => HTMLElement) | undefined;
  isOpenMenu?: boolean;
  ariaLabel?: string;
  title?: string;
}

const BulkSelectorLayout = (props: PropsToBulkSelector) => {
  return (
    <div
      key={props.menuKey}
      ref={props.containerRefMenu}
      className={props.selectorClassName}
      title={props.title ? props.title : ""}
    >
      <Popper
        trigger={props.toggle}
        popper={props.menuToolbar}
        appendTo={props.appendTo}
        isVisible={props.isOpenMenu}
        aria-label={props.ariaLabel}
      />
    </div>
  );
};

export default BulkSelectorLayout;
