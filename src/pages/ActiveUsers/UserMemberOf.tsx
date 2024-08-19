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
import { useNavigate } from "react-router-dom";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";

interface PropsToUserMemberOf {
  user: User;
  tab: string;
  from: string;
}

const UserMemberOf = (props: PropsToUserMemberOf) => {
  const navigate = useNavigate();

  // Update breadcrumb route
  React.useEffect(() => {
    if (!props.user.uid) {
      // Redirect to the main page
      navigate("/" + props.from);
    }
  }, [props.user.uid]);

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.from, noBreadcrumb: true });

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

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("group");

  React.useEffect(() => {
    setActiveTabKey(props.tab);
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
              "/" + props.from + "/" + props.user.uid + "/memberof_" + tabIndex
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
                  {user && user.memberof_group ? user.memberof_group.length : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfUserGroups
              entry={user}
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
                  {user && user.memberof_netgroup
                    ? user.memberof_netgroup.length
                    : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfNetgroups
              entity={user}
              id={user.uid as string}
              from={props.from}
              isDataLoading={userQuery.isFetching}
              onRefreshData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={"role"}
            name="memberof_role"
            title={
              <TabTitleText>
                Roles{" "}
                <Badge key={2} isRead>
                  {user && user.memberof_role ? user.memberof_role.length : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfRoles
              entity={user}
              id={user.uid as string}
              from={props.from}
              isDataLoading={userQuery.isFetching}
              onRefreshData={onRefreshUserData}
              memberof_role={user.memberof_role as string[]}
              memberofindirect_role={user.memberofindirect_role as string[]}
            />
          </Tab>
          <Tab
            eventKey={"hbacrule"}
            name="memberof_hbacrule"
            title={
              <TabTitleText>
                HBAC rules{" "}
                <Badge key={3} isRead>
                  {user && user.memberof_hbacrule
                    ? user.memberof_hbacrule.length
                    : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfHbacRules
              entity={user}
              id={user.uid as string}
              from={props.from}
              isDataLoading={userQuery.isFetching}
              onRefreshData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={"sudorule"}
            name="memberof_sudorule"
            title={
              <TabTitleText>
                Sudo rules{" "}
                <Badge key={4} isRead>
                  {user && user.memberof_sudorule
                    ? user.memberof_sudorule.length
                    : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfSudoRules
              entity={user}
              id={user.uid as string}
              from={props.from}
              isDataLoading={userQuery.isFetching}
              onRefreshData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={"subid"}
            name="memberof_subid"
            title={
              <TabTitleText>
                Subordinate IDs{" "}
                <Badge key={5} isRead>
                  {user && user.memberof_subid ? user.memberof_subid.length : 0}
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
