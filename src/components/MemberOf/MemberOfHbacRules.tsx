import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import {
  User,
  HBACRule,
  Host,
  HostGroup,
} from "src/utils/datatypes/globalDataTypes";
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
import { ErrorResult } from "src/services/rpc";
import {
  useGetHbacRulesInfoByNameQuery,
  useGettingHbacRulesQuery,
  useAddToHbacRulesMutation,
  useRemoveFromHbacRulesMutation,
} from "src/services/rpcHBACRules";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToHBACRule } from "src/utils/hbacRulesUtils";

interface MemberOfHbacRulesProps {
  entity: Partial<User> | Partial<Host> | Partial<HostGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
}

const MemberOfHbacRules = (props: MemberOfHbacRulesProps) => {
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
  const [hbacRulesSelected, setHbacRulesSelected] = React.useState<string[]>(
    []
  );
  const [indirectHbacRulesSelected, setIndirectHbacRulesSelected] =
    React.useState<string[]>([]);

  // Loaded HBAC rules based on paging and member attributes
  const [hbacRules, setHbacRules] = React.useState<HBACRule[]>([]);

  const memberof_hbacrule = props.entity.memberof_hbacrule || [];
  const memberofindirect_hbacrule =
    props.entity.memberofindirect_hbacrule || [];

  let hbacRuleNames =
    membershipDirection === "direct"
      ? memberof_hbacrule
      : memberofindirect_hbacrule;
  hbacRuleNames = [...hbacRuleNames];

  const columnNames = ["HBAC rule", "Status", "Description"];
  const properties = ["cn", "ipaenabledflag", "description"];

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

  // Refresh HBAC rules
  React.useEffect(() => {
    const hbacRulesNames = getHbacRulesNameToLoad();
    setHbacRulesNamesToLoad(hbacRulesNames);
    props.setDirection(membershipDirection);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (hbacRulesNamesToLoad.length > 0) {
      fullHbacRulesQuery.refetch();
    }
  }, [hbacRulesNamesToLoad]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entity]);

  // Update HBAC rules
  React.useEffect(() => {
    if (fullHbacRulesQuery.data && !fullHbacRulesQuery.isFetching) {
      setHbacRules(fullHbacRulesQuery.data);
    }
  }, [fullHbacRulesQuery.data, fullHbacRulesQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "active-users") {
      return "user";
    } else if (props.from === "hosts") {
      return "host";
    } else if (props.from === "host-groups") {
      return "hostgroup";
    } else if (props.from === "user-groups") {
      return "group";
    } else {
      // Return 'user' as default
      return "user";
    }
  };

  // Computed "states"
  const showTableRows = hbacRules.length > 0;
  const entityType = getEntityType();

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  // - Refresh
  const isRefreshButtonEnabled =
    !fullHbacRulesQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'HBAC rules'
  // API calls
  const [addMemberToHbacRules] = useAddToHbacRulesMutation();
  const [removeMembersFromHbacRules] = useRemoveFromHbacRulesMutation();
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
  }, [showAddModal, adderSearchValue, props.entity]);

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
      items = items.filter((item) => !memberof_hbacrule.includes(item.key));

      setAvailableHbacRules(avalHbacRules);
      setAvailableItems(items);
    }
  }, [hbacRulesQuery.data, hbacRulesQuery.isFetching]);

  // - Add
  const onAddHbacRule = (items: AvailableItems[]) => {
    const newHbacRuleNames = items.map((item) => item.key);
    if (props.id === undefined || newHbacRuleNames.length == 0) {
      return;
    }
    setSpinning(true);
    addMemberToHbacRules([props.id, entityType, newHbacRuleNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            if (response.data.result.results[0].error) {
              const errorMessage = response.data.result.results[0]
                .error as string;
              alerts.addAlert("add-member-error", errorMessage, "danger");
            } else {
              // Set alert: success
              alerts.addAlert(
                "add-member-success",
                `Assigned '${props.id}' to HBAC rules`,
                "success"
              );
            }
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
  const onDeleteHbacRules = () => {
    setSpinning(true);
    removeMembersFromHbacRules([props.id, entityType, hbacRulesSelected]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-hbac-rules-success",
              `Removed '${props.id}' from HBAC rules`,
              "success"
            );
            // Refresh
            props.onRefreshData();
            // Reset delete button
            setHbacRulesSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Back to page 1
            setPage(1);
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-hbac-rules-error",
              errorMessage.message,
              "danger"
            );
          }
          setSpinning(false);
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
        deleteButtonEnabled={
          membershipDirection === "direct"
            ? hbacRulesSelected.length > 0
            : indirectHbacRulesSelected.length > 0
        }
        onDeleteButtonClick={() => setShowDeleteModal(true)}
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
      <MemberTable
        entityList={hbacRules}
        idKey="cn"
        from="hbac-rules"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={
          membershipDirection === "direct"
            ? hbacRulesSelected
            : indirectHbacRulesSelected
        }
        onCheckItemsChange={
          membershipDirection === "direct"
            ? setHbacRulesSelected
            : setIndirectHbacRulesSelected
        }
        showTableRows={showTableRows}
      />
      {hbacRuleNames.length > 0 && (
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
      )}
      <MemberOfAddModal
        showModal={showAddModal}
        onCloseModal={() => setShowAddModal(false)}
        availableItems={availableItems}
        onAdd={onAddHbacRule}
        onSearchTextChange={setAdderSearchValue}
        title={`Add '${props.id}' into HBAC rules`}
        ariaLabel={"Add HBAC rule modal"}
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove '${props.id}' from HBAC rules`}
        onDelete={onDeleteHbacRules}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableHbacRules.filter((rule) =>
            membershipDirection === "direct"
              ? hbacRulesSelected.includes(rule.cn)
              : indirectHbacRulesSelected.includes(rule.cn)
          )}
          from="hbac-rules"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default MemberOfHbacRules;
