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

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const firstRoleIdx = (page - 1) * perPage;
  const lastRoleIdx = page * perPage;

  // API call
  // - Full info of available Roles
  const rolesQuery = useGettingRolesQuery({
    apiVersion: API_VERSION_BACKUP,
    startIdx: firstRoleIdx,
    stopIdx: lastRoleIdx,
  });

  const [rolesFullList, setRolesFullList] = React.useState<Role[]>([]);

  const rolesData = rolesQuery.data || {};

  React.useEffect(() => {
    if (rolesData && !rolesQuery.isFetching) {
      const dataParsed = rolesData as BatchRPCResponse;
      const count = dataParsed.result.count;
      const results = dataParsed.result.results;

      const rolesTempList: Role[] = [];

      for (let i = 0; i < count; i++) {
        const role = apiToRole(results[i].result);
        rolesTempList.push(role);
      }
      setRolesFullList(rolesTempList);
    }
  }, [rolesData, rolesQuery.isFetching]);

  // Get full data of the 'Roles' assigned to user
  React.useEffect(() => {
    const rolesParsed: Role[] = [];
    props.user.memberof_role?.map((role) => {
      rolesFullList.map((rl) => {
        if (rl.cn === role) {
          rolesParsed.push(rl);
        }
      });
    });
    if (JSON.stringify(rolesFromUser) !== JSON.stringify(rolesParsed)) {
      setRolesFromUser(rolesParsed);
    }

    // Roles not from user
    const rolesNotFromUserParsed: Role[] = rolesFullList.filter(
      (role) => !props.user.memberof_role?.includes(role.cn)
    );
    if (JSON.stringify(rolesFromUser) !== JSON.stringify(rolesParsed)) {
      setRolesFromUser(rolesParsed);
    }
    if (
      JSON.stringify(rolesNotFromUser) !==
      JSON.stringify(rolesNotFromUserParsed)
    ) {
      setRolesNotFromUser(rolesNotFromUserParsed);
      setRolesAvailable(parseAvailableItems(rolesNotFromUserParsed));
    }
  }, [rolesFullList]);

  // Refetch User groups when user data changes
  React.useEffect(() => {
    rolesQuery.refetch();
  }, [props.user, rolesFromUser]);

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

  // Update 'shownRoles' when 'RolesFromUser' changes
  React.useEffect(() => {
    setShownRoles(paginate(rolesFromUser, page, perPage));
  }, [rolesFromUser]);

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

  // Buttons functionality
  const deleteAndAddButtonsEnabled = membershipDirection !== "indirect";

  // - Refresh
  const isRefreshButtonEnabled =
    !rolesQuery.isFetching && !props.isUserDataLoading;

  // - Add
  const isAddButtonEnabled = !rolesQuery.isFetching && !props.isUserDataLoading;

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
        deleteButtonEnabled={someItemSelected && deleteAndAddButtonsEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={rolesFromUser.length}
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
        itemCount={rolesFromUser.length}
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
