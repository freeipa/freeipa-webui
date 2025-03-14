import React from "react";
// PatternFly
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, { ToolbarItem } from "./ToolbarLayout";

interface PropsToPageWithGrayBorderLayout {
  pageTitle: string;
  id: string;
  toolbarItems?: ToolbarItem[];
  children: React.ReactNode;
}

const PageWithGrayBorderLayout = (props: PropsToPageWithGrayBorderLayout) => {
  const style: React.CSSProperties = {
    overflowY: "auto",
    height: `calc(100vh - 278.2px)`,
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <TitleLayout
          id={props.id}
          text={props.pageTitle}
          headingLevel="h1"
          className="pf-v5-u-mt-md pf-v5-u-ml-md"
        />
      </PageSection>
      <PageSection
        type="default"
        variant={PageSectionVariants.light}
        isFilled
        className="pf-v5-u-m-lg pf-v5-u-mb-0 pf-v5-u-pb-0"
      >
        <>
          <PageSection
            id={props.id}
            variant={PageSectionVariants.light}
            style={style}
            className="pf-v5-u-mb-0"
          >
            {props.children}
          </PageSection>
          {props.toolbarItems && (
            <ToolbarLayout isSticky toolbarItems={props.toolbarItems} />
          )}
        </>
      </PageSection>
    </>
  );
};

export default PageWithGrayBorderLayout;
