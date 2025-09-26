import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
// Components
import UserGroupsSettings from "./UserGroupsSettings";
import { partialGroupToGroup } from "src/utils/groupUtils";
import UserGroupsMembers from "./UserGroupsMembers";
import UserGroupsMemberOf from "./UserGroupsMemberOf";
import UserGroupsMemberManagers from "./UserGroupsMemberManagers";
// Hooks
import { useUserGroupSettings } from "src/hooks/useUserGroupSettingsData";
import DataSpinner from "src/components/layouts/DataSpinner";
import { NotFound } from "src/components/errors/PageErrors";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";

// eslint-disable-next-line react/prop-types
const UserGroupsTabs = ({ section }) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [groupId, setGroupId] = useState("");

  const userGroupSettingsData = useUserGroupSettings(cn);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/user-groups/" + cn);
    } else if (tabIndex === "member") {
      navigate("/user-groups/" + cn + "/member_user");
    } else if (tabIndex === "memberof") {
      navigate("/user-groups/" + cn + "/memberof_usergroup");
    } else if (tabIndex === "manager") {
      navigate("/user-groups/" + cn + "/manager_user");
    }
  };

  React.useEffect(() => {
    setGroupId(cn);
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "User groups",
        url: URL_PREFIX + "/user-groups",
      },
      {
        name: cn,
        url: URL_PREFIX + "/user-groups/" + cn,
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
      navigate(URL_PREFIX + "/user-groups/" + groupId);
    }
    const section_string = section as string;
    if (section_string === "settings") {
      setActiveTabKey("settings");
    } else if (section_string.startsWith("memberof_")) {
      setActiveTabKey("memberof");
    } else if (section_string.startsWith("member_")) {
      setActiveTabKey("member");
    } else if (section_string.startsWith("manager_")) {
      setActiveTabKey("manager");
    }
  }, [section]);

  if (
    userGroupSettingsData.isLoading ||
    userGroupSettingsData.userGroup.cn === undefined
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the host is not found
  if (
    !userGroupSettingsData.isLoading &&
    Object.keys(userGroupSettingsData.userGroup).length === 0
  ) {
    return <NotFound />;
  }

  const usergroup = partialGroupToGroup(userGroupSettingsData.userGroup);

  // Show the 'NotFound' page if the userGroup is not found
  if (
    !userGroupSettingsData.isLoading &&
    Object.keys(userGroupSettingsData.userGroup).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={usergroup.cn}
          preText="User group:"
          text={usergroup.cn}
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
            <UserGroupsSettings
              userGroup={userGroupSettingsData.userGroup}
              originalGroup={userGroupSettingsData.originalGroup}
              metadata={userGroupSettingsData.metadata}
              onGroupChange={userGroupSettingsData.setUserGroup}
              isDataLoading={userGroupSettingsData.isFetching}
              onRefresh={userGroupSettingsData.refetch}
              isModified={userGroupSettingsData.modified}
              onResetValues={userGroupSettingsData.resetValues}
              modifiedValues={userGroupSettingsData.modifiedValues}
              pwPolicyData={userGroupSettingsData.pwPolicyData}
            />
          </Tab>
          <Tab
            eventKey={"member"}
            name={"member-details"}
            title={<TabTitleText>Members</TabTitleText>}
          >
            <UserGroupsMembers userGroup={usergroup} tabSection={section} />
          </Tab>
          <Tab
            eventKey={"memberof"}
            name="memberof-details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <UserGroupsMemberOf userGroup={usergroup} tabSection={section} />
          </Tab>
          <Tab
            eventKey={"manager"}
            name="manager-details"
            title={<TabTitleText>Member managers</TabTitleText>}
          >
            <UserGroupsMemberManagers
              userGroup={usergroup}
              tabSection={section}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default UserGroupsTabs;
