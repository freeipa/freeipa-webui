import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Components
import PrivilegesSettings from "src/pages/Privileges/PrivilegesSettings";
import MembersRoles from "src/components/Members/MembersRoles";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import PrivilegesPermissions from "src/pages/Privileges/PrivilegesPermissions";
// Utils
import { partialPrivilegeToPrivilege } from "src/utils/privilegesUtils";
// Hooks
import { usePrivilegeSettings } from "src/hooks/usePrivilegeSettingsData";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
// Navigation
import { NotFound } from "src/components/errors/PageErrors";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import {
  closeHelpPanel,
  toggleHelpPanel,
} from "src/store/Global/contextual-help-slice";

interface PrivilegesTabsProps {
  section: string;
}

// Central mapping between tab keys and routes
const TAB_ROUTES: Record<string, (cn: string) => string> = {
  settings: (cn) => `/privileges/${cn}`,
  permissions: (cn) => `/privileges/${cn}/permissions`,
  member_role: (cn) => `/privileges/${cn}/member_role`,
};

const getTabKeyFromSection = (section?: string): string => {
  if (!section) return "settings";
  return section in TAB_ROUTES ? section : "settings";
};

const PrivilegesTabs = ({ section }: PrivilegesTabsProps) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useContextualHelpTopic("privileges-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    dispatch(closeHelpPanel());
  }, [section, dispatch]);

  const privilegeSettingsData = usePrivilegeSettings(cn);

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
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Privileges",
        url: "/privileges",
      },
      {
        name: cn,
        url: "/privileges/" + cn,
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
    setActiveTabKey(getTabKeyFromSection(section));
  }, [section, cn, navigate]);

  if (privilegeSettingsData.isLoading) {
    return <DataSpinner />;
  }

  if (!privilegeSettingsData.privilege.cn) {
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
          id={privilegeSettingsData.privilege.cn}
          preText="Privilege:"
          text={privilegeSettingsData.privilege.cn}
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
            <PrivilegesSettings
              privilege={privilegeSettingsData.privilege}
              originalPrivilege={privilegeSettingsData.originalPrivilege}
              metadata={privilegeSettingsData.metadata}
              onPrivilegeChange={privilegeSettingsData.setPrivilege}
              isDataLoading={privilegeSettingsData.isFetching}
              onRefresh={privilegeSettingsData.refetch}
              isModified={privilegeSettingsData.modified}
              onResetValues={privilegeSettingsData.resetValues}
              modifiedValues={privilegeSettingsData.modifiedValues}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
          <Tab
            eventKey={"permissions"}
            name="permissions-details"
            title={<TabTitleText>Permissions</TabTitleText>}
          >
            <PrivilegesPermissions
              privilege={partialPrivilegeToPrivilege(
                privilegeSettingsData.privilege
              )}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
          <Tab
            eventKey={"member_role"}
            name="member-role-details"
            title={<TabTitleText>Roles</TabTitleText>}
          >
            <MembersRoles privilege={privilegeSettingsData.privilege} />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default PrivilegesTabs;
