import React, { useEffect, useMemo } from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { Role } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "src/components/MemberOf/MemberOfToolbar";
import MemberTable from "src/components/tables/MembershipTable";
import MemberOfAddModal, {
  AvailableItems,
} from "src/components/MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModal";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useGetRoleByIdQuery,
  useGetPrivilegesQuery,
  useAddPrivilegeToRoleMutation,
  useRemovePrivilegeFromRoleMutation,
} from "src/services/rpcRoles";
// Utils
import { paginate } from "src/utils/utils";

interface PropsToRolesPrivileges {
  role: Role;
}

interface PrivilegeItem {
  cn: string;
}

const RolesPrivileges = (props: PropsToRolesPrivileges) => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "roles", noBreadcrumb: true });

  // Get role data with privileges
  const roleQuery = useGetRoleByIdQuery(props.role.cn);
  const roleData = roleQuery.data || {};

  const role = useMemo<Partial<Role>>(() => {
    if (!roleQuery.isFetching && roleData) {
      return { ...roleData };
    }
    return {};
  }, [roleData, roleQuery.isFetching]);

  // Get parameters from URL
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Other states
  const [privilegesSelected, setPrivilegesSelected] = React.useState<string[]>(
    []
  );

  // Get privilege names from role
  const privilegeNames = useMemo(
    () => role.memberof_privilege || [],
    [role.memberof_privilege]
  );

  // Column configuration
  const columnNames = ["Privilege name"];
  const properties: string[] = [];

  const privileges = useMemo((): PrivilegeItem[] => {
    let toLoad = [...privilegeNames];
    toLoad.sort();

    // Filter by search
    if (searchValue) {
      toLoad = toLoad.filter((name) =>
        name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply paging
    toLoad = paginate(toLoad, page, perPage);

    return toLoad.map((name) => ({ cn: name }));
  }, [privilegeNames, searchValue, page, perPage]);

  // Computed "states"
  const showTableRows = !roleQuery.isFetching;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled = !roleQuery.isFetching;
  const isDeleteButtonEnabled =
    privilegesSelected.length > 0 && isRefreshButtonEnabled;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // API calls
  const [addPrivilegeToRole] = useAddPrivilegeToRoleMutation();
  const [removePrivilegeFromRole] = useRemovePrivilegeFromRoleMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available privileges (only when modal is open)
  const privilegesQuery = useGetPrivilegesQuery(adderSearchValue, {
    skip: !showAddModal,
  });

  // Trigger available privileges search
  useEffect(() => {
    if (showAddModal) {
      privilegesQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, role]);

  // Update available privileges
  useEffect(() => {
    if (privilegesQuery.data && !privilegesQuery.isFetching) {
      const results = (privilegesQuery.data.result?.result ||
        []) as unknown as Array<{
        cn: string[] | string;
      }>;
      let items: AvailableItems[] = results.map((priv) => ({
        key: Array.isArray(priv.cn) ? priv.cn[0] : priv.cn,
        title: Array.isArray(priv.cn) ? priv.cn[0] : priv.cn,
      }));

      // Filter out already assigned privileges
      items = items.filter((item) => !privilegeNames.includes(item.key));

      setAvailableItems(items);
    }
  }, [privilegesQuery.data, privilegesQuery.isFetching, privilegeNames]);

  // Refresh data
  const onRefreshData = () => {
    setPrivilegesSelected([]);
    roleQuery.refetch();
  };

  // Add privileges to role
  const onAddPrivilege = (items: AvailableItems[]) => {
    const newPrivilegeNames = items.map((item) => item.key);
    if (props.role.cn === undefined || newPrivilegeNames.length === 0) {
      return;
    }

    setSpinning(true);
    addPrivilegeToRole({
      roleCn: props.role.cn,
      privileges: newPrivilegeNames,
    }).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          dispatch(
            addAlert({
              name: "add-privilege-success",
              title: `Added privileges to role '${props.role.cn}'`,
              variant: "success",
            })
          );
          onRefreshData();
          setShowAddModal(false);
        } else if (response.data?.error) {
          const errorMessage = response.data.error as unknown as ErrorResult;
          dispatch(
            addAlert({
              name: "add-privilege-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
      }
      setSpinning(false);
    });
  };

  // Remove privileges from role
  const onDeletePrivilege = () => {
    if (props.role.cn === undefined || privilegesSelected.length === 0) {
      return;
    }

    setSpinning(true);
    removePrivilegeFromRole({
      roleCn: props.role.cn,
      privileges: privilegesSelected,
    }).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          dispatch(
            addAlert({
              name: "remove-privilege-success",
              title: `Removed privileges from role '${props.role.cn}'`,
              variant: "success",
            })
          );
          onRefreshData();
          setShowDeleteModal(false);
          setPage(1);
        } else if (response.data?.error) {
          const errorMessage = response.data.error as unknown as ErrorResult;
          dispatch(
            addAlert({
              name: "remove-privilege-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
      }
      setSpinning(false);
    });
  };

  // Get filtered privilege names count for pagination
  const getFilteredCount = (): number => {
    if (!searchValue) {
      return privilegeNames.length;
    }
    return privilegeNames.filter((name) =>
      name.toLowerCase().includes(searchValue.toLowerCase())
    ).length;
  };

  return (
    <TabLayout id="privileges">
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        onSearch={() => {}}
        searchPlaceholder="Search privileges"
        searchAriaLabel="Search privileges"
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={onRefreshData}
        deleteButtonEnabled={isDeleteButtonEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        totalItems={getFilteredCount()}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={privileges}
        idKey="cn"
        from="privileges"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={privilegesSelected}
        onCheckItemsChange={setPrivilegesSelected}
        showTableRows={showTableRows}
      />
      {getFilteredCount() > 0 && (
        <Pagination
          className="pf-v6-u-pb-0 pf-v6-u-pr-md"
          itemCount={getFilteredCount()}
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
        onAdd={onAddPrivilege}
        onSearchTextChange={setAdderSearchValue}
        title={`Add privileges to role '${props.role.cn}'`}
        ariaLabel="Add privileges to role modal"
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove privileges from role '${props.role.cn}'`}
        onDelete={onDeletePrivilege}
        spinning={spinning}
      >
        <MemberTable
          entityList={privileges.filter((priv) =>
            privilegesSelected.includes(priv.cn)
          )}
          from="privileges"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </TabLayout>
  );
};

export default RolesPrivileges;
