import React from "react";
// PatternFly
import {
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  TextVariants,
} from "@patternfly/react-core";
import HelpTextWithIconLayout from "./HelpTextWithIconLayout";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";

interface SidebarLayoutProps {
  itemNames: string[];
  children: React.ReactNode;
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
            textComponent={TextVariants.p}
            textClassName="pf-v5-u-mb-md"
            subTextComponent={TextVariants.a}
            subTextIsVisitedLink={true}
            textContent="Help"
            icon={
              <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
            }
          />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
            offset={220} // for masthead
            expandable={{ default: "expandable", md: "nonExpandable" }}
          >
            {props.itemNames.map((item, index) => (
              <JumpLinksItem key={index} href={"#" + parseNameToId(item)}>
                {item}
              </JumpLinksItem>
            ))}
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v5-u-mr-xl">
          {props.children}
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default SidebarLayout;
