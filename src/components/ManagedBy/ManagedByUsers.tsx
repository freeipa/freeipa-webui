import React from "react";
// PatternFly
import { PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
// Data types
import { OtpToken, User } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToUser } from "src/utils/userUtils";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useGetUsersInfoByUidQuery,
  useGettingActiveUserQuery,
} from "src/services/rpcUsers";
import {
  OtpTokenManagedByPayload,
  useAddManagedByOtpTokenMutation,
  useRemoveManagedByOtpTokenMutation,
} from "src/services/rpcOtpTokens";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import PaginationLayout from "../layouts/PaginationLayout";

interface ManagedByUsersProps {
  entity: Partial<OtpToken>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
}

const ManagedByUsers = (props: ManagedByUsersProps) => {
  const dispatch = useAppDispatch();

  // Get parameters from URL
  const { page, perPage, searchValue } = useListPageSearchParams();

  // Other states
  const [usersSelected, setUsersSelected] = React.useState<string[]>([]);

  const managedby_user = props.entity.managedby_user || [];

  const filteredUsers = React.useMemo(() => {
    let toLoad = [...managedby_user].sort();

    if (searchValue) {
      const q = searchValue.toLowerCase();
      toLoad = toLoad.filter((name) => name.toLowerCase().includes(q));
    }

    return toLoad;
  }, [props.entity.managedby_user, searchValue]);

  const userNamesToLoad = React.useMemo(
    () => paginate(filteredUsers, page, perPage),
    [filteredUsers, page, perPage]
  );

  const fullUsersQuery = useGetUsersInfoByUidQuery({
    uidsList: userNamesToLoad,
    noMembers: true,
  });

  const users = React.useMemo<User[]>(
    () => fullUsersQuery.data ?? [],
    [fullUsersQuery.data]
  );

  // Computed "states"
  const someItemSelected = usersSelected.length > 0;
  const showTableRows = users.length > 0;
  const userColumnNames = ["User login", "First name", "Last name", "Status"];
  const userProperties = ["uid", "givenname", "sn", "nsaccountlock"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullUsersQuery.isFetching && !props.isDataLoading;
  const isDeleteEnabled = someItemSelected;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // API calls
  const [addManagedBy] = useAddManagedByOtpTokenMutation();
  const [removeManagedBy] = useRemoveManagedByOtpTokenMutation();

  const [adderSearchValue, setAdderSearchValue] = React.useState("");

  // Load available Users
  const usersQuery = useGettingActiveUserQuery({
    searchValue: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizeLimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available Users search
  React.useEffect(() => {
    if (showAddModal) {
      usersQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  const availableUsers = React.useMemo<User[]>(() => {
    if (!usersQuery.data || usersQuery.isFetching) return [];
    const { count, results } = usersQuery.data.result;
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      users.push(apiToUser(results[i].result));
    }
    return users;
  }, [usersQuery.data, usersQuery.isFetching]);

  const availableItems = React.useMemo<AvailableItems[]>(
    () =>
      availableUsers
        .filter((user) => !managedby_user.includes(user.uid))
        .map((user) => ({
          key: user.uid,
          title: user.uid,
        })),
    [availableUsers, managedby_user]
  );

  // Add
  const onAddUser = (items: AvailableItems[]) => {
    const newUserNames = items.map((item) => item.key);
    if (props.id === undefined || newUserNames.length === 0) {
      return;
    }

    const payload: OtpTokenManagedByPayload = {
      otpTokenId: props.id,
      users: newUserNames,
    };

    setSpinning(true);
    addManagedBy(payload).then(
      (
        response:
          | { data: { result?: unknown; error?: unknown } }
          | { error: FetchBaseQueryError | SerializedError }
      ) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "add-managedby-success",
                title: "Assigned new managers to OTP token '" + props.id + "'",
                variant: "success",
              })
            );
            props.onRefreshData();
            setShowAddModal(false);
          } else if (response.data?.error) {
            const errorMessage = response.data.error as unknown as ErrorResult;
            dispatch(
              addAlert({
                name: "add-managedby-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
          }
        } else if ("error" in response) {
          dispatch(
            addAlert({
              name: "add-managedby-error",
              title: "Failed to assign managers",
              variant: "danger",
            })
          );
        }
        setSpinning(false);
      }
    );
  };

  // Delete
  const onDeleteUser = () => {
    if (props.id === undefined) return;

    const payload: OtpTokenManagedByPayload = {
      otpTokenId: props.id,
      users: usersSelected,
    };

    setSpinning(true);
    removeManagedBy(payload).then(
      (
        response:
          | { data: { result?: unknown; error?: unknown } }
          | { error: FetchBaseQueryError | SerializedError }
      ) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "remove-managedby-success",
                title: "Removed managers from OTP token '" + props.id + "'",
                variant: "success",
              })
            );
            props.onRefreshData();
            setUsersSelected([]);
            setShowDeleteModal(false);
          } else if (response.data?.error) {
            const errorMessage = response.data.error as unknown as ErrorResult;
            dispatch(
              addAlert({
                name: "remove-managedby-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
          }
        } else if ("error" in response) {
          dispatch(
            addAlert({
              name: "remove-managedby-error",
              title: "Failed to remove managers",
              variant: "danger",
            })
          );
        }
        setSpinning(false);
      }
    );
  };

  return (
    <>
      <MemberOfToolbar
        searchPlaceholder="Search users"
        searchAriaLabel="Search users"
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={isDeleteEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        onHelpIconClick={() => dispatch(toggleHelpPanel())}
        totalItems={filteredUsers.length}
      />
      <MemberTable
        entityList={users}
        idKey="uid"
        from="active-users"
        columnNamesToShow={userColumnNames}
        propertiesToShow={userProperties}
        checkedItems={usersSelected}
        onCheckItemsChange={setUsersSelected}
        showTableRows={showTableRows}
      />
      <PaginationLayout
        list={[]}
        totalCount={filteredUsers.length}
        variant={PaginationVariant.bottom}
        widgetId="pagination-options-menu-bottom"
        className="pf-v6-u-pb-0 pf-v6-u-pr-md"
      />
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddUser}
          searchProps={{ onSearchTextChange: setAdderSearchValue }}
          title={`Assign users managing OTP token: ${props.id}`}
          ariaLabel="Add managed by user modal"
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={`Remove managers from OTP token: ${props.id}`}
          onDelete={onDeleteUser}
          spinning={spinning}
        >
          <MemberTable
            entityList={availableUsers.filter((user) =>
              usersSelected.includes(user.uid)
            )}
            from="active-users"
            idKey="uid"
            columnNamesToShow={userColumnNames}
            propertiesToShow={userProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default ManagedByUsers;
