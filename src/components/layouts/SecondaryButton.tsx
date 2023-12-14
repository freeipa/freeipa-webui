/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";

interface PropsToSecondaryButton {
  classname?: string;
  name?: string;
  isDisabled?: boolean;
  onClickHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children?: React.ReactNode;
  isActive?: boolean;
  isBlock?: boolean;
  isInLine?: boolean;
  isSmall?: boolean;
  ouijaId?: number | string;
  ouijaSafe?: boolean;
  innerRef?: React.Ref<any>;
  form?: string;
  isLoading?: boolean;
  spinnerAriaValueText?: string;
  spinnerAriaLabelledBy?: string;
  spinnerAriaLabel?: string;
}

const SecondaryButton = (props: PropsToSecondaryButton) => {
  return (
    <Button
      className={props.classname}
      name={props.name}
      variant="secondary"
      isDisabled={props.isDisabled}
      isActive={props.isActive}
      isBlock={props.isBlock}
      isInline={props.isInLine}
      size="sm"
      ouiaId={props.ouijaId}
      ouiaSafe={props.ouijaSafe}
      onClick={props.onClickHandler}
      innerRef={props.innerRef}
      form={props.form}
      isLoading={props.isLoading}
      spinnerAriaValueText={props.spinnerAriaValueText}
      spinnerAriaLabelledBy={props.spinnerAriaLabelledBy}
      spinnerAriaLabel={props.spinnerAriaLabel}
    >
      {props.children}
    </Button>
  );
};

export default SecondaryButton;
