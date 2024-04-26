import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, Role } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar, { MembershipDirection } from "./MemberOfToolbar";
import MemberOfTableRoles from "./MemberOfTableRoles";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import {
  BatchRPCResponse,
  ErrorResult,
  useAddToRolesMutation,
  useGetRolesInfoByNameQuery,
  useGettingRolesQuery,
  useRemoveFromRolesMutation,
} from "src/services/rpc";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToRole } from "src/utils/rolesUtils";

interface MemberOfRolesProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}
const MemberOfRoles = (props: MemberOfRolesProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [addMemberToRoles] = useAddToRolesMutation();
  const [removeMembersFromRoles] = useRemoveFromRolesMutation();

  // Roles from current user
  const [rolesFromUser, setRolesFromUser] = React.useState<Role[]>([]);

  const [rolesNotFromUser, setRolesNotFromUser] = React.useState<Role[]>([]);
  const [rolesAvailable, setRolesAvailable] = React.useState<AvailableItems[]>(
    []
  );

  const [indirectRoles, setIndirectRoles] = React.useState<Role[]>([]);

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // API call
  // - Full info of available Roles
  const fullRolesQuery = useGettingRolesQuery({
    apiVersion: API_VERSION_BACKUP,
    startIdx: 0,
    stopIdx: 100, // Max number of roles retrieved
  });

  const fullRolesData = fullRolesQuery.data || {};

  const [rolesFullList, setRolesFullList] = React.useState<Role[]>([]);

  const memberof_role = props.user.memberof_role || [];
  const memberofindirect_role = props.user.memberofindirect_role || [];

  const directMembersFullDataQuery = useGetRolesInfoByNameQuery({
    roleNamesList: memberof_role,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  const directMembersData = directMembersFullDataQuery.data || [];

  const indirectMembersFullDataQuery = useGetRolesInfoByNameQuery({
    roleNamesList: memberofindirect_role,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  const indirectMembersData = indirectMembersFullDataQuery.data || [];

  // Converts API data to Role data
  React.useEffect(() => {
    if (fullRolesData && !fullRolesQuery.isFetching) {
      const dataParsed = fullRolesData as BatchRPCResponse;
      const count = dataParsed.result.count;
      const results = dataParsed.result.results;

      const rolesTempList: Role[] = [];

      for (let i = 0; i < count; i++) {
        const role = apiToRole(results[i].result);
        rolesTempList.push(role);
      }
      setRolesFullList(rolesTempList);
    }
  }, [fullRolesData, fullRolesQuery.isFetching]);

  // Assign and sort data when it is fetched
  React.useEffect(() => {
    if (directMembersData && !directMembersFullDataQuery.isFetching) {
      const directMembersDataCopy = [...directMembersData];
      const sortedDirectMembers = directMembersDataCopy.sort((a, b) =>
        a.cn.localeCompare(b.cn)
      );
      setRolesFromUser(sortedDirectMembers);
    }
  }, [directMembersData, directMembersFullDataQuery.isFetching]);

  React.useEffect(() => {
    if (indirectMembersData && !indirectMembersFullDataQuery.isFetching) {
      const indirectMembersDataCopy = [...indirectMembersData];
      const sortedIndirectMembers = indirectMembersDataCopy.sort((a, b) =>
        a.cn.localeCompare(b.cn)
      );
      setIndirectRoles(sortedIndirectMembers);
    }
  }, [indirectMembersData, indirectMembersFullDataQuery.isFetching]);

  // Refetch User groups when user data changes
  React.useEffect(() => {
    directMembersFullDataQuery.refetch();
    indirectMembersFullDataQuery.refetch();

    // Roles not from user
    const rolesNotFromUserParsed: Role[] = rolesFullList.filter(
      (role) => !memberof_role.includes(role.cn)
    );
    if (
      JSON.stringify(rolesNotFromUser) !==
      JSON.stringify(rolesNotFromUserParsed)
    ) {
      setRolesNotFromUser(rolesNotFromUserParsed);
      setRolesAvailable(parseAvailableItems(rolesNotFromUserParsed));
    }
  }, [rolesFullList]);

  // Other states
  const [rolesSelected, setRolesSelected] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState("");

  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Computed "states"
  const someItemSelected = rolesSelected.length > 0;
  const [shownRoles, setShownRoles] = React.useState<Role[]>(
    paginate(rolesFromUser, page, perPage)
  );
  const showTableRows = rolesFromUser.length > 0;

  // Pagination
  // - Data would depend on the direction
  const [paginationData, setPaginationData] = React.useState<string[]>([]);

  // Update 'shownRoles' when 'RolesFromUser' changes
  React.useEffect(() => {
    if (membershipDirection === "indirect") {
      setShownRoles(indirectRoles);
    } else {
      setShownRoles(paginate(rolesFromUser, page, perPage));
    }
    setPage(1);
  }, [rolesFromUser]);

  // When change page, update 'shownRoles'
  React.useEffect(() => {
    if (membershipDirection === "indirect") {
      setShownRoles(paginate(indirectRoles, page, perPage));
    } else {
      setShownRoles(paginate(rolesFromUser, page, perPage));
    }
  }, [page, perPage]);

  // Parse availableItems to 'AvailableItems' type
  const parseAvailableItems = (itemsList: Role[]) => {
    const avItems: AvailableItems[] = [];
    itemsList.map((item) => {
      avItems.push({
        key: item.cn,
        title: item.cn,
      });
    });
    return avItems;
  };

  // Membership
  // - Update shown groups on table when membership direction changes
  React.useEffect(() => {
    if (membershipDirection === "indirect") {
      setShownRoles(paginate(indirectRoles, page, perPage));
      setPaginationData(memberofindirect_role);
    } else {
      setShownRoles(paginate(rolesFromUser, page, perPage));
      setPaginationData(memberof_role);
    }
    setPage(1);
  }, [membershipDirection, props.user]);

  // Buttons functionality
  const deleteAndAddButtonsEnabled = membershipDirection !== "indirect";

  // - Refresh
  const isRefreshButtonEnabled =
    !directMembersFullDataQuery.isFetching &&
    !indirectMembersFullDataQuery.isFetching &&
    !props.isUserDataLoading;

  // - Add
  const isAddButtonEnabled =
    !directMembersFullDataQuery.isFetching &&
    !indirectMembersFullDataQuery.isFetching &&
    !props.isUserDataLoading;

  // Add new member to 'Role'
  const onAddToRole = (toUid: string, type: string, newData: string[]) => {
    addMemberToRoles([toUid, type, newData]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Added new members to Role '" + toUid + "'",
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
    });
  };

  const onAddRole = (items: AvailableItems[]) => {
    const newItems = items.map((item) => item.key);
    const newRoles = rolesFullList.filter((role) => newItems.includes(role.cn));
    if (props.user.uid !== undefined) {
      onAddToRole(props.user.uid, "user", newItems);
      const updatedRoles = rolesFromUser.concat(newRoles);
      setRolesFromUser(updatedRoles);
      // Remove the just-added items from 'rolesAvailable'
      const newAvailableItems = rolesAvailable.filter(
        (item) => !newItems.includes(item.key)
      );
      setRolesAvailable(newAvailableItems);
    }
  };

  // - Delete
  const onDeleteRole = () => {
    const updatedRoles = rolesFromUser.filter(
      (role) => !rolesSelected.includes(role.cn)
    );
    if (props.user.uid) {
      removeMembersFromRoles([props.user.uid, "user", rolesSelected]).then(
        (response) => {
          if ("data" in response) {
            if (response.data.result) {
              // Set alert: success
              alerts.addAlert(
                "remove-roles-success",
                "Removed roles from user '" + props.user.uid + "'",
                "success"
              );
              // Update data
              setRolesFromUser(updatedRoles);
              setRolesSelected([]);
              // Add the just-removed items from 'rolesAvailable'
              const deletedRoles = rolesFullList.filter((role) =>
                rolesSelected.includes(role.cn)
              );
              const newAvailableItems = rolesAvailable.concat(
                parseAvailableItems(deletedRoles)
              );
              setRolesAvailable(newAvailableItems);
              // Close modal
              setShowDeleteModal(false);
              // Refresh
              props.onRefreshUserData();
            } else if (response.data.error) {
              // Set alert: error
              const errorMessage = response.data
                .error as unknown as ErrorResult;
              alerts.addAlert(
                "remove-roles-error",
                errorMessage.message,
                "danger"
              );
            }
          }
        }
      );
    }
  };

  const onSearch = () => {
    if (membershipDirection === "direct") {
      const searchResult = rolesFromUser.filter((role) => {
        return role.cn.toLowerCase().includes(searchValue.toLowerCase());
      });
      setShownRoles(paginate(searchResult, page, perPage));
      setPaginationData(searchResult.map((role) => role.cn));
    } else {
      const searchResult = indirectRoles.filter((role) => {
        return role.cn.toLowerCase().includes(searchValue.toLowerCase());
      });
      setShownRoles(paginate(searchResult, page, perPage));
      setPaginationData(searchResult.map((role) => role.cn));
    }
  };

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        onSearch={onSearch}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshUserData}
        deleteButtonEnabled={someItemSelected && deleteAndAddButtonsEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={paginationData.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfTableRoles
        roles={shownRoles}
        checkedItems={rolesSelected}
        onCheckItemsChange={setRolesSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={paginationData.length}
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
          availableItems={rolesAvailable}
          onAdd={onAddRole}
          onSearchTextChange={setSearchValue}
          title={"Add '" + props.user.uid + "' into Roles"}
          ariaLabel="Add user of role modal"
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title="Delete user from Roles"
          onDelete={onDeleteRole}
        >
          <MemberOfTableRoles
            roles={rolesFromUser.filter((group) =>
              rolesSelected.includes(group.cn)
            )}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MemberOfRoles;
