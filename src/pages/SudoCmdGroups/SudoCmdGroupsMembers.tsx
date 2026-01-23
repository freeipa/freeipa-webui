import React from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { SudoCmdGroup } from "src/utils/datatypes/globalDataTypes";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetSudoCmdGroupByIdQuery } from "src/services/rpcSudoCmdGroups";
// 'Members' sections
import MembersSudoCommands from "src/components/Members/MembersSudoCommands";

interface PropsToSudoGroupsMembers {
  sudocmdgroup: SudoCmdGroup;
  tabSection: string;
}

const SudoCmdGroupMembers = (props: PropsToSudoGroupsMembers) => {
  const navigate = useNavigate();

  const {
    data: cmdGroup,
    isFetching,
    refetch,
  } = useGetSudoCmdGroupByIdQuery(props.sudocmdgroup.cn);

  // Fallback to props.sudocmdgroup if cmdGroup is not available
  const displayEntity = cmdGroup || props.sudocmdgroup || {};

  const onRefreshSudoCmdData = () => {
    refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "sudo-command-groups", noBreadcrumb: true });

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/sudo-command-groups/" + props.sudocmdgroup.cn + "/" + tabIndex);
  };

  return (
    <div
      style={{
        height: `var(--subsettings-calc)`,
      }}
    >
      <TabLayout id="members">
        <Tabs
          activeKey={props.tabSection}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"member_sudocmd"}
            name="member_sudocmd"
            title={
              <TabTitleText>
                Sudo commands{" "}
                <Badge key={0} id="cmd_count" isRead>
                  {cmdGroup?.member_sudocmd
                    ? cmdGroup?.member_sudocmd?.length
                    : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersSudoCommands
              entity={displayEntity}
              id={props.sudocmdgroup.cn}
              from="sudo-command-groups"
              isDataLoading={isFetching}
              onRefreshData={onRefreshSudoCmdData}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default SudoCmdGroupMembers;
