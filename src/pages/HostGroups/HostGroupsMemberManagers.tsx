import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { HostGroup } from "src/utils/datatypes/globalDataTypes";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetHostGroupByIdQuery } from "src/services/rpcHostGroups";
// 'Members' sections
import ManagersUsers from "src/components/MemberManagers/ManagersUsers";
import ManagersUserGroups from "src/components/MemberManagers/ManagersUserGroups";

interface PropsToHostGroupsMembers {
  hostGroup: HostGroup;
  tabSection: string;
}

const HostGroupsMemberManagers = (props: PropsToHostGroupsMembers) => {
  const navigate = useNavigate();

  const hostGroupQuery = useGetHostGroupByIdQuery(props.hostGroup.cn);
  const hostGroupData = hostGroupQuery.data || {};
  const [hostGroup, setHostGroup] = useState<Partial<HostGroup>>({});

  React.useEffect(() => {
    if (!hostGroupQuery.isFetching && hostGroupData) {
      setHostGroup({ ...hostGroupData });
    }
  }, [hostGroupData, hostGroupQuery.isFetching]);

  const onRefreshHostGroupData = () => {
    hostGroupQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "host-groups", noBreadcrumb: true });

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/host-groups/" + props.hostGroup.cn + "/" + tabIndex);
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
                {hostGroup && hostGroup.membermanager_user
                  ? hostGroup.membermanager_user.length
                  : 0}
              </Badge>
            </TabTitleText>
          }
        >
          <ManagersUsers
            entity={hostGroup}
            id={hostGroup.cn as string}
            from="host-groups"
            isDataLoading={hostGroupQuery.isFetching}
            onRefreshData={onRefreshHostGroupData}
            manager_users={hostGroup.membermanager_user || []}
          />
        </Tab>
        <Tab
          eventKey={"manager_usergroup"}
          name="manager_usergroup"
          title={
            <TabTitleText>
              User groups{" "}
              <Badge key={1} id="usergroup_count" isRead>
                {hostGroup && hostGroup.membermanager_group
                  ? hostGroup.membermanager_group.length
                  : 0}
              </Badge>
            </TabTitleText>
          }
        >
          <ManagersUserGroups
            entity={hostGroup}
            id={hostGroup.cn as string}
            from="host-groups"
            isDataLoading={hostGroupQuery.isFetching}
            onRefreshData={onRefreshHostGroupData}
            manager_groups={hostGroup.membermanager_group || []}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default HostGroupsMemberManagers;
