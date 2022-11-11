// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

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
  ouijaId?: number | string;
  ouijaSafe?: boolean;
  innerRef?: React.Ref<any>;
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
      ouiaId={props.ouijaId}
      ouiaSafe={props.ouijaSafe}
      onClick={props.onClickHandler}
      innerRef={props.innerRef}
    >
      {props.children}
    </Button>
  );
};

export default SecondaryButton;
