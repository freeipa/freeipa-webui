import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, HBACRule } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar, { MembershipDirection } from "./MemberOfToolbar";
import MemberOfHbacRulesTable from "./MemberOfTableHbacRules";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import { ErrorResult } from "src/services/rpc";

import {
  useGetHbacRulesInfoByNameQuery,
  useGettingHbacRulesQuery,
  useAddToHbacRulesMutation,
} from "src/services/rpcHBAC";

// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToHBACRule } from "src/utils/hbacRulesUtils";

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

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);

  // Buttons functionality
  // - Refresh
  const isRefreshButtonEnabled =
    !fullHbacRulesQuery.isFetching && !props.isUserDataLoading;
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'HBAC rules'
  // API calls
  const [addMemberToHbacRules] = useAddToHbacRulesMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableHbacRules, setAvailableHbacRules] = React.useState<
    HBACRule[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available HBAC rules, delay the search for opening the modal
  const hbacRulesQuery = useGettingHbacRulesQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available HBAC rules search
  React.useEffect(() => {
    if (showAddModal) {
      hbacRulesQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.user]);

  // Update available HBAC rules
  React.useEffect(() => {
    if (hbacRulesQuery.data && !hbacRulesQuery.isFetching) {
      // transform data to HBAC rules
      const count = hbacRulesQuery.data.result.count;
      const results = hbacRulesQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalHbacRules: HBACRule[] = [];
      for (let i = 0; i < count; i++) {
        const hbacRule = apiToHBACRule(results[i].result);
        avalHbacRules.push(hbacRule);
        items.push({
          key: hbacRule.cn,
          title: hbacRule.cn,
        });
      }
      items = items.filter((item) => !hbacRulesNamesToLoad.includes(item.key));

      setAvailableHbacRules(avalHbacRules);
      setAvailableItems(items);
    }
  }, [hbacRulesQuery.data, hbacRulesQuery.isFetching]);

  // - Add
  const onAddHbacRule = (items: AvailableItems[]) => {
    const uid = props.user.uid;
    const newHbacRuleNames = items.map((item) => item.key);
    if (uid === undefined || newHbacRuleNames.length == 0) {
      return;
    }

    addMemberToHbacRules([uid, "user", newHbacRuleNames]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            `Assigned new HBAC rule to user ${uid}`,
            "success"
          );
          // Update displayed HBAC Rules before they are updated via refresh
          const newHbacRules = hbacRules.concat(
            availableHbacRules.filter((hbacRule) =>
              newHbacRuleNames.includes(hbacRule.cn)
            )
          );
          setHbacRules(newHbacRules);

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

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSearch={() => {}}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshUserData}
        deleteButtonEnabled={someItemSelected}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDeleteButtonClick={() => {}}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
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
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddHbacRule}
          onSearchTextChange={setAdderSearchValue}
          title={`Assign HBAC rule to user ${props.user.uid}`}
          ariaLabel="Add user of HBAC rule modal"
        />
      )}
    </>
  );
};

export default MemberOfHbacRules;
