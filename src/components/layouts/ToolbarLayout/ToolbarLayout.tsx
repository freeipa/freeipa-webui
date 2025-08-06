import React from "react";
// PatternFly
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";

export interface ToolbarItemGap {
  default?:
    | "gapNone"
    | "gapXs"
    | "gapSm"
    | "gapMd"
    | "gapLg"
    | "gapXl"
    | "gap_2xl"
    | "gap_3xl"
    | "gap_4xl";
  md?:
    | "gapNone"
    | "gapXs"
    | "gapSm"
    | "gapMd"
    | "gapLg"
    | "gapXl"
    | "gap_2xl"
    | "gap_3xl"
    | "gap_4xl";
  lg?:
    | "gapNone"
    | "gapXs"
    | "gapSm"
    | "gapMd"
    | "gapLg"
    | "gapXl"
    | "gap_2xl"
    | "gap_3xl"
    | "gap_4xl";
  xl?:
    | "gapNone"
    | "gapXs"
    | "gapSm"
    | "gapMd"
    | "gapLg"
    | "gapXl"
    | "gap_2xl"
    | "gap_3xl"
    | "gap_4xl";
  "2xl"?:
    | "gapNone"
    | "gapXs"
    | "gapSm"
    | "gapMd"
    | "gapLg"
    | "gapXl"
    | "gap_2xl"
    | "gap_3xl"
    | "gap_4xl";
}

export interface ToolbarItemAlignment {
  default?: "alignEnd" | "alignStart" | "alignCenter";
  md?: "alignEnd" | "alignStart" | "alignCenter";
  lg?: "alignEnd" | "alignStart" | "alignCenter";
  xl?: "alignEnd" | "alignStart" | "alignCenter";
  "2xl"?: "alignEnd" | "alignStart" | "alignCenter";
}

export interface ToolbarItem {
  key: number;
  id?: string;
  element?: JSX.Element;
  toolbarItemVariant?: ToolbarItemVariant;
  toolbarItemGap?: ToolbarItemGap;
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
            align={elem.toolbarItemAlignment}
            gap={elem.toolbarItemGap}
          >
            {elem.element}
          </ToolbarItem>
        ))}
      </ToolbarContent>
    </Toolbar>
  );
};

export default ToolbarLayout;
