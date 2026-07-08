import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Components
import RolesSettings from "./RolesSettings";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import RolesMembers from "./RolesMembers";
import { partialRoleToRole } from "src/utils/rolesUtils";
// Hooks
import { useRoleSettings } from "src/hooks/useRolesSettingsData";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import {
  closeHelpPanel,
  toggleHelpPanel,
} from "src/store/Global/contextual-help-slice";

interface RolesTabsProps {
  section: string;
}

const RolesTabs = ({ section }: RolesTabsProps) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useContextualHelpTopic("roles-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Close links panel when tab section is changed
  React.useEffect(() => {
    dispatch(closeHelpPanel());
  }, [section, dispatch]);

  // Data loaded from DB
  const roleSettingsData = useRoleSettings(cn);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("settings");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/roles/" + cn);
    } else if (tabIndex === "member") {
      navigate("/roles/" + cn + "/member_user");
    }
  };

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Roles",
        url: URL_PREFIX + "/roles",
      },
      {
        name: cn,
        url: URL_PREFIX + "/roles/" + cn,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
    dispatch(updateBreadCrumbPath(currentPath));
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/roles/" + cn);
    }
    if (section.startsWith("member_")) {
      setActiveTabKey("member");
    } else {
      setActiveTabKey(section);
    }
  }, [section]);

  if (roleSettingsData.isLoading || roleSettingsData.role.cn === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the role is not found
  if (
    !roleSettingsData.isLoading &&
    Object.keys(roleSettingsData.role).length === 0
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
          id={roleSettingsData.role.cn}
          preText="Role:"
          text={roleSettingsData.role.cn}
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
            <RolesSettings
              role={roleSettingsData.role}
              originalRole={roleSettingsData.originalRole}
              metadata={roleSettingsData.metadata}
              onRoleChange={roleSettingsData.setRole}
              isDataLoading={roleSettingsData.isFetching}
              onRefresh={roleSettingsData.refetch}
              isModified={roleSettingsData.modified}
              onResetValues={roleSettingsData.resetValues}
              modifiedValues={roleSettingsData.modifiedValues}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
          <Tab
            eventKey={"member"}
            name={"member-details"}
            title={<TabTitleText>Members</TabTitleText>}
          >
            <RolesMembers
              role={partialRoleToRole(roleSettingsData.role)}
              tabSection={section}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default RolesTabs;
