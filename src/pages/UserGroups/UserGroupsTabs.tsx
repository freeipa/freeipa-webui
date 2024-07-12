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
import TitleLayout from "src/components/layouts/TitleLayout";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
// Components
import UserGroupsSettings from "./UserGroupsSettings";
import { partialGroupToGroup } from "src/utils/groupUtils";
import UserGroupsMembers from "./UserGroupsMembers";
// Hooks
import { useUserGroupSettings } from "src/hooks/useUserGroupSettingsData";
import DataSpinner from "src/components/layouts/DataSpinner";
import { NotFound } from "src/components/errors/PageErrors";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";

// eslint-disable-next-line react/prop-types
const UserGroupsTabs = ({ section }) => {
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userGroupSettingsData = useUserGroupSettings(cn as string);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);

    if (tabIndex === "settings") {
      navigate("/user-groups/" + cn);
    } else if (tabIndex === "member") {
      navigate("/user-groups/" + cn + "/member_user");
    } else if (tabIndex === "memberof") {
      navigate("/user-groups/" + cn + "/memberof_usergroup");
    } else if (tabIndex === "managedby") {
      navigate("/user-groups/" + cn + "/managedby_usergroup");
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/user-groups");
    } else {
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
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/user-groups/" + cn);
    }
    // Infer the general tab key from the section name
    const sect = section as string;
    if (sect.startsWith("member_")) {
      setActiveTabKey("member");
    } else {
      setActiveTabKey(section);
    }
    // TODO: Check more routes here
  }, [section]);

  if (
    userGroupSettingsData.isLoading ||
    userGroupSettingsData.userGroup.cn === undefined
  ) {
    return <DataSpinner />;
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
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb className="pf-v5-u-mb-md" />
        <TitleLayout id={usergroup.cn} text={usergroup.cn} headingLevel="h1" />
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
            name={"members-details"}
            title={<TabTitleText>Members</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <UserGroupsMembers userGroup={usergroup} tabSection={section} />
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

export default UserGroupsTabs;
