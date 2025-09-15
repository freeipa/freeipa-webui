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
    height: `var(--tab-layout-calc)`,
  };

  return (
    <div data-cy={props.dataCy}>
      <Flex direction={{ default: "column" }}>
        <div className="pf-v6-u-pt-lg pf-v6-u-pl-lg pf-v6-u-pr-lg">
          <PageSection hasBodyWrapper={false} id={props.id} style={style}>
            {props.children}
          </PageSection>
        </div>
        {props.toolbarItems && (
          <FlexItem
            style={{ marginTop: "auto", position: "sticky", bottom: 0 }}
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
