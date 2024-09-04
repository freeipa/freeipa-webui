import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router-dom";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetHostByIdQuery } from "src/services/rpcHosts";
// 'Is a member of' sections
import MemberOfHostGroups from "src/components/MemberOf/MemberOfHostGroups";
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
import MemberOfHbacRules from "src/components/MemberOf/MemberOfHbacRules";
import MemberOfSudoRules from "src/components/MemberOf/MemberOfSudoRules";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";

interface PropsToHostsMemberOf {
  host: Host;
  tabSection: string;
}

const HostsMemberOf = (props: PropsToHostsMemberOf) => {
  const navigate = useNavigate();

  // Host's full data
  const hostQuery = useGetHostByIdQuery(props.host.fqdn);
  const hostData = hostQuery.data || {};

  const [host, setHost] = useState<Partial<Host>>({});

  React.useEffect(() => {
    if (!hostQuery.isFetching && hostData) {
      setHost({ ...hostData });
    }
  }, [hostData, hostQuery.isFetching]);

  const onRefreshHostData = () => {
    hostQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hosts", noBreadcrumb: true });

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("memberof_hostgroup");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    navigate("/hosts/" + props.host.fqdn + "/" + tabIndex);
  };

  React.useEffect(() => {
    setActiveTabKey(props.tabSection);
  }, [props.tabSection]);

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
        host && host.memberof_hostgroup ? host.memberof_hostgroup.length : 0
      );
    } else {
      setGroupCount(
        host && host.memberofindirect_hostgroup
          ? host.memberofindirect_hostgroup.length
          : 0
      );
    }
    setGroupDirection(direction);
  };
  const updateNetgroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setNetgroupCount(
        host && host.memberof_netgroup ? host.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        host && host.memberofindirect_netgroup
          ? host.memberofindirect_netgroup.length
          : 0
      );
    }
    setNetgroupDirection(direction);
  };
  const updateRoleDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setRoleCount(host && host.memberof_role ? host.memberof_role.length : 0);
    } else {
      setRoleCount(
        host && host.memberofindirect_role
          ? host.memberofindirect_role.length
          : 0
      );
    }
    setRoleDirection(direction);
  };
  const updateHbacDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setHbacCount(
        host && host.memberof_hbacrule ? host.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        host && host.memberofindirect_hbacrule
          ? host.memberofindirect_hbacrule.length
          : 0
      );
    }
    setHbacDirection(direction);
  };
  const updateSudoDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setSudoCount(
        host && host.memberof_sudorule ? host.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        host && host.memberofindirect_sudorule
          ? host.memberofindirect_sudorule.length
          : 0
      );
    }
    setSudoDirection(direction);
  };
  React.useEffect(() => {
    if (groupDirection === "direct") {
      setGroupCount(
        host && host.memberof_hostgroup ? host.memberof_hostgroup.length : 0
      );
    } else {
      setGroupCount(
        host && host.memberofindirect_hostgroup
          ? host.memberofindirect_hostgroup.length
          : 0
      );
    }
    if (roleDirection === "direct") {
      setRoleCount(host && host.memberof_role ? host.memberof_role.length : 0);
    } else {
      setRoleCount(
        host && host.memberofindirect_role
          ? host.memberofindirect_role.length
          : 0
      );
    }
    if (hbacDirection === "direct") {
      setHbacCount(
        host && host.memberof_hbacrule ? host.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        host && host.memberofindirect_hbacrule
          ? host.memberofindirect_hbacrule.length
          : 0
      );
    }
    if (sudoDirection === "direct") {
      setSudoCount(
        host && host.memberof_sudorule ? host.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        host && host.memberofindirect_sudorule
          ? host.memberofindirect_sudorule.length
          : 0
      );
    }
    if (netgroupDirection === "direct") {
      setNetgroupCount(
        host && host.memberof_netgroup ? host.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        host && host.memberofindirect_netgroup
          ? host.memberofindirect_netgroup.length
          : 0
      );
    }
  }, [host]);

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
          eventKey={"memberof_hostgroup"}
          name="memberof_hostgroup"
          title={
            <TabTitleText>
              Host groups{" "}
              <Badge key={0} isRead>
                {groupCount}
              </Badge>
            </TabTitleText>
          }
        >
          <MemberOfHostGroups
            host={host}
            isHostDataLoading={hostQuery.isFetching}
            onRefreshHostData={onRefreshHostData}
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
            entity={host}
            id={host.fqdn as string}
            from={"hosts"}
            isDataLoading={hostQuery.isFetching}
            onRefreshData={onRefreshHostData}
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
            entity={host}
            id={host.fqdn as string}
            from={"hosts"}
            isDataLoading={hostQuery.isFetching}
            onRefreshData={onRefreshHostData}
            memberof_role={host.memberof_role as string[]}
            memberofindirect_role={host.memberofindirect_role as string[]}
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
            entity={host}
            id={host.fqdn as string}
            from={"hosts"}
            isDataLoading={hostQuery.isFetching}
            onRefreshData={onRefreshHostData}
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
            entity={host}
            id={host.fqdn as string}
            from={"hosts"}
            isDataLoading={hostQuery.isFetching}
            onRefreshData={onRefreshHostData}
            setDirection={updateSudoDirection}
            direction={sudoDirection}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default HostsMemberOf;
