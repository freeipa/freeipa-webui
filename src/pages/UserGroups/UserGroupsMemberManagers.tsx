import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetGroupByIdQuery } from "src/services/rpcUserGroups";
// 'Members' sections
import ManagersUsers from "src/components/MemberManagers/ManagersUsers";
import ManagersUserGroups from "src/components/MemberManagers/ManagersUserGroups";

interface PropsToUserGroupsMembers {
  userGroup: UserGroup;
  tabSection: string;
}

const UserGroupsMemberManagers = (props: PropsToUserGroupsMembers) => {
  const navigate = useNavigate();

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

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/user-groups/" + props.userGroup.cn + "/" + tabIndex);
  };

  return (
    <TabLayout id="managers">
      <Tabs
        activeKey={props.tabSection}
        onSelect={handleTabClick}
        isBox={false}
        mountOnEnter
        unmountOnExit
      >
        <Tab
          eventKey={"manager_user"}
          name="manager_user"
          title={
            <TabTitleText>
              Users{" "}
              <Badge key={0} id="user_count" isRead>
                {userGroup && userGroup.membermanager_user
                  ? userGroup.membermanager_user.length
                  : 0}
              </Badge>
            </TabTitleText>
          }
        >
          <ManagersUsers
            entity={userGroup}
            id={userGroup.cn as string}
            from="user-groups"
            isDataLoading={userGroupQuery.isFetching}
            onRefreshData={onRefreshUserGroupData}
            manager_users={userGroup.membermanager_user || []}
          />
        </Tab>
        <Tab
          eventKey={"manager_usergroup"}
          name="manager_usergroup"
          title={
            <TabTitleText>
              User groups{" "}
              <Badge key={1} id="usergroup_count" isRead>
                {userGroup && userGroup.membermanager_group
                  ? userGroup.membermanager_group.length
                  : 0}
              </Badge>
            </TabTitleText>
          }
        >
          <ManagersUserGroups
            entity={userGroup}
            id={userGroup.cn as string}
            from="user-groups"
            isDataLoading={userGroupQuery.isFetching}
            onRefreshData={onRefreshUserGroupData}
            manager_groups={userGroup.membermanager_group || []}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default UserGroupsMemberManagers;
