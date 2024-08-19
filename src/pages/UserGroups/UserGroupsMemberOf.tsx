import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router-dom";
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

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("memberof_usergroup");
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

  // Render component
  return (
    <TabLayout id="memberof">
      <Tabs
        activeKey={activeTabKey}
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
                {group && group.memberof_group
                  ? group.memberof_group.length
                  : 0}
              </Badge>
            </TabTitleText>
          }
        >
          <MemberOfUserGroups
            entry={group}
            from="User groups"
            isUserDataLoading={groupQuery.isFetching}
            onRefreshUserData={onRefreshData}
          />
        </Tab>
        <Tab
          eventKey={"memberof_netgroup"}
          name="memberof_netgroup"
          title={
            <TabTitleText>
              Netgroups{" "}
              <Badge key={1} isRead>
                {group && group.memberof_netgroup
                  ? group.memberof_netgroup.length
                  : 0}
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
          />
        </Tab>
        <Tab
          eventKey={"memberof_role"}
          name="memberof_role"
          title={
            <TabTitleText>
              Roles{" "}
              <Badge key={2} isRead>
                {group && group.memberof_role ? group.memberof_role.length : 0}
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
            memberof_role={group.memberof_role as string[]}
            memberofindirect_role={group.memberofindirect_role as string[]}
          />
        </Tab>
        <Tab
          eventKey={"memberof_hbacrule"}
          name="memberof_hbacrule"
          title={
            <TabTitleText>
              HBAC rules{" "}
              <Badge key={3} isRead>
                {group && group.memberof_hbacrule
                  ? group.memberof_hbacrule.length
                  : 0}
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
          />
        </Tab>
        <Tab
          eventKey={"memberof_sudorule"}
          name="memberof_sudorule"
          title={
            <TabTitleText>
              Sudo rules{" "}
              <Badge key={4} isRead>
                {group && group.memberof_sudorule
                  ? group.memberof_sudorule.length
                  : 0}
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
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default UserGroupsMemberOf;
