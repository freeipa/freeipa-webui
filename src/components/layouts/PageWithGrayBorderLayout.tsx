import React from "react";
// PatternFly
import { FlexItem, Flex, PageSection } from "@patternfly/react-core";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, { ToolbarItem } from "./ToolbarLayout";
import { BreadCrumbItem } from "./BreadCrumb";

interface PropsToPageWithGrayBorderLayout {
  pageTitle: string;
  id: string;
  toolbarItems?: ToolbarItem[];
  breadcrumbItems?: BreadCrumbItem[];
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
        <Flex direction={{ default: "column" }}>
          <PageSection
            hasBodyWrapper={false}
            id={props.id}
            style={style}
            className="pf-v6-u-mb-0"
          >
            {props.children}
          </PageSection>
          {props.toolbarItems && (
            <FlexItem
              style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}
            >
              <ToolbarLayout toolbarItems={props.toolbarItems} />
            </FlexItem>
          )}
        </Flex>
      </PageSection>
    </>
  );
};

export default PageWithGrayBorderLayout;
