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
import MemberOfAddModal from "./MemberOfAddModalUserGroups";
import MemberOfDeleteModal from "./MemberOfDeleteModalUserGroups";
// Hooks
import { useUserMemberOfData } from "src/hooks/useUserMemberOfData";

function paginate<Type>(array: Type[], page: number, perPage: number): Type[] {
  const startIdx = (page - 1) * perPage;
  const endIdx = perPage * page - 1;
  return array.slice(startIdx, endIdx);
}

interface TypeWithName {
  cn: string;
}

// Filter functions to compare the available data with the data that
//  the user is already member of. This is done to prevent duplicates
//  (e.g: adding the same element twice).
function filterUserGroupsData<Type extends TypeWithName>(
  list1: Array<Type>,
  list2: Array<Type>
): Type[] {
  return list1.filter((item) => {
    return !list2.some((itm) => {
      return item.cn === itm.cn;
    });
  });
}

interface MemberOfUserGroupsProps {
  user: Partial<User>;
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
}

const MemberOfUserGroups = (props: MemberOfUserGroupsProps) => {
  // 'User groups' assigned to  user
  const [userGroupsFromUser, setUserGroupsFromUser] = React.useState<
    UserGroup[]
  >([]);

  const firstUserIdx = (props.page - 1) * props.perPage;
  const lastUserIdx = props.page * props.perPage;

  // API call: full list of 'User groups' available
  const fullUserGroupsQuery = useUserMemberOfData({
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
  const shownUserGroups = paginate(
    userGroupsFromUser,
    props.page,
    props.perPage
  );
  const showTableRows = userGroupsFromUser.length > 0;

  // Available data to be added as member of
  const userGroupsFilteredData: UserGroup[] = filterUserGroupsData(
    userGroupsFullList,
    userGroupsFromUser
  );

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
        perPage={props.perPage}
        page={props.page}
        onPerPageChange={props.setPerPage}
        onPageChange={props.setPage}
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
        perPage={props.perPage}
        page={props.page}
        variant={PaginationVariant.bottom}
        onSetPage={(_e, page) => props.setPage(page)}
        onPerPageSelect={(_e, perPage) => props.setPerPage(perPage)}
      />
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableData={userGroupsFilteredData}
          groupRepository={userGroupsFromUser}
          updateGroupRepository={setUserGroupsFromUser}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          tabName="User groups"
          groupNamesToDelete={groupsNamesSelected}
          updateGroupNamesToDelete={setGroupsNamesSelected}
          groupRepository={userGroupsFromUser}
          updateGroupRepository={setUserGroupsFromUser}
        />
      )}
    </>
  );
};

export default MemberOfUserGroups;
