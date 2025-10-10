import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router";
// Layout
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetGroupByIdQuery } from "src/services/rpcUserGroups";
// 'Is a member of' sections
import MemberOfUserGroups from "src/components/MemberOf/MemberOfUserGroups";
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
import MemberOfHbacRules from "src/components/MemberOf/MemberOfHbacRules";
import MemberOfSudoRules from "src/components/MemberOf/MemberOfSudoRules";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";

interface PropsToMemberOf {
  userGroup: UserGroup;
  tabSection: string;
}

const UserGroupsMemberOf = (props: PropsToMemberOf) => {
  const navigate = useNavigate();

  // User group's full data
  const groupQuery = useGetGroupByIdQuery(props.userGroup.cn);
  const groupData = groupQuery.data || {};

  const [group, setGroup] = useState<Partial<UserGroup>>({});

  React.useEffect(() => {
    if (!groupQuery.isFetching && groupData) {
      setGroup({ ...groupData });
    }
  }, [groupData, groupQuery.isFetching]);

  const onRefreshData = () => {
    groupQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "user-groups", noBreadcrumb: true });

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/user-groups/" + props.userGroup.cn + "/" + tabIndex);
  };

  const [groupCount, setGroupCount] = React.useState(0);
  const [netgroupCount, setNetgroupCount] = React.useState(0);
  const [roleCount, setRoleCount] = React.useState(0);
  const [hbacCount, setHbacCount] = React.useState(0);
  const [sudoCount, setSudoCount] = React.useState(0);
  const [groupDirection, setGroupDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [netgroupDirection, setNetgroupDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [roleDirection, setRoleDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [hbacDirection, setHbacDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [sudoDirection, setSudoDirection] = React.useState(
    "direct" as MembershipDirection
  );

  const updateGroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setGroupCount(
        group && group.memberof_group ? group.memberof_group.length : 0
      );
    } else {
      setGroupCount(
        group && group.memberofindirect_group
          ? group.memberofindirect_group.length
          : 0
      );
    }
    setGroupDirection(direction);
  };
  const updateNetgroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setNetgroupCount(
        group && group.memberof_netgroup ? group.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        group && group.memberofindirect_netgroup
          ? group.memberofindirect_netgroup.length
          : 0
      );
    }
    setNetgroupDirection(direction);
  };
  const updateRoleDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setRoleCount(
        group && group.memberof_role ? group.memberof_role.length : 0
      );
    } else {
      setRoleCount(
        group && group.memberofindirect_role
          ? group.memberofindirect_role.length
          : 0
      );
    }
    setRoleDirection(direction);
  };
  const updateHbacDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setHbacCount(
        group && group.memberof_hbacrule ? group.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        group && group.memberofindirect_hbacrule
          ? group.memberofindirect_hbacrule.length
          : 0
      );
    }
    setHbacDirection(direction);
  };
  const updateSudoDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setSudoCount(
        group && group.memberof_sudorule ? group.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        group && group.memberofindirect_sudorule
          ? group.memberofindirect_sudorule.length
          : 0
      );
    }
    setSudoDirection(direction);
  };

  React.useEffect(() => {
    if (groupDirection === "direct") {
      setGroupCount(
        group && group.memberof_group ? group.memberof_group.length : 0
      );
    } else {
      setGroupCount(
        group && group.memberofindirect_group
          ? group.memberofindirect_group.length
          : 0
      );
    }
    if (roleDirection === "direct") {
      setRoleCount(
        group && group.memberof_role ? group.memberof_role.length : 0
      );
    } else {
      setRoleCount(
        group && group.memberofindirect_role
          ? group.memberofindirect_role.length
          : 0
      );
    }
    if (hbacDirection === "direct") {
      setHbacCount(
        group && group.memberof_hbacrule ? group.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        group && group.memberofindirect_hbacrule
          ? group.memberofindirect_hbacrule.length
          : 0
      );
    }
    if (sudoDirection === "direct") {
      setSudoCount(
        group && group.memberof_sudorule ? group.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        group && group.memberofindirect_sudorule
          ? group.memberofindirect_sudorule.length
          : 0
      );
    }
    if (netgroupDirection === "direct") {
      setNetgroupCount(
        group && group.memberof_netgroup ? group.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        group && group.memberofindirect_netgroup
          ? group.memberofindirect_netgroup.length
          : 0
      );
    }
  }, [group]);

  // Render component
  return (
    <div style={{ height: `var(--memberof-calc)` }}>
      <TabLayout id="memberof">
        <Tabs
          activeKey={props.tabSection}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"memberof_usergroup"}
            name="memberof_usergroup"
            title={
              <TabTitleText>
                User groups{" "}
                <Badge key={0} isRead>
                  {groupCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfUserGroups
              entry={group}
              from="User groups"
              isUserDataLoading={groupQuery.isFetching}
              onRefreshUserData={onRefreshData}
              setDirection={updateGroupDirection}
              direction={groupDirection}
            />
          </Tab>
          <Tab
            eventKey={"memberof_netgroup"}
            name="memberof_netgroup"
            title={
              <TabTitleText>
                Netgroups{" "}
                <Badge key={1} isRead>
                  {netgroupCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfNetgroups
              entity={group}
              id={group.cn as string}
              from={"user-groups"}
              isDataLoading={groupQuery.isFetching}
              onRefreshData={onRefreshData}
              setDirection={updateNetgroupDirection}
              direction={netgroupDirection}
            />
          </Tab>
          <Tab
            eventKey={"memberof_role"}
            name="memberof_role"
            title={
              <TabTitleText>
                Roles{" "}
                <Badge key={2} isRead>
                  {roleCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfRoles
              entity={group}
              id={group.cn as string}
              from={"user-groups"}
              isDataLoading={groupQuery.isFetching}
              onRefreshData={onRefreshData}
              setDirection={updateRoleDirection}
              direction={roleDirection}
            />
          </Tab>
          <Tab
            eventKey={"memberof_hbacrule"}
            name="memberof_hbacrule"
            title={
              <TabTitleText>
                HBAC rules{" "}
                <Badge key={3} isRead>
                  {hbacCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfHbacRules
              entity={group}
              id={group.cn as string}
              from={"user-groups"}
              isDataLoading={groupQuery.isFetching}
              onRefreshData={onRefreshData}
              setDirection={updateHbacDirection}
              direction={hbacDirection}
            />
          </Tab>
          <Tab
            eventKey={"memberof_sudorule"}
            name="memberof_sudorule"
            title={
              <TabTitleText>
                Sudo rules{" "}
                <Badge key={4} isRead>
                  {sudoCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfSudoRules
              entity={group}
              id={group.cn as string}
              from={"user-groups"}
              isDataLoading={groupQuery.isFetching}
              onRefreshData={onRefreshData}
              setDirection={updateSudoDirection}
              direction={sudoDirection}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default UserGroupsMemberOf;
