import React from "react";
// PatternFly
import { PageSection } from "@patternfly/react-core";
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
      <PageSection hasBodyWrapper={false} className="pf-v6-u-pr-0">
        <TitleLayout
          id={props.id}
          text={props.pageTitle}
          headingLevel="h1"
          className="pf-v6-u-mt-md pf-v6-u-ml-md"
        />
      </PageSection>
      <PageSection
        hasBodyWrapper={false}
        type="default"
        isFilled
        className="pf-v6-u-m-lg pf-v6-u-mb-0 pf-v6-u-pb-0"
      >
        <>
          <PageSection
            hasBodyWrapper={false}
            id={props.id}
            style={style}
            className="pf-v6-u-mb-0"
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
