import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar, {
  MembershipDirection,
} from "../MemberOf/MemberOfToolbar";
import { AvailableItems } from "../MemberOf/MemberOfAddModal";
import AddModalBySelector from "./AddModalBySelector";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
// Data types
import { UserGroup, UserIDOverride } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  // MemberPayload,
  useAddAsMemberMutation,
  useRemoveAsMemberMutation,
} from "src/services/rpcUserGroups";
import { MemberPayload } from "src/services/rpc";
import { useGetUserIdOverridesInfoByUidQuery } from "src/services/rpcUserIdOverrides";
import { useGetIDViewsQuery } from "src/services/rpcIDViews";
// Utils
import { paginate } from "src/utils/utils";

interface PropsToUserIDOverrides {
  entity: Partial<UserGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_idoverrideuser: string[];
  memberindirect_idoverrideuser: string[];
  membershipDisabled?: boolean;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
}

const MembersUserIDOverrides = (props: PropsToUserIDOverrides) => {
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
  const [idOverridesSelected, setIdOverridesSelected] = React.useState<
    string[]
  >([]);
  const [indirectIdOverridesSelected, setindirectIdOverridesSelected] =
    React.useState<string[]>([]);

  // Loaded ID overrides based on paging and member attributes
  const [idOverrides, setIdOverrides] = React.useState<UserIDOverride[]>([]);

  // Choose the correct ID overrides based on the membership direction
  const member_idoverrideuser = props.member_idoverrideuser || [];
  const memberindirect_idoverrideuser =
    props.memberindirect_idoverrideuser || [];
  let idoverrideNames =
    membershipDirection === "direct"
      ? member_idoverrideuser
      : memberindirect_idoverrideuser;
  idoverrideNames = [...idoverrideNames];

  const getIdOverridesNameToLoad = (): string[] => {
    let toLoad = [...idoverrideNames];
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

  const [idOverrideNamesToLoad, setIdOverrideNamesToLoad] = React.useState<
    string[]
  >(getIdOverridesNameToLoad());

  // Load idOverrides
  const fullIdOverridesQuery = useGetUserIdOverridesInfoByUidQuery(
    idOverrideNamesToLoad
  );

  // Refresh ID Overrides
  React.useEffect(() => {
    const idOverridesNames = getIdOverridesNameToLoad();
    setIdOverrideNamesToLoad(idOverridesNames);
    props.setDirection(membershipDirection);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entity]);

  React.useEffect(() => {
    if (idOverrideNamesToLoad.length > 0) {
      fullIdOverridesQuery.refetch();
    }
  }, [idOverrideNamesToLoad]);

  // Update ID Overrides
  React.useEffect(() => {
    if (fullIdOverridesQuery.data && !fullIdOverridesQuery.isFetching) {
      setIdOverrides(fullIdOverridesQuery.data);
    }
  }, [fullIdOverridesQuery.data, fullIdOverridesQuery.isFetching]);

  // Computed "states"
  const someItemSelected = idOverridesSelected.length > 0;
  const showTableRows = idOverrides.length > 0;
  const idOverrideColumnNames = ["User to override"];
  const idOverrideProperties = ["uid"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullIdOverridesQuery.isFetching && !props.isDataLoading;
  const isDeleteEnabled =
    someItemSelected && membershipDirection !== "indirect";
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'IdOverride'
  // API calls
  const [addMemberToIdOverride] = useAddAsMemberMutation();
  const [removeMembersFromIdOverrides] = useRemoveAsMemberMutation();
  const [selectorValue, setSelectorValue] = React.useState("");
  const [availableIdViews, setAvailableIdViews] = React.useState<string[]>([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available ID Overrides, delay the search for opening the modal
  const idViewsQuery = useGetIDViewsQuery();

  // Trigger available ID Views
  React.useEffect(() => {
    if (showAddModal) {
      idViewsQuery.refetch();
    }
  }, [showAddModal, selectorValue, props.entity]);

  // Update available ID Overrides
  React.useEffect(() => {
    if (idViewsQuery.data && !idViewsQuery.isFetching) {
      // Transform data to AvailableItems data type
      const count = idViewsQuery.data.length;
      const results = idViewsQuery.data;
      let items: AvailableItems[] = [];
      const avalIdViews: string[] = [];
      for (let i = 0; i < count; i++) {
        const idView = results[i];
        avalIdViews.push(results[i]);
        items.push({
          key: idView,
          title: idView,
        });
      }

      items = items.filter((item) => !idoverrideNames.includes(item.key));

      setAvailableIdViews(avalIdViews);
      setAvailableItems(items);
    }
  }, [idViewsQuery.data, idViewsQuery.isFetching]);

  // Add
  const onAddIdOverride = (items: AvailableItems[]) => {
    const newIdOverrideNames = items.map((item) => item.key);
    if (props.id === undefined || newIdOverrideNames.length == 0) {
      return;
    }

    const payload = {
      entryName: props.id,
      entityType: "idoverrideuser",
      idsToAdd: newIdOverrideNames,
    } as MemberPayload;

    setSpinning(true);
    addMemberToIdOverride(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new User IDs to User group " + props.id,
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

  // Delete
  const onDeleteIdOverride = () => {
    const payload = {
      entryName: props.id,
      entityType: "idoverrideuser",
      idsToAdd: idOverridesSelected,
    } as MemberPayload;

    setSpinning(true);
    removeMembersFromIdOverrides(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-id-overrides-success",
            "Removed User IDs from User group '" + props.id + "'",
            "success"
          );
          // Refresh
          props.onRefreshData();
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
          setPage(1);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert(
            "remove-id-overrides-error",
            errorMessage.message,
            "danger"
          );
        }
      }
      setSpinning(false);
    });
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
          deleteButtonEnabled={isDeleteEnabled}
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          helpIconEnabled={true}
          totalItems={idoverrideNames.length}
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
              ? idOverridesSelected.length > 0
              : indirectIdOverridesSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          membershipDirectionEnabled={true}
          membershipDirection={membershipDirection}
          onMembershipDirectionChange={setMembershipDirection}
          helpIconEnabled={true}
          totalItems={idoverrideNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      )}
      <MemberTable
        entityList={idOverrides}
        from="idoverrideuser"
        idKey="uid"
        columnNamesToShow={idOverrideColumnNames}
        propertiesToShow={idOverrideProperties}
        checkedItems={
          membershipDirection === "direct"
            ? idOverridesSelected
            : indirectIdOverridesSelected
        }
        onCheckItemsChange={
          membershipDirection === "direct"
            ? setIdOverridesSelected
            : setindirectIdOverridesSelected
        }
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={idoverrideNames.length}
        widgetId="pagination-options-menu-bottom"
        perPage={perPage}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={(_e, page) => setPage(page)}
        onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
      />
      {showAddModal && (
        <AddModalBySelector
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItemsSelector={availableItems}
          onAdd={onAddIdOverride}
          onSearchTextChange={setSelectorValue}
          title={"Assign User ID Overrides to User group " + props.id}
          ariaLabel={"Add User group of User ID Override modal"}
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete User group from User ID Overrides"}
          onDelete={onDeleteIdOverride}
          spinning={spinning}
        >
          <MemberTable
            entityList={availableIdViews.filter((idOverride) =>
              membershipDirection === "direct"
                ? idOverridesSelected.includes(idOverride)
                : indirectIdOverridesSelected.includes(idOverride)
            )}
            idKey="uid"
            from="idoverrideuser"
            columnNamesToShow={idOverrideColumnNames}
            propertiesToShow={idOverrideProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MembersUserIDOverrides;
