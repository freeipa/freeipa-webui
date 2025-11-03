import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
// RPC
import { ErrorResult, MemberPayload } from "src/services/rpc";
import {
  useGetUsersInfoByUidQuery,
  useGettingActiveUserQuery,
} from "src/services/rpcUsers";
import {
  useAddMemberManagersMutation,
  useRemoveMemberManagersMutation,
} from "src/services/rpcUserGroups";
import {
  useAddHGMemberManagersMutation,
  useRemoveHGMemberManagersMutation,
} from "src/services/rpcHostGroups";
import { apiToUser } from "src/utils/userUtils";

interface PropsToManagersUsers {
  entity: Partial<User>;
  id: string;
  from: "user-groups" | "host-groups";
  isDataLoading: boolean;
  onRefreshData: () => void;
  manager_users: string[];
}

const ManagersUsers = (props: PropsToManagersUsers) => {
  const dispatch = useAppDispatch();

  // Get parameters from URL
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Other states
  const [usersSelected, setUsersSelected] = React.useState<string[]>([]);

  // Loaded users based on paging and member attributes
  const [managers, setManagers] = React.useState<User[]>([]);

  const getUserNamesToLoad = (): string[] => {
    let toLoad = [...props.manager_users];
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

  const [userNamesToLoad, setUserNamesToLoad] =
    React.useState<string[]>(getUserNamesToLoad());

  // Load user
  const fullUsersQuery = useGetUsersInfoByUidQuery({
    uidsList: userNamesToLoad,
    noMembers: true,
  });

  // Refresh user
  React.useEffect(() => {
    const userNames = getUserNamesToLoad();
    setUserNamesToLoad(userNames);
  }, [props.entity, searchValue, page, perPage]);

  React.useEffect(() => {
    if (userNamesToLoad.length > 0) {
      fullUsersQuery.refetch();
    }
  }, [userNamesToLoad]);

  // Update user
  React.useEffect(() => {
    if (fullUsersQuery.data && !fullUsersQuery.isFetching) {
      setManagers(fullUsersQuery.data);
    }
  }, [fullUsersQuery.data, fullUsersQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "user-groups") {
      return "user group";
    } else if (props.from === "host-groups") {
      return "host group";
    } else {
      // Return default
      return "user group";
    }
  };

  // Computed "states"
  const someItemSelected = usersSelected.length > 0;
  const showTableRows = managers.length > 0;
  const entityType = getEntityType();
  const userColumnNames = ["User login", "Status"];
  const userProperties = ["uid", "nsaccountlock"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullUsersQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // Add new member to 'User'
  // API calls
  let [addManagers] = useAddMemberManagersMutation();
  if (props.from === "host-groups") {
    [addManagers] = useAddHGMemberManagersMutation();
  }
  let [removeManagers] = useRemoveMemberManagersMutation();
  if (props.from === "host-groups") {
    [removeManagers] = useRemoveHGMemberManagersMutation();
  }

  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableUsers, setAvailableUsers] = React.useState<User[]>([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available user, delay the search for opening the modal
  const usersQuery = useGettingActiveUserQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available user search
  React.useEffect(() => {
    if (showAddModal) {
      usersQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available user
  React.useEffect(() => {
    if (usersQuery.data && !usersQuery.isFetching) {
      // transform data to user
      const count = usersQuery.data.result.count;
      const results = usersQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalUsers: User[] = [];
      for (let i = 0; i < count; i++) {
        const user = apiToUser(results[i].result);
        avalUsers.push(user);
        items.push({
          key: user.uid,
          title: user.uid,
        });
      }
      items = items.filter(
        (item) =>
          !props.manager_users.includes(item.key) && item.key !== props.id
      );

      setAvailableUsers(avalUsers);
      setAvailableItems(items);
    }
  }, [usersQuery.data, usersQuery.isFetching]);

  // Add
  const onAddUser = (items: AvailableItems[]) => {
    const newUserNames = items.map((item) => item.key);
    if (props.id === undefined || newUserNames.length == 0) {
      return;
    }

    const payload = {
      entryName: props.id,
      entityType: "user",
      idsToAdd: newUserNames,
    } as MemberPayload;

    setSpinning(true);
    addManagers(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Set alert: success
          dispatch(
            addAlert({
              name: "add-member-managers-success",
              title: "Assigned new user member managers to '" + props.id + "'",
              variant: "success",
            })
          );
          // Refresh data
          props.onRefreshData();
          // Close modal
          setShowAddModal(false);
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          dispatch(
            addAlert({
              name: "add-member-managers-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
      }
      setSpinning(false);
    });
  };

  // Delete
  const onDeleteUsers = () => {
    const payload = {
      entryName: props.id,
      entityType: "user",
      idsToAdd: usersSelected,
    } as MemberPayload;

    setSpinning(true);
    removeManagers(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Set alert: success
          dispatch(
            addAlert({
              name: "remove-member-managers-success",
              title: "Removed user member managers from '" + props.id + "'",
              variant: "success",
            })
          );
          // Refresh
          props.onRefreshData();
          // Disable 'remove' button
          setUsersSelected([]);
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
          setPage(1);
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          dispatch(
            addAlert({
              name: "remove-member-managers-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
      }
      setSpinning(false);
    });
  };

  return (
    <>
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        onSearch={() => {}}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={usersSelected.length > 0}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={false}
        helpIconEnabled={true}
        totalItems={props.manager_users.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={managers}
        idKey="uid"
        from={props.from}
        columnNamesToShow={userColumnNames}
        propertiesToShow={userProperties}
        checkedItems={usersSelected}
        onCheckItemsChange={setUsersSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v6-u-pb-0 pf-v6-u-pr-md"
        itemCount={managers.length}
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
          onAdd={onAddUser}
          onSearchTextChange={setAdderSearchValue}
          title={"Assign user member managers to: " + props.id}
          ariaLabel={"Add " + entityType + " to user managers modal"}
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete user member managers from: " + props.id}
          onDelete={onDeleteUsers}
          spinning={spinning}
        >
          <MemberTable
            entityList={availableUsers.filter((user) =>
              usersSelected.includes(user.uid)
            )}
            from={props.from}
            idKey="uid"
            columnNamesToShow={userColumnNames}
            propertiesToShow={userProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default ManagersUsers;
