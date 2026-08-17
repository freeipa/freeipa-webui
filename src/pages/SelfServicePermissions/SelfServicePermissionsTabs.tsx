import React, { useState } from "react";
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
import { useNavigate } from "react-router";
import SelfServicePermissionsSettings from "src/pages/SelfServicePermissions/SelfServicePermissionsSettings";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import { useSelfServicePermissionSettings } from "src/hooks/useSelfServicePermissionSettingsData";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { NotFound } from "src/components/errors/PageErrors";
import { AcinameParams, useSafeParams } from "src/utils/paramsUtils";
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import {
  closeHelpPanel,
  toggleHelpPanel,
} from "src/store/Global/contextual-help-slice";

interface SelfServicePermissionsTabsProps {
  section: string;
}

const SelfServicePermissionsTabs = ({
  section,
}: SelfServicePermissionsTabsProps) => {
  const { aciname } = useSafeParams<AcinameParams>(["aciname"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useContextualHelpTopic("selfservice-permissions-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    dispatch(closeHelpPanel());
  }, [section, dispatch]);

  const permissionSettingsData = useSelfServicePermissionSettings(aciname);

  const [activeTabKey, setActiveTabKey] = useState(section || "settings");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/selfservice-permissions/" + aciname);
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Self service permissions",
        url: "/selfservice-permissions",
      },
      {
        name: aciname,
        url: "/selfservice-permissions/" + aciname,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
    dispatch(updateBreadCrumbPath(currentPath));
  }, [aciname, dispatch]);

  React.useEffect(() => {
    if (!section) {
      navigate("/selfservice-permissions/" + aciname);
    }
    setActiveTabKey(section || "settings");
  }, [section, aciname, navigate]);

  if (permissionSettingsData.isLoading) {
    return <DataSpinner />;
  }

  if (!permissionSettingsData.permission.aciname) {
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
          id={permissionSettingsData.permission.aciname}
          preText="Self-service permission:"
          text={permissionSettingsData.permission.aciname}
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
            <SelfServicePermissionsSettings
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
        </Tabs>
      </PageSection>
    </>
  );
};

export default SelfServicePermissionsTabs;
