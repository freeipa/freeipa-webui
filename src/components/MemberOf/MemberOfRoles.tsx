import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, Role } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar, { MembershipDirection } from "./MemberOfToolbar";
import MemberOfTableRoles from "./MemberOfTableRoles";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import { BatchRPCResponse, useGettingRolesQuery } from "src/services/rpc";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToRole } from "src/utils/rolesUtils";

interface MemberOfRolesProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}
const MemberOfRoles = (props: MemberOfRolesProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Roles from current user
  const [rolesFromUser, setRolesFromUser] = React.useState<Role[]>([]);

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const firstRoleIdx = (page - 1) * perPage;
  const lastRoleIdx = page * perPage;

  // Current user ID
  const uid = props.user.uid;

  // API call
  // - Full info of available Roles
  const rolesQuery = useGettingRolesQuery({
    user: uid,
    apiVersion: API_VERSION_BACKUP,
    startIdx: firstRoleIdx,
    stopIdx: lastRoleIdx,
  });

  const [rolesFullList, setRolesFullList] = React.useState<Role[]>([]);

  const rolesData = rolesQuery.data || {};

  React.useEffect(() => {
    if (rolesData && !rolesQuery.isFetching) {
      const dataParsed = rolesData as BatchRPCResponse;
      const count = dataParsed.result.count;
      const results = dataParsed.result.results;

      const rolesTempList: Role[] = [];

      for (let i = 0; i < count; i++) {
        rolesTempList.push(apiToRole(results[i].result));
      }
      setRolesFullList(rolesTempList);
    }
  }, [rolesData, rolesQuery.isFetching]);

  // Get full data of the 'Roles' assigned to user
  React.useEffect(() => {
    const rolesParsed: Role[] = [];
    props.user.memberof_role?.map((role) => {
      rolesFullList.map((rl) => {
        if (rl.cn === role) {
          rolesParsed.push(rl);
        }
      });
    });
    if (JSON.stringify(rolesFromUser) !== JSON.stringify(rolesParsed)) {
      setRolesFromUser(rolesParsed);
    }
  }, [rolesFullList]);

  // Other states
  const [rolesSelected, setRolesSelected] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState("");

  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  // Computed "states"
  const someItemSelected = rolesSelected.length > 0;
  const [shownRoles, setShownRoles] = React.useState<Role[]>(
    paginate(rolesFromUser, page, perPage)
  );
  const showTableRows = rolesFromUser.length > 0;

  // Update 'shownRoles' when 'RolesFromUser' changes
  React.useEffect(() => {
    setShownRoles(paginate(rolesFromUser, page, perPage));
  }, [rolesFromUser]);

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSearch={() => {}}
        refreshButtonEnabled={true}
        onRefreshButtonClick={props.onRefreshUserData}
        deleteButtonEnabled={someItemSelected}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDeleteButtonClick={() => {}}
        addButtonEnabled={true}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onAddButtonClick={() => {}}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={rolesFromUser.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfTableRoles
        roles={shownRoles}
        checkedItems={rolesSelected}
        onCheckItemsChange={setRolesSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={rolesFromUser.length}
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

export default MemberOfRoles;
