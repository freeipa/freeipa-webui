import React from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router";
// Layout
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetNetgroupByIdQuery } from "src/services/rpcNetgroups";
// 'Is a member of' sections
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";

interface PropsToMemberOf {
  netgroup: Netgroup;
  tabSection: string;
}

const NetgroupsMemberOf = (props: PropsToMemberOf) => {
  const navigate = useNavigate();

  // Netgroup's full data
  const netgroupQuery = useGetNetgroupByIdQuery(props.netgroup.cn);
  const netgroupData = netgroupQuery.data || {};

  const [netgroup, setNetgroup] = React.useState<Partial<Netgroup>>({});

  React.useEffect(() => {
    if (!netgroupQuery.isFetching && netgroupData) {
      setNetgroup({ ...netgroupData });
    }
  }, [netgroupData, netgroupQuery.isFetching]);

  const onRefreshData = () => {
    netgroupQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "netgroups", noBreadcrumb: true });

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/netgroups/" + props.netgroup.cn + "/" + tabIndex);
  };

  const [netgroupCount, setNetgroupCount] = React.useState(0);

  React.useEffect(() => {
    setNetgroupCount(
      netgroup && netgroup.memberof_netgroup
        ? netgroup.memberof_netgroup.length
        : 0
    );
  }, [netgroup]);

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
            eventKey={"memberof_netgroup"}
            name="memberof_netgroup"
            title={
              <TabTitleText>
                Netgroups{" "}
                <Badge key={0} isRead>
                  {netgroupCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfNetgroups
              entity={netgroup}
              id={netgroup.cn as string}
              from={"netgroups"}
              isDataLoading={netgroupQuery.isFetching}
              onRefreshData={onRefreshData}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default NetgroupsMemberOf;
