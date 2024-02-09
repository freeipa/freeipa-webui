import React from "react";
// Repositories
import { userGroupsInitialData } from "src/utils/data/GroupRepositories";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbarUserGroups, {
  MembershipDirection,
} from "./MemberOfToolbar";
import MemberOfUserGroupsTable from "./MemberOfTableUserGroups";
import { Pagination, PaginationVariant } from "@patternfly/react-core";

interface MemberOfUserGroupsProps {
  showAddModal: () => void;
  showDeleteModal: () => void;
}

function paginate<Type>(array: Type[], page: number, perPage: number): Type[] {
  const startIdx = (page - 1) * perPage;
  const endIdx = perPage * page - 1;
  return array.slice(startIdx, endIdx);
}

const MemberOfUserGroups = (props: MemberOfUserGroupsProps) => {
  const [groupsNamesSelected, setGroupsNamesSelected] = React.useState<
    string[]
  >([]);

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const [searchValue, setSearchValue] = React.useState("");

  const [usersGroupsFromUser] = React.useState<UserGroup[]>(
    userGroupsInitialData
  );

  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  // Computed "states"
  const someItemSelected = groupsNamesSelected.length > 0;
  const shownUserGroups = paginate(usersGroupsFromUser, page, perPage);
  const showTableRows = usersGroupsFromUser.length > 0;

  return (
    <>
      <MemberOfToolbarUserGroups
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        refreshButtonEnabled={true}
        deleteButtonEnabled={someItemSelected}
        onDeleteButtonClick={props.showDeleteModal}
        addButtonEnabled={true}
        onAddButtonClick={props.showAddModal}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={usersGroupsFromUser.length}
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
        itemCount={usersGroupsFromUser.length}
        widgetId="pagination-options-menu-bottom"
        perPage={perPage}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={(_e, page) => setPage(page)}
        onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
      />
    </>
  );
};

export default MemberOfUserGroups;
