import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "./MemberTable";
// Data types
import { User, UserGroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToUser } from "src/utils/userUtils";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useGetUsersInfoByUidQuery,
  useGettingActiveUserQuery,
} from "src/services/rpcUsers";
import {
  MemberPayload,
  useAddToUsersAsMemberMutation,
  useRemoveFromUsersAsMemberMutation,
} from "src/services/rpcUserGroups";

interface PropsToMembersUsers {
  entity: Partial<UserGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_user: string[];
  memberindirect_user?: string[];
  membershipDisabled?: boolean;
}

const MembersUsers = (props: PropsToMembersUsers) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const membershipDisabled =
    props.membershipDisabled === undefined ? false : props.membershipDisabled;

  // Get parameters from URL
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
  const [usersSelected, setUsersSelected] = React.useState<string[]>([]);

  // Loaded users based on paging and member attributes
  const [users, setUsers] = React.useState<User[]>([]);

  // Choose the correct users based on the membership direction
  const member_user = props.member_user || [];
  const memberindirect_user = props.memberindirect_user || [];
  let userNames =
    membershipDirection === "direct" ? member_user : memberindirect_user;
  userNames = [...userNames];

  const getUsersNameToLoad = (): string[] => {
    let toLoad = [...userNames];
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

  const [userNamesToLoad, setUserNamesToLoad] = React.useState<string[]>(
    getUsersNameToLoad()
  );

  // Load users
  const fullUsersQuery = useGetUsersInfoByUidQuery({
    uidsList: userNamesToLoad,
    noMembers: true,
  });

  // Refresh users
  React.useEffect(() => {
    const usersNames = getUsersNameToLoad();
    setUserNamesToLoad(usersNames);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (userNamesToLoad.length > 0) {
      fullUsersQuery.refetch();
    }
  }, [userNamesToLoad]);

  // Update users
  React.useEffect(() => {
    if (fullUsersQuery.data && !fullUsersQuery.isFetching) {
      setUsers(fullUsersQuery.data);
    }
  }, [fullUsersQuery.data, fullUsersQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "user-groups") {
      return "user group";
    } else {
      // Return 'group' as default
      return "group";
    }
  };

  // Computed "states"
  const someItemSelected = usersSelected.length > 0;
  const showTableRows = users.length > 0;
  const entityType = getEntityType();
  const userColumnNames = [
    "User login",
    "First name",
    "Last name",
    "Status",
    "UID",
    "Email address",
    "Telephone number",
    "Job title",
  ];
  const userProperties = [
    "uid",
    "givenname",
    "sn",
    "nsaccountlock",
    "uidnumber",
    "mail",
    "telephonenumber",
    "title",
  ];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullUsersQuery.isFetching && !props.isDataLoading;
  const isDeleteEnabled =
    someItemSelected && membershipDirection !== "indirect";
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'User'
  // API calls
  const [addMemberToUser] = useAddToUsersAsMemberMutation();
  const [removeMembersFromUsers] = useRemoveFromUsersAsMemberMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableUsers, setAvailableUsers] = React.useState<User[]>([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available users, delay the search for opening the modal
  const usersQuery = useGettingActiveUserQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available users search
  React.useEffect(() => {
    if (showAddModal) {
      usersQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available users
  React.useEffect(() => {
    if (usersQuery.data && !usersQuery.isFetching) {
      // transform data to users
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
      items = items.filter((item) => !member_user.includes(item.key));

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
      userGroup: props.id,
      entityType: "user",
      userIds: newUserNames,
    } as MemberPayload;

    addMemberToUser(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new users to " + entityType + " " + props.id,
            "success"
          );
          // Update displayed users before they are updated via refresh
          const newUsers = users.concat(
            availableUsers.filter((user) => newUserNames.includes(user.uid))
          );
          setUsers(newUsers);

          // Refresh data
          props.onRefreshData();
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

  // Delete
  const onDeleteUser = () => {
    const payload = {
      userGroup: props.id,
      entityType: "user",
      userIds: usersSelected,
    } as MemberPayload;

    removeMembersFromUsers(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-users-success",
            "Removed users from " + entityType + " '" + props.id + "'",
            "success"
          );
          // Update displayed users
          const newUsers = users.filter(
            (user) => !usersSelected.includes(user.uid)
          );
          setUsers(newUsers);
          // Update data
          setUsersSelected([]);
          // Close modal
          setShowDeleteModal(false);
          // Refresh
          props.onRefreshData();
          // Back to page 1
          setPage(1);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("remove-users-error", errorMessage.message, "danger");
        }
      }
    });
  };

  return (
    <>
      <alerts.ManagedAlerts />
      {membershipDisabled ? (
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshData}
          deleteButtonEnabled={isDeleteEnabled}
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          helpIconEnabled={true}
          totalItems={userNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      ) : (
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshData}
          deleteButtonEnabled={isDeleteEnabled}
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          membershipDirectionEnabled={true}
          membershipDirection={membershipDirection}
          onMembershipDirectionChange={setMembershipDirection}
          helpIconEnabled={true}
          totalItems={userNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      )}
      <MemberTable
        entityList={users}
        idKey="uid"
        columnNamesToShow={userColumnNames}
        propertiesToShow={userProperties}
        checkedItems={usersSelected}
        onCheckItemsChange={setUsersSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={userNames.length}
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
          title={"Assign users to " + entityType + " " + props.id}
          ariaLabel={"Add " + entityType + " of user modal"}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete " + entityType + " from Users"}
          onDelete={onDeleteUser}
        >
          <MemberTable
            entityList={availableUsers.filter((user) =>
              usersSelected.includes(user.uid)
            )}
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

export default MembersUsers;
