import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { SudoCmd } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router";
// Layout
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetSudoCmdByIdQuery } from "src/services/rpcSudoCmds";
// 'Is a member of' sections
import MemberOfSudoCmdGroups from "src/components/MemberOf/MemberOfSudoCmdGroups";

interface PropsToMemberOf {
  sudoCmd: SudoCmd;
  tabSection: string;
}

const SudoCmdsMemberOf = (props: PropsToMemberOf) => {
  const navigate = useNavigate();

  // Sudo command full data
  const sudoQuery = useGetSudoCmdByIdQuery(props.sudoCmd.sudocmd);
  const sudoData = sudoQuery.data || {};
  const [sudocmd, setSudoCmd] = useState<Partial<SudoCmd>>({});

  React.useEffect(() => {
    if (!sudoQuery.isFetching && sudoData) {
      setSudoCmd({ ...sudoData });
    }
  }, [sudoData, sudoQuery.isFetching]);

  const onRefreshData = () => {
    sudoQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "sudo-commands", noBreadcrumb: true });

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/sudo-commands/" + props.sudoCmd.sudocmd + "/" + tabIndex);
  };

  // Render component
  return (
    <div
      style={{
        height: `var(--subsettings-calc)`,
      }}
    >
      <TabLayout id="memberof">
        <Tabs
          activeKey={props.tabSection}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"memberof_sudocmdgroup"}
            name="memberof_sudocmdgroup"
            title={
              <TabTitleText>
                Sudo command groups{" "}
                <Badge key={0} id="svcgroup_count" isRead>
                  {sudocmd && sudocmd.memberof_sudocmdgroup
                    ? sudocmd.memberof_sudocmdgroup.length
                    : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfSudoCmdGroups
              entity={sudocmd}
              id={sudocmd.sudocmd as string}
              isDataLoading={sudoQuery.isFetching}
              onRefreshData={onRefreshData}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default SudoCmdsMemberOf;
