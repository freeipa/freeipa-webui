import React, { useEffect } from "react";
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

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Other states
  const [rolesSelected, setRolesSelected] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState("");

  // Loaded roles based on paging and member attributes
  const [roles, setRoles] = React.useState<Role[]>([]);

  // Membership direction and roles
  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  // Choose the correct roles based on the membership direction
  const memberof_role = props.user.memberof_role || [];
  const memberofindirect_role = props.user.memberofindirect_role || [];
  let roleNames =
    membershipDirection === "direct" ? memberof_role : memberofindirect_role;
  roleNames = [...roleNames];

  const getRolesNameToLoad = (): string[] => {
    let toLoad = [...roleNames];
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

  const [roleNamesToLoad, setRoleNamesToLoad] = React.useState<string[]>(
    getRolesNameToLoad()
  );

  // Load roles
  const fullRolesQuery = useGetRolesInfoByNameQuery({
    roleNamesList: roleNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Reset page on direction change
  useEffect(() => {
    setPage(1);
  }, [membershipDirection]);

  // Refresh roles
  useEffect(() => {
    const rolesNames = getRolesNameToLoad();
    setRoleNamesToLoad(rolesNames);
  }, [props.user, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (roleNamesToLoad.length > 0) {
      fullRolesQuery.refetch();
    }
  }, [roleNamesToLoad]);

  // Update roles
  React.useEffect(() => {
    if (fullRolesQuery.data && !fullRolesQuery.isFetching) {
      setRoles(fullRolesQuery.data);
    }
  }, [fullRolesQuery.data, fullRolesQuery.isFetching]);

  // Computed "states"
  const someItemSelected = rolesSelected.length > 0;
  const showTableRows = roles.length > 0;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullRolesQuery.isFetching && !props.isUserDataLoading;
  const isDeleteEnabled =
    someItemSelected && membershipDirection !== "indirect";
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'Role'
  // API calls
  const [addMemberToRoles] = useAddToRolesMutation();
  const [removeMembersFromRoles] = useRemoveFromRolesMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableRoles, setAvailableRoles] = React.useState<Role[]>([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available roles, delay the search for opening the modal
  const rolesQuery = useGettingRolesQuery(
    {
      search: adderSearchValue,
      apiVersion: API_VERSION_BACKUP,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 100,
    },
    { skip: !showAddModal }
  );

  // Trigger available roles search
  React.useEffect(() => {
    if (showAddModal) {
      rolesQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.user]);

  // Update available roles
  React.useEffect(() => {
    if (rolesQuery.data && !rolesQuery.isFetching) {
      // transform data to roles
      const count = rolesQuery.data.result.count;
      const results = rolesQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalRoles: Role[] = [];
      for (let i = 0; i < count; i++) {
        const role = apiToRole(results[i].result);
        avalRoles.push(role);
        items.push({
          key: role.cn,
          title: role.cn,
        });
      }
      items = items.filter((item) => !roleNamesToLoad.includes(item.key));

      setAvailableRoles(avalRoles);
      setAvailableItems(items);
    }
  }, [rolesQuery.data, rolesQuery.isFetching]);

  const onAddRole = (items: AvailableItems[]) => {
    const uid = props.user.uid;
    const newRoleNames = items.map((item) => item.key);
    if (uid === undefined || newRoleNames.length == 0) {
      return;
    }

    addMemberToRoles([uid, "user", newRoleNames]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            `Assigned new roles to user ${uid}`,
            "success"
          );
          // Update displayed roles before they are updated via refresh
          const newRoles = roles.concat(
            availableRoles.filter((role) => newRoleNames.includes(role.cn))
          );
          setRoles(newRoles);

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
  const onDeleteRole = () => {
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
              // Update displayed roles
              const newRoles = roles.filter(
                (role) => !rolesSelected.includes(role.cn)
              );
              setRoles(newRoles);
              // Update data
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
        deleteButtonEnabled={isDeleteEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={roleNames.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfTableRoles
        roles={roles}
        checkedItems={rolesSelected}
        onCheckItemsChange={setRolesSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={roleNames.length}
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
          onAdd={onAddRole}
          onSearchTextChange={setAdderSearchValue}
          title={`Assign roles to user ${props.user.uid}`}
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
            roles={roles.filter((group) => rolesSelected.includes(group.cn))}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MemberOfRoles;
