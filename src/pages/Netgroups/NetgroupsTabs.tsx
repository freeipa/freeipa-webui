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
// Layouts
import BreadcrumbLayout from "src/components/layouts/BreadcrumbLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
// Data types
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { useNetgroupSettings } from "src/hooks/useNetgroupSettingsData";
import DataSpinner from "src/components/layouts/DataSpinner";

const NetgroupsTabs = () => {
  // Get location (React Router DOM) and get state data
  const location = useLocation();
  const netgroupsData: Netgroup = location.state as Netgroup;
  const netgroupSettingsData = useNetgroupSettings(netgroupsData.cn[0]);

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
      name: "Netgroups",
      url: URL_PREFIX + "/netgroups",
    },
  ];

  if (
    netgroupSettingsData.isLoading ||
    netgroupSettingsData.netgroup.cn === undefined
  ) {
    return <DataSpinner />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadcrumbLayout
          className="pf-v5-u-mb-md"
          userId={netgroupSettingsData.netgroup.cn}
          preText=""
          pagesVisited={pagesVisited}
        />
        <TitleLayout
          id={netgroupSettingsData.netgroup.cn}
          text={netgroupSettingsData.netgroup.cn}
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
          </Tab>
          <Tab
            eventKey={1}
            name="details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default NetgroupsTabs;
