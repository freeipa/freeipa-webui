import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetNetgroupByIdQuery } from "src/services/rpcNetgroups";
// 'Members' sections
import MembersUsers from "src/components/Members/MembersUsers";
import MembersUserGroups from "src/components/Members/MembersUserGroups";
import MembersHosts from "src/components/Members/MembersHosts";
import MembersHostGroups from "src/components/Members/MembersHostGroups";
import MembersNetgroups from "src/components/Members/MembersNetgroups";

interface PropsToNetgroupsMembers {
  netgroup: Netgroup;
  tabSection: string;
}

const NetgroupsMembers = (props: PropsToNetgroupsMembers) => {
  const navigate = useNavigate();

  const netgroupQuery = useGetNetgroupByIdQuery(props.netgroup.cn);
  const netgroupData = netgroupQuery.data || {};
  const [netgroup, setNetgroup] = useState<Partial<Netgroup>>({});

  React.useEffect(() => {
    if (!netgroupQuery.isFetching && netgroupData) {
      setNetgroup({ ...netgroupData });
    }
  }, [netgroupData, netgroupQuery.isFetching]);

  const onRefreshNetgroupData = () => {
    netgroupQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "netgroups", noBreadcrumb: true });

  // Tab counters
  const [netgroupCount, setNetgroupCount] = React.useState(0);
  const [userCount, setUserCount] = React.useState(0);
  const [groupCount, setGroupCount] = React.useState(0);
  const [hostCount, setHostCount] = React.useState(0);
  const [hostGroupCount, setHostGroupCount] = React.useState(0);

  // group Directions
  const [netgroupDirection, setNetgroupDirection] = React.useState(
    "direct" as MembershipDirection
  );

  const updateNetgroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setNetgroupCount(
        netgroup && netgroup.member_netgroup
          ? netgroup.member_netgroup.length
          : 0
      );
    } else {
      setNetgroupCount(
        netgroup && netgroup.memberindirect_netgroup
          ? netgroup.memberindirect_netgroup.length
          : 0
      );
    }
    setNetgroupDirection(direction);
  };

  React.useEffect(() => {
    if (netgroupDirection === "direct") {
      setNetgroupCount(
        netgroup && netgroup.member_netgroup
          ? netgroup.member_netgroup.length
          : 0
      );
    } else {
      setNetgroupCount(
        netgroup && netgroup.memberindirect_netgroup
          ? netgroup.memberindirect_netgroup.length
          : 0
      );
    }

    setUserCount(
      netgroup && netgroup.memberuser_user ? netgroup.memberuser_user.length : 0
    );
    setGroupCount(
      netgroup && netgroup.memberuser_group
        ? netgroup.memberuser_group.length
        : 0
    );
    setHostCount(
      netgroup && netgroup.memberhost_host ? netgroup.memberhost_host.length : 0
    );
    setHostGroupCount(
      netgroup && netgroup.memberhost_hostgroup
        ? netgroup.memberhost_hostgroup.length
        : 0
    );
  }, [netgroup]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/netgroups/" + props.netgroup.cn + "/" + tabIndex);
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
            entity={netgroup}
            id={netgroup.cn as string}
            from="netgroup"
            isDataLoading={netgroupQuery.isFetching}
            onRefreshData={onRefreshNetgroupData}
            member_user={netgroup.memberuser_user || []}
            setDirection={() => {}}
            direction={"direct"}
          />
        </Tab>
        <Tab
          eventKey={"member_group"}
          name="member_group"
          title={
            <TabTitleText>
              User groups{" "}
              <Badge key={1} id="group_count" isRead>
                {groupCount}
              </Badge>
            </TabTitleText>
          }
        >
          <MembersUserGroups
            entity={netgroup}
            id={netgroup.cn as string}
            from="netgroup"
            isDataLoading={netgroupQuery.isFetching}
            onRefreshData={onRefreshNetgroupData}
            member_group={netgroup.memberuser_group || []}
            setDirection={() => {}}
            direction={"direct"}
          />
        </Tab>
        <Tab
          eventKey={"member_host"}
          name="member_host"
          title={
            <TabTitleText>
              Hosts{" "}
              <Badge key={2} id="host_count" isRead>
                {hostCount}
              </Badge>
            </TabTitleText>
          }
        >
          <MembersHosts
            entity={netgroup}
            id={netgroup.cn as string}
            from="netgroup"
            isDataLoading={netgroupQuery.isFetching}
            onRefreshData={onRefreshNetgroupData}
            member_host={netgroup.memberhost_host || []}
            setDirection={() => {}}
            direction={"direct"}
          />
        </Tab>
        <Tab
          eventKey={"member_hostgroup"}
          name="member_hostgroup"
          title={
            <TabTitleText>
              Host groups{" "}
              <Badge key={3} id="hostgroup_count" isRead>
                {hostGroupCount}
              </Badge>
            </TabTitleText>
          }
        >
          <MembersHostGroups
            entity={netgroup}
            id={netgroup.cn as string}
            from="netgroup"
            isDataLoading={netgroupQuery.isFetching}
            onRefreshData={onRefreshNetgroupData}
            member_hostgroup={netgroup.memberhost_hostgroup || []}
            setDirection={() => {}}
            direction={"direct"}
          />
        </Tab>
        <Tab
          eventKey={"member_netgroup"}
          name="member_netgroup"
          title={
            <TabTitleText>
              Netgroups{" "}
              <Badge key={4} id="netgroup_count" isRead>
                {netgroupCount}
              </Badge>
            </TabTitleText>
          }
        >
          <MembersNetgroups
            entity={netgroup}
            id={netgroup.cn as string}
            from="netgroup"
            isDataLoading={netgroupQuery.isFetching}
            onRefreshData={onRefreshNetgroupData}
            member_netgroup={netgroup.member_netgroup || []}
            memberindirect_netgroup={netgroup.memberindirect_netgroup || []}
            setDirection={updateNetgroupDirection}
            direction={netgroupDirection}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default NetgroupsMembers;
