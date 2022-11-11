// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
// PatternFly
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";

interface ToolbarItemSpacer {
  default?: "spacerNone" | "spacerSm" | "spacerMd" | "spacerLg";
  md?: "spacerNone" | "spacerSm" | "spacerMd" | "spacerLg";
  lg?: "spacerNone" | "spacerSm" | "spacerMd" | "spacerLg";
  xl?: "spacerNone" | "spacerSm" | "spacerMd" | "spacerLg";
  "2xl"?: "spacerNone" | "spacerSm" | "spacerMd" | "spacerLg";
}

interface ToolbarItemAlignment {
  default?: "alignRight" | "alignLeft";
  md?: "alignRight" | "alignLeft";
  lg?: "alignRight" | "alignLeft";
  xl?: "alignRight" | "alignLeft";
  "2xl"?: "alignRight" | "alignLeft";
}

export interface ToolbarItem {
  key: number;
  // element: JSX.Element | undefined;
  element?: JSX.Element;
  toolbarItemVariant?:
    | "bulk-select"
    | "overflow-menu"
    | "pagination"
    | "search-filter"
    | "label"
    | "chip-group"
    | "separator"
    | "expand-all";
  toolbarItemSpacer?: ToolbarItemSpacer;
  toolbarItemAlignment?: ToolbarItemAlignment;
}

interface PropsToToolbar {
  toolbarItems: ToolbarItem[];
  className?: string;
  contentClassName?: string;
  isSticky?: boolean;
}

const ToolbarLayout = (props: PropsToToolbar) => {
  return (
    <Toolbar className={props.className} isSticky={props.isSticky}>
      <ToolbarContent className={props.contentClassName}>
        {props.toolbarItems.map((elem) => (
          <ToolbarItem
            key={elem.key}
            id={elem.key.toString()}
            variant={elem.toolbarItemVariant}
            alignment={elem.toolbarItemAlignment}
            spacer={elem.toolbarItemSpacer}
          >
            {elem.element}
          </ToolbarItem>
        ))}
      </ToolbarContent>
    </Toolbar>
  );
};

export default ToolbarLayout;
