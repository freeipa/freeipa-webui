import React, { useState } from "react";
// PatternFly
import {
  Title,
  Page,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useLocation } from "react-router-dom";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Other
import UserSettings from "src/components/UserSettings";
// Layouts
import BreadcrumbLayout from "src/components/layouts/BreadcrumbLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useStageUserSettings } from "src/hooks/useUserSettingsData";

const StageUsersTabs = () => {
  // Get location (React Router DOM) and get state data
  const location = useLocation();
  const userData: User = location.state as User;
  const uid = userData.uid;

  // Data loaded from DB
  const userSettingsData = useStageUserSettings(uid);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  // 'pagesVisited' array will contain the visited pages.
  // - Those will be passed to the BreadcrumbLayout component.
  const pagesVisited = [
    {
      name: "Stage users",
      url: URL_PREFIX + "/stage-users",
    },
  ];

  if (userSettingsData.isLoading) {
    return <DataSpinner />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadcrumbLayout
          className="pf-v5-u-mb-md"
          userId={userData.uid}
          pagesVisited={pagesVisited}
        />
        <TextContent>
          <Title headingLevel="h1">
            <Text>{userData.uid}</Text>
          </Title>
        </TextContent>
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
            <UserSettings
              originalUser={userSettingsData.originalUser}
              user={userSettingsData.user}
              metadata={userSettingsData.metadata}
              pwPolicyData={userSettingsData.pwPolicyData}
              krbPolicyData={userSettingsData.krbtPolicyData}
              certData={userSettingsData.certData}
              onUserChange={userSettingsData.setUser}
              isDataLoading={userSettingsData.isFetching}
              onRefresh={userSettingsData.refetch}
              isModified={userSettingsData.modified}
              onResetValues={userSettingsData.resetValues}
              modifiedValues={userSettingsData.modifiedValues}
              radiusProxyData={userSettingsData.radiusServers}
              idpData={userSettingsData.idpServers}
              from="stage-users"
            />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default StageUsersTabs;
