import React from "react";
// PatternFly
import {
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
import HelpTextWithIconLayout from "../HelpTextWithIconLayout";

interface SidebarLayoutProps {
  itemNames: string[];
  children: React.ReactNode;
  onHelpClick?: () => void;
}

const SidebarLayout = (props: SidebarLayoutProps) => {
  // Utility functions
  const parseNameToId = (name: string) => {
    return name.toLowerCase().replace(/ /g, "-");
  };

  // Render component
  return (
    <>
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            onClick={props.onHelpClick}
          />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
            expandable={{ default: "expandable", md: "nonExpandable" }}
          >
            {props.itemNames.map((item, index) => (
              <JumpLinksItem key={index} href={"#" + parseNameToId(item)}>
                {item}
              </JumpLinksItem>
            ))}
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          {props.children}
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default SidebarLayout;
