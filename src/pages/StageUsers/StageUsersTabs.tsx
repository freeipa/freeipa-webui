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
import { useNavigate, useParams } from "react-router-dom";
// Components
import UserSettings from "src/components/UserSettings";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useStageUserSettings } from "src/hooks/useUserSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";

const StageUsersTabs = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!uid) {
      // Redirect to the stage users page
      navigate("stage-users");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Stage users",
          url: "../stage-users",
        },
        {
          name: uid,
          url: "../stage-users/" + uid,
          isActive: true,
        },
      ];
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [uid]);

  // Data loaded from DB
  const userSettingsData = useStageUserSettings(uid as string);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  if (userSettingsData.isLoading) {
    return <DataSpinner />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb className="pf-v5-u-mb-md" preText="User login:" />
        <TextContent>
          <Title headingLevel="h1">
            <Text>{uid}</Text>
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
          mountOnEnter
          unmountOnExit
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
