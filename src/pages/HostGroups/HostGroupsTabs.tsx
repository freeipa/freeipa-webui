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
// Layouts
import BreadcrumbLayout from "src/components/layouts/BreadcrumbLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
// Data types
import { HostGroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { useHostGroupSettings } from "src/hooks/useHostGroupSettingsData";
import DataSpinner from "src/components/layouts/DataSpinner";
import { NotFound } from "src/components/errors/PageErrors";

const HostGroupsTabs = () => {
  // Get location (React Router DOM) and get state data
  const location = useLocation();
  const hostGroupsData: HostGroup = location.state as HostGroup;
  const hostGroupSettingsData = useHostGroupSettings(hostGroupsData.cn[0]);

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
      name: "Host groups",
      url: "/host-groups",
    },
  ];

  if (
    hostGroupSettingsData.isLoading ||
    hostGroupSettingsData.hostGroup.cn === undefined
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the hostGroup is not found
  if (
    !hostGroupSettingsData.isLoading &&
    Object.keys(hostGroupSettingsData.hostGroup).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadcrumbLayout
          className="pf-v5-u-mb-md"
          userId={hostGroupsData.cn}
          preText=""
          pagesVisited={pagesVisited}
        />
        <TitleLayout
          id={hostGroupsData.cn}
          text={hostGroupsData.cn}
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
          <Tab
            eventKey={2}
            name="details"
            title={<TabTitleText>Is managed by</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default HostGroupsTabs;
