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
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
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
  entry: Partial<User> | Partial<UserGroup>;
  from: string;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
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
  } = useListPageSearchParams();

  // Other states
  const [userGroupsSelected, setUserGroupsSelected] = React.useState<string[]>(
    []
  );

  // Loaded User groups based on paging and member attributes
  const [userGroups, setUserGroups] = React.useState<UserGroup[]>([]);

  // Choose the correct User groups based on the membership direction
  const memberof_group = props.entry.memberof_group || [];
  const memberofindirect_group = props.entry.memberofindirect_group || [];
  const id =
    props.from === "active-users"
      ? "uid" in props.entry
        ? (props.entry.uid as string)
        : (props.entry.cn as string)
      : (props.entry.cn as string);
  const entryType = props.from === "active-users" ? "user" : "group";
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

  // Refresh user groups
  React.useEffect(() => {
    const userGroupsNames = getUserGroupsNameToLoad();
    setUserGroupNamesToLoad(userGroupsNames);
    props.setDirection(membershipDirection);
  }, [props.entry, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entry]);

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
  const [spinning, setSpinning] = React.useState(false);

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
  }, [showAddModal, adderSearchValue, props.entry]);

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
      setAvailableItems(items);
    }
  }, [userGroupsQuery.data, userGroupsQuery.isFetching]);

  // - Add
  const onAddUserGroup = (items: AvailableItems[]) => {
    const newUserGroupNames = items.map((item) => item.key);
    if (id === undefined || newUserGroupNames.length == 0) {
      return;
    }

    setSpinning(true);
    addMemberToUserGroups([id, entryType, newUserGroupNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "add-member-success",
              `Assigned '${id}' to user groups`,
              "success"
            );
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
        setSpinning(false);
      }
    );
  };

  // - Delete
  const onDeleteUserGroup = () => {
    if (id) {
      setSpinning(true);
      removeMembersFromUserGroups([id, entryType, userGroupsSelected]).then(
        (response) => {
          if ("data" in response) {
            if (response.data.result) {
              // Set alert: success
              alerts.addAlert(
                "remove-user-groups-success",
                `Removed '${id}' from user groups`,
                "success"
              );
              // Refresh
              props.onRefreshUserData();
              // Reset delete button
              setUserGroupsSelected([]);
              // Close modal
              setShowDeleteModal(false);
              // Return to first page
              setPage(1);
            } else if (response.data.error) {
              // Set alert: error
              const errorMessage = response.data
                .error as unknown as ErrorResult;
              alerts.addAlert(
                "remove-entry-groups-error",
                errorMessage.message,
                "danger"
              );
            }
          }
          setSpinning(false);
        }
      );
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
      {userGroupNames.length > 0 && (
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
      )}
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddUserGroup}
          onSearchTextChange={setAdderSearchValue}
          title={`Assign '${id}' to user groups`}
          ariaLabel="Add entry of user group modal"
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={`Remove '${id}' from user groups`}
          onDelete={onDeleteUserGroup}
          spinning={spinning}
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
