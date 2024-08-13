import React, { useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Layouts
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useHostGroupSettings } from "src/hooks/useHostGroupSettingsData";
// Utils
import { partialGroupToGroup } from "src/utils/hostGroupUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import HostGroupsSettings from "./HostGroupsSettings";

// eslint-disable-next-line react/prop-types
const HostGroupsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const hostGroupSettingsData = useHostGroupSettings(cn as string);
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/host-groups/" + cn);
    } else if (tabIndex === "memberof") {
      navigate("/host-groups/" + cn + "/memberof_hostgroup");
    } else if (tabIndex === "managedby") {
      navigate("/host-groups/" + cn + "/managedby_hostgroup");
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/host-groups");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Host groups",
          url: URL_PREFIX + "/host-groups",
        },
        {
          name: cn,
          url: URL_PREFIX + "/host-groups/" + cn,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/host-groups/" + cn);
    }
    setActiveTabKey(section);
  }, [section]);

  if (
    hostGroupSettingsData.isLoading ||
    hostGroupSettingsData.hostGroup.cn === undefined
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the hostGroup is not found
  if (
    !hostGroupSettingsData.isLoading &&
    Object.keys(hostGroupSettingsData.hostGroup).length === 0
  ) {
    return <NotFound />;
  }

  const hostgroup = partialGroupToGroup(hostGroupSettingsData.hostGroup);

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={hostgroup.cn}
          preText="Host group:"
          text={hostgroup.cn}
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
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <HostGroupsSettings
              hostGroup={hostGroupSettingsData.hostGroup}
              originalGroup={hostGroupSettingsData.originalGroup}
              metadata={hostGroupSettingsData.metadata}
              onGroupChange={hostGroupSettingsData.setHostGroup}
              isDataLoading={hostGroupSettingsData.isFetching}
              onRefresh={hostGroupSettingsData.refetch}
              isModified={hostGroupSettingsData.modified}
              onResetValues={hostGroupSettingsData.resetValues}
              modifiedValues={hostGroupSettingsData.modifiedValues}
            />
          </Tab>
          <Tab
            eventKey={"memberof"}
            name="memberof-details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
          </Tab>
          <Tab
            eventKey={"managedby"}
            name="managedby-details"
            title={<TabTitleText>Is managed by</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default HostGroupsTabs;
