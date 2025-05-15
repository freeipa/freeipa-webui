import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { HostGroup } from "src/utils/datatypes/globalDataTypes";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetHostGroupByIdQuery } from "src/services/rpcHostGroups";
// 'Members' sections
import MembersHosts from "src/components/Members/MembersHosts";
import MembersHostGroups from "src/components/Members/MembersHostGroups";

interface PropsToHostGroupsMembers {
  hostGroup: HostGroup;
  tabSection: string;
}

const HostGroupsMembers = (props: PropsToHostGroupsMembers) => {
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

  // Tab counters
  const [hostCount, setHostCount] = React.useState(0);
  const [groupCount, setGroupCount] = React.useState(0);

  // group Directions
  const [hostDirection, setHostDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [groupDirection, setGroupDirection] = React.useState(
    "direct" as MembershipDirection
  );

  const updateHostDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setHostCount(
        hostGroup && hostGroup.member_host ? hostGroup.member_host.length : 0
      );
    } else {
      setHostCount(
        hostGroup && hostGroup.memberindirect_host
          ? hostGroup.memberindirect_host.length
          : 0
      );
    }
    setHostDirection(direction);
  };
  const updateGroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setGroupCount(
        hostGroup && hostGroup.member_hostgroup
          ? hostGroup.member_hostgroup.length
          : 0
      );
    } else {
      setGroupCount(
        hostGroup && hostGroup.memberindirect_hostgroup
          ? hostGroup.memberindirect_hostgroup.length
          : 0
      );
    }
    setGroupDirection(direction);
  };

  React.useEffect(() => {
    if (hostDirection === "direct") {
      setHostCount(
        hostGroup && hostGroup.member_host ? hostGroup.member_host.length : 0
      );
    } else {
      setHostCount(
        hostGroup && hostGroup.memberindirect_host
          ? hostGroup.memberindirect_host.length
          : 0
      );
    }
    if (groupDirection === "direct") {
      setGroupCount(
        hostGroup && hostGroup.member_hostgroup
          ? hostGroup.member_hostgroup.length
          : 0
      );
    } else {
      setGroupCount(
        hostGroup && hostGroup.memberindirect_hostgroup
          ? hostGroup.memberindirect_hostgroup.length
          : 0
      );
    }
  }, [hostGroup]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/host-groups/" + props.hostGroup.cn + "/" + tabIndex);
  };

  return (
    <TabLayout id="members">
      <Tabs
        activeKey={props.tabSection}
        onSelect={handleTabClick}
        isBox={false}
        mountOnEnter
        unmountOnExit
      >
        <Tab
          eventKey={"member_host"}
          name="member_host"
          title={
            <TabTitleText>
              Hosts{" "}
              <Badge key={0} id="host_count" isRead>
                {hostCount}
              </Badge>
            </TabTitleText>
          }
        >
          <MembersHosts
            entity={hostGroup}
            id={hostGroup.cn as string}
            from="host-groups"
            isDataLoading={hostGroupQuery.isFetching}
            onRefreshData={onRefreshHostGroupData}
            member_host={hostGroup.member_host || []}
            memberindirect_host={hostGroup.memberindirect_host || []}
            setDirection={updateHostDirection}
            direction={hostDirection}
          />
        </Tab>
        <Tab
          eventKey={"member_hostgroup"}
          name="member_hostgroup"
          title={
            <TabTitleText>
              Host groups{" "}
              <Badge key={1} id="hostgroup_count" isRead>
                {groupCount}
              </Badge>
            </TabTitleText>
          }
        >
          <MembersHostGroups
            entity={hostGroup}
            id={hostGroup.cn as string}
            from="host-groups"
            isDataLoading={hostGroupQuery.isFetching}
            onRefreshData={onRefreshHostGroupData}
            member_hostgroup={hostGroup.member_hostgroup || []}
            memberindirect_hostgroup={hostGroup.memberindirect_hostgroup || []}
            setDirection={updateGroupDirection}
            direction={groupDirection}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default HostGroupsMembers;
