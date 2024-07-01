import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, SudoRule, Host } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberOfTableSudoRules from "./MemberOfTableSudoRules";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useGetSudoRulesInfoByNameQuery,
  useAddToSudoRulesMutation,
  useGettingSudoRulesQuery,
  useRemoveFromSudoRulesMutation,
} from "src/services/rpcSudoRules";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToSudoRule } from "src/utils/sudoRulesUtils";
import { ErrorResult } from "src/services/rpc";

interface MemberOfSudoRulesProps {
  entity: Partial<User> | Partial<Host>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
}

const MemberOfSudoRules = (props: MemberOfSudoRulesProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

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
  const [sudoRulesSelected, setSudoRulesSelected] = React.useState<string[]>(
    []
  );

  // Loaded Sudo rules based on paging and member attributes
  const [sudoRules, setSudoRules] = React.useState<SudoRule[]>([]);

  const memberof_sudorule = props.entity.memberof_sudorule || [];
  const memberofindirect_sudorule =
    props.entity.memberofindirect_sudorule || [];

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

  // Refresh Sudo rules
  React.useEffect(() => {
    const sudoRulesNames = getSudoRulesNameToLoad();
    setSudoRulesNamesToLoad(sudoRulesNames);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

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

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "active-users") {
      return "user";
    } else if (props.from === "hosts") {
      return "host";
    } else {
      // Return 'user' as default
      return "user";
    }
  };

  // Computed "states"
  const someItemSelected = sudoRulesSelected.length > 0;
  const showTableRows = sudoRules.length > 0;
  const entityType = getEntityType();

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Buttons functionality
  // - Refresh
  const isRefreshButtonEnabled =
    !fullSudoRulesQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'Sudo rules'
  // API calls
  const [addMemberToSudoRules] = useAddToSudoRulesMutation();
  const [removeMembersFromSudoRules] = useRemoveFromSudoRulesMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableSudoRules, setAvailableSudoRules] = React.useState<
    SudoRule[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available Sudo rules, delay the search for opening the modal
  const sudoRulesQuery = useGettingSudoRulesQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available Sudo rules search
  React.useEffect(() => {
    if (showAddModal) {
      sudoRulesQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available Sudo rules
  React.useEffect(() => {
    if (sudoRulesQuery.data && !sudoRulesQuery.isFetching) {
      // transform data to Sudo rules
      const count = sudoRulesQuery.data.result.count;
      const results = sudoRulesQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalSudoRules: SudoRule[] = [];
      for (let i = 0; i < count; i++) {
        const sudoRule = apiToSudoRule(results[i].result);
        avalSudoRules.push(sudoRule);
        items.push({
          key: sudoRule.cn,
          title: sudoRule.cn,
        });
      }
      items = items.filter((item) => !memberof_sudorule.includes(item.key));

      setAvailableSudoRules(avalSudoRules);
      setAvailableItems(items);
    }
  }, [sudoRulesQuery.data, sudoRulesQuery.isFetching]);

  // - Add
  const onAddSudoRule = (items: AvailableItems[]) => {
    const newSudoRuleNames = items.map((item) => item.key);
    if (props.id === undefined || newSudoRuleNames.length == 0) {
      return;
    }

    addMemberToSudoRules([props.id, entityType, newSudoRuleNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "add-member-success",
              "Assigned new Sudo rule to " + entityType + " " + props.id,
              "success"
            );
            // Update displayed Sudo Rules before they are updated via refresh
            const newSudoRules = sudoRules.concat(
              availableSudoRules.filter((sudoRule) =>
                newSudoRuleNames.includes(sudoRule.cn)
              )
            );
            setSudoRules(newSudoRules);

            // Refresh data
            props.onRefreshData();
            // Close modal
            setShowAddModal(false);
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert("add-member-error", errorMessage.message, "danger");
          }
        }
      }
    );
  };

  // - Delete
  const onDeleteSudoRules = () => {
    removeMembersFromSudoRules([props.id, entityType, sudoRulesSelected]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-sudo-rules-success",
              "Removed Sudo rules from " + entityType + " '" + props.id + "'",
              "success"
            );
            // Update displayed HBAC rules
            const newSudoRules = sudoRules.filter(
              (sudoRule) => !sudoRulesSelected.includes(sudoRule.cn)
            );
            setSudoRules(newSudoRules);
            // Update data
            setSudoRulesSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Refresh
            props.onRefreshData();
            // Back to page 1
            setPage(1);
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-sudo-rules-error",
              errorMessage.message,
              "danger"
            );
          }
        }
      }
    );
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
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={someItemSelected}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
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
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddSudoRule}
          onSearchTextChange={setAdderSearchValue}
          title={"Assign Sudo rule to " + entityType + " " + props.id}
          ariaLabel={"Add " + entityType + " of Sudo rule modal"}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete " + entityType + " from Sudo rules"}
          onDelete={onDeleteSudoRules}
        >
          <MemberOfTableSudoRules
            sudoRules={availableSudoRules.filter((sudorule) =>
              sudoRulesSelected.includes(sudorule.cn)
            )}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MemberOfSudoRules;
