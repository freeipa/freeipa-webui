import React, { useMemo } from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
// Data types
import { Role } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { paginate } from "src/utils/utils";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  RoleMemberPayload,
  useAddAsMemberRoleMutation,
  useRemoveAsMemberRoleMutation,
} from "src/services/rpcRoles";
import { useSearchIdOverrideUsersQuery } from "src/services/rpcIdOverrides";

const DEFAULT_ID_VIEW = "Default Trust View";

interface PropsToMembersUserIdOverride {
  entity: Partial<Role>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_idoverrideuser: string[];
}

const MembersUserIdOverride = (props: PropsToMembersUserIdOverride) => {
  const dispatch = useAppDispatch();

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const member_idoverrideuser = props.member_idoverrideuser || [];

  const getItemsToShow = (): string[] => {
    let toShow = [...member_idoverrideuser];
    toShow.sort();

    if (searchValue) {
      toShow = toShow.filter((name) =>
        name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    toShow = paginate(toShow, page, perPage);

    return toShow;
  };

  const itemsToShow = getItemsToShow();

  const columnNames = ["User ID override"];
  const someItemSelected = selectedItems.length > 0;
  const showTableRows = itemsToShow.length > 0;

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  const isRefreshButtonEnabled = !props.isDataLoading;
  const isDeleteEnabled = someItemSelected;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  const [addMembers] = useAddAsMemberRoleMutation();
  const [removeMembers] = useRemoveAsMemberRoleMutation();

  const [adderSearchValue, setAdderSearchValue] = React.useState("");

  const idOverrideUsersQuery = useSearchIdOverrideUsersQuery({
    idView: DEFAULT_ID_VIEW,
    searchValue: adderSearchValue,
  });

  React.useEffect(() => {
    if (showAddModal) {
      idOverrideUsersQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  const availableItems = useMemo<AvailableItems[]>(() => {
    if (idOverrideUsersQuery.data && !idOverrideUsersQuery.isFetching) {
      const overrideUsers = idOverrideUsersQuery.data;
      const items: AvailableItems[] = overrideUsers.map((user) => {
        const displayName =
          user.ipaoriginaluid || user.uid || user.ipaanchoruuid;
        return {
          key: displayName,
          title:
            displayName + (user.description ? ` (${user.description})` : ""),
        };
      });

      return items.filter(
        (item) =>
          !member_idoverrideuser.includes(item.key) && item.key !== props.id
      );
    }
    return [];
  }, [
    idOverrideUsersQuery.data,
    idOverrideUsersQuery.isFetching,
    member_idoverrideuser,
    props.id,
  ]);

  const onAddIdOverrideUser = (items: AvailableItems[]) => {
    const newIdOverrideNames = items.map((item) => item.key);
    if (props.id === undefined || newIdOverrideNames.length === 0) {
      return;
    }

    const payload: RoleMemberPayload = {
      entryName: props.id,
      entityType: "idoverrideuser",
      idsToAdd: newIdOverrideNames,
    };

    setSpinning(true);
    addMembers(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          dispatch(
            addAlert({
              name: "add-member-success",
              title: "Assigned ID override users to role '" + props.id + "'",
              variant: "success",
            })
          );
          props.onRefreshData();
          setShowAddModal(false);
        } else if (response.data?.error) {
          const errorMessage = response.data.error as unknown as ErrorResult;
          dispatch(
            addAlert({
              name: "add-member-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
      }
      setSpinning(false);
    });
  };

  const onDeleteIdOverrideUser = () => {
    const payload: RoleMemberPayload = {
      entryName: props.id,
      entityType: "idoverrideuser",
      idsToAdd: selectedItems,
    };

    setSpinning(true);
    removeMembers(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          dispatch(
            addAlert({
              name: "remove-members-success",
              title: "Removed ID override users from role '" + props.id + "'",
              variant: "success",
            })
          );
          props.onRefreshData();
          setSelectedItems([]);
          setShowDeleteModal(false);
          setPage(1);
        } else if (response.data?.error) {
          const errorMessage = response.data.error as unknown as ErrorResult;
          dispatch(
            addAlert({
              name: "remove-members-error",
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
        searchPlaceholder="Search user ID overrides"
        searchAriaLabel="Search user ID overrides"
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={isDeleteEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        totalItems={member_idoverrideuser.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={itemsToShow}
        idKey="id"
        from="idoverrideuser"
        columnNamesToShow={columnNames}
        propertiesToShow={itemsToShow}
        checkedItems={selectedItems}
        onCheckItemsChange={setSelectedItems}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v6-u-pb-0 pf-v6-u-pr-md"
        itemCount={member_idoverrideuser.length}
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
          onAdd={onAddIdOverrideUser}
          onSearchTextChange={setAdderSearchValue}
          title={"Assign ID override users to role: " + props.id}
          ariaLabel="Add ID override user to role modal"
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Remove ID override users from role: " + props.id}
          onDelete={onDeleteIdOverrideUser}
          spinning={spinning}
        >
          <MemberTable
            entityList={member_idoverrideuser.filter((item) =>
              selectedItems.includes(item)
            )}
            idKey="id"
            from="idoverrideuser"
            columnNamesToShow={columnNames}
            propertiesToShow={member_idoverrideuser.filter((item) =>
              selectedItems.includes(item)
            )}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MembersUserIdOverride;
