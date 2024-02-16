import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { UserGroupOld } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppSelector } from "src/store/hooks";
// Components
import MemberOfToolbarUserGroups, {
  MembershipDirection,
} from "./MemberOfToolbar";
import MemberOfUserGroupsTable from "./MemberOfTableUserGroups";
import MemberOfAddModal from "./MemberOfAddModalUserGroups";
import MemberOfDeleteModal from "./MemberOfDeleteModalUserGroups";

function paginate<Type>(array: Type[], page: number, perPage: number): Type[] {
  const startIdx = (page - 1) * perPage;
  const endIdx = perPage * page - 1;
  return array.slice(startIdx, endIdx);
}

interface TypeWithName {
  name: string;
}

// Filter functions to compare the available data with the data that
//  the user is already member of. This is done to prevent duplicates
//  (e.g: adding the same element twice).
function filterUserGroupsData<Type extends TypeWithName>(
  list1: Array<Type>,
  list2: Array<Type>
): Type[] {
  // User groups
  return list1.filter((item) => {
    return !list2.some((itm) => {
      return item.name === itm.name;
    });
  });
}

interface MemberOfUserGroupsProps {
  usersGroupsFromUser: UserGroupOld[];
  updateUsersGroupsFromUser: (newList: UserGroupOld[]) => void;
}

const MemberOfUserGroups = (props: MemberOfUserGroupsProps) => {
  const userGroupsFullList = useAppSelector(
    (state) => state.usergroups.userGroupList
  );

  const [groupsNamesSelected, setGroupsNamesSelected] = React.useState<
    string[]
  >([]);

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const [searchValue, setSearchValue] = React.useState("");

  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Computed "states"
  const someItemSelected = groupsNamesSelected.length > 0;
  const shownUserGroups = paginate(props.usersGroupsFromUser, page, perPage);
  const showTableRows = props.usersGroupsFromUser.length > 0;

  // Available data to be added as member of
  const userGroupsFilteredData: UserGroupOld[] = filterUserGroupsData(
    userGroupsFullList,
    props.usersGroupsFromUser
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
        totalItems={props.usersGroupsFromUser.length}
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
        itemCount={props.usersGroupsFromUser.length}
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
          availableData={userGroupsFilteredData}
          groupRepository={props.usersGroupsFromUser}
          updateGroupRepository={(newList: UserGroupOld[]) =>
            props.updateUsersGroupsFromUser(newList)
          }
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          tabName="User groups"
          groupNamesToDelete={groupsNamesSelected}
          updateGroupNamesToDelete={setGroupsNamesSelected}
          groupRepository={props.usersGroupsFromUser}
          updateGroupRepository={props.updateUsersGroupsFromUser}
        />
      )}
    </>
  );
};

export default MemberOfUserGroups;
