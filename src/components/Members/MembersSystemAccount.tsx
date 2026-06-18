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
import { useGetSysaccountsQuery } from "src/services/rpcSystemAccounts";

interface PropsToMembersSystemAccount {
  entity: Partial<Role>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_sysaccount: string[];
}

const MembersSystemAccount = (props: PropsToMembersSystemAccount) => {
  const dispatch = useAppDispatch();

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const member_sysaccount = props.member_sysaccount || [];

  const getItemsToShow = (): string[] => {
    let toShow = [...member_sysaccount];
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

  const columnNames = ["System account"];
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

  const sysaccountsQuery = useGetSysaccountsQuery(adderSearchValue);

  React.useEffect(() => {
    if (showAddModal) {
      sysaccountsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  const availableItems = useMemo<AvailableItems[]>(() => {
    if (sysaccountsQuery.data && !sysaccountsQuery.isFetching) {
      const sysaccounts = sysaccountsQuery.data;
      const items: AvailableItems[] = sysaccounts.map((sa) => ({
        key: sa.uid,
        title: sa.uid + (sa.description ? ` (${sa.description})` : ""),
      }));

      return items.filter(
        (item) => !member_sysaccount.includes(item.key) && item.key !== props.id
      );
    }
    return [];
  }, [
    sysaccountsQuery.data,
    sysaccountsQuery.isFetching,
    member_sysaccount,
    props.id,
  ]);

  const onAddSystemAccount = (items: AvailableItems[]) => {
    const newSysaccountNames = items.map((item) => item.key);
    if (props.id === undefined || newSysaccountNames.length === 0) {
      return;
    }

    const payload: RoleMemberPayload = {
      entryName: props.id,
      entityType: "sysaccount",
      idsToAdd: newSysaccountNames,
    };

    setSpinning(true);
    addMembers(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          dispatch(
            addAlert({
              name: "add-member-success",
              title: "Assigned system accounts to role '" + props.id + "'",
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

  const onDeleteSystemAccount = () => {
    const payload: RoleMemberPayload = {
      entryName: props.id,
      entityType: "sysaccount",
      idsToAdd: selectedItems,
    };

    setSpinning(true);
    removeMembers(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          dispatch(
            addAlert({
              name: "remove-members-success",
              title: "Removed system accounts from role '" + props.id + "'",
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
        searchPlaceholder="Search system accounts"
        searchAriaLabel="Search system accounts"
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={isDeleteEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        totalItems={member_sysaccount.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={itemsToShow}
        idKey="id"
        from="sysaccount"
        columnNamesToShow={columnNames}
        propertiesToShow={itemsToShow}
        checkedItems={selectedItems}
        onCheckItemsChange={setSelectedItems}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v6-u-pb-0 pf-v6-u-pr-md"
        itemCount={member_sysaccount.length}
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
          onAdd={onAddSystemAccount}
          onSearchTextChange={setAdderSearchValue}
          title={"Assign system accounts to role: " + props.id}
          ariaLabel="Add system account to role modal"
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Remove system accounts from role: " + props.id}
          onDelete={onDeleteSystemAccount}
          spinning={spinning}
        >
          <MemberTable
            entityList={member_sysaccount.filter((item) =>
              selectedItems.includes(item)
            )}
            idKey="id"
            from="sysaccount"
            columnNamesToShow={columnNames}
            propertiesToShow={member_sysaccount.filter((item) =>
              selectedItems.includes(item)
            )}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MembersSystemAccount;
