import React, { useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useLocation } from "react-router-dom";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Other
import HostsSettings from "./HostsSettings";
import HostsMemberOf from "./HostsMemberOf";
import HostsManagedBy from "./HostsManagedBy";
// Layouts
import BreadcrumbLayout from "src/components/layouts/BreadcrumbLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { useHostSettings } from "src/hooks/useHostSettingsData";
import DataSpinner from "src/components/layouts/DataSpinner";

const HostsTabs = () => {
  // Get location (React Router DOM) and get state data
  const location = useLocation();
  const hostData: Host = location.state as Host;
  const hostSettingsData = useHostSettings(hostData.fqdn[0]);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  // 'pagesVisited' array will contain the visited pages.
  // - Those will be passed to the 'BreadcrumbLayout' component.
  const pagesVisited = [
    {
      name: "Hosts",
      url: URL_PREFIX + "/hosts",
    },
  ];

  if (hostSettingsData.isLoading || hostSettingsData.host.fqdn === undefined) {
    return <DataSpinner />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadcrumbLayout
          className="pf-v5-u-mb-md"
          userId={hostData.fqdn}
          preText=""
          pagesVisited={pagesVisited}
        />
        <TitleLayout
          id={hostData.fqdn}
          text={hostData.fqdn}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection type="tabs" variant={PageSectionVariants.light} isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="light300"
          isBox
          className="pf-v5-u-ml-lg"
        >
          <Tab
            eventKey={0}
            name="details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <HostsSettings
              host={hostSettingsData.host}
              originalHost={hostSettingsData.originalHost}
              metadata={hostSettingsData.metadata}
              certData={hostSettingsData.certData}
              onHostChange={hostSettingsData.setHost}
              isDataLoading={hostSettingsData.isFetching}
              onRefresh={hostSettingsData.refetch}
              isModified={hostSettingsData.modified}
              onResetValues={hostSettingsData.resetValues}
              modifiedValues={hostSettingsData.modifiedValues}
            />
          </Tab>
          <Tab
            eventKey={1}
            name="details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <HostsMemberOf host={hostData} />
          </Tab>
          <Tab
            eventKey={2}
            name="details"
            title={<TabTitleText>Is managed by</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <HostsManagedBy host={hostData} />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default HostsTabs;
