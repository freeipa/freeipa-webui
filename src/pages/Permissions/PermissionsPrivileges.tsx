import React, { useMemo } from "react";
// PatternFly
import { PaginationVariant } from "@patternfly/react-core";
// Data types
import { Permission } from "src/utils/datatypes/globalDataTypes";
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
  useGetPermissionByIdQuery,
  useAddPrivilegeToPermissionMutation,
  useRemovePrivilegeFromPermissionMutation,
} from "src/services/rpcPermissions";
import { useGetAvailablePrivilegesQuery } from "src/services/rpcPrivileges";
// Utils
import { paginate } from "src/utils/utils";
import { getSelectedPerPageData } from "src/utils/selectedPerPage";

interface PropsToPermissionsPrivileges {
  permission: Permission;
  onOpenContextualPanel?: () => void;
}

interface PrivilegeItem {
  cn: string;
}

interface PrivilegesAddModalProps {
  showModal: boolean;
  onClose: () => void;
  permissionCn: string;
  privilegeNames: string[];
  onSuccess: () => void;
}

const PrivilegesAddModal = (props: PrivilegesAddModalProps) => {
  const dispatch = useAppDispatch();
  const [spinning, setSpinning] = React.useState(false);
  const [addPrivilegeToPermission] = useAddPrivilegeToPermissionMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  const privilegesQuery = useGetAvailablePrivilegesQuery(adderSearchValue, {
    skip: !props.showModal,
  });

  React.useEffect(() => {
    if (privilegesQuery.data && !privilegesQuery.isFetching) {
      const results = (privilegesQuery.data.result?.result ||
        []) as unknown as Array<{ cn: string[] | string }>;
      let items: AvailableItems[] = results.map((priv) => ({
        key: Array.isArray(priv.cn) ? priv.cn[0] : priv.cn,
        title: Array.isArray(priv.cn) ? priv.cn[0] : priv.cn,
      }));
      items = items.filter((item) => !props.privilegeNames.includes(item.key));
      setAvailableItems(items);
    }
  }, [privilegesQuery.data, privilegesQuery.isFetching, props.privilegeNames]);

  const onAddPrivilege = (items: AvailableItems[]) => {
    const newPrivilegeNames = items.map((item) => item.key);
    if (!props.permissionCn || newPrivilegeNames.length === 0) {
      return;
    }

    setSpinning(true);
    addPrivilegeToPermission({
      permissionCn: props.permissionCn,
      privileges: newPrivilegeNames,
    })
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "add-privilege-success",
                title: `Added privileges to permission '${props.permissionCn}'`,
                variant: "success",
              })
            );
            props.onSuccess();
            props.onClose();
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
      onAdd={onAddPrivilege}
      title={`Add privileges to permission '${props.permissionCn}'`}
      ariaLabel="Add privileges to permission modal"
      searchProps={{ onSearchTextChange: setAdderSearchValue }}
      spinning={spinning}
    />
  );
};

const PermissionsPrivileges = (props: PropsToPermissionsPrivileges) => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "permissions", noBreadcrumb: true });

  // Query used for refresh operations
  const permissionQuery = useGetPermissionByIdQuery(props.permission.cn);

  // Get parameters from URL
  const { page, setPage, perPage, searchValue } = useListPageSearchParams();

  // Selection state (entity-based for BulkSelectorPrep compatibility)
  const [selectedPrivileges, setSelectedPrivileges] = React.useState<
    PrivilegeItem[]
  >([]);

  // Get privilege names from permission (prefer fresh query data, fallback to props)
  const privilegeNames = useMemo(
    () =>
      permissionQuery.data?.[0]?.member_privilege ||
      props.permission.member_privilege ||
      [],
    [
      permissionQuery.data?.[0]?.member_privilege,
      props.permission.member_privilege,
    ]
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

  // Derive string[] for MemberTable compatibility
  const privilegesSelectedNames = useMemo(
    () => selectedPrivileges.map((p) => p.cn),
    [selectedPrivileges]
  );

  // Delete button disabled state (managed by BulkSelectorPrep and selection helpers)
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState(true);

  // Update selected privileges (used by BulkSelectorPrep and MemberTable)
  const updateSelectedPrivileges = (
    items: PrivilegeItem[],
    isSelected: boolean
  ) => {
    let newSelected: PrivilegeItem[];
    if (isSelected) {
      const currentNames = new Set(privilegesSelectedNames);
      const toAdd = items.filter((item) => !currentNames.has(item.cn));
      newSelected = [...selectedPrivileges, ...toAdd];
    } else {
      const removeNames = new Set(items.map((item) => item.cn));
      newSelected = selectedPrivileges.filter((p) => !removeNames.has(p.cn));
    }
    setSelectedPrivileges(newSelected);
    setIsDeleteButtonDisabled(newSelected.length === 0);
  };

  // Adapter for MemberTable's string-based onCheckItemsChange
  const onCheckItemsChange = (checkedNames: string[]) => {
    setSelectedPrivileges(checkedNames.map((name) => ({ cn: name })));
    setIsDeleteButtonDisabled(checkedNames.length === 0);
  };

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled = !permissionQuery.isFetching;

  const selectedPerPageData = getSelectedPerPageData(
    privileges,
    privilegesSelectedNames,
    (priv) => priv.cn
  );

  const bulkSelectorData = {
    selected: selectedPrivileges,
    updateSelected: updateSelectedPrivileges,
    selectableTable: privileges,
    nameAttr: "cn",
  };

  // API calls
  const [removePrivilegeFromPermission] =
    useRemovePrivilegeFromPermissionMutation();

  // Refresh data
  const onRefreshData = () => {
    setSelectedPrivileges([]);
    setIsDeleteButtonDisabled(true);
    permissionQuery.refetch();
  };

  // Remove privileges from permission
  const onDeletePrivilege = () => {
    if (
      props.permission.cn === undefined ||
      privilegesSelectedNames.length === 0
    ) {
      return;
    }

    setSpinning(true);
    removePrivilegeFromPermission({
      permissionCn: props.permission.cn,
      privileges: privilegesSelectedNames,
    })
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "remove-privilege-success",
                title: `Removed privileges from permission '${props.permission.cn}'`,
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
      })
      .finally(() => {
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
        bulkSelector={
          <BulkSelectorPrep
            list={privileges}
            shownElementsList={privileges}
            elementData={bulkSelectorData}
            buttonsData={{
              updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
            }}
            selectedPerPageData={selectedPerPageData}
          />
        }
        searchPlaceholder="Search privileges"
        searchAriaLabel="Search privileges"
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={onRefreshData}
        deleteButtonEnabled={!isDeleteButtonDisabled && isRefreshButtonEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isRefreshButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled
        onHelpIconClick={props.onOpenContextualPanel}
        totalItems={getFilteredCount()}
      />
      <MemberTable
        entityList={privileges}
        idKey="cn"
        from="privileges"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={privilegesSelectedNames}
        onCheckItemsChange={onCheckItemsChange}
        showTableRows={!permissionQuery.isFetching}
        showLink
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
        <PrivilegesAddModal
          showModal={showAddModal}
          onClose={() => setShowAddModal(false)}
          permissionCn={props.permission.cn}
          privilegeNames={privilegeNames}
          onSuccess={onRefreshData}
        />
      )}
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove privileges from permission '${props.permission.cn}'`}
        onDelete={onDeletePrivilege}
        spinning={spinning}
      >
        <MemberTable
          entityList={selectedPrivileges}
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

export default PermissionsPrivileges;
