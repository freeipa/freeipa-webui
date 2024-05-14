import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, SudoRule } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar, { MembershipDirection } from "./MemberOfToolbar";
import MemberOfTableSudoRules from "./MemberOfTableSudoRules";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import { useGetSudoRulesInfoByNameQuery } from "src/services/rpcSudoRules";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";

interface MemberOfSudoRulesProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const MemberOfSudoRules = (props: MemberOfSudoRulesProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Other states
  const [sudoRulesSelected, setSudoRulesSelected] = React.useState<string[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState("");

  // Loaded Sudo rules based on paging and member attributes
  const [sudoRules, setSudoRules] = React.useState<SudoRule[]>([]);

  // Membership direction and Sudo rules
  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  const memberof_sudorule = props.user.memberof_sudorule || [];
  const memberofindirect_sudorule = props.user.memberofindirect_sudorule || [];
  let sudoRuleNames =
    membershipDirection === "direct"
      ? memberof_sudorule
      : memberofindirect_sudorule;
  sudoRuleNames = [...sudoRuleNames];

  const getSudoRulesNameToLoad = (): string[] => {
    let toLoad = [...sudoRuleNames];
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

  const [sudoRulesNamesToLoad, setSudoRulesNamesToLoad] = React.useState<
    string[]
  >(getSudoRulesNameToLoad());

  // Load Sudo rules
  const fullSudoRulesQuery = useGetSudoRulesInfoByNameQuery({
    sudoRuleNamesList: sudoRulesNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Reset page on direction change
  React.useEffect(() => {
    setPage(1);
  }, [membershipDirection]);

  // Refresh Sudo rules
  React.useEffect(() => {
    const sudoRulesNames = getSudoRulesNameToLoad();
    setSudoRulesNamesToLoad(sudoRulesNames);
  }, [props.user, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (sudoRulesNamesToLoad.length > 0) {
      fullSudoRulesQuery.refetch();
    }
  }, [sudoRulesNamesToLoad]);

  // Update Sudo rules
  React.useEffect(() => {
    if (fullSudoRulesQuery.data && !fullSudoRulesQuery.isFetching) {
      setSudoRules(fullSudoRulesQuery.data);
    }
  }, [fullSudoRulesQuery.data, fullSudoRulesQuery.isFetching]);

  // Computed "states"
  const someItemSelected = sudoRulesSelected.length > 0;
  const showTableRows = sudoRules.length > 0;

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
        totalItems={sudoRuleNames.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfTableSudoRules
        sudoRules={sudoRules}
        checkedItems={sudoRulesSelected}
        onCheckItemsChange={setSudoRulesSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={sudoRuleNames.length}
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

export default MemberOfSudoRules;
