import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
// RPC
import { ErrorResult, MemberPayload } from "src/services/rpc";
import {
  useGetGroupInfoByNameQuery,
  useGettingGroupsQuery,
  useAddMemberManagersMutation,
  useRemoveMemberManagersMutation,
} from "src/services/rpcUserGroups";
import {
  useAddHGMemberManagersMutation,
  useRemoveHGMemberManagersMutation,
} from "src/services/rpcHostGroups";
import { apiToGroup } from "src/utils/groupUtils";

interface PropsToManagersUsergroups {
  entity: Partial<UserGroup>;
  id: string;
  from: "user-groups" | "host-groups";
  isDataLoading: boolean;
  onRefreshData: () => void;
  manager_groups: string[];
}

const ManagersUserGroups = (props: PropsToManagersUsergroups) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Get parameters from URL
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Other states
  const [userGroupsSelected, setUserGroupsSelected] = React.useState<string[]>(
    []
  );

  // Loaded userGroups based on paging and member attributes
  const [managers, setManagers] = React.useState<UserGroup[]>([]);

  const getUserGroupsNameToLoad = (): string[] => {
    let toLoad = [...props.manager_groups];
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

  const [userGroupNamesToLoad, setUserGroupNamesToLoad] = React.useState<
    string[]
  >(getUserGroupsNameToLoad());

  // Load user groups
  const fullUserGroupsQuery = useGetGroupInfoByNameQuery({
    groupNamesList: userGroupNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Refresh user groups
  React.useEffect(() => {
    const userGroupsNames = getUserGroupsNameToLoad();
    setUserGroupNamesToLoad(userGroupsNames);
  }, [props.entity, searchValue, page, perPage]);

  React.useEffect(() => {
    if (userGroupNamesToLoad.length > 0) {
      fullUserGroupsQuery.refetch();
    }
  }, [userGroupNamesToLoad]);

  // Update user groups
  React.useEffect(() => {
    if (fullUserGroupsQuery.data && !fullUserGroupsQuery.isFetching) {
      setManagers(fullUserGroupsQuery.data);
    }
  }, [fullUserGroupsQuery.data, fullUserGroupsQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "user-groups") {
      return "user group";
    } else if (props.from === "host-groups") {
      return "host group";
    } else {
      // Return default
      return "user group";
    }
  };

  // Computed "states"
  const someItemSelected = userGroupsSelected.length > 0;
  const showTableRows = managers.length > 0;
  const entityType = getEntityType();
  const userGroupColumnNames = ["Group name", "GID", "Description"];
  const userGroupProperties = ["cn", "gidnumber", "description"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullUserGroupsQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // Add new member to 'UserGroup'
  // API calls
  let [addManagers] = useAddMemberManagersMutation();
  if (props.from === "host-groups") {
    [addManagers] = useAddHGMemberManagersMutation();
  }
  let [removeManagers] = useRemoveMemberManagersMutation();
  if (props.from === "host-groups") {
    [removeManagers] = useRemoveHGMemberManagersMutation();
  }

  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableUserGroups, setAvailableUserGroups] = React.useState<
    UserGroup[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available user groups, delay the search for opening the modal
  const userGroupsQuery = useGettingGroupsQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available user groups search
  React.useEffect(() => {
    if (showAddModal) {
      userGroupsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available user groups
  React.useEffect(() => {
    if (userGroupsQuery.data && !userGroupsQuery.isFetching) {
      // transform data to user groups
      const count = userGroupsQuery.data.result.count;
      const results = userGroupsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalUserGroups: UserGroup[] = [];
      for (let i = 0; i < count; i++) {
        const userGroup = apiToGroup(results[i].result);
        avalUserGroups.push(userGroup);
        items.push({
          key: userGroup.cn,
          title: userGroup.cn,
        });
      }
      items = items.filter(
        (item) =>
          !props.manager_groups.includes(item.key) && item.key !== props.id
      );

      setAvailableUserGroups(avalUserGroups);
      setAvailableItems(items);
    }
  }, [userGroupsQuery.data, userGroupsQuery.isFetching]);

  // Add
  const onAddUserGroup = (items: AvailableItems[]) => {
    const newUserGroupNames = items.map((item) => item.key);
    if (props.id === undefined || newUserGroupNames.length == 0) {
      return;
    }

    const payload = {
      entryName: props.id,
      entityType: "group",
      idsToAdd: newUserGroupNames,
    } as MemberPayload;

    setSpinning(true);
    addManagers(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-managers-success",
            "Assigned new group member managers to '" + props.id + "'",
            "success"
          );
          // Refresh data
          props.onRefreshData();
          // Close modal
          setShowAddModal(false);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert(
            "add-member-managers-error",
            errorMessage.message,
            "danger"
          );
        }
      }
      setSpinning(false);
    });
  };

  // Delete
  const onDeleteUserGroups = () => {
    const payload = {
      entryName: props.id,
      entityType: "group",
      idsToAdd: userGroupsSelected,
    } as MemberPayload;

    setSpinning(true);
    removeManagers(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-member-managers-success",
            "Removed group member managers from '" + props.id + "'",
            "success"
          );
          // Refresh
          props.onRefreshData();
          // Disable 'remove' button
          setUserGroupsSelected([]);
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
          setPage(1);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert(
            "remove-member-managers-error",
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
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSearch={() => {}}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={userGroupsSelected.length > 0}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={false}
        helpIconEnabled={true}
        totalItems={props.manager_groups.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={managers}
        idKey="cn"
        from={props.from}
        columnNamesToShow={userGroupColumnNames}
        propertiesToShow={userGroupProperties}
        checkedItems={userGroupsSelected}
        onCheckItemsChange={setUserGroupsSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={managers.length}
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
          onAdd={onAddUserGroup}
          onSearchTextChange={setAdderSearchValue}
          title={"Assign group member managers to: " + props.id}
          ariaLabel={"Add " + entityType + " to user group managers modal"}
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete group member managers from: " + props.id}
          onDelete={onDeleteUserGroups}
          spinning={spinning}
        >
          <MemberTable
            entityList={availableUserGroups.filter((userGroup) =>
              userGroupsSelected.includes(userGroup.cn)
            )}
            from={props.from}
            idKey="cn"
            columnNamesToShow={userGroupColumnNames}
            propertiesToShow={userGroupProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default ManagersUserGroups;
