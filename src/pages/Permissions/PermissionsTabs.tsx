import React, { useState } from "react";
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
import { useNavigate } from "react-router";
import PermissionsSettings from "src/pages/Permissions/PermissionsSettings";
import PermissionsPrivileges from "src/pages/Permissions/PermissionsPrivileges";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import { usePermissionSettings } from "src/hooks/usePermissionSettingsData";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { NotFound } from "src/components/errors/PageErrors";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";
import { partialPermissionToPermission } from "src/utils/permissionsUtils";
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import {
  closeHelpPanel,
  toggleHelpPanel,
} from "src/store/Global/contextual-help-slice";

interface PermissionsTabsProps {
  section: string;
}

const TAB_ROUTES: Record<string, (cn: string) => string> = {
  settings: (cn) => `/permissions/${cn}`,
  privileges: (cn) => `/permissions/${cn}/privileges`,
};

const PermissionsTabs = ({ section }: PermissionsTabsProps) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useContextualHelpTopic("permissions-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    dispatch(closeHelpPanel());
  }, [section, dispatch]);

  const permissionSettingsData = usePermissionSettings(cn);

  const [activeTabKey, setActiveTabKey] = useState(section || "settings");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    const tabKey = String(tabIndex);
    const toPath = TAB_ROUTES[tabKey];
    if (toPath) {
      navigate(toPath(cn));
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Permissions",
        url: "/permissions",
      },
      {
        name: cn,
        url: "/permissions/" + cn,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
    dispatch(updateBreadCrumbPath(currentPath));
  }, [cn, dispatch]);

  React.useEffect(() => {
    if (!section) {
      navigate(TAB_ROUTES.settings(cn));
    }
    setActiveTabKey(section || "settings");
  }, [section, cn, navigate]);

  if (permissionSettingsData.isLoading) {
    return <DataSpinner />;
  }

  if (!permissionSettingsData.permission.cn) {
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
          id={permissionSettingsData.permission.cn}
          preText="Permission:"
          text={permissionSettingsData.permission.cn}
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
            <PermissionsSettings
              permission={permissionSettingsData.permission}
              originalPermission={permissionSettingsData.originalPermission}
              metadata={permissionSettingsData.metadata}
              onPermissionChange={permissionSettingsData.setPermission}
              isDataLoading={permissionSettingsData.isFetching}
              onRefresh={permissionSettingsData.refetch}
              isModified={permissionSettingsData.modified}
              onResetValues={permissionSettingsData.resetValues}
              modifiedValues={permissionSettingsData.modifiedValues}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
          <Tab
            eventKey={"privileges"}
            name="privileges-details"
            title={<TabTitleText>Privileges</TabTitleText>}
          >
            <PermissionsPrivileges
              permission={partialPermissionToPermission(
                permissionSettingsData.permission
              )}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default PermissionsTabs;
