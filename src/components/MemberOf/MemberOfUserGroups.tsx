import React from "react";
// PatternFly
import {
  FlexItem,
  Flex,
  Pagination,
  PaginationVariant,
} from "@patternfly/react-core";
// Data types
import { User, UserGroup } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberTable from "src/components/tables/MembershipTable";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useAddToGroupsMutation,
  useGetGroupInfoByNameQuery,
  useGettingGroupsQuery,
  useRemoveFromGroupsMutation,
} from "src/services/rpcUserGroups";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToGroup } from "src/utils/groupUtils";

interface MemberOfUserGroupsProps {
  entry: Partial<User> | Partial<UserGroup>;
  from: string;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
}

const MemberOfUserGroups = (props: MemberOfUserGroupsProps) => {
  const dispatch = useAppDispatch();

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

  // Loaded User groups based on paging and member attributes
  const [userGroups, setUserGroups] = React.useState<UserGroup[]>([]);

  // Choose the correct User groups based on the membership direction
  const memberof_group = props.entry.memberof_group || [];
  const memberofindirect_group = props.entry.memberofindirect_group || [];
  const id =
    props.from === "active-users"
      ? "uid" in props.entry
        ? (props.entry.uid as string)
        : (props.entry.cn as string)
      : (props.entry.cn as string);
  const entryType = props.from === "active-users" ? "user" : "group";
  let userGroupNames =
    membershipDirection === "direct" ? memberof_group : memberofindirect_group;
  userGroupNames = [...userGroupNames];

  const columnNames = ["Group name", "GID", "Description"];
  const properties = ["cn", "gidnumber", "description"];

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

  // Load User groups
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
  }, [props.entry, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entry]);

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

  // Computed "states"
  const showTableRows = userGroups.length > 0;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullUserGroupsQuery.isFetching && !props.isUserDataLoading;
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'User groups'
  // API calls
  const [addMemberToUserGroups] = useAddToGroupsMutation();
  const [removeMembersFromUserGroups] = useRemoveFromGroupsMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableUserGroups, setAvailableUserGroups] = React.useState<
    UserGroup[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available User groups
  const userGroupsQuery = useGettingGroupsQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available User groups search
  React.useEffect(() => {
    if (showAddModal) {
      userGroupsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entry]);

  // Update available User groups
  React.useEffect(() => {
    if (userGroupsQuery.data && !userGroupsQuery.isFetching) {
      // transform data to User groups
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
      items = items.filter((item) => !memberof_group.includes(item.key));
      setAvailableUserGroups(avalUserGroups);
      setAvailableItems(items);
    }
  }, [userGroupsQuery.data, userGroupsQuery.isFetching]);

  // - Add
  const onAddUserGroup = (items: AvailableItems[]) => {
    const newUserGroupNames = items.map((item) => item.key);
    if (id === undefined || newUserGroupNames.length == 0) {
      return;
    }

    setSpinning(true);
    addMemberToUserGroups([id, entryType, newUserGroupNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Set alert: success
            dispatch(
              addAlert({
                name: "add-member-success",
                title: `Assigned '${id}' to user groups`,
                variant: "success",
              })
            );
            // Refresh data
            props.onRefreshUserData();
            // Close modal
            setShowAddModal(false);
          } else if (response.data?.error) {
            // Set alert: error
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
      }
    );
  };

  // - Delete
  const onDeleteUserGroup = () => {
    if (id) {
      setSpinning(true);
      removeMembersFromUserGroups([id, entryType, userGroupsSelected]).then(
        (response) => {
          if ("data" in response) {
            if (response.data?.result) {
              // Set alert: success
              dispatch(
                addAlert({
                  name: "remove-user-groups-success",
                  title: `Removed '${id}' from user groups`,
                  variant: "success",
                })
              );
              // Refresh
              props.onRefreshUserData();
              // Reset delete button
              setUserGroupsSelected([]);
              // Close modal
              setShowDeleteModal(false);
              // Return to first page
              setPage(1);
            } else if (response.data?.error) {
              // Set alert: error
              const errorMessage = response.data
                .error as unknown as ErrorResult;
              dispatch(
                addAlert({
                  name: "remove-entry-groups-error",
                  title: errorMessage.message,
                  variant: "danger",
                })
              );
            }
          }
          setSpinning(false);
        }
      );
    }
  };

  return (
    <>
      <Flex direction={{ default: "column" }}>
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshUserData}
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
        <MemberTable
          entityList={userGroups}
          idKey="cn"
          from="user-groups"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
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
        {userGroupNames.length > 0 && (
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <Pagination
              // className="pf-v6-u-pb-0 pf-v6-u-pr-md"
              itemCount={userGroupNames.length}
              widgetId="pagination-options-menu-bottom"
              perPage={perPage}
              page={page}
              variant={PaginationVariant.bottom}
              onSetPage={(_e, page) => setPage(page)}
              onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
            />
          </FlexItem>
        )}
      </Flex>
      <MemberOfAddModal
        showModal={showAddModal}
        onCloseModal={() => setShowAddModal(false)}
        availableItems={availableItems}
        onAdd={onAddUserGroup}
        onSearchTextChange={setAdderSearchValue}
        title={`Assign '${id}' to user groups`}
        ariaLabel="Add entry of user group modal"
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove '${id}' from user groups`}
        onDelete={onDeleteUserGroup}
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
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default MemberOfUserGroups;
