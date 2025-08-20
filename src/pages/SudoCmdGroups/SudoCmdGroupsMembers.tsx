import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { SudoCmdGroup } from "src/utils/datatypes/globalDataTypes";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router-dom";
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

  const groupQuery = useGetSudoCmdGroupByIdQuery(props.sudocmdgroup.cn);
  const groupData = groupQuery.data || {};
  const [cmdGroup, setCmdGroup] = useState<Partial<SudoCmdGroup>>({});

  React.useEffect(() => {
    if (!groupQuery.isFetching && groupData) {
      setCmdGroup({ ...groupData });
    }
  }, [groupData, groupQuery.isFetching]);

  const onRefreshSudoCmdData = () => {
    groupQuery.refetch();
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
                  {cmdGroup && cmdGroup.member_sudocmd
                    ? cmdGroup.member_sudocmd.length
                    : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersSudoCommands
              entity={cmdGroup}
              id={cmdGroup.cn as string}
              from="sudo-command-groups"
              isDataLoading={groupQuery.isFetching}
              onRefreshData={onRefreshSudoCmdData}
              member_sudocmd={cmdGroup.member_sudocmd || []}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default SudoCmdGroupMembers;
