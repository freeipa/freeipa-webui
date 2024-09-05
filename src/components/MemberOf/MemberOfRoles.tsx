import React, { useEffect } from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, Role, Host, Service } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberTable from "src/components/tables/MembershipTable";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useAddToRolesMutation,
  useGetRolesInfoByNameQuery,
  useGettingRolesQuery,
  useRemoveFromRolesMutation,
} from "src/services/rpcRoles";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToRole } from "src/utils/rolesUtils";

interface MemberOfRolesProps {
  entity: Partial<User> | Partial<Host> | Partial<Service>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  membershipDisabled?: boolean;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
}
const MemberOfRoles = (props: MemberOfRolesProps) => {
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
  const [rolesSelected, setRolesSelected] = React.useState<string[]>([]);
  const [indirectRolesSelected, setIndirectRolesSelected] = React.useState<
    string[]
  >([]);

  // Loaded roles based on paging and member attributes
  const [roles, setRoles] = React.useState<Role[]>([]);

  // Choose the correct roles based on the membership direction
  const memberof_role = props.entity.memberof_role || [];
  const memberofindirect_role =
    ("memberofindirect_role" in props.entity &&
      props.entity.memberofindirect_role) ||
    [];
  let roleNames =
    membershipDirection === "direct" ? memberof_role : memberofindirect_role;
  roleNames = [...roleNames];

  const columnNames = ["Role name", "Description"];
  const properties = ["cn", "description"];

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

  // Refresh roles
  useEffect(() => {
    const rolesNames = getRolesNameToLoad();
    setRoleNamesToLoad(rolesNames);
    props.setDirection(membershipDirection);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entity]);

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

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "active-users") {
      return "user";
    } else if (props.from === "hosts") {
      return "host";
    } else if (props.from === "services") {
      return "service";
    } else if (props.from === "user-groups") {
      return "group";
    } else {
      // Return 'user' as default
      return "user";
    }
  };

  // Computed "states"
  const showTableRows = roles.length > 0;
  const entityType = getEntityType();

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullRolesQuery.isFetching && !props.isDataLoading;
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
  }, [showAddModal, adderSearchValue, props.entity]);

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
      items = items.filter((item) => !memberof_role.includes(item.key));

      setAvailableRoles(avalRoles);
      setAvailableItems(items);
    }
  }, [rolesQuery.data, rolesQuery.isFetching]);

  const onAddRole = (items: AvailableItems[]) => {
    const newRoleNames = items.map((item) => item.key);
    if (props.id === undefined || newRoleNames.length == 0) {
      return;
    }

    setSpinning(true);
    addMemberToRoles([props.id, entityType, newRoleNames]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            `Assigned '${props.id}' to roles`,
            "success"
          );
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
      setSpinning(false);
    });
  };

  // - Delete
  const onDeleteRole = () => {
    setSpinning(true);
    removeMembersFromRoles([props.id, entityType, rolesSelected]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-roles-success",
              `Removed '${props.id}' from roles`,
              "success"
            );
            // Refresh
            props.onRefreshData();
            // Reset delete button
            setRolesSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Back to page 1
            setPage(1);
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-roles-error",
              errorMessage.message,
              "danger"
            );
          }
        }
        setSpinning(false);
      }
    );
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
          deleteButtonEnabled={
            membershipDirection === "direct"
              ? rolesSelected.length > 0
              : indirectRolesSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          helpIconEnabled={true}
          totalItems={roleNames.length}
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
          deleteButtonEnabled={
            membershipDirection === "direct"
              ? rolesSelected.length > 0
              : indirectRolesSelected.length > 0
          }
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
      )}
      <MemberTable
        entityList={roles}
        idKey="cn"
        from="roles"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={
          membershipDirection === "direct"
            ? rolesSelected
            : indirectRolesSelected
        }
        onCheckItemsChange={
          membershipDirection === "direct"
            ? setRolesSelected
            : setIndirectRolesSelected
        }
        showTableRows={showTableRows}
      />
      {roleNames.length > 0 && (
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
      )}
      <MemberOfAddModal
        showModal={showAddModal}
        onCloseModal={() => setShowAddModal(false)}
        availableItems={availableItems}
        onAdd={onAddRole}
        onSearchTextChange={setAdderSearchValue}
        title={`Add '${props.id}' into roles`}
        ariaLabel={"Add " + entityType + " of role modal"}
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove '${props.id}' from roles`}
        onDelete={onDeleteRole}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableRoles.filter((role) =>
            membershipDirection === "direct"
              ? rolesSelected.includes(role.cn)
              : indirectRolesSelected.includes(role.cn)
          )}
          from="roles"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default MemberOfRoles;
