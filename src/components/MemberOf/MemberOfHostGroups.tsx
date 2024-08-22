import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { Host, HostGroup } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberOfHostGroupsTable from "./MemberOfTableHostGroups";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useAddToHostGroupsMutation,
  useGetHostGroupInfoByNameQuery,
  useGettingHostGroupsQuery,
  useRemoveFromHostGroupsMutation,
} from "src/services/rpcHostGroups";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToHostGroup } from "src/utils/hostGroupUtils";

interface MemberOfHostGroupsProps {
  host: Partial<Host>;
  isHostDataLoading: boolean;
  onRefreshHostData: () => void;
}

const MemberOfHostGroups = (props: MemberOfHostGroupsProps) => {
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
  const [hostGroupsSelected, setHostGroupsSelected] = React.useState<string[]>(
    []
  );

  // Loaded Host groups based on paging and member attributes
  const [hostGroups, setHostGroups] = React.useState<HostGroup[]>([]);

  // Choose the correct Host groups based on the membership direction
  const memberof_hostgroup = props.host.memberof_hostgroup || [];
  const memberofindirect_hostgroup =
    props.host.memberofindirect_hostgroup || [];
  let hostGroupNames =
    membershipDirection === "direct"
      ? memberof_hostgroup
      : memberofindirect_hostgroup;
  hostGroupNames = [...hostGroupNames];

  const getHostGroupsNameToLoad = (): string[] => {
    let toLoad = [...hostGroupNames];
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

  const [hostGroupNamesToLoad, setHostGroupNamesToLoad] = React.useState<
    string[]
  >(getHostGroupsNameToLoad());

  // Load Host groups
  const fullHostGroupsQuery = useGetHostGroupInfoByNameQuery({
    groupNamesList: hostGroupNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Refresh host groups
  React.useEffect(() => {
    const hostGroupsNames = getHostGroupsNameToLoad();
    setHostGroupNamesToLoad(hostGroupsNames);
  }, [props.host, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (hostGroupNamesToLoad.length > 0) {
      fullHostGroupsQuery.refetch();
    }
  }, [hostGroupNamesToLoad]);

  // Update host groups
  React.useEffect(() => {
    if (fullHostGroupsQuery.data && !fullHostGroupsQuery.isFetching) {
      setHostGroups(fullHostGroupsQuery.data);
    }
  }, [fullHostGroupsQuery.data, fullHostGroupsQuery.isFetching]);

  // Computed "states"
  const someItemSelected = hostGroupsSelected.length > 0;
  const showTableRows = hostGroups.length > 0;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullHostGroupsQuery.isFetching && !props.isHostDataLoading;
  const isDeleteEnabled =
    someItemSelected && membershipDirection !== "indirect";
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'Host groups'
  // API calls
  const [addMemberToHostGroups] = useAddToHostGroupsMutation();
  const [removeMembersFromHostGroups] = useRemoveFromHostGroupsMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableHostGroups, setAvailableHostGroups] = React.useState<
    HostGroup[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available Host groups
  const hostGroupsQuery = useGettingHostGroupsQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available Host groups search
  React.useEffect(() => {
    if (showAddModal) {
      hostGroupsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.host]);

  // Update available Host groups
  React.useEffect(() => {
    if (hostGroupsQuery.data && !hostGroupsQuery.isFetching) {
      // transform data to Host groups
      const count = hostGroupsQuery.data.result.count;
      const results = hostGroupsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalHostGroups: HostGroup[] = [];
      for (let i = 0; i < count; i++) {
        const userGroup = apiToHostGroup(results[i].result);
        avalHostGroups.push(userGroup);
        items.push({
          key: userGroup.cn,
          title: userGroup.cn,
        });
      }
      items = items.filter((item) => !memberof_hostgroup.includes(item.key));

      setAvailableHostGroups(avalHostGroups);
      setAvailableItems(items);
    }
  }, [hostGroupsQuery.data, hostGroupsQuery.isFetching]);

  // - Add
  const onAddHostGroup = (items: AvailableItems[]) => {
    const fqdn = props.host.fqdn;
    const newHostGroupNames = items.map((item) => item.key);
    if (fqdn === undefined || newHostGroupNames.length == 0) {
      return;
    }

    setSpinning(true);
    addMemberToHostGroups([fqdn, "host", newHostGroupNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "add-member-success",
              `Assigned '${fqdn}' to host groups`,
              "success"
            );
            // Refresh data
            props.onRefreshHostData();
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
  const onDeleteHostGroup = () => {
    if (props.host.fqdn) {
      setSpinning(true);
      removeMembersFromHostGroups([
        props.host.fqdn,
        "host",
        hostGroupsSelected,
      ]).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-host-groups-success",
              `Removed '${props.host.fqdn}' from host groups`,
              "success"
            );
            // Refresh
            props.onRefreshHostData();
            // Reset delete button
            setHostGroupsSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Return to first page
            setPage(1);
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-host-groups-error",
              errorMessage.message,
              "danger"
            );
          }
        }
        setSpinning(false);
      });
    }
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
        onRefreshButtonClick={props.onRefreshHostData}
        deleteButtonEnabled={isDeleteEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={hostGroupNames.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfHostGroupsTable
        hostGroups={hostGroups}
        checkedItems={hostGroupsSelected}
        onCheckItemsChange={setHostGroupsSelected}
        showTableRows={showTableRows}
      />
      {hostGroupNames.length > 0 && (
        <Pagination
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          itemCount={hostGroupNames.length}
          widgetId="pagination-options-menu-bottom"
          perPage={perPage}
          page={page}
          variant={PaginationVariant.bottom}
          onSetPage={(_e, page) => setPage(page)}
          onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
        />
      )}
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddHostGroup}
          onSearchTextChange={setAdderSearchValue}
          title={`Add '${props.host.fqdn}' into host groups`}
          ariaLabel="Add host of host group modal"
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={`Remove '${props.host.fqdn}' from host groups`}
          onDelete={onDeleteHostGroup}
          spinning={spinning}
        >
          <MemberOfHostGroupsTable
            hostGroups={availableHostGroups.filter((hostgroup) =>
              hostGroupsSelected.includes(hostgroup.cn)
            )}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MemberOfHostGroups;
