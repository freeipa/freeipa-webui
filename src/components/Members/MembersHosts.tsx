import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// Data types
import { Host, HostGroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useGetHostInfoByNameQuery,
  useGettingHostQuery,
} from "src/services/rpcHosts";
import {
  MemberPayload,
  useAddAsMemberHGMutation,
  useRemoveAsMemberHGMutation,
} from "src/services/rpcHostGroups";
import { apiToHost } from "src/utils/hostUtils";

interface PropsToMembersHosts {
  entity: Partial<HostGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_host: string[];
  memberindirect_host?: string[];
  membershipDisabled?: boolean;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
}

const MembersHosts = (props: PropsToMembersHosts) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const membershipDisabled =
    props.membershipDisabled === undefined ? false : props.membershipDisabled;

  // Get parameters from URL
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
  const [hostsSelected, setHostsSelected] = React.useState<string[]>([]);
  const [indirectHostsSelected, setIndirectHostsSelected] = React.useState<
    string[]
  >([]);

  // Loaded hosts based on paging and member attributes
  const [hosts, setHosts] = React.useState<Host[]>([]);

  // Choose the correct entries based on the membership direction
  const member_host = props.member_host || [];
  const memberindirect_host = props.memberindirect_host || [];
  let hostNames =
    membershipDirection === "direct" ? member_host : memberindirect_host;
  hostNames = [...hostNames];

  const getHostsNameToLoad = (): string[] => {
    let toLoad = [...hostNames];
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

  const [hostNamesToLoad, setHostNamesToLoad] = React.useState<string[]>(
    getHostsNameToLoad()
  );

  // Load hosts
  const fullHostsQuery = useGetHostInfoByNameQuery({
    hostNamesList: hostNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Refresh hosts
  React.useEffect(() => {
    const hostsNames = getHostsNameToLoad();
    setHostNamesToLoad(hostsNames);
    props.setDirection(membershipDirection);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entity]);

  React.useEffect(() => {
    if (hostNamesToLoad.length > 0) {
      fullHostsQuery.refetch();
    }
  }, [hostNamesToLoad]);

  React.useEffect(() => {
    if (fullHostsQuery.data && !fullHostsQuery.isFetching) {
      setHosts(fullHostsQuery.data);
    }
  }, [fullHostsQuery.data, fullHostsQuery.isFetching]);

  // Computed "states"
  const someItemSelected = hostsSelected.length > 0;
  const showTableRows = hosts.length > 0;
  const hostColumnNames = ["Host name", "Description"];
  const hostProperties = ["fqdn", "description"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullHostsQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'Host'
  // API calls
  const [addMemberToHostGroups] = useAddAsMemberHGMutation();
  const [removeMembersFromHostGroups] = useRemoveAsMemberHGMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableHosts, setAvailableHosts] = React.useState<Host[]>([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available hosts, delay the search for opening the modal
  const hostsQuery = useGettingHostQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available hosts search
  React.useEffect(() => {
    if (showAddModal) {
      hostsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available hosts
  React.useEffect(() => {
    if (hostsQuery.data && !hostsQuery.isFetching) {
      // transform data
      const count = hostsQuery.data.result.count;
      const results = hostsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalHosts: Host[] = [];
      for (let i = 0; i < count; i++) {
        const host = apiToHost(results[i].result);
        avalHosts.push(host);
        items.push({
          key: host.fqdn,
          title: host.fqdn,
        });
      }
      items = items.filter(
        (item) =>
          !member_host.includes(item.key) &&
          !memberindirect_host.includes(item.key) &&
          item.key !== props.id
      );

      setAvailableHosts(avalHosts);
      setAvailableItems(items);
    }
  }, [hostsQuery.data, hostsQuery.isFetching]);

  // Add
  const onAddHost = (items: AvailableItems[]) => {
    const newHostNames = items.map((item) => item.key);
    if (props.id === undefined || newHostNames.length == 0) {
      return;
    }

    const payload = {
      hostGroup: props.id,
      entityType: "host",
      idsToAdd: newHostNames,
    } as MemberPayload;

    setSpinning(true);
    addMemberToHostGroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new hosts to host group '" + props.id + "'",
            "success"
          );
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
    });
  };

  // Delete
  const onDeleteHosts = () => {
    const payload = {
      hostGroup: props.id,
      entityType: "host",
      idsToAdd: hostsSelected,
    } as MemberPayload;

    setSpinning(true);
    removeMembersFromHostGroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-host-success",
            "Removed hosts from host group '" + props.id + "'",
            "success"
          );
          // Refresh
          props.onRefreshData();
          // Disable 'remove' button
          if (membershipDirection === "direct") {
            setHostsSelected([]);
          } else {
            setIndirectHostsSelected([]);
          }
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
          setPage(1);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("remove-hosts-error", errorMessage.message, "danger");
        }
      }
      setSpinning(false);
    });
  };

  return (
    <>
      <alerts.ManagedAlerts />
      {membershipDisabled ? (
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshData}
          deleteButtonEnabled={
            membershipDirection === "direct"
              ? hostsSelected.length > 0
              : indirectHostsSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          helpIconEnabled={true}
          totalItems={hostNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      ) : (
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshData}
          deleteButtonEnabled={
            membershipDirection === "direct"
              ? hostsSelected.length > 0
              : indirectHostsSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          membershipDirectionEnabled={true}
          membershipDirection={membershipDirection}
          onMembershipDirectionChange={setMembershipDirection}
          helpIconEnabled={true}
          totalItems={hostNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      )}
      <MemberTable
        entityList={hosts}
        idKey="fqdn"
        from="hosts"
        columnNamesToShow={hostColumnNames}
        propertiesToShow={hostProperties}
        checkedItems={
          membershipDirection === "direct"
            ? hostsSelected
            : indirectHostsSelected
        }
        onCheckItemsChange={
          membershipDirection === "direct"
            ? setHostsSelected
            : setIndirectHostsSelected
        }
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={hostNames.length}
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
          onAdd={onAddHost}
          onSearchTextChange={setAdderSearchValue}
          title={"Assign hosts to host group: " + props.id}
          ariaLabel={"Add hosts  modal"}
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete hosts from host group: " + props.id}
          onDelete={onDeleteHosts}
          spinning={spinning}
        >
          <MemberTable
            entityList={availableHosts.filter((host) =>
              membershipDirection === "direct"
                ? hostsSelected.includes(host.fqdn)
                : indirectHostsSelected.includes(host.fqdn)
            )}
            from="hosts"
            idKey="fqdn"
            columnNamesToShow={hostColumnNames}
            propertiesToShow={hostProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MembersHosts;
