import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Components
import PrivilegesSettings from "./PrivilegesSettings";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
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

  const [activeTabKey, setActiveTabKey] = useState(section || "settings");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/privileges/" + cn);
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
      navigate("/privileges/" + cn);
    }
    setActiveTabKey(section || "settings");
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
        </Tabs>
      </PageSection>
    </>
  );
};

export default PrivilegesTabs;
