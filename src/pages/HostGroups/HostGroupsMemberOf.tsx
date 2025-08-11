import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { HostGroup } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router-dom";
// Layout
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetHostGroupByIdQuery } from "src/services/rpcHostGroups";
// 'Is a member of' sections
import MemberOfHostGroups from "src/components/MemberOf/MemberOfHostGroups";
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";
import MemberOfHbacRules from "src/components/MemberOf/MemberOfHbacRules";
import MemberOfSudoRules from "src/components/MemberOf/MemberOfSudoRules";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";

interface PropsToMemberOf {
  hostGroup: HostGroup;
  tabSection: string;
}

const HostGroupsMemberOf = (props: PropsToMemberOf) => {
  const navigate = useNavigate();

  // User group's full data
  const groupQuery = useGetHostGroupByIdQuery(props.hostGroup.cn);
  const groupData = groupQuery.data || {};
  const [group, setGroup] = useState<Partial<HostGroup>>({});

  React.useEffect(() => {
    if (!groupQuery.isFetching && groupData) {
      setGroup({ ...groupData });
    }
  }, [groupData, groupQuery.isFetching]);

  const onRefreshData = () => {
    groupQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "host-groups", noBreadcrumb: true });

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/host-groups/" + props.hostGroup.cn + "/" + tabIndex);
  };

  const [groupCount, setGroupCount] = React.useState(0);
  const [hbacCount, setHbacCount] = React.useState(0);
  const [sudoCount, setSudoCount] = React.useState(0);
  const [groupDirection, setGroupDirection] = React.useState(
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
        group && group.memberof_hostgroup ? group.memberof_hostgroup.length : 0
      );
    } else {
      setGroupCount(
        group && group.memberofindirect_hostgroup
          ? group.memberofindirect_hostgroup.length
          : 0
      );
    }
    setGroupDirection(direction);
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
        group && group.memberof_hostgroup ? group.memberof_hostgroup.length : 0
      );
    } else {
      setGroupCount(
        group && group.memberofindirect_hostgroup
          ? group.memberofindirect_hostgroup.length
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
  }, [group]);

  // Render component
  return (
    <div style={{ height: `var(--subsettings-calc)` }}>
      <TabLayout id="memberof">
        <Tabs
          activeKey={props.tabSection}
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
                <Badge key={0} id="group_count" isRead>
                  {groupCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfHostGroups
              entity={group}
              from="host-groups"
              id={group.cn as string}
              isDataLoading={groupQuery.isFetching}
              onRefreshData={onRefreshData}
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
                <Badge key={1} id="netgroup_count" isRead>
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
              from={"host-groups"}
              isDataLoading={groupQuery.isFetching}
              onRefreshData={onRefreshData}
            />
          </Tab>
          <Tab
            eventKey={"memberof_hbacrule"}
            name="memberof_hbacrule"
            title={
              <TabTitleText>
                HBAC rules{" "}
                <Badge key={3} id="hbacrule_count" isRead>
                  {hbacCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfHbacRules
              entity={group}
              id={group.cn as string}
              from={"host-groups"}
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
                <Badge key={4} id="sudorule_count" isRead>
                  {sudoCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfSudoRules
              entity={group}
              id={group.cn as string}
              from={"host-groups"}
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

export default HostGroupsMemberOf;
