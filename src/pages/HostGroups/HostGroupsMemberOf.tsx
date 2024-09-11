import React from "react";
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
// Components
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// 'Is a member of' sections
import MemberOfHostGroups from "src/components/MemberOf/MemberOfHostGroups";

interface PropsToMemberOf {
  hostGroup: HostGroup;
  tabSection: string;
}

const HostGroupsMemberOf = (props: PropsToMemberOf) => {
  const navigate = useNavigate();

  // Host group's full data
  const hostgroupQuery = useGetHostGroupByIdQuery(props.hostGroup.cn); // useGetHostGroupsFullDataQuery(props.hostGroup.cn);
  const hostgroupData = hostgroupQuery.data || {};

  const [hostgroup, setHostgroup] = React.useState<Partial<HostGroup>>({});

  React.useEffect(() => {
    if (!hostgroupQuery.isFetching && hostgroupData) {
      setHostgroup((prevState) => ({ ...prevState, ...hostgroupData }));
    }
  }, [hostgroupData, hostgroupQuery.isFetching]);

  const onRefreshData = () => {
    hostgroupQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "host-groups", noBreadcrumb: true });

  // Tab
  const [activeTabKey, setActiveTabKey] = React.useState("memberof_hostgroup");
  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    navigate("/host-groups/" + props.hostGroup.cn + "/" + tabIndex);
  };

  React.useEffect(() => {
    setActiveTabKey(props.tabSection);
  }, [props.tabSection]);

  const [hostgroupCount, setHostgroupCount] = React.useState(0);
  const [hostgroupDirection, setHostgroupDirection] = React.useState(
    "direct" as MembershipDirection
  );

  const updateHostgroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setHostgroupCount(
        hostgroup && hostgroup.memberof_hostgroup
          ? hostgroup.memberof_hostgroup.length
          : 0
      );
    } else {
      setHostgroupCount(
        hostgroup && hostgroup.memberofindirect_hostgroup
          ? hostgroup.memberofindirect_hostgroup.length
          : 0
      );
    }
    setHostgroupDirection(direction);
  };

  React.useEffect(() => {
    if (hostgroupDirection === "direct") {
      setHostgroupCount(
        hostgroup && hostgroup.memberof_hostgroup
          ? hostgroup.memberof_hostgroup.length
          : 0
      );
    }
  }, [hostgroup]);

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
                {hostgroupCount}
              </Badge>
            </TabTitleText>
          }
        >
          <MemberOfHostGroups
            entity={hostgroup}
            id={hostgroup.cn as string}
            from="host-groups"
            isDataLoading={hostgroupQuery.isFetching}
            onRefreshData={onRefreshData}
            setDirection={updateHostgroupDirection}
            direction={hostgroupDirection}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default HostGroupsMemberOf;
