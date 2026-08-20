import React, { useMemo } from "react";
// PatternFly
import { PaginationVariant } from "@patternfly/react-core";
// Data types
import { Privilege } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "src/components/MemberOf/MemberOfToolbar";
import MemberTable from "src/components/tables/MembershipTable";
import MemberOfAddModal, {
  AvailableItems,
} from "src/components/MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModal";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
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
  useGetPrivilegeByIdQuery,
  useGetPermissionsQuery,
  useAddPermissionToPrivilegeMutation,
  useRemovePermissionFromPrivilegeMutation,
} from "src/services/rpcPrivileges";
// Utils
import { paginate } from "src/utils/utils";
import { getSelectedPerPageData } from "src/utils/selectedPerPage";

interface PropsToPrivilegesPermissions {
  privilege: Privilege;
  onOpenContextualPanel?: () => void;
}

interface PermissionItem {
  cn: string;
}

interface PermissionsAddModalProps {
  showModal: boolean;
  onClose: () => void;
  privilegeCn: string;
  permissionNames: string[];
  onSuccess: () => void;
}

const PermissionsAddModal = (props: PermissionsAddModalProps) => {
  const dispatch = useAppDispatch();
  const [spinning, setSpinning] = React.useState(false);
  const [addPermissionToPrivilege] = useAddPermissionToPrivilegeMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  const permissionsQuery = useGetPermissionsQuery(adderSearchValue, {
    skip: !props.showModal,
  });

  React.useEffect(() => {
    if (permissionsQuery.data && !permissionsQuery.isFetching) {
      const results = (permissionsQuery.data.result?.result ||
        []) as unknown as Array<{ cn: string[] }>;
      let items: AvailableItems[] = results.map((perm) => ({
        key: perm.cn[0],
        title: perm.cn[0],
      }));
      items = items.filter((item) => !props.permissionNames.includes(item.key));
      setAvailableItems(items);
    }
  }, [
    permissionsQuery.data,
    permissionsQuery.isFetching,
    props.permissionNames,
  ]);

  const onAddPermission = (items: AvailableItems[]) => {
    const newPermissionNames = items.map((item) => item.key);
    if (!props.privilegeCn || newPermissionNames.length === 0) {
      return;
    }

    setSpinning(true);
    addPermissionToPrivilege({
      privilegeCn: props.privilegeCn,
      permissions: newPermissionNames,
    })
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "add-permission-success",
                title: `Added permissions to privilege '${props.privilegeCn}'`,
                variant: "success",
              })
            );
            props.onSuccess();
            props.onClose();
          } else if (response.data?.error) {
            const errorMessage = response.data.error as unknown as ErrorResult;
            dispatch(
              addAlert({
                name: "add-permission-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
          }
        }
      })
      .finally(() => {
        setSpinning(false);
      });
  };

  return (
    <MemberOfAddModal
      showModal={props.showModal}
      onCloseModal={props.onClose}
      availableItems={availableItems}
      onAdd={onAddPermission}
      title={`Add permissions to privilege '${props.privilegeCn}'`}
      ariaLabel="Add permissions to privilege modal"
      searchProps={{ onSearchTextChange: setAdderSearchValue }}
      spinning={spinning}
    />
  );
};

