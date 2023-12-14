import React, { useState } from "react";
import { TabTitleText, Tab, Tabs, Badge } from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Wrappers
import MemberOfUserGroups from "src/components/MemberOf/MemberOfUserGroups";
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
import MemberOfHbacRules from "src/components/MemberOf/MemberOfHbacRules";
import MemberOfSudoRules from "src/components/MemberOf/MemberOfSudoRules";
import MemberOfSubIds from "src/components/MemberOf/MemberOfSubIds";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
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

  const [groupCount, setGroupCount] = React.useState(0);
  const [netgroupCount, setNetgroupCount] = React.useState(0);
  const [roleCount, setRoleCount] = React.useState(0);
  const [hbacCount, setHbacCount] = React.useState(0);
  const [sudoCount, setSudoCount] = React.useState(0);
  const [groupDirection, setGroupDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [netgroupDirection, setNetgroupDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [roleDirection, setRoleDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [hbacDirection, setHbacDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [sudoDirection, setSudoDirection] = React.useState(
    "direct" as MembershipDirection
  );

  const updateGroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setGroupCount(
        user && user.memberof_group ? user.memberof_group.length : 0
      );
    } else {
      setGroupCount(
        user && user.memberofindirect_group
          ? user.memberofindirect_group.length
          : 0
      );
    }
    setGroupDirection(direction);
  };
  const updateNetgroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setNetgroupCount(
        user && user.memberof_netgroup ? user.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        user && user.memberofindirect_netgroup
          ? user.memberofindirect_netgroup.length
          : 0
      );
    }
    setNetgroupDirection(direction);
  };
  const updateRoleDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setRoleCount(user && user.memberof_role ? user.memberof_role.length : 0);
    } else {
      setRoleCount(
        user && user.memberofindirect_role
          ? user.memberofindirect_role.length
          : 0
      );
    }
    setRoleDirection(direction);
  };
  const updateHbacDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setHbacCount(
        user && user.memberof_hbacrule ? user.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        user && user.memberofindirect_hbacrule
          ? user.memberofindirect_hbacrule.length
          : 0
      );
    }
    setHbacDirection(direction);
  };
  const updateSudoDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setSudoCount(
        user && user.memberof_sudorule ? user.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        user && user.memberofindirect_sudorule
          ? user.memberofindirect_sudorule.length
          : 0
      );
    }
    setSudoDirection(direction);
  };

  React.useEffect(() => {
    if (groupDirection === "direct") {
      setGroupCount(
        user && user.memberof_group ? user.memberof_group.length : 0
      );
    } else {
      setGroupCount(
        user && user.memberofindirect_group
          ? user.memberofindirect_group.length
          : 0
      );
    }
    if (netgroupDirection === "direct") {
      setNetgroupCount(
        user && user.memberof_netgroup ? user.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        user && user.memberofindirect_netgroup
          ? user.memberofindirect_netgroup.length
          : 0
      );
    }
    if (roleDirection === "direct") {
      setRoleCount(user && user.memberof_role ? user.memberof_role.length : 0);
    } else {
      setRoleCount(
        user && user.memberofindirect_role
          ? user.memberofindirect_role.length
          : 0
      );
    }
    if (hbacDirection === "direct") {
      setHbacCount(
        user && user.memberof_hbacrule ? user.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        user && user.memberofindirect_hbacrule
          ? user.memberofindirect_hbacrule.length
          : 0
      );
    }
    if (sudoDirection === "direct") {
      setSudoCount(
        user && user.memberof_sudorule ? user.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        user && user.memberofindirect_sudorule
          ? user.memberofindirect_sudorule.length
          : 0
      );
    }
  }, [user]);

  return (
    <TabLayout id="memberOf">
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
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={false}>
          <Tab
            eventKey={0}
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
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={1}
            name="memberof_netgroup"
            title={
              <TabTitleText>
                Netgroups{" "}
                <Badge key={1} isRead>
                  {netgroupsRepoLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfToolbar
              pageRepo={netgroupsRepository}
              shownItems={shownNetgroupsList}
              toolbar="netgroups"
              settersData={toolbarSettersData}
              pageData={toolbarPageData}
              buttonData={toolbarButtonData}
              searchValueData={searchValueData}
            />
            <MemberOfTable
              group={shownNetgroupsList}
              tableName={"Netgroups"}
              activeTabKey={activeTabKey}
              changeSelectedGroups={updateGroupsNamesSelected}
              buttonData={tableButtonData}
              showTableRows={showTableRows}
              searchValue={searchValue}
              fullGroupList={netgroupsRepository}
            />
          </Tab>
          <Tab
            eventKey={2}
            name="memberof_role"
            title={
              <TabTitleText>
                Roles{" "}
                <Badge key={2} isRead>
                  {rolesRepoLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfToolbar
              pageRepo={rolesRepository}
              shownItems={shownRolesList}
              toolbar="roles"
              settersData={toolbarSettersData}
              pageData={toolbarPageData}
              buttonData={toolbarButtonData}
              searchValueData={searchValueData}
            />
            <MemberOfTable
              group={shownRolesList}
              tableName={"Roles"}
              activeTabKey={activeTabKey}
              changeSelectedGroups={updateGroupsNamesSelected}
              buttonData={tableButtonData}
              showTableRows={showTableRows}
              searchValue={searchValue}
              fullGroupList={rolesRepository}
            />
          </Tab>
          <Tab
            eventKey={3}
            name="memberof_hbacrule"
            title={
              <TabTitleText>
                HBAC rules{" "}
                <Badge key={3} isRead>
                  {hbacRulesRepoLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfToolbar
              pageRepo={hbacRulesRepository}
              shownItems={shownHBACRulesList}
              toolbar="HBAC rules"
              settersData={toolbarSettersData}
              pageData={toolbarPageData}
              buttonData={toolbarButtonData}
              searchValueData={searchValueData}
            />
            <MemberOfTable
              group={shownHBACRulesList}
              tableName={"HBAC rules"}
              activeTabKey={activeTabKey}
              changeSelectedGroups={updateGroupsNamesSelected}
              buttonData={tableButtonData}
              showTableRows={showTableRows}
              searchValue={searchValue}
              fullGroupList={hbacRulesRepository}
            />
          </Tab>
          <Tab
            eventKey={4}
            name="memberof_sudorule"
            title={
              <TabTitleText>
                Sudo rules{" "}
                <Badge key={4} isRead>
                  {sudoRulesRepoLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfToolbar
              pageRepo={sudoRulesRepository}
              shownItems={shownSudoRulesList}
              toolbar="sudo rules"
              settersData={toolbarSettersData}
              pageData={toolbarPageData}
              buttonData={toolbarButtonData}
              searchValueData={searchValueData}
            />
            <MemberOfTable
              group={shownSudoRulesList}
              tableName={"Sudo rules"}
              activeTabKey={activeTabKey}
              changeSelectedGroups={updateGroupsNamesSelected}
              buttonData={tableButtonData}
              showTableRows={showTableRows}
              searchValue={searchValue}
              fullGroupList={sudoRulesRepository}
            />
          </Tab>
        </Tabs>
        <Pagination
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          itemCount={numberOfItems()}
          widgetId="pagination-options-menu-bottom"
          perPage={perPage}
          page={page}
          variant={PaginationVariant.bottom}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
        />
      </PageSection>
      {tabName === "Netgroups" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              modalData={addModalData}
              availableData={netgroupsFilteredData}
              groupRepository={netgroupsRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateNetgroupsList}
              tabData={tabData}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              modalData={deleteModalData}
              tabData={deleteTabData}
              groupNamesToDelete={groupsNamesSelected}
              groupRepository={netgroupsRepository}
              updateGroupRepository={updateGroupRepository}
              buttonData={deleteButtonData}
            />
          )}
        </>
      )}
      {tabName === "Roles" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              modalData={addModalData}
              availableData={rolesFilteredData}
              groupRepository={rolesRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateRolesList}
              tabData={tabData}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              modalData={deleteModalData}
              tabData={deleteTabData}
              groupNamesToDelete={groupsNamesSelected}
              groupRepository={rolesRepository}
              updateGroupRepository={updateGroupRepository}
              buttonData={deleteButtonData}
            />
          )}
        </>
      )}
      {tabName === "HBAC rules" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              modalData={addModalData}
              availableData={hbacRulesFilteredData}
              groupRepository={hbacRulesRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateHbacRulesList}
              tabData={tabData}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              modalData={deleteModalData}
              tabData={deleteTabData}
              groupNamesToDelete={groupsNamesSelected}
              groupRepository={hbacRulesRepository}
              updateGroupRepository={updateGroupRepository}
              buttonData={deleteButtonData}
            />
          )}
        </>
      )}
      {tabName === "Sudo rules" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              modalData={addModalData}
              availableData={sudoRulesFilteredData}
              groupRepository={sudoRulesRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateSudoRulesList}
              tabData={tabData}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              modalData={deleteModalData}
              tabData={deleteTabData}
              groupNamesToDelete={groupsNamesSelected}
              groupRepository={sudoRulesRepository}
              updateGroupRepository={updateGroupRepository}
              buttonData={deleteButtonData}
            />
          )}
        </>
      )}
    </Page>
  );
};

export default UserMemberOf;
