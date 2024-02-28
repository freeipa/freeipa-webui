import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, UserGroup } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbarUserGroups, {
  MembershipDirection,
} from "./MemberOfToolbar";
import MemberOfUserGroupsTable from "./MemberOfTableUserGroups";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
// Hooks
import { useUserMemberOfData } from "src/hooks/useUserMemberOfData";
import useAlerts from "src/hooks/useAlerts";
// RPC
import { ErrorResult, useAddToGroupsMutation } from "src/services/rpc";
// Utils
import { paginate } from "src/utils/utils";

interface MemberOfUserGroupsProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const MemberOfUserGroups = (props: MemberOfUserGroupsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // API call
  const [addMemberToUserGroup] = useAddToGroupsMutation();

  // 'User groups' assigned to  user
  const [userGroupsFromUser, setUserGroupsFromUser] = React.useState<
    UserGroup[]
  >([]);

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  const uid = props.user.uid;

  // API call: full list of 'User groups' available
  const fullUserGroupsQuery = useUserMemberOfData({
    uid,
    firstUserIdx,
    lastUserIdx,
  });

  // Member of
  const userGroupsFullList = fullUserGroupsQuery.userGroupsFullList;

  // Not member of
  const userGroupsNotMemberOfFullList =
    fullUserGroupsQuery.userGroupsNotMemberOfFullList;

  // Get full data of the 'User groups' assigned to user
  React.useEffect(() => {
    if (!fullUserGroupsQuery.isFetching && userGroupsFullList) {
      const userGroupsParsed: UserGroup[] = [];
      props.user.memberof_group?.map((group) => {
        userGroupsFullList.map((g) => {
          if (g.cn === group) {
            userGroupsParsed.push(g);
          }
        });
      });
      if (
        JSON.stringify(userGroupsFromUser) !== JSON.stringify(userGroupsParsed)
      ) {
        setUserGroupsFromUser(userGroupsParsed);
      }
    }
  }, [fullUserGroupsQuery]);

  // Refetch User groups when user data changes
  React.useEffect(() => {
    fullUserGroupsQuery.refetch();
    fullUserGroupsQuery.notMemberOfRefetch();
  }, [props.user, userGroupsFromUser]);

  const [groupsNamesSelected, setGroupsNamesSelected] = React.useState<
    string[]
  >([]);

  const [searchValue, setSearchValue] = React.useState("");

  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Computed "states"
  const someItemSelected = groupsNamesSelected.length > 0;
  const shownUserGroups = paginate(userGroupsFromUser, page, perPage);
  const showTableRows = userGroupsFromUser.length > 0;

  // Parse availableItems to 'AvailableItems' type
  const parseAvailableItems = (itemsList: UserGroup[]) => {
    const avItems: AvailableItems[] = [];
    itemsList.map((item) => {
      avItems.push({
        key: item.cn,
        title: item.cn,
      });
    });
    return avItems;
  };

  const availableUserGroupsItems: AvailableItems[] = parseAvailableItems(
    userGroupsNotMemberOfFullList
  );

  // Buttons functionality
  // - Refresh
  const isRefreshButtonEnabled = !props.isUserDataLoading;

  // - 'Add'
  const isAddButtonEnabled = !props.isUserDataLoading;

  // Add new member to 'User group'
  const onAddToUserGroup = (toUid: string, type: string, newData: string[]) => {
    addMemberToUserGroup([toUid, type, newData]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Added new members to user group '" + toUid + "'",
            "success"
          );
          // Refresh data
          props.onRefreshUserData();
          // Close modal
          setShowAddModal(false);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("add-member-error", errorMessage.message, "danger");
        }
      }
    });
  };

  const onAddUserGroup = (items: AvailableItems[]) => {
    const newItems = items.map((item) => item.key);
    const newGroups = userGroupsFullList.filter((group) =>
      newItems.includes(group.cn)
    );
    if (props.user.uid !== undefined) {
      onAddToUserGroup(props.user.uid, "user", newItems);
      const updatedGroups = userGroupsFromUser.concat(newGroups);
      setUserGroupsFromUser(updatedGroups);
    }
  };

  // 'Delete' function
  const onDeleteUserGroup = () => {
    const updatedGroups = userGroupsFromUser.filter(
      (group) => !groupsNamesSelected.includes(group.cn)
    );
    setUserGroupsFromUser(updatedGroups);
  };

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfToolbarUserGroups
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshUserData}
        deleteButtonEnabled={someItemSelected}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={userGroupsFromUser.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfUserGroupsTable
        userGroups={shownUserGroups}
        checkedItems={groupsNamesSelected}
        onCheckItemsChange={setGroupsNamesSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={userGroupsFromUser.length}
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
          availableItems={availableUserGroupsItems}
          onAdd={onAddUserGroup}
          onSearchTextChange={setSearchValue}
          title={"Add '" + props.user.uid + "' into User groups"}
          ariaLabel="Add user of  user group modal"
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title="Delete user from user groups"
          onDelete={onDeleteUserGroup}
        >
          <MemberOfUserGroupsTable
            userGroups={
              userGroupsFromUser.filter((group) =>
                groupsNamesSelected.includes(group.cn)
              ) as UserGroup[]
            }
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MemberOfUserGroups;
