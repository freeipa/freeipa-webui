import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { SudoCmd, SudoCmdGroup } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberTable from "src/components/tables/MembershipTable";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useGettingSudoCmdGroupsQuery,
  useAddToSudoCmdGroupsMutation,
  useRemoveFromSudoCmdGroupsMutation,
  useGetSudoCmdGroupsInfoByNameQuery,
} from "src/services/rpcSudoCmdGroups";

// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToSudoCmdGroup } from "src/utils/sudoCmdGroupsUtils";

interface MemberOfSudoCmdGroupsProps {
  entity: Partial<SudoCmd>;
  id: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
}

const MemberOfSudoCmdGroups = (props: MemberOfSudoCmdGroupsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const [sudoGroupsSelected, setSudoGroupsSelected] = React.useState<string[]>(
    []
  );
  const [sudoGroups, setSudoGroups] = React.useState<SudoCmdGroup[]>([]);
  const memberof_sudocmdgroup = props.entity.memberof_sudocmdgroup || [];
  const columnNames = ["Sudo command group", "Description"];
  const properties = ["cn", "description"];

  const getSudoGroupNameToLoad = (): string[] => {
    let toLoad = [...memberof_sudocmdgroup];
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

  const [sudoGroupNamesToLoad, setSudoGroupNamesToLoad] = React.useState<
    string[]
  >(getSudoGroupNameToLoad());

  // Load Sudo groups
  const fullSudoGroupsQuery = useGetSudoCmdGroupsInfoByNameQuery({
    sudoCmdNamesList: sudoGroupNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Refresh Sudo groups
  React.useEffect(() => {
    const sudoGroupsNames = getSudoGroupNameToLoad();
    setSudoGroupNamesToLoad(sudoGroupsNames);
  }, [props.entity, searchValue, page, perPage]);

  React.useEffect(() => {
    if (sudoGroupNamesToLoad.length > 0) {
      fullSudoGroupsQuery.refetch();
    }
  }, [sudoGroupNamesToLoad]);

  // Update Sudo group
  React.useEffect(() => {
    if (fullSudoGroupsQuery.data && !fullSudoGroupsQuery.isFetching) {
      setSudoGroups(fullSudoGroupsQuery.data);
    }
  }, [fullSudoGroupsQuery.data, fullSudoGroupsQuery.isFetching]);

  // Computed "states"
  const showTableRows = sudoGroups.length > 0;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  // - Refresh
  const isRefreshButtonEnabled =
    !fullSudoGroupsQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // API calls
  const [addMemberToSudoGroups] = useAddToSudoCmdGroupsMutation();
  const [removeMembersFromSudoGroup] = useRemoveFromSudoCmdGroupsMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableSudoGroups, setAvailableSudoGroups] = React.useState<
    SudoCmdGroup[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available Sudo groups
  const sudoGroupsQuery = useGettingSudoCmdGroupsQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available Sudo group search
  React.useEffect(() => {
    if (showAddModal) {
      sudoGroupsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available Sudo groups
  React.useEffect(() => {
    if (sudoGroupsQuery.data && !sudoGroupsQuery.isFetching) {
      // transform data to Sudo groups
      const count = sudoGroupsQuery.data.result.count;
      const results = sudoGroupsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalSudoGroups: SudoCmdGroup[] = [];
      for (let i = 0; i < count; i++) {
        const sudogroup = apiToSudoCmdGroup(results[i].result);
        avalSudoGroups.push(sudogroup);
        items.push({
          key: sudogroup.cn,
          title: sudogroup.cn,
        });
      }
      items = items.filter((item) => !memberof_sudocmdgroup.includes(item.key));

      setAvailableSudoGroups(avalSudoGroups);
      setAvailableItems(items);
    }
  }, [sudoGroupsQuery.data, sudoGroupsQuery.isFetching]);

  // - Add
  const onAddSudoCommand = (items: AvailableItems[]) => {
    const newSudoCommandNames = items.map((item) => item.key);
    if (props.id === undefined || newSudoCommandNames.length == 0) {
      return;
    }
    setSpinning(true);
    addMemberToSudoGroups([props.id, "sudocmd", newSudoCommandNames]).then(
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
                `Assigned '${props.id}' to Sudo command groups`,
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
  const onDeleteSudoCmdGroups = () => {
    setSpinning(true);
    removeMembersFromSudoGroup([props.id, "sudocmd", sudoGroupsSelected]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-sudo-cmds-success",
              `Removed '${props.id}' from Sudo command groups`,
              "success"
            );
            // Refresh
            props.onRefreshData();
            // Reset delete button
            setSudoGroupsSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Back to page 1
            setPage(1);
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-sudo-cmds-error",
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
        deleteButtonEnabled={sudoGroupsSelected.length > 0}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        totalItems={memberof_sudocmdgroup.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={sudoGroups}
        idKey="cn"
        from="sudo-commands"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={sudoGroupsSelected}
        onCheckItemsChange={setSudoGroupsSelected}
        showTableRows={showTableRows}
      />
      {memberof_sudocmdgroup.length > 0 && (
        <Pagination
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          itemCount={memberof_sudocmdgroup.length}
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
        onAdd={onAddSudoCommand}
        onSearchTextChange={setAdderSearchValue}
        title={`Add '${props.id}' to Sudo command groups`}
        ariaLabel={"Add Sudo cmd group member modal"}
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove '${props.id}' from Sudo command groups`}
        onDelete={onDeleteSudoCmdGroups}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableSudoGroups.filter((group) =>
            sudoGroupsSelected.includes(group.cn)
          )}
          from="sudo-commands"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default MemberOfSudoCmdGroups;
