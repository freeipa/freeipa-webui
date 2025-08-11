import React from "react";
// PatternFly
import { PageSection } from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Components
import TitleLayout from "./TitleLayout";
import ToolbarLayout, { ToolbarItem } from "./ToolbarLayout";

interface PageLayoutProps {
  title: string;
  pathname: string;
  hasAlerts: boolean;
  toolbarItems?: ToolbarItem[];
  children: React.ReactNode;
  pagination?: React.ReactNode;
  modals?: React.ReactNode;
}

const PageLayout = (props: PageLayoutProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: props.pathname });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  return (
    <>
      {props.hasAlerts && <alerts.ManagedAlerts />}
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id={props.title + " title"}
          headingLevel="h1"
          text={props.title}
        />
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        {props.toolbarItems && props.toolbarItems.length > 0 && (
          <ToolbarLayout
            className="pf-v6-u-pt-0 pf-v6-u-pl-lg pf-v6-u-pr-md"
            contentClassName="pf-v6-u-p-0"
            toolbarItems={props.toolbarItems}
          />
        )}
        {props.children}
        {props.pagination && props.pagination}
      </PageSection>
      {props.modals && props.modals}
    </>
  );
};

export default PageLayout;
