import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Components
import RolesSettings from "./RolesSettings";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";
import DataSpinner from "src/components/layouts/DataSpinner";
import RolesMembers from "./RolesMembers";
import RolesPrivileges from "./RolesPrivileges";
import { partialRoleToRole } from "src/utils/rolesUtils";
// Hooks
import { useRoleSettings } from "src/hooks/useRolesSettingsData";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";

interface RolesTabsProps {
  section: string;
}

// Central mapping between tab keys and routes
const TAB_ROUTES: Record<string, (cn: string) => string> = {
  settings: (cn) => `/roles/${cn}`,
  member: (cn) => `/roles/${cn}/member_user`,
  privileges: (cn) => `/roles/${cn}/privileges`,
};

// Normalize section -> tab key
const getTabKeyFromSection = (section?: string): string => {
  if (!section) return "settings";
  if (section.startsWith("member_")) return "member";
  return section in TAB_ROUTES ? section : "settings";
};

const RolesTabs = ({ section }: RolesTabsProps) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Contextual links panel
  const [isContextualPanelExpanded, setIsContextualPanelExpanded] =
    useState(false);

  const onOpenContextualPanel = () => {
    setIsContextualPanelExpanded(!isContextualPanelExpanded);
  };

  const onCloseContextualPanel = () => {
    setIsContextualPanelExpanded(false);
  };

  // Close links panel when tab section is changed
  React.useEffect(() => {
    setIsContextualPanelExpanded(false);
  }, [section]);

  // Data loaded from DB
  const roleSettingsData = useRoleSettings(cn);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(() =>
    getTabKeyFromSection(section)
  );

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
      navigate(URL_PREFIX + TAB_ROUTES.settings(cn));
    }
    setActiveTabKey(getTabKeyFromSection(section));
  }, [section, cn, navigate]);

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
      <ContextualHelpPanel
        fromPage="roles-settings"
        isExpanded={isContextualPanelExpanded}
        onClose={onCloseContextualPanel}
      >
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
                onOpenContextualPanel={onOpenContextualPanel}
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
            <Tab
              eventKey={"privileges"}
              name={"privileges-details"}
              title={<TabTitleText>Privileges</TabTitleText>}
            >
              <RolesPrivileges
                role={partialRoleToRole(roleSettingsData.role)}
              />
            </Tab>
          </Tabs>
        </PageSection>
      </ContextualHelpPanel>
    </>
  );
};

export default RolesTabs;
