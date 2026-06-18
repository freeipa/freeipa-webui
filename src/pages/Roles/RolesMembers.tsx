import React, { useMemo } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { Role } from "src/utils/datatypes/globalDataTypes";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetRoleByIdQuery } from "src/services/rpcRoles";
// 'Members' sections
import MembersUsers from "src/components/Members/MembersUsers";
import MembersUserGroups from "src/components/Members/MembersUserGroups";
import MembersHosts from "src/components/Members/MembersHosts";
import MembersHostGroups from "src/components/Members/MembersHostGroups";
import MembersServices from "src/components/Members/MembersServices";
import MembersUserIdOverride from "src/components/Members/MembersUserIdOverride";
import MembersSystemAccount from "src/components/Members/MembersSystemAccount";

interface PropsToRolesMembers {
  role: Role;
  tabSection: string;
}

const RolesMembers = (props: PropsToRolesMembers) => {
  const navigate = useNavigate();

  const roleQuery = useGetRoleByIdQuery(props.role.cn);
  const roleData = roleQuery.data || {};

  const role = useMemo<Partial<Role>>(() => {
    if (!roleQuery.isFetching && roleData) {
      return { ...roleData };
    }
    return {};
  }, [roleData, roleQuery.isFetching]);

  const onRefreshRoleData = () => {
    roleQuery.refetch();
  };

  useUpdateRoute({ pathname: "roles", noBreadcrumb: true });

  const userCount = role.member_user ? role.member_user.length : 0;
  const groupCount = role.member_group ? role.member_group.length : 0;
  const hostCount = role.member_host ? role.member_host.length : 0;
  const hostGroupCount = role.member_hostgroup
    ? role.member_hostgroup.length
    : 0;
  const serviceCount = role.member_service ? role.member_service.length : 0;
  const idOverrideCount = role.member_idoverrideuser
    ? role.member_idoverrideuser.length
    : 0;
  const sysAccountCount = role.member_sysaccount
    ? role.member_sysaccount.length
    : 0;

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/roles/" + props.role.cn + "/" + tabIndex);
  };

  return (
    <div style={{ height: `var(--memberof-calc)` }}>
      <TabLayout id="members">
        <Tabs
          activeKey={props.tabSection}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"member_user"}
            name="member_user"
            title={
              <TabTitleText>
                Users{" "}
                <Badge key={0} id="user_count" isRead>
                  {userCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersUsers
              entity={role}
              id={role.cn as string}
              from="roles"
              isDataLoading={roleQuery.isFetching}
              onRefreshData={onRefreshRoleData}
              member_user={role.member_user || []}
              membershipDisabled={true}
              setDirection={() => {}}
              direction="direct"
            />
          </Tab>
          <Tab
            eventKey={"member_group"}
            name="member_group"
            title={
              <TabTitleText>
                User groups{" "}
                <Badge key={1} id="group_count" isRead>
                  {groupCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersUserGroups
              entity={role}
              id={role.cn as string}
              from="roles"
              isDataLoading={roleQuery.isFetching}
              onRefreshData={onRefreshRoleData}
              member_group={role.member_group || []}
              membershipDisabled={true}
              setDirection={() => {}}
              direction="direct"
            />
          </Tab>
          <Tab
            eventKey={"member_host"}
            name="member_host"
            title={
              <TabTitleText>
                Hosts{" "}
                <Badge key={2} id="host_count" isRead>
                  {hostCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersHosts
              entity={role}
              id={role.cn as string}
              from="roles"
              isDataLoading={roleQuery.isFetching}
              onRefreshData={onRefreshRoleData}
              member_host={role.member_host || []}
              membershipDisabled={true}
              setDirection={() => {}}
              direction="direct"
            />
          </Tab>
          <Tab
            eventKey={"member_hostgroup"}
            name="member_hostgroup"
            title={
              <TabTitleText>
                Host groups{" "}
                <Badge key={3} id="hostgroup_count" isRead>
                  {hostGroupCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersHostGroups
              entity={role}
              id={role.cn as string}
              from="roles"
              isDataLoading={roleQuery.isFetching}
              onRefreshData={onRefreshRoleData}
              member_hostgroup={role.member_hostgroup || []}
              membershipDisabled={true}
              setDirection={() => {}}
              direction="direct"
            />
          </Tab>
          <Tab
            eventKey={"member_service"}
            name="member_service"
            title={
              <TabTitleText>
                Services{" "}
                <Badge key={4} id="service_count" isRead>
                  {serviceCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersServices
              entity={role}
              id={role.cn as string}
              from="roles"
              isDataLoading={roleQuery.isFetching}
              onRefreshData={onRefreshRoleData}
              member_service={role.member_service || []}
              membershipDisabled={true}
              setDirection={() => {}}
              direction="direct"
            />
          </Tab>
          <Tab
            eventKey={"member_idoverrideuser"}
            name="member_idoverrideuser"
            title={
              <TabTitleText>
                User ID override{" "}
                <Badge key={5} id="idoverride_count" isRead>
                  {idOverrideCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersUserIdOverride
              entity={role}
              id={role.cn as string}
              from="roles"
              isDataLoading={roleQuery.isFetching}
              onRefreshData={onRefreshRoleData}
              member_idoverrideuser={role.member_idoverrideuser || []}
            />
          </Tab>
          <Tab
            eventKey={"member_sysaccount"}
            name="member_sysaccount"
            title={
              <TabTitleText>
                System accounts{" "}
                <Badge key={6} id="sysaccount_count" isRead>
                  {sysAccountCount}
                </Badge>
              </TabTitleText>
            }
          >
            <MembersSystemAccount
              entity={role}
              id={role.cn as string}
              from="roles"
              isDataLoading={roleQuery.isFetching}
              onRefreshData={onRefreshRoleData}
              member_sysaccount={role.member_sysaccount || []}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default RolesMembers;
