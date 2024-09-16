import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { HBACService } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router-dom";
// Layout
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetHbacServiceByIdQuery } from "src/services/rpcHBACServices";
// 'Is a member of' sections
import MemberOfHBACServiceGroups from "src/components/MemberOf/MemberOfHbacServiceGroups";

interface PropsToMemberOf {
  hbacService: HBACService;
  tabSection: string;
}

const HBACServicesMemberOf = (props: PropsToMemberOf) => {
  const navigate = useNavigate();

  // HBAC service's full data
  const svcQuery = useGetHbacServiceByIdQuery(props.hbacService.cn);
  const svcData = svcQuery.data || {};
  const [service, setService] = useState<Partial<HBACService>>({});

  React.useEffect(() => {
    if (!svcQuery.isFetching && svcData) {
      setService({ ...svcData });
    }
  }, [svcData, svcQuery.isFetching]);

  const onRefreshData = () => {
    svcQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hbac-services", noBreadcrumb: true });

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("memberof_hbacsvcgroup");
  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    navigate("/hbac-services/" + props.hbacService.cn + "/" + tabIndex);
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
          eventKey={"memberof_hbacsvcgroup"}
          name="memberof_hbacsvcgroup"
          title={
            <TabTitleText>
              Host groups{" "}
              <Badge key={0} id="svcgroup_count" isRead>
                {service && service.memberof_hbacsvcgroup
                  ? service.memberof_hbacsvcgroup.length
                  : 0}
              </Badge>
            </TabTitleText>
          }
        >
          <MemberOfHBACServiceGroups
            entity={service}
            id={service.cn as string}
            isDataLoading={svcQuery.isFetching}
            onRefreshData={onRefreshData}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default HBACServicesMemberOf;
