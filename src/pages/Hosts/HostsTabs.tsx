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
import HostsSettings from "./HostsSettings";
import HostsMemberOf from "./HostsMemberOf";
import HostsManagedBy from "./HostsManagedBy";
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { useHostSettings } from "src/hooks/useHostSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { partialHostToHost } from "src/utils/hostUtils";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";

// eslint-disable-next-line react/prop-types
const HostsTabs = ({ section }) => {
  const { fqdn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [hostId, setHostId] = useState("");

  // Contextual links panel
  const [fromPageSelected, setFromPageSelected] =
    React.useState("hosts-settings");
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

  // - Close links panel when tab section is changed
  React.useEffect(() => {
    setIsContextualPanelExpanded(false);
  }, [section]);

  // Data loaded from DB
  const hostSettingsData = useHostSettings(fqdn as string);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    const tabIdx = tabIndex.toString();
    if (tabIndex === "settings") {
      navigate("/hosts/" + hostId);
    } else if (tabIdx.startsWith("memberof")) {
      if (tabIdx === "memberof") {
        navigate("/hosts/" + hostId + "/" + tabIdx + "_hostgroup");
      } else {
        navigate("/hosts/" + hostId + "/" + tabIdx);
      }
    } else if (tabIndex === "managedby") {
      navigate("/hosts/" + hostId + "/managedby_host");
    }
  };

  React.useEffect(() => {
    if (!fqdn) {
      // Redirect to the main page
      navigate(URL_PREFIX + "/hosts");
    } else {
      setHostId(fqdn);
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Hosts",
          url: URL_PREFIX + "/hosts",
        },
        {
          name: fqdn,
          url: URL_PREFIX + "/hosts/" + fqdn,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [fqdn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/hosts/" + hostId);
    }

    // Case: any of the 'member of' sections is clicked
    if (section !== "settings" && section !== "managedby") {
      setActiveTabKey("memberof_hostgroup");
    } else {
      setActiveTabKey(section);
    }
  }, [section]);

  if (hostSettingsData.isLoading || !hostSettingsData.host) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the host is not found
  if (
    !hostSettingsData.isLoading &&
    Object.keys(hostSettingsData.host).length === 0
  ) {
    return <NotFound />;
  }

  const host = hostSettingsData.host;

  return (
    <>
      <ContextualHelpPanel
        fromPage={fromPageSelected}
        isExpanded={isContextualPanelExpanded}
        onClose={onCloseContextualPanel}
      >
        <PageSection
          variant={PageSectionVariants.light}
          className="pf-v5-u-pr-0"
        >
          <BreadCrumb
            className="pf-v5-u-mb-md"
            breadcrumbItems={breadcrumbItems}
          />
          <TitleLayout
            id={hostId}
            preText="Host:"
            text={hostId}
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
              eventKey={"settings"}
              name="settings-details"
              title={<TabTitleText>Settings</TabTitleText>}
            >
              <HostsSettings
                host={host}
                originalHost={hostSettingsData.originalHost}
                metadata={hostSettingsData.metadata}
                certData={hostSettingsData.certData}
                onHostChange={hostSettingsData.setHost}
                isDataLoading={hostSettingsData.isFetching}
                onRefresh={hostSettingsData.refetch}
                isModified={hostSettingsData.modified}
                onResetValues={hostSettingsData.resetValues}
                modifiedValues={hostSettingsData.modifiedValues}
                changeFromPage={changeFromPage}
                onOpenContextualPanel={onOpenContextualPanel}
              />
            </Tab>
            <Tab
              eventKey={"memberof_hostgroup"}
              name="memberof-details"
              title={<TabTitleText>Is a member of</TabTitleText>}
            >
              <HostsMemberOf
                host={partialHostToHost(host)}
                tabSection={section}
              />
            </Tab>
            <Tab
              eventKey={"managedby"}
              name="managedby-details"
              title={<TabTitleText>Is managed by</TabTitleText>}
            >
              <HostsManagedBy host={host as Host} />
            </Tab>
          </Tabs>
        </PageSection>
      </ContextualHelpPanel>
    </>
  );
};

export default HostsTabs;
