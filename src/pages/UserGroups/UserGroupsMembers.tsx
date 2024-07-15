import React, { useState } from "react";
// PatternFly
import {
  Badge,
  Page,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetGroupByIdQuery } from "src/services/rpcUserGroups";
// 'Members' sections
import MembersUsers from "src/components/Members/MembersUsers";
import MembersUserGroups from "src/components/Members/MembersUserGroups";
import MembersServices from "src/components/Members/MembersServices";
import MembersExternal from "src/components/Members/MembersExternal";

interface PropsToUserGroupsMembers {
  userGroup: UserGroup;
  tabSection: string;
}

const UserGroupsMembers = (props: PropsToUserGroupsMembers) => {
  const navigate = useNavigate();

  // User groups' full data
  const userGroupQuery = useGetGroupByIdQuery(props.userGroup.cn);
  const userGroupData = userGroupQuery.data || {};

  const [userGroup, setUserGroup] = useState<Partial<UserGroup>>({});

  React.useEffect(() => {
    if (!userGroupQuery.isFetching && userGroupData) {
      setUserGroup({ ...userGroupData });
    }
  }, [userGroupData, userGroupQuery.isFetching]);

  const onRefreshUserGroupData = () => {
    userGroupQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "user-groups", noBreadcrumb: true });

  // 'Users' length to show in tab badge
  const [usersLength, setUsersLength] = React.useState(0);

  React.useEffect(() => {
    if (userGroup && userGroup.member_user) {
      setUsersLength(userGroup.member_user.length);
    }
  }, [userGroup]);

  // 'User Groups' length to show in tab badge
  const [userGroupsLength, setUserGroupsLength] = React.useState(0);

  React.useEffect(() => {
    if (userGroup && userGroup.member_group) {
      setUserGroupsLength(userGroup.member_group.length);
    }
  }, [userGroup]);

  // 'Services' length to show in tab badge
  const [servicesLength, setServicesLength] = React.useState(0);

  React.useEffect(() => {
    if (userGroup && userGroup.member_service) {
      setServicesLength(userGroup.member_service.length);
    }
  }, [userGroup]);

  // 'Externals' length to show in tab badge
  const [externalsLength, setExternalsLength] = React.useState(0);

  React.useEffect(() => {
    if (userGroup && userGroup.member_external) {
      setExternalsLength(userGroup.member_external.length);
    }
  }, [userGroup]);

  // TODO: Add the rest of the tab lengths here

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(props.tabSection);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    navigate("/user-groups/" + props.userGroup.cn + "/" + tabIndex);
  };

  React.useEffect(() => {
    setActiveTabKey(props.tabSection);
  }, [props.tabSection]);

  return (
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg"
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"member_user"}
            name="member_user"
            title={
              <TabTitleText>
                Users{" "}
                <Badge key={0} isRead>
                  {usersLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersUsers
              entity={userGroup}
              id={userGroup.cn as string}
              from="user-groups"
              isDataLoading={userGroupQuery.isFetching}
              onRefreshData={onRefreshUserGroupData}
              member_user={userGroup.member_user || []}
            />
          </Tab>
          <Tab
            eventKey={"member_group"}
            name="member_group"
            title={
              <TabTitleText>
                User Groups{" "}
                <Badge key={1} isRead>
                  {userGroupsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersUserGroups
              entity={userGroup}
              id={userGroup.cn as string}
              from="user-groups"
              isDataLoading={userGroupQuery.isFetching}
              onRefreshData={onRefreshUserGroupData}
              member_group={userGroup.member_group || []}
            />
          </Tab>
          <Tab
            eventKey={"member_service"}
            name="member_service"
            title={
              <TabTitleText>
                Services{" "}
                <Badge key={2} isRead>
                  {servicesLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersServices
              entity={userGroup}
              id={userGroup.cn as string}
              from="user-groups"
              isDataLoading={userGroupQuery.isFetching}
              onRefreshData={onRefreshUserGroupData}
              member_service={userGroup.member_service || []}
            />
          </Tab>
          <Tab
            eventKey={"member_external"}
            name="member_external"
            title={
              <TabTitleText>
                External{" "}
                <Badge key={3} isRead>
                  {externalsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersExternal
              entity={userGroup}
              id={userGroup.cn as string}
              from="user-groups"
              isDataLoading={userGroupQuery.isFetching}
              onRefreshData={onRefreshUserGroupData}
              member_external={userGroup.member_external || []}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default UserGroupsMembers;
