import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Components
import SystemAccountSettings from "src/pages/SystemAccounts/SystemAccountSettings";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useSysAccountSettings } from "src/hooks/useSysAccountSettingsData";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
// Navigation
import { NotFound } from "src/components/errors/PageErrors";
import { UidParams, useSafeParams } from "src/utils/paramsUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import {
  closeHelpPanel,
  toggleHelpPanel,
} from "src/store/Global/contextual-help-slice";

interface SystemAccountTabsProps {
  section: string;
}

const pathname = "system-accounts";

const SystemAccountTabs = ({ section }: SystemAccountTabsProps) => {
  const { uid } = useSafeParams<UidParams>(["uid"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useContextualHelpTopic("sysaccount-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Close help panel when tab section is changed
  React.useEffect(() => {
    dispatch(closeHelpPanel());
  }, [section, dispatch]);

  // Data loaded from DB
  const sysAccountSettingsData = useSysAccountSettings(uid);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + uid);
    }
  };

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "System accounts",
        url: "/" + pathname,
      },
      {
        name: uid,
        url: "/" + pathname + "/" + uid,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
    dispatch(updateBreadCrumbPath(currentPath));
  }, [uid]);

  if (
    sysAccountSettingsData.isLoading ||
    sysAccountSettingsData.sysAccount.uid === undefined
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the system account is not found
  if (
    !sysAccountSettingsData.isLoading &&
    Object.keys(sysAccountSettingsData.sysAccount).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb
          className="pf-v6-u-mb-sm"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={sysAccountSettingsData.sysAccount.uid}
          preText="System account:"
          text={sysAccountSettingsData.sysAccount.uid}
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
            eventKey={"settings"}
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <SystemAccountSettings
              sysAccount={sysAccountSettingsData.sysAccount}
              originalSysAccount={sysAccountSettingsData.originalSysAccount}
              metadata={sysAccountSettingsData.metadata}
              onSysAccountChange={sysAccountSettingsData.setSysAccount}
              isDataLoading={sysAccountSettingsData.isFetching}
              onRefresh={sysAccountSettingsData.refetch}
              isModified={sysAccountSettingsData.modified}
              onResetValues={sysAccountSettingsData.resetValues}
              modifiedValues={sysAccountSettingsData.modifiedValues}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default SystemAccountTabs;
