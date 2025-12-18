import React from "react";
// PatternFly
import { Flex, FlexItem, PageSection } from "@patternfly/react-core";
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
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout id={props.id} text={props.pageTitle} headingLevel="h1" />
      </PageSection>
      <PageSection
        hasBodyWrapper={false}
        type="default"
        isFilled
        className="pf-v6-u-pl-xl pf-v6-u-pb-0"
      >
        <Flex direction={{ default: "column" }}>
          <FlexItem>{props.children}</FlexItem>
          <FlexItem
            className="pf-v6-u-mt-auto"
            style={{ position: "sticky", bottom: 0 }}
          >
            {props.toolbarItems && (
              <ToolbarLayout isSticky toolbarItems={props.toolbarItems} />
            )}
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export default PageWithGrayBorderLayout;
