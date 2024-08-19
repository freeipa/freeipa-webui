import React, { useState } from "react";
// PatternFly
import {
  PageSection,
  PageSectionVariants,
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
import TitleLayout from "src/components/layouts/TitleLayout";
// Hooks
import { useStageUserSettings } from "src/hooks/useUserSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";

const StageUsersTabs = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    if (!uid) {
      // Redirect to the stage users page
      navigate(URL_PREFIX + "stage-users");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Stage users",
          url: URL_PREFIX + "/stage-users",
        },
        {
          name: uid,
          url: URL_PREFIX + "/stage-users/" + uid,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey(0);
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

  // Show the 'NotFound' page if the user is not found
  if (
    !userSettingsData.isLoading &&
    Object.keys(userSettingsData.user).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={uid ? uid : ""}
          preText="Staged user:"
          text={uid ? uid : ""}
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
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={0}
            name="details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
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
    </>
  );
};

export default StageUsersTabs;
