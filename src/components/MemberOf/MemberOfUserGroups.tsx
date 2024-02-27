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

function paginate<Type>(array: Type[], page: number, perPage: number): Type[] {
  const startIdx = (page - 1) * perPage;
  const endIdx = perPage * page - 1;
  return array.slice(startIdx, endIdx);
}

interface TypeWithCN {
  cn: string;
}

// Filter functions to compare the available data with the data that
//  the user is already member of. This is done to prevent duplicates
//  (e.g: adding the same element twice).
function filterUserGroupsData<Type extends TypeWithCN>(
  list1: Array<Type>,
  list2: Array<Type>
): Type[] {
  // User groups
  return list1.filter((item) => {
    return !list2.some((itm) => {
      return item.cn === itm.cn;
    });
  });
}

interface MemberOfUserGroupsProps {
  user: Partial<User>;
}

const MemberOfUserGroups = (props: MemberOfUserGroupsProps) => {
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

  const userGroupsFullList = fullUserGroupsQuery.userGroupsFullList;

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

  // Available data to be added as member of
  const userGroupsFilteredData: UserGroup[] = filterUserGroupsData(
    userGroupsFullList,
    userGroupsFromUser
  );

  // Parse availableItems to AvailableItems type
  const parseAvailableItems = () => {
    const avItems: AvailableItems[] = [];
    userGroupsFilteredData.map((item) => {
      avItems.push({
        key: item.cn,
        title: item.cn,
      });
    });
    return avItems;
  };
  const availableUserGroupsItems: AvailableItems[] = parseAvailableItems();

  // 'Add' function
  // TODO: Adapt to work with real data
  const onAddUserGroup = (items: AvailableItems[]) => {
    const newItems = items.map((item) => item.key);
    const newGroups = userGroupsFullList.filter((group) =>
      newItems.includes(group.cn)
    );
    const updatedGroups = userGroupsFromUser.concat(newGroups);
    setUserGroupsFromUser(updatedGroups);
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
      <MemberOfToolbarUserGroups
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        refreshButtonEnabled={true}
        deleteButtonEnabled={someItemSelected}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={true}
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
