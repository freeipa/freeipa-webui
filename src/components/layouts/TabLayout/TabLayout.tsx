import React from "react";
import { Flex, FlexItem, PageSection } from "@patternfly/react-core";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";

interface PropsToTab {
  id: string;
  children: React.ReactNode;
  toolbarItems?: ToolbarItem[];
  dataCy?: string;
}

// Float the tab content
const TabLayout = (props: PropsToTab) => {
  const style: React.CSSProperties = {
    overflowY: "auto",
    maxHeight: "100dvh",
    minHeight: `var(--tab-layout-calc)`,
  };

  return (
    <div id={props.id + "-container"} data-cy={props.dataCy}>
      <Flex direction={{ default: "column" }}>
        <PageSection
          hasBodyWrapper={false}
          id={props.id}
          style={style}
          isFilled
          className="pf-v6-u-pl-xl pf-v6-u-mb-0" // Slightly centers the content and removes the bottom margin
        >
          {props.children}
        </PageSection>
        {props.toolbarItems && (
          <FlexItem
            style={{
              marginTop: 0,
              position: "sticky",
              bottom: 0,
            }}
          >
            <ToolbarLayout
              isSticky
              className={"pf-v6-u-p-md pf-v6-u-pl-xl"}
              toolbarItems={props.toolbarItems}
            />
          </FlexItem>
        )}
      </Flex>
    </div>
  );
};

export default TabLayout;
