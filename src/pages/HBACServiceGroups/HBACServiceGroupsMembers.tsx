import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { HBACServiceGroup } from "src/utils/datatypes/globalDataTypes";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetHbacServiceGroupByIdQuery } from "src/services/rpcHBACSvcGroups";
// 'Members' sections
import MembersHbacServices from "src/components/Members/MembersHbacServices";

interface PropsToSvcGroupsMembers {
  hbacsvcgroup: HBACServiceGroup;
  tabSection: string;
}

const HBACSvcGroupMembers = (props: PropsToSvcGroupsMembers) => {
  const navigate = useNavigate();

  const groupQuery = useGetHbacServiceGroupByIdQuery(props.hbacsvcgroup.cn);
  const groupData = groupQuery.data || {};
  const [serviceGroup, setSvcGroup] = useState<Partial<HBACServiceGroup>>({});

  React.useEffect(() => {
    if (!groupQuery.isFetching && groupData) {
      setSvcGroup({ ...groupData });
    }
  }, [groupData, groupQuery.isFetching]);

  const onRefreshHbacSvcData = () => {
    groupQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hbac-service-groups", noBreadcrumb: true });

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("member_hbacsvc");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/hbac-service-groups/" + props.hbacsvcgroup.cn + "/" + tabIndex);
  };

  React.useEffect(() => {
    setActiveTabKey(props.tabSection);
  }, [props.tabSection]);

  return (
    <div
      style={{
        height: `var(--subsettings-calc)`,
      }}
    >
      <TabLayout id="members">
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"member_hbacsvc"}
            name="member_hbacsvc"
            data-cy="hbac-service-groups-tab-members-tab-hbacservices"
            title={
              <TabTitleText>
                HBAC services{" "}
                <Badge key={0} id="service_count" isRead>
                  {serviceGroup && serviceGroup.member_hbacsvc
                    ? serviceGroup.member_hbacsvc.length
                    : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersHbacServices
              entity={serviceGroup}
              id={serviceGroup.cn as string}
              from="hbac-service-groups"
              isDataLoading={groupQuery.isFetching}
              onRefreshData={onRefreshHbacSvcData}
              member_hbacsvc={serviceGroup.member_hbacsvc || []}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default HBACSvcGroupMembers;
