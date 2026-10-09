import React, { useState } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { SysAccount } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetSysAccountByIdQuery } from "src/services/rpcSystemAccounts";
// 'Is a member of' sections
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";

interface PropsToSystemAccountMemberOf {
  sysAccount: SysAccount;
  tabSection: string;
}

const SystemAccountMemberOf = (props: PropsToSystemAccountMemberOf) => {
  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "system-accounts", noBreadcrumb: true });

  // System account's full data
  const sysAccountQuery = useGetSysAccountByIdQuery(props.sysAccount.uid);
  const sysAccountData = sysAccountQuery.data || {};

  const [sysAccount, setSysAccount] = useState<Partial<SysAccount>>({});

  React.useEffect(() => {
    if (!sysAccountQuery.isFetching && sysAccountData) {
      setSysAccount({ ...sysAccountData });
    }
  }, [sysAccountData, sysAccountQuery.isFetching]);

  const onRefreshSysAccountData = () => {
    sysAccountQuery.refetch();
  };

  const [roleCount, setRoleCount] = React.useState(0);
  const [roleDirection, setRoleDirection] = React.useState(
    "direct" as MembershipDirection
  );

  const updateRoleDirection = (direction: MembershipDirection) => {
    setRoleCount(
      sysAccount && sysAccount.memberof_role
        ? sysAccount.memberof_role.length
        : 0
    );
    setRoleDirection(direction);
  };

  React.useEffect(() => {
    if (roleDirection === "direct") {
      setRoleCount(
        sysAccount && sysAccount.memberof_role
          ? sysAccount.memberof_role.length
          : 0
      );
    }
  }, [sysAccount]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/system-accounts/" + props.sysAccount.uid + "/" + tabIndex);
  };

  return (
    <div style={{ height: `var(--memberof-calc)` }}>
      <TabLayout id="memberof">
        <Tabs
          activeKey={props.tabSection}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"member_role"}
            name="member_role"
            title={
              <TabTitleText>
                Roles{" "}
                <Badge key={0} isRead>
                  {roleCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfRoles
              entity={sysAccount}
              id={sysAccount.uid as string}
              from="system-accounts"
              isDataLoading={sysAccountQuery.isFetching}
              onRefreshData={onRefreshSysAccountData}
              membershipDisabled={true}
              setDirection={updateRoleDirection}
              direction={roleDirection}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default SystemAccountMemberOf;
