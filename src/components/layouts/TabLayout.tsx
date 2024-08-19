import React from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";

interface PropsToTab {
  id: string;
  children: React.ReactNode;
  toolbarItems?: ToolbarItem[];
}

// Float the tab content
const TabLayout = (props: PropsToTab) => {
  // When having toolbar, make the page section to use the whole real estate.
  // Otherwise let the page section size be based on its content but limit
  // the height to the viewport.
  let style: React.CSSProperties = {
    overflowY: "auto",
    height: `calc(100vh - 319.2px)`,
  };
  if (!props.toolbarItems) {
    style = { overflowY: "auto", maxHeight: `calc(100vh - 275px)` };
  }

  return (
    <>
      <div className="pf-v5-u-pt-lg pf-v5-u-pl-lg pf-v5-u-pr-lg">
        <PageSection
          id={props.id}
          variant={PageSectionVariants.light}
          style={style}
        >
          {props.children}
        </PageSection>
      </div>
      {props.toolbarItems && (
        <ToolbarLayout
          isSticky
          className={"pf-v5-u-p-md pf-v5-u-ml-lg pf-v5-u-mr-lg"}
          toolbarItems={props.toolbarItems}
        />
      )}
    </>
  );
};

export default TabLayout;
