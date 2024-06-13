import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, UserGroup } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberOfUserGroupsTable from "./MemberOfTableUserGroups";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useRoutingParams from "src/hooks/useRoutingParams";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useAddToGroupsMutation,
  useGetGroupInfoByNameQuery,
  useGettingGroupsQuery,
  useRemoveFromGroupsMutation,
} from "src/services/rpcUserGroups";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToGroup } from "src/utils/groupUtils";

interface MemberOfUserGroupsProps {
  user: Partial<User>;
  from: string;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const MemberOfUserGroups = (props: MemberOfUserGroupsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    searchValue,
    setSearchValue,
    membershipDirection,
    setMembershipDirection,
  } = useRoutingParams();

  // Other states
  const [userGroupsSelected, setUserGroupsSelected] = React.useState<string[]>(
    []
  );

  // Loaded User groups based on paging and member attributes
  const [userGroups, setUserGroups] = React.useState<UserGroup[]>([]);

  // Choose the correct User groups based on the membership direction
  const memberof_group = props.user.memberof_group || [];
  const memberofindirect_group = props.user.memberofindirect_group || [];
  let userGroupNames =
    membershipDirection === "direct" ? memberof_group : memberofindirect_group;
  userGroupNames = [...userGroupNames];

  const getUserGroupsNameToLoad = (): string[] => {
    let toLoad = [...userGroupNames];
    toLoad.sort();

    // Filter by search
    if (searchValue) {
      toLoad = toLoad.filter((name) =>
        name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply paging
    toLoad = paginate(toLoad, page, perPage);

    return toLoad;
  };

  const [userGroupNamesToLoad, setUserGroupNamesToLoad] = React.useState<
    string[]
  >(getUserGroupsNameToLoad());

  // Load User groups
  const fullUserGroupsQuery = useGetGroupInfoByNameQuery({
    groupNamesList: userGroupNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Reset page on direction change
  React.useEffect(() => {
    setPage(1);
  }, [membershipDirection]);

  // Refresh user groups
  React.useEffect(() => {
    const userGroupsNames = getUserGroupsNameToLoad();
    setUserGroupNamesToLoad(userGroupsNames);
  }, [props.user, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (userGroupNamesToLoad.length > 0) {
      fullUserGroupsQuery.refetch();
    }
  }, [userGroupNamesToLoad]);

  // Update user groups
  React.useEffect(() => {
    if (fullUserGroupsQuery.data && !fullUserGroupsQuery.isFetching) {
      setUserGroups(fullUserGroupsQuery.data);
    }
  }, [fullUserGroupsQuery.data, fullUserGroupsQuery.isFetching]);

  // Computed "states"
  const someItemSelected = userGroupsSelected.length > 0;
  const showTableRows = userGroups.length > 0;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullUserGroupsQuery.isFetching && !props.isUserDataLoading;
  const isDeleteEnabled =
    someItemSelected && membershipDirection !== "indirect";
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'User groups'
  // API calls
  const [addMemberToUserGroups] = useAddToGroupsMutation();
  const [removeMembersFromUserGroups] = useRemoveFromGroupsMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableUserGroups, setAvailableUserGroups] = React.useState<
    UserGroup[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available User groups
  const userGroupsQuery = useGettingGroupsQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available User groups search
  React.useEffect(() => {
    if (showAddModal) {
      userGroupsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.user]);

  // Update available User groups
  React.useEffect(() => {
    if (userGroupsQuery.data && !userGroupsQuery.isFetching) {
      // transform data to User groups
      const count = userGroupsQuery.data.result.count;
      const results = userGroupsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalUserGroups: UserGroup[] = [];
      for (let i = 0; i < count; i++) {
        const userGroup = apiToGroup(results[i].result);
        avalUserGroups.push(userGroup);
        items.push({
          key: userGroup.cn,
          title: userGroup.cn,
        });
      }
      items = items.filter((item) => !memberof_group.includes(item.key));

      setAvailableUserGroups(avalUserGroups);
      setAvailableItems(items);
    }
  }, [userGroupsQuery.data, userGroupsQuery.isFetching]);

  // - Add
  const onAddUserGroup = (items: AvailableItems[]) => {
    const uid = props.user.uid;
    const newUserGroupNames = items.map((item) => item.key);
    if (uid === undefined || newUserGroupNames.length == 0) {
      return;
    }

    addMemberToUserGroups([uid, "user", newUserGroupNames]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            `Assigned user ${uid} to user groups`,
            "success"
          );
          // Update displayed User groups before they are updated via refresh
          const newUserGroups = userGroups.concat(
            availableUserGroups.filter((userGroup) =>
              newUserGroupNames.includes(userGroup.cn)
            )
          );
          setUserGroups(newUserGroups);

          // Refresh data
          props.onRefreshUserData();
          // Close modal
          setShowAddModal(false);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("add-member-error", errorMessage.message, "danger");
        }
      }
    });
  };

  // - Delete
  const onDeleteUserGroup = () => {
    if (props.user.uid) {
      removeMembersFromUserGroups([
        props.user.uid,
        "user",
        userGroupsSelected,
      ]).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-user-groups-success",
              "Removed members from user group '" + props.user.uid + "'",
              "success"
            );
            // Update displayed User groups
            const newUserGroups = userGroups.filter(
              (userGroup) => !userGroupsSelected.includes(userGroup.cn)
            );
            setUserGroups(newUserGroups);
            // Update data
            setUserGroupsSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Refresh
            props.onRefreshUserData();
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-user-groups-error",
              errorMessage.message,
              "danger"
            );
          }
        }
      });
    }
  };

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSearch={() => {}}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshUserData}
        deleteButtonEnabled={isDeleteEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={userGroupNames.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfUserGroupsTable
        userGroups={userGroups}
        checkedItems={userGroupsSelected}
        onCheckItemsChange={setUserGroupsSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={userGroupNames.length}
        widgetId="pagination-options-menu-bottom"
        perPage={perPage}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={(_e, page) => setPage(page)}
        onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
      />
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddUserGroup}
          onSearchTextChange={setAdderSearchValue}
          title={`Assign user groups to user ${props.user.uid}`}
          ariaLabel="Add user of user group modal"
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title="Delete user from User groups"
          onDelete={onDeleteUserGroup}
        >
          <MemberOfUserGroupsTable
            userGroups={userGroups.filter((group) =>
              userGroupsSelected.includes(group.cn)
            )}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MemberOfUserGroups;
