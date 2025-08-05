import React from "react";
// PatternFly
import {
  FlexItem,
  Flex,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, { ToolbarItem } from "./ToolbarLayout";
import BreadCrumb, { BreadCrumbItem } from "./BreadCrumb";

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
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        {props.breadcrumbItems && (
          <BreadCrumb
            className="pf-v5-u-mb-md"
            breadcrumbItems={props.breadcrumbItems}
          />
        )}
        <TitleLayout
          id={props.id}
          text={props.pageTitle}
          headingLevel="h1"
          className="pf-v5-u-mt-md pf-v5-u-ml-md pf-v5-u-mb-md"
        />
      </PageSection>
      <PageSection
        hasBodyWrapper={false}
        type="default"
        isFilled
        className="pf-v5-u-m-lg pf-v5-u-mb-0 pf-v5-u-pb-0"
      >
        <Flex direction={{ default: "column" }}>
          <PageSection
            hasBodyWrapper={false}
            id={props.id}
            variant={PageSectionVariants.light}
            className="pf-v5-u-mb-0"
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
