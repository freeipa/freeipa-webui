import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, HBACRule } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar, { MembershipDirection } from "./MemberOfToolbar";
import MemberOfHbacRulesTable from "./MemberOfTableHbacRules";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import { useGetHbacRulesInfoByNameQuery } from "src/services/rpc";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";

interface MemberOfHbacRulesProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const MemberOfHbacRules = (props: MemberOfHbacRulesProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Other states
  const [hbacRulesSelected, setHbacRulesSelected] = React.useState<string[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState("");

  // Loaded HBAC rules based on paging and member attributes
  const [hbacRules, setHbacRules] = React.useState<HBACRule[]>([]);

  // Membership direction and HBAC rules
  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  const memberof_hbacrule = props.user.memberof_hbacrule || [];
  const memberofindirect_hbacrule = props.user.memberofindirect_hbacrule || [];
  let hbacRuleNames =
    membershipDirection === "direct"
      ? memberof_hbacrule
      : memberofindirect_hbacrule;
  hbacRuleNames = [...hbacRuleNames];

  const getHbacRulesNameToLoad = (): string[] => {
    let toLoad = [...hbacRuleNames];
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

  const [hbacRulesNamesToLoad, setHbacRulesNamesToLoad] = React.useState<
    string[]
  >(getHbacRulesNameToLoad());

  // Load HBAC rules
  const fullHbacRulesQuery = useGetHbacRulesInfoByNameQuery({
    hbacRuleNamesList: hbacRulesNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Reset page on direction change
  React.useEffect(() => {
    setPage(1);
  }, [membershipDirection]);

  // Refresh HBAC rules
  React.useEffect(() => {
    const hbacRulesNames = getHbacRulesNameToLoad();
    setHbacRulesNamesToLoad(hbacRulesNames);
  }, [props.user, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (hbacRulesNamesToLoad.length > 0) {
      fullHbacRulesQuery.refetch();
    }
  }, [hbacRulesNamesToLoad]);

  // Update HBAC rules
  React.useEffect(() => {
    if (fullHbacRulesQuery.data && !fullHbacRulesQuery.isFetching) {
      setHbacRules(fullHbacRulesQuery.data);
    }
  }, [fullHbacRulesQuery.data, fullHbacRulesQuery.isFetching]);

  // Computed "states"
  const someItemSelected = hbacRulesSelected.length > 0;
  const showTableRows = hbacRules.length > 0;

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
        totalItems={hbacRuleNames.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfHbacRulesTable
        hbacRules={hbacRules}
        checkedItems={hbacRulesSelected}
        onCheckItemsChange={setHbacRulesSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={hbacRuleNames.length}
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

export default MemberOfHbacRules;
