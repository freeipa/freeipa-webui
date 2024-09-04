import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, SudoRule, Host } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberTable from "src/components/tables/MembershipTable";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
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
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
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
  const [indirectSudoRulesSelected, setIndirectSudoRulesSelected] =
    React.useState<string[]>([]);

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

  const columnNames = ["Sudo rule", "Status", "Description"];
  const properties = ["cn", "ipaenabledflag", "description"];

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
    props.setDirection(membershipDirection);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (sudoRulesNamesToLoad.length > 0) {
      fullSudoRulesQuery.refetch();
    }
  }, [sudoRulesNamesToLoad]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entity]);

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
    } else if (props.from === "user-groups") {
      return "group";
    } else {
      // Return 'user' as default
      return "user";
    }
  };

  // Computed "states"
  const showTableRows = sudoRules.length > 0;
  const entityType = getEntityType();

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

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

    setSpinning(true);
    addMemberToSudoRules([props.id, entityType, newSudoRuleNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "add-member-success",
              `Assigned '${props.id}' to sudo rules`,
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
        setSpinning(false);
      }
    );
  };

  // - Delete
  const onDeleteSudoRules = () => {
    setSpinning(true);
    removeMembersFromSudoRules([props.id, entityType, sudoRulesSelected]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-sudo-rules-success",
              `Removed '${props.id}' from sudo rules'`,
              "success"
            );
            // Refresh
            props.onRefreshData();
            // Reset delete button
            setSudoRulesSelected([]);
            // Close modal
            setShowDeleteModal(false);
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
        setSpinning(false);
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
        deleteButtonEnabled={
          membershipDirection === "direct"
            ? sudoRulesSelected.length > 0
            : indirectSudoRulesSelected.length > 0
        }
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
      <MemberTable
        entityList={sudoRules}
        idKey="cn"
        from="sudo-rules"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={
          membershipDirection === "direct"
            ? sudoRulesSelected
            : indirectSudoRulesSelected
        }
        onCheckItemsChange={
          membershipDirection === "direct"
            ? setSudoRulesSelected
            : setIndirectSudoRulesSelected
        }
        showTableRows={showTableRows}
      />
      {sudoRuleNames.length > 0 && (
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
      )}
      <MemberOfAddModal
        showModal={showAddModal}
        onCloseModal={() => setShowAddModal(false)}
        availableItems={availableItems}
        onAdd={onAddSudoRule}
        onSearchTextChange={setAdderSearchValue}
        title={`Add '${props.id}' into sudo rules`}
        ariaLabel={"Add " + entityType + " of Sudo rule modal"}
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove '${props.id}' from sudo rules`}
        onDelete={onDeleteSudoRules}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableSudoRules.filter((rule) =>
            membershipDirection === "direct"
              ? sudoRulesSelected.includes(rule.cn)
              : indirectSudoRulesSelected.includes(rule.cn)
          )}
          from="sudo-rules"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default MemberOfSudoRules;
