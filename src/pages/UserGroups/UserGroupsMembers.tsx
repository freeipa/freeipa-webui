import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
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

  // Tab counters
  const [userCount, setUserCount] = React.useState(0);
  const [groupCount, setGroupCount] = React.useState(0);
  const [serviceCount, setServiceCount] = React.useState(0);
  const [overrideCount, setOverrideCount] = React.useState(0);
  // group Directions
  const [userDirection, setUserDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [groupDirection, setGroupDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [serviceDirection, setServiceDirection] = React.useState(
    "direct" as MembershipDirection
  );

  const updateUserDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setUserCount(
        userGroup && userGroup.member_user ? userGroup.member_user.length : 0
      );
    } else {
      setUserCount(
        userGroup && userGroup.memberindirect_user
          ? userGroup.memberindirect_user.length
          : 0
      );
    }
    setUserDirection(direction);
  };
  const updateGroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setGroupCount(
        userGroup && userGroup.member_group ? userGroup.member_group.length : 0
      );
    } else {
      setGroupCount(
        userGroup && userGroup.memberindirect_group
          ? userGroup.memberindirect_group.length
          : 0
      );
    }
    setGroupDirection(direction);
  };
  const updateServiceDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setServiceCount(
        userGroup && userGroup.member_service
          ? userGroup.member_service.length
          : 0
      );
    } else {
      setServiceCount(
        userGroup && userGroup.memberindirect_service
          ? userGroup.memberindirect_service.length
          : 0
      );
    }
    setServiceDirection(direction);
  };

  React.useEffect(() => {
    if (userDirection === "direct") {
      setUserCount(
        userGroup && userGroup.member_user ? userGroup.member_user.length : 0
      );
    } else {
      setUserCount(
        userGroup && userGroup.memberindirect_user
          ? userGroup.memberindirect_user.length
          : 0
      );
    }
    if (groupDirection === "direct") {
      setGroupCount(
        userGroup && userGroup.member_group ? userGroup.member_group.length : 0
      );
    } else {
      setGroupCount(
        userGroup && userGroup.memberindirect_group
          ? userGroup.memberindirect_group.length
          : 0
      );
    }
    if (serviceDirection === "direct") {
      setServiceCount(
        userGroup && userGroup.member_service
          ? userGroup.member_service.length
          : 0
      );
    } else {
      setServiceCount(
        userGroup && userGroup.memberindirect_service
          ? userGroup.memberindirect_service.length
          : 0
      );
    }

    setOverrideCount(
      userGroup && userGroup.member_idoverrideuser
        ? userGroup.member_idoverrideuser.length
        : 0
    );
  }, [userGroup]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    // id override not implemented yet
    if (tabIndex !== "member_iduseroverride") {
      navigate("/user-groups/" + props.userGroup.cn + "/" + tabIndex);
    }
  };

  return (
    <div style={{ height: `var(--memberof-calc)` }}>
      <TabLayout id="members">
        <Tabs
          activeKey={props.tabSection}
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
                <Badge key={0} id="user_count" isRead>
                  {userCount}
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
              memberindirect_user={userGroup.memberindirect_user || []}
              setDirection={updateUserDirection}
              direction={userDirection}
            />
          </Tab>
          <Tab
            eventKey={"member_group"}
            name="member_group"
            title={
              <TabTitleText>
                User groups{" "}
                <Badge key={1} id="usergroup_count" isRead>
                  {groupCount}
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
              memberindirect_group={userGroup.memberindirect_group || []}
              setDirection={updateGroupDirection}
              direction={groupDirection}
            />
          </Tab>
          <Tab
            eventKey={"member_service"}
            name="member_service"
            title={
              <TabTitleText>
                Services{" "}
                <Badge key={2} id="service_count" isRead>
                  {serviceCount}
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
              memberindirect_service={userGroup.memberindirect_service || []}
              setDirection={updateServiceDirection}
              direction={serviceDirection}
            />
          </Tab>
          <Tab
            eventKey={"member_external"}
            name="member_external"
            title={
              <TabTitleText>
                External{" "}
                <Badge key={3} id="external_count" isRead>
                  {userGroup.member_external
                    ? userGroup.member_external.length
                    : 0}
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
          <Tab
            eventKey={"member_iduseroverride"}
            name="idoverrideuser"
            title={
              <TabTitleText>
                User ID overrides{" "}
                <Badge key={4} id="override_count" isRead>
                  {overrideCount}
                </Badge>
              </TabTitleText>
            }
          ></Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default UserGroupsMembers;
