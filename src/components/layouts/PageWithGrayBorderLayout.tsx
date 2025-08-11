import React from "react";
// PatternFly
import { Flex, FlexItem, PageSection } from "@patternfly/react-core";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, { ToolbarItem } from "./ToolbarLayout";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";

interface PropsToPageWithGrayBorderLayout {
  pageTitle: string;
  id: string;
  toolbarItems?: ToolbarItem[];
  children: React.ReactNode;
}

const PageWithGrayBorderLayout = (props: PropsToPageWithGrayBorderLayout) => {
  const style: React.CSSProperties = {
    overflowY: "auto",
    height: "65vh",
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout id={props.id} text={props.pageTitle} headingLevel="h1" />
      </PageSection>
      <PageSection
        hasBodyWrapper={false}
        type="default"
        isFilled
        className="pf-v6-u-ml-lg"
      >
        <Flex direction={{ default: "column" }}>
          <OuterScrollContainer>
            <InnerScrollContainer style={style}>
              <FlexItem>{props.children}</FlexItem>
            </InnerScrollContainer>
          </OuterScrollContainer>
          <FlexItem
            style={{ marginTop: "auto", position: "sticky", bottom: 0 }}
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
