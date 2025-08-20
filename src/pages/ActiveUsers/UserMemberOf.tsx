import React from "react";
import { TabTitleText, Tab, Tabs, Badge } from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Wrappers
import MemberOfUserGroups from "src/components/MemberOf/MemberOfUserGroups";
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
import MemberOfHbacRules from "src/components/MemberOf/MemberOfHbacRules";
import MemberOfSudoRules from "src/components/MemberOf/MemberOfSudoRules";
import MemberOfSubIds from "src/components/MemberOf/MemberOfSubIds";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// RPC
import { useGetUserByUidQuery } from "src/services/rpcUsers";
// Utils
import { convertToString } from "src/utils/ipaObjectUtils";
// Navigation
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";

interface PropsToUserMemberOf {
  user: User;
  tab: string;
  from: string;
}

const UserMemberOf = (props: PropsToUserMemberOf) => {
  const navigate = useNavigate();

  // Update breadcrumb route
  React.useEffect(() => {
    if (!props.user.uid) {
      // Redirect to the main page
      navigate("/" + props.from);
    }
  }, [props.user.uid]);

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.from, noBreadcrumb: true });

  // User's full data
  const userQuery = useGetUserByUidQuery(convertToString(props.user.uid));

  const userData = userQuery.data || {};

  const [user, setUser] = React.useState<Partial<User>>({});

  React.useEffect(() => {
    if (!userQuery.isFetching && userData) {
      setUser({ ...userData });
    }
  }, [userData, userQuery.isFetching]);

  const onRefreshUserData = () => {
    userQuery.refetch();
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
        user && user.memberof_group ? user.memberof_group.length : 0
      );
    } else {
      setGroupCount(
        user && user.memberofindirect_group
          ? user.memberofindirect_group.length
          : 0
      );
    }
    setGroupDirection(direction);
  };
  const updateNetgroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setNetgroupCount(
        user && user.memberof_netgroup ? user.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        user && user.memberofindirect_netgroup
          ? user.memberofindirect_netgroup.length
          : 0
      );
    }
    setNetgroupDirection(direction);
  };
  const updateRoleDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setRoleCount(user && user.memberof_role ? user.memberof_role.length : 0);
    } else {
      setRoleCount(
        user && user.memberofindirect_role
          ? user.memberofindirect_role.length
          : 0
      );
    }
    setRoleDirection(direction);
  };
  const updateHbacDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setHbacCount(
        user && user.memberof_hbacrule ? user.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        user && user.memberofindirect_hbacrule
          ? user.memberofindirect_hbacrule.length
          : 0
      );
    }
    setHbacDirection(direction);
  };
  const updateSudoDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setSudoCount(
        user && user.memberof_sudorule ? user.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        user && user.memberofindirect_sudorule
          ? user.memberofindirect_sudorule.length
          : 0
      );
    }
    setSudoDirection(direction);
  };

  React.useEffect(() => {
    if (groupDirection === "direct") {
      setGroupCount(
        user && user.memberof_group ? user.memberof_group.length : 0
      );
    } else {
      setGroupCount(
        user && user.memberofindirect_group
          ? user.memberofindirect_group.length
          : 0
      );
    }
    if (netgroupDirection === "direct") {
      setNetgroupCount(
        user && user.memberof_netgroup ? user.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        user && user.memberofindirect_netgroup
          ? user.memberofindirect_netgroup.length
          : 0
      );
    }
    if (roleDirection === "direct") {
      setRoleCount(user && user.memberof_role ? user.memberof_role.length : 0);
    } else {
      setRoleCount(
        user && user.memberofindirect_role
          ? user.memberofindirect_role.length
          : 0
      );
    }
    if (hbacDirection === "direct") {
      setHbacCount(
        user && user.memberof_hbacrule ? user.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        user && user.memberofindirect_hbacrule
          ? user.memberofindirect_hbacrule.length
          : 0
      );
    }
    if (sudoDirection === "direct") {
      setSudoCount(
        user && user.memberof_sudorule ? user.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        user && user.memberofindirect_sudorule
          ? user.memberofindirect_sudorule.length
          : 0
      );
    }
  }, [user]);

  return (
    <div
      style={{
        height: `var(--memberof-calc)`,
      }}
    >
      <TabLayout id="memberOf">
        <Tabs
          activeKey={props.tab}
          onSelect={(_event, tabIndex) => {
            navigate(
              "/" + props.from + "/" + props.user.uid + "/memberof_" + tabIndex
            );
          }}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"group"}
            name="memberof_group"
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
              entry={user}
              from={props.from}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
              setDirection={updateGroupDirection}
              direction={groupDirection}
            />
          </Tab>
          <Tab
            eventKey={"netgroup"}
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
              entity={user}
              id={user.uid as string}
              from={props.from}
              isDataLoading={userQuery.isFetching}
              onRefreshData={onRefreshUserData}
              setDirection={updateNetgroupDirection}
              direction={netgroupDirection}
            />
          </Tab>
          <Tab
            eventKey={"role"}
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
              entity={user}
              id={user.uid as string}
              from={props.from}
              isDataLoading={userQuery.isFetching}
              onRefreshData={onRefreshUserData}
              setDirection={updateRoleDirection}
              direction={roleDirection}
            />
          </Tab>
          <Tab
            eventKey={"hbacrule"}
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
              entity={user}
              id={user.uid as string}
              from={props.from}
              isDataLoading={userQuery.isFetching}
              onRefreshData={onRefreshUserData}
              setDirection={updateHbacDirection}
              direction={hbacDirection}
            />
          </Tab>
          <Tab
            eventKey={"sudorule"}
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
              entity={user}
              id={user.uid as string}
              from={props.from}
              isDataLoading={userQuery.isFetching}
              onRefreshData={onRefreshUserData}
              setDirection={updateSudoDirection}
              direction={sudoDirection}
            />
          </Tab>
          <Tab
            eventKey={"subid"}
            name="memberof_subid"
            title={
              <TabTitleText>
                Subordinate IDs{" "}
                <Badge key={5} isRead>
                  {user && user.memberof_subid ? user.memberof_subid.length : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfSubIds
              user={user}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default UserMemberOf;
