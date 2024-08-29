import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  MemberPayload,
  useAddAsMemberMutation,
  useGetGroupInfoByNameQuery,
  useGettingGroupsQuery,
  useRemoveAsMemberMutation,
} from "src/services/rpcUserGroups";
import { apiToGroup } from "src/utils/groupUtils";

interface PropsToMembersUsergroups {
  entity: Partial<UserGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_group: string[];
  memberindirect_group?: string[];
  membershipDisabled?: boolean;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
}

const MembersUserGroups = (props: PropsToMembersUsergroups) => {
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
  const [userGroupsSelected, setUserGroupsSelected] = React.useState<string[]>(
    []
  );
  const [indirectUserGroupsSelected, setIndirectUserGroupsSelected] =
    React.useState<string[]>([]);

  // Loaded userGroups based on paging and member attributes
  const [userGroups, setUserGroups] = React.useState<UserGroup[]>([]);

  // Choose the correct users based on the membership direction
  const member_group = props.member_group || [];
  const memberindirect_group = props.memberindirect_group || [];
  let userGroupNames =
    membershipDirection === "direct" ? member_group : memberindirect_group;
  userGroupNames = [...userGroupNames];

  const getUserGroupsNameToLoad = (): string[] => {
    let toLoad = [...userGroupNames];
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
    props.setDirection(membershipDirection);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entity]);

  React.useEffect(() => {
    if (userGroupNamesToLoad.length > 0) {
      fullUserGroupsQuery.refetch();
    }
  }, [userGroupNamesToLoad]);

  // Update user groups
  React.useEffect(() => {
    if (fullUserGroupsQuery.data && !fullUserGroupsQuery.isFetching) {
      setUserGroups(fullUserGroupsQuery.data);
    }
  }, [fullUserGroupsQuery.data, fullUserGroupsQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "user-groups") {
      return "user group";
    } else {
      // Return 'group' as default
      return "group";
    }
  };

  // Computed "states"
  const someItemSelected = userGroupsSelected.length > 0;
  const showTableRows = userGroups.length > 0;
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
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'UserGroup'
  // API calls
  const [addMemberToUserGroups] = useAddAsMemberMutation();
  const [removeMembersFromUserGroups] = useRemoveAsMemberMutation();
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
      items = items.filter((item) => !member_group.includes(item.key));

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
      userGroup: props.id,
      entityType: "group",
      idsToAdd: newUserGroupNames,
    } as MemberPayload;

    setSpinning(true);
    addMemberToUserGroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new user groups to " + entityType + " " + props.id,
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
  const onDeleteUserGroups = () => {
    const payload = {
      userGroup: props.id,
      entityType: "group",
      idsToAdd: userGroupsSelected,
    } as MemberPayload;

    setSpinning(true);
    removeMembersFromUserGroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-usersgroups-success",
            "Removed user groups from " + entityType + " '" + props.id + "'",
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
            "remove-usergroups-error",
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
          deleteButtonEnabled={
            membershipDirection === "direct"
              ? userGroupsSelected.length > 0
              : indirectUserGroupsSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          helpIconEnabled={true}
          totalItems={userGroupNames.length}
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
              ? userGroupsSelected.length > 0
              : indirectUserGroupsSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          membershipDirectionEnabled={true}
          membershipDirection={membershipDirection}
          onMembershipDirectionChange={setMembershipDirection}
          helpIconEnabled={true}
          totalItems={userGroupNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      )}
      <MemberTable
        entityList={userGroups}
        idKey="cn"
        from="user-groups"
        columnNamesToShow={userGroupColumnNames}
        propertiesToShow={userGroupProperties}
        checkedItems={
          membershipDirection === "direct"
            ? userGroupsSelected
            : indirectUserGroupsSelected
        }
        onCheckItemsChange={
          membershipDirection === "direct"
            ? setUserGroupsSelected
            : setIndirectUserGroupsSelected
        }
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={userGroupNames.length}
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
          title={"Assign User groups to " + entityType + " " + props.id}
          ariaLabel={"Add " + entityType + " of user groups modal"}
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete " + entityType + " from User groups"}
          onDelete={onDeleteUserGroups}
          spinning={spinning}
        >
          <MemberTable
            entityList={availableUserGroups.filter((userGroup) =>
              membershipDirection === "direct"
                ? userGroupsSelected.includes(userGroup.cn)
                : indirectUserGroupsSelected.includes(userGroup.cn)
            )}
            from="user-groups"
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

export default MembersUserGroups;
