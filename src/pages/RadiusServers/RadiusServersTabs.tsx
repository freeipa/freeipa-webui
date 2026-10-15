import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Components
import RadiusServersSettings from "src/pages/RadiusServers/RadiusServersSettings";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useRadiusServerSettings } from "src/hooks/useRadiusServerSettingsData";
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

interface RadiusServersTabsProps {
  section: string;
}

const RadiusServersTabs = ({ section }: RadiusServersTabsProps) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = "radius-servers";

  useContextualHelpTopic("radius-servers-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Data loaded from the API
  const radiusServerSettingsData = useRadiusServerSettings(cn);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  // Close links panel when tab section is changed
  React.useEffect(() => {
    dispatch(closeHelpPanel());
  }, [section, dispatch]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + cn);
    }
  };

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "RADIUS servers",
        url: "/" + pathname,
      },
      {
        name: cn,
        url: "/" + pathname + "/" + cn,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
    dispatch(updateBreadCrumbPath(currentPath));
  }, [cn]);

  // Handling of the API data
  if (
    radiusServerSettingsData.isLoading ||
    radiusServerSettingsData.radiusServer.cn === undefined
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the server is not found
  if (
    !radiusServerSettingsData.isLoading &&
    Object.keys(radiusServerSettingsData.radiusServer).length === 0
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
          id={cn}
          preText="RADIUS server:"
          text={cn}
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
            <RadiusServersSettings
              radiusServer={radiusServerSettingsData.radiusServer}
              originalRadiusServer={
                radiusServerSettingsData.originalRadiusServer
              }
              metadata={radiusServerSettingsData.metadata}
              onRadiusServerChange={radiusServerSettingsData.setRadiusServer}
              isDataLoading={radiusServerSettingsData.isFetching}
              onRefresh={radiusServerSettingsData.refetch}
              isModified={radiusServerSettingsData.modified}
              onResetValues={radiusServerSettingsData.resetValues}
              modifiedValues={radiusServerSettingsData.modifiedValues}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default RadiusServersTabs;
