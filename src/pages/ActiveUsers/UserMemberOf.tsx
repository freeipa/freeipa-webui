import React, { useState } from "react";
import {
  TabTitleText,
  Page,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  Badge,
} from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Wrappers
import MemberOfUserGroups from "src/components/MemberOf/MemberOfUserGroups";
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
import MemberOfHbacRules from "src/components/MemberOf/MemberOfHbacRules";
import MemberOfSudoRules from "src/components/MemberOf/MemberOfSudoRules";
import MemberOfSubIds from "src/components/MemberOf/MemberOfSubIds";
// RPC
import { useGetUserByUidQuery } from "src/services/rpcUsers";
// Utils
import { convertToString } from "src/utils/ipaObjectUtils";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { useNavigate } from "react-router-dom";

interface PropsToUserMemberOf {
  user: User;
  tab: string;
  from: string;
}

const UserMemberOf = (props: PropsToUserMemberOf) => {
  const navigate = useNavigate();

  // User's full data
  const userQuery = useGetUserByUidQuery(convertToString(props.user.uid));

  const userData = userQuery.data || {};

  const [user, setUser] = React.useState<Partial<User>>({});

  React.useEffect(() => {
    if (!userQuery.isFetching && userData) {
      setUser({ ...userData });
    }
  }, [userData, userQuery.isFetching]);

  const onRefreshUserData = () => {
    userQuery.refetch();
  };

  // 'User groups' length to show in tab badge
  const [userGroupsLength, setUserGroupLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_group) {
      setUserGroupLength(user.memberof_group.length);
    }
  }, [user]);

  // 'Netgroups' length to show in tab badge
  const [netgroupsLength, setNetgroupsLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_netgroup) {
      setNetgroupsLength(user.memberof_netgroup.length);
    }
  }, [user]);

  // 'Roles' length to show in tab badge
  const [rolesLength, setRolesLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_role) {
      setRolesLength(user.memberof_role.length);
    }
  }, [user]);

  // 'HBACRules' length to show in tab badge
  const [hbacRulesLength, setHbacRulesLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_hbacrule) {
      setHbacRulesLength(user.memberof_hbacrule.length);
    }
  }, [user]);

  // 'Sudo rules' length to show in tab badge
  const [sudoRulesLength, setSudoRulesLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_sudorule) {
      setSudoRulesLength(user.memberof_sudorule.length);
    }
  }, [user]);

  // 'Subordinate IDs' length to show in tab badge
  const [subIdsLength, setSubIdsLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_subid) {
      setSubIdsLength(user.memberof_subid.length);
    }
  }, [user]);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("group");

  React.useEffect(() => {
    setActiveTabKey(props.tab);
    navigate(
      URL_PREFIX +
        "/" +
        props.from +
        "/" +
        props.user.uid +
        "/memberof_" +
        props.tab
    );
  }, [props.tab]);

  return (
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg"
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabIndex) => {
            setActiveTabKey(tabIndex as string);
            navigate(
              URL_PREFIX +
                "/" +
                props.from +
                "/" +
                props.user.uid +
                "/memberof_" +
                tabIndex
            );
          }}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"group"}
            name="memberof_group"
            title={
              <TabTitleText>
                User groups{" "}
                <Badge key={0} isRead>
                  {userGroupsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfUserGroups
              user={user}
              from={props.from}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={"netgroup"}
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
              user={user}
              from={props.from}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={"role"}
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
              user={user}
              from={props.from}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={"hbacrule"}
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
              user={user}
              from={props.from}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={"sudorule"}
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
              user={user}
              from={props.from}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={5}
            name="memberof_subid"
            title={
              <TabTitleText>
                Subordinate IDs{" "}
                <Badge key={5} isRead>
                  {subIdsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfSubIds
              user={user}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default UserMemberOf;
