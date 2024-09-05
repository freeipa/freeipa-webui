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
import HostGroupsMembers from "./HostGroupsMembers";
import HostGroupsMemberOf from "./HostGroupsMemberOf";

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
  const [groupId, setGroupId] = useState("");

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/host-groups/" + cn);
    } else if (tabIndex === "member") {
      navigate("/host-groups/" + cn + "/member_host");
    } else if (tabIndex === "memberof") {
      navigate("/host-groups/" + cn + "/memberof_hostgroup");
    } else if (tabIndex === "managedby") {
      // navigate("/host-groups/" + cn + "/managedby_hostgroup");
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/host-groups");
    } else {
      setGroupId(cn);
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
      navigate(URL_PREFIX + "/host-groups/" + groupId);
    }
    const section_string = section as string;
    if (section_string.startsWith("memberof_")) {
      setActiveTabKey("memberof");
    } else if (section_string.startsWith("member_")) {
      setActiveTabKey("member");
    } else if (section_string.startsWith("managedby")) {
      // setActiveTabKey("managedby");
    }
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
    <>
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
            eventKey={"member"}
            name="member-details"
            title={<TabTitleText>Members</TabTitleText>}
          >
            <HostGroupsMembers hostGroup={hostgroup} tabSection={section} />
          </Tab>
          <Tab
            eventKey={"memberof"}
            name="memberof-details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <HostGroupsMemberOf hostGroup={hostgroup} tabSection={section} />
          </Tab>
          <Tab
            eventKey={"managedby"}
            name="managedby-details"
            title={<TabTitleText>Is managed by</TabTitleText>}
          ></Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default HostGroupsTabs;
