import React from "react";
// PatternFly
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, { ToolbarItem } from "./ToolbarLayout";
import BreadCrumb, { BreadCrumbItem } from "./BreadCrumb";

interface PropsToPageWithGrayBorderLayout {
  pageTitle: string;
  id: string;
  toolbarItems?: ToolbarItem[];
  breadcrumbItems?: BreadCrumbItem[];
  height?: string;
  children: React.ReactNode;
}

const PageWithGrayBorderLayout = (props: PropsToPageWithGrayBorderLayout) => {
  const style: React.CSSProperties = {
    overflowY: "auto",
    height: props.height || `calc(100vh - 278.2px)`,
  };

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