const PrivilegesPermissions = (props: PropsToPrivilegesPermissions) => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "privileges", noBreadcrumb: true });

  // Query used for refresh operations
  const privilegeQuery = useGetPrivilegeByIdQuery(props.privilege.cn);

  // Get parameters from URL
  const { page, setPage, perPage, searchValue } = useListPageSearchParams();

  // Selection state (entity-based for BulkSelectorPrep compatibility)
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    PermissionItem[]
  >([]);

  // Get permission names from privilege (prefer fresh query data, fallback to props)
  const permissionNames = useMemo(
    () =>
      privilegeQuery.data?.memberof_permission ||
      props.privilege.memberof_permission ||
      [],
    [
      privilegeQuery.data?.memberof_permission,
      props.privilege.memberof_permission,
    ]
  );

  // Column configuration
  const columnNames = ["Permission name"];
  const properties: string[] = [];

  const permissions = useMemo((): PermissionItem[] => {
    let toLoad = [...permissionNames];
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
  }, [permissionNames, searchValue, page, perPage]);

  // Derive string[] for MemberTable compatibility
  const permissionsSelectedNames = useMemo(
    () => selectedPermissions.map((p) => p.cn),
    [selectedPermissions]
  );

  // Delete button disabled state (managed by BulkSelectorPrep and selection helpers)
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState(true);

  // Update selected permissions (used by BulkSelectorPrep and MemberTable)
  const updateSelectedPermissions = (
    items: PermissionItem[],
    isSelected: boolean
  ) => {
    let newSelected: PermissionItem[];
    if (isSelected) {
      const currentNames = new Set(permissionsSelectedNames);
      const toAdd = items.filter((item) => !currentNames.has(item.cn));
      newSelected = [...selectedPermissions, ...toAdd];
    } else {
      const removeNames = new Set(items.map((item) => item.cn));
      newSelected = selectedPermissions.filter((p) => !removeNames.has(p.cn));
    }
    setSelectedPermissions(newSelected);
    setIsDeleteButtonDisabled(newSelected.length === 0);
  };

  // Adapter for MemberTable's string-based onCheckItemsChange
  const onCheckItemsChange = (checkedNames: string[]) => {
    setSelectedPermissions(checkedNames.map((name) => ({ cn: name })));
    setIsDeleteButtonDisabled(checkedNames.length === 0);
  };

  // Show table rows when we have data (even during background refetches)
  const showTableRows = !privilegeQuery.isFetching;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled = !privilegeQuery.isFetching;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // BulkSelectorPrep data
  const selectablePermissionsTable = permissions;

  const selectedPerPageData = getSelectedPerPageData(
    permissions,
    permissionsSelectedNames,
    (perm) => perm.cn
  );

  const bulkSelectorData = {
    selected: selectedPermissions,
    updateSelected: updateSelectedPermissions,
    selectableTable: selectablePermissionsTable,
    nameAttr: "cn",
  };

  // API calls
  const [removePermissionFromPrivilege] =
    useRemovePermissionFromPrivilegeMutation();

  // Refresh data
  const onRefreshData = () => {
    setSelectedPermissions([]);
    setIsDeleteButtonDisabled(true);
    privilegeQuery.refetch();
  };

  // Remove permissions from privilege
  const onDeletePermission = () => {
    if (
      props.privilege.cn === undefined ||
      permissionsSelectedNames.length === 0
    ) {
      return;
    }

    setSpinning(true);
    removePermissionFromPrivilege({
      privilegeCn: props.privilege.cn,
      permissions: permissionsSelectedNames,
    })
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "remove-permission-success",
                title: `Removed permissions from privilege '${props.privilege.cn}'`,
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
                name: "remove-permission-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
          }
        }
      })
      .finally(() => {
        setSpinning(false);
      });
  };

  // Get filtered permission names count for pagination
  const getFilteredCount = (): number => {
    if (!searchValue) {
      return permissionNames.length;
    }
    return permissionNames.filter((name) =>
      name.toLowerCase().includes(searchValue.toLowerCase())
    ).length;
  };

  return (
    <TabLayout id="permissions">
      <MemberOfToolbar
        bulkSelector={
          <BulkSelectorPrep
            list={permissions}
            shownElementsList={permissions}
            elementData={bulkSelectorData}
            buttonsData={{
              updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
            }}
            selectedPerPageData={selectedPerPageData}
          />
        }
        searchPlaceholder="Search permissions"
        searchAriaLabel="Search permissions"
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={onRefreshData}
        deleteButtonEnabled={!isDeleteButtonDisabled && isRefreshButtonEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled
        onHelpIconClick={props.onOpenContextualPanel}
        totalItems={getFilteredCount()}
      />
      <MemberTable
        entityList={permissions}
        idKey="cn"
        from="permissions"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={permissionsSelectedNames}
        onCheckItemsChange={onCheckItemsChange}
        showTableRows={showTableRows}
      />
      {getFilteredCount() > 0 && (
        <PaginationLayout
          list={[]}
          totalCount={getFilteredCount()}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v6-u-pb-0 pf-v6-u-pr-md"
        />
      )}
      {showAddModal && (
        <PermissionsAddModal
          showModal={showAddModal}
          onClose={() => setShowAddModal(false)}
          privilegeCn={props.privilege.cn}
          permissionNames={permissionNames}
          onSuccess={onRefreshData}
        />
      )}
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove permissions from privilege '${props.privilege.cn}'`}
        onDelete={onDeletePermission}
        spinning={spinning}
      >
        <MemberTable
          entityList={permissions.filter((perm) =>
            permissionsSelectedNames.includes(perm.cn)
          )}
          from="permissions"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </TabLayout>
  );
};

export default PrivilegesPermissions;
