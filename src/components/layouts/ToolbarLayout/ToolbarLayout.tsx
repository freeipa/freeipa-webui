import React from "react";
// PatternFly
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemProps,
  ToolbarItemVariant,
} from "@patternfly/react-core";

type ToolbarItemGap = ToolbarItemProps["gap"];
type ToolbarItemAlignment = ToolbarItemProps["align"];

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
