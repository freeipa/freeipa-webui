import React, { useMemo } from "react";
// PatternFly
import { PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "src/components/MemberOf/MemberOfToolbar";
import MemberOfAddModal, {
  AvailableItems,
} from "src/components/MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
import TabLayout from "src/components/layouts/TabLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import PaginationLayout from "src/components/layouts/PaginationLayout";
// Data types
import { Privilege } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToRole } from "src/utils/rolesUtils";
import { getSelectedPerPageData } from "src/utils/selectedPerPage";
// RPC
import { ErrorResult, FindRPCResponse } from "src/services/rpc";
import {
  PrivilegeMemberPayload,
  useAddAsMemberPrivilegeMutation,
  useGetPrivilegeByIdQuery,
  useRemoveAsMemberPrivilegeMutation,
} from "src/services/rpcPrivileges";
import { useGettingRolesQuery } from "src/services/rpcRoles";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToMembersRoles {
  privilege: Partial<Privilege>;
}

interface RoleItem {
  cn: string;
}

type PrivilegeMemberMutationResponse =
  | { data?: FindRPCResponse }
  | { error: FetchBaseQueryError | SerializedError };

const MembersRoles = (props: PropsToMembersRoles) => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "privileges", noBreadcrumb: true });

  const privilegeQuery = useGetPrivilegeByIdQuery(props.privilege.cn || "", {
    skip: !props.privilege.cn,
  });

  const privilege: Partial<Privilege> = privilegeQuery.data ?? props.privilege;
  const member_role = privilege.member_role ?? [];

  const { page, setPage, perPage, searchValue } = useListPageSearchParams();

  const [rolesSelected, setRolesSelected] = React.useState<string[]>([]);

  const columnNames = ["Role name"];
  const properties: string[] = [];

  const filteredRoles = useMemo((): RoleItem[] => {
    let toLoad = [...member_role];
    toLoad.sort();

    if (searchValue) {
      toLoad = toLoad.filter((name) =>
        name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return toLoad.map((name) => ({ cn: name }));
  }, [member_role, searchValue]);

  const roles = useMemo(
    () => paginate(filteredRoles, page, perPage),
    [filteredRoles, page, perPage]
  );

  const updateSelectedRoles = (items: RoleItem[], isSelected: boolean) => {
    const names = items.map((item) => item.cn);
    if (isSelected) {
      setRolesSelected((prev) => {
        const next = [...prev];
        for (const name of names) {
          if (!next.includes(name)) {
            next.push(name);
          }
        }
        return next;
      });
    } else {
      setRolesSelected((prev) => prev.filter((name) => !names.includes(name)));
    }
  };

  const selectedRoleItems = useMemo(
    () => rolesSelected.map((cn) => ({ cn })),
    [rolesSelected]
  );

  const selectedPerPageData = getSelectedPerPageData(
    roles,
    rolesSelected,
    (item) => item.cn
  );

  const bulkSelectorData = {
    selected: selectedRoleItems,
    updateSelected: updateSelectedRoles,
    selectableTable: roles,
    nameAttr: "cn",
  };

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  const isRefreshButtonEnabled = !privilegeQuery.isFetching;
  const isDeleteButtonEnabled =
    rolesSelected.length > 0 && isRefreshButtonEnabled;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  const [addMembers] = useAddAsMemberPrivilegeMutation();
  const [removeMembers] = useRemoveAsMemberPrivilegeMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  const rolesQuery = useGettingRolesQuery(
    {
      searchValue: adderSearchValue,
      apiVersion: API_VERSION_BACKUP,
      sizeLimit: 100,
      startIdx: 0,
      stopIdx: 100,
    },
    { skip: !showAddModal }
  );

  React.useEffect(() => {
    if (rolesQuery.data && !rolesQuery.isFetching) {
      const results = rolesQuery.data.result.results as unknown as Array<{
        result: Record<string, unknown>;
      }>;
      let items: AvailableItems[] = [];
      for (let i = 0; i < results.length; i++) {
        const role = apiToRole(results[i].result);
        items.push({
          key: role.cn,
          title: role.cn,
        });
      }
      items = items.filter((item) => !member_role.includes(item.key));
      setAvailableItems(items);
    }
  }, [rolesQuery.data, rolesQuery.isFetching, member_role]);

  const onRefreshData = () => {
    setRolesSelected([]);
    privilegeQuery.refetch();
  };

  const handleMemberMutation = (
    response: PrivilegeMemberMutationResponse,
    {
      successName,
      successTitle,
      errorName,
      errorFallbackTitle,
    }: {
      successName: string;
      successTitle: string;
      errorName: string;
      errorFallbackTitle: string;
    }
  ): boolean => {
    if ("data" in response && response.data) {
      if (response.data.result) {
        dispatch(
          addAlert({
            name: successName,
            title: successTitle,
            variant: "success",
          })
        );
        onRefreshData();
        return true;
      }

      if (response.data.error) {
        const errorMessage = response.data.error as unknown as ErrorResult;
        dispatch(
          addAlert({
            name: errorName,
            title: errorMessage.message,
            variant: "danger",
          })
        );
        return false;
      }
    }

    if ("error" in response) {
      const title =
        "message" in response.error && response.error.message
          ? response.error.message
          : errorFallbackTitle;
      dispatch(
        addAlert({
          name: errorName,
          title,
          variant: "danger",
        })
      );
    }

    return false;
  };

  const onAddRole = (items: AvailableItems[]) => {
    const newRoleNames = items.map((item) => item.key);
    if (props.privilege.cn === undefined || newRoleNames.length === 0) {
      return;
    }

    const payload: PrivilegeMemberPayload = {
      entryName: props.privilege.cn,
      entityType: "role",
      memberIds: newRoleNames,
    };

    setSpinning(true);
    addMembers(payload)
      .then((response) => {
        const success = handleMemberMutation(response, {
          successName: "add-member-success",
          successTitle:
            "Assigned roles to privilege '" + props.privilege.cn + "'",
          errorName: "add-member-error",
          errorFallbackTitle: "Failed to assign roles to privilege",
        });

        if (success) {
          setShowAddModal(false);
        }
      })
      .finally(() => setSpinning(false));
  };

  const onDeleteRole = () => {
    if (props.privilege.cn === undefined || rolesSelected.length === 0) {
      return;
    }

    const payload: PrivilegeMemberPayload = {
      entryName: props.privilege.cn,
      entityType: "role",
      memberIds: rolesSelected,
    };

    setSpinning(true);
    removeMembers(payload)
      .then((response) => {
        const success = handleMemberMutation(response, {
          successName: "remove-members-success",
          successTitle:
            "Removed roles from privilege '" + props.privilege.cn + "'",
          errorName: "remove-members-error",
          errorFallbackTitle: "Failed to remove roles from privilege",
        });

        if (success) {
          setShowDeleteModal(false);
          setPage(1);
        }
      })
      .finally(() => setSpinning(false));
  };

  return (
    <TabLayout id="member_role">
      <MemberOfToolbar
        searchPlaceholder="Search roles"
        searchAriaLabel="Search roles"
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={onRefreshData}
        deleteButtonEnabled={isDeleteButtonEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        onHelpIconClick={() => dispatch(toggleHelpPanel())}
        totalItems={filteredRoles.length}
        bulkSelector={
          <BulkSelectorPrep
            list={roles}
            shownElementsList={roles}
            elementData={bulkSelectorData}
            buttonsData={{
              updateIsDeleteButtonDisabled: () => {},
            }}
            selectedPerPageData={selectedPerPageData}
          />
        }
      />
      <MemberTable
        entityList={roles}
        idKey="cn"
        from="roles"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={rolesSelected}
        onCheckItemsChange={setRolesSelected}
        showTableRows={!privilegeQuery.isFetching}
      />
      {filteredRoles.length > 0 && (
        <PaginationLayout
          list={[]}
          totalCount={filteredRoles.length}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v6-u-pb-0 pf-v6-u-pr-md"
        />
      )}
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddRole}
          searchProps={{ onSearchTextChange: setAdderSearchValue }}
          title={"Assign roles to privilege: " + props.privilege.cn}
          ariaLabel="Add roles to privilege modal"
          spinning={spinning}
        />
      )}
      {showDeleteModal && rolesSelected.length > 0 && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Remove roles from privilege: " + props.privilege.cn}
          onDelete={onDeleteRole}
          spinning={spinning}
        >
          <MemberTable
            entityList={filteredRoles.filter((role) =>
              rolesSelected.includes(role.cn)
            )}
            from="roles"
            idKey="cn"
            columnNamesToShow={columnNames}
            propertiesToShow={properties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </TabLayout>
  );
};

export default MembersRoles;
