import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// Components
import UserSettings from "src/components/UsersSections/UserSettings";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";
// Hooks
import { useUserSettings } from "src/hooks/useUserSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
import { UidParams, useSafeParams } from "src/utils/paramsUtils";

const PreservedUsersTabs = () => {
  // Get location (React Router DOM) and get state data
  const { uid } = useSafeParams<UidParams>(["uid"]);
  const dispatch = useAppDispatch();

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Preserved users",
        url: URL_PREFIX + "/preserved-users",
      },
      {
        name: uid,
        url: URL_PREFIX + "/preserved-users/" + uid,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey(0);
    dispatch(updateBreadCrumbPath(currentPath));
  }, [uid]);

  // Contextual links panel
  const [fromPageSelected, setFromPageSelected] = React.useState(
    "preserved-users-settings"
  );
  const [isContextualPanelExpanded, setIsContextualPanelExpanded] =
    React.useState(false);

  const changeFromPage = (fromPage: string) => {
    setFromPageSelected(fromPage);
  };

  const onOpenContextualPanel = () => {
    setIsContextualPanelExpanded(!isContextualPanelExpanded);
  };

  const onCloseContextualPanel = () => {
    setIsContextualPanelExpanded(false);
  };

  // Data loaded from DB
  const userSettingsData = useUserSettings(uid);

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
      <ContextualHelpPanel
        fromPage={fromPageSelected}
        isExpanded={isContextualPanelExpanded}
        onClose={onCloseContextualPanel}
      >
        <PageSection hasBodyWrapper={false}>
          <BreadCrumb breadcrumbItems={breadcrumbItems} />
          <TitleLayout
            id={uid}
            preText="Preserved user:"
            text={uid}
            headingLevel="h1"
          />
        </PageSection>
        <PageSection hasBodyWrapper={false} type="tabs" isFilled>
          <Tabs
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            variant="secondary"
            isBox
            className="pf-v6-u-ml-lg"
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
                from="preserved-users"
                changeFromPage={changeFromPage}
                onOpenContextualPanel={onOpenContextualPanel}
              />
            </Tab>
          </Tabs>
        </PageSection>
      </ContextualHelpPanel>
    </>
  );
};

export default PreservedUsersTabs;
