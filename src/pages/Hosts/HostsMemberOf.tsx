import React, { useState } from "react";
// PatternFly
import {
  Badge,
  Page,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetHostByIdQuery } from "src/services/rpcHosts";
// 'Is a member of' sections
import MemberOfHostGroups from "src/components/MemberOf/MemberOfHostGroups";
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
import MemberOfHbacRules from "src/components/MemberOf/MemberOfHbacRules";
import MemberOfSudoRules from "src/components/MemberOf/MemberOfSudoRules";

interface PropsToHostsMemberOf {
  host: Host;
  tabSection: string;
}

const HostsMemberOf = (props: PropsToHostsMemberOf) => {
  const navigate = useNavigate();

  // Host's full data
  const hostQuery = useGetHostByIdQuery(props.host.fqdn);
  const hostData = hostQuery.data || {};

  const [host, setHost] = useState<Partial<Host>>({});

  React.useEffect(() => {
    if (!hostQuery.isFetching && hostData) {
      setHost({ ...hostData });
    }
  }, [hostData, hostQuery.isFetching]);

  const onRefreshHostData = () => {
    hostQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hosts", noBreadcrumb: true });

  // 'Host groups' length to show in tab badge
  const [hostGroupsLength, setHostGroupLength] = React.useState(0);

  React.useEffect(() => {
    if (host && host.memberof_hostgroup) {
      setHostGroupLength(host.memberof_hostgroup.length);
    }
  }, [host]);

  // 'Netgroups' length to show in tab badge
  const [netgroupsLength, setNetgroupLength] = React.useState(0);

  React.useEffect(() => {
    if (host && host.memberof_netgroup) {
      setNetgroupLength(host.memberof_netgroup.length);
    }
  }, [host]);

  // 'Roles' length to show in tab badge
  const [rolesLength, setRolesLength] = React.useState(0);

  React.useEffect(() => {
    if (host && host.memberof_role) {
      setRolesLength(host.memberof_role.length);
    }
  }, [host]);

  // 'HBAC rules' length to show in tab badge
  const [hbacRulesLength, setHbacRulesLength] = React.useState(0);

  React.useEffect(() => {
    if (host && host.memberof_hbacrule) {
      setHbacRulesLength(host.memberof_hbacrule.length);
    }
  }, [host]);

  // 'Sudo rules' length to show in tab badge
  const [sudoRulesLength, setSudoRulesLength] = React.useState(0);

  React.useEffect(() => {
    if (host && host.memberof_sudorule) {
      setSudoRulesLength(host.memberof_sudorule.length);
    }
  }, [host]);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("memberof_hostgroup");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    navigate("/hosts/" + props.host.fqdn + "/" + tabIndex);
  };

  React.useEffect(() => {
    setActiveTabKey(props.tabSection);
    navigate("/hosts/" + props.host.fqdn + "/" + props.tabSection);
  }, [props.tabSection]);

  // Render component
  return (
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg"
      >
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
                  {hostGroupsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfHostGroups
              host={host}
              isHostDataLoading={hostQuery.isFetching}
              onRefreshHostData={onRefreshHostData}
            />
          </Tab>
          <Tab
            eventKey={"memberof_netgroup"}
            name="memberof_netgroup"
            title={
              <TabTitleText>
                Netgroups{" "}
                <Badge key={1} isRead>
                  {netgroupsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfNetgroups
              entity={host}
              id={host.fqdn as string}
              from={"hosts"}
              isDataLoading={hostQuery.isFetching}
              onRefreshData={onRefreshHostData}
            />
          </Tab>
          <Tab
            eventKey={"memberof_role"}
            name="memberof_role"
            title={
              <TabTitleText>
                Roles{" "}
                <Badge key={2} isRead>
                  {rolesLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfRoles
              entity={host}
              id={host.fqdn as string}
              from={"hosts"}
              isDataLoading={hostQuery.isFetching}
              onRefreshData={onRefreshHostData}
            />
          </Tab>
          <Tab
            eventKey={"memberof_hbacrule"}
            name="memberof_hbacrule"
            title={
              <TabTitleText>
                HBAC rules{" "}
                <Badge key={3} isRead>
                  {hbacRulesLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfHbacRules
              entity={host}
              id={host.fqdn as string}
              from={"hosts"}
              isDataLoading={hostQuery.isFetching}
              onRefreshData={onRefreshHostData}
            />
          </Tab>
          <Tab
            eventKey={"memberof_sudorule"}
            name="memberof_sudorule"
            title={
              <TabTitleText>
                Sudo rules{" "}
                <Badge key={4} isRead>
                  {sudoRulesLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfSudoRules
              entity={host}
              id={host.fqdn as string}
              from={"hosts"}
              isDataLoading={hostQuery.isFetching}
              onRefreshData={onRefreshHostData}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default HostsMemberOf;
