import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { Host, Service } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfHostsTable from "./ManagedByTableHosts";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult, FindRPCResponse } from "src/services/rpc";
import {
  useAddToHostsManagedByMutation,
  useGetHostInfoByNameQuery,
  useGettingHostQuery,
  useRemoveFromHostsManagedByMutation,
} from "src/services/rpcHosts";
import {
  ServiceAddRemoveHostPayload,
  useAddServiceHostMutation,
  useRemoveServiceHostMutation,
} from "src/services/rpcServices";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToHost } from "src/utils/hostUtils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface ManagedByHostsProps {
  entity: Partial<Host> | Partial<Service>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
}

const ManagedByHosts = (props: ManagedByHostsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Get parameters from URL
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Other states
  const [hostsSelected, setHostsSelected] = React.useState<string[]>([]);

  // Loaded nhost based on paging and member attributes
  const [hosts, setHosts] = React.useState<Host[]>([]);

  const managedby_host = props.entity.managedby_host || [];

  const getHostsNameToLoad = (): string[] => {
    let toLoad = [...managedby_host];
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
  }, [props.entity, searchValue, page, perPage]);

  React.useEffect(() => {
    if (hostNamesToLoad.length > 0) {
      fullHostsQuery.refetch();
    }
  }, [hostNamesToLoad]);

  // Update hosts
  React.useEffect(() => {
    if (fullHostsQuery.data && !fullHostsQuery.isFetching) {
      setHosts(fullHostsQuery.data);
    }
  }, [fullHostsQuery.data, fullHostsQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "host") {
      return "host";
    } // Add more entity types here.
    // Default is "hosts"
    else {
      return "host";
    }
  };

  // Computed "states"
  const someItemSelected = hostsSelected.length > 0;
  const showTableRows = hosts.length > 0;
  const entityType = getEntityType();

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullHostsQuery.isFetching && !props.isDataLoading;
  const isDeleteEnabled = someItemSelected;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // API calls - From Hosts
  const [addHostsFromHosts] = useAddToHostsManagedByMutation();
  const [removeHostsFromHosts] = useRemoveFromHostsManagedByMutation();

  // API calls - From Services
  const [addHostsFromServices] = useAddServiceHostMutation();
  const [removeHostsFromServices] = useRemoveServiceHostMutation();

  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableHosts, setAvailableHosts] = React.useState<Host[]>([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available Hosts
  const hostsQuery = useGettingHostQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available Hosts search
  React.useEffect(() => {
    if (showAddModal) {
      hostsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available Hosts
  React.useEffect(() => {
    if (hostsQuery.data && !hostsQuery.isFetching) {
      // transform data to Hosts
      const count = hostsQuery.data.result.count;
      const results = hostsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalHosts: Host[] = [];
      for (let i = 0; i < count; i++) {
        const h = apiToHost(results[i].result);
        avalHosts.push(h);
        items.push({
          key: h.fqdn,
          title: h.fqdn,
        });
      }
      items = items.filter((item) => !managedby_host.includes(item.key));

      setAvailableHosts(avalHosts);
      setAvailableItems(items);
    }
  }, [hostsQuery.data, hostsQuery.isFetching]);

  // Handle add response
  const handleAddResponse = (
    response:
      | {
          data: FindRPCResponse;
        }
      | {
          error: FetchBaseQueryError | SerializedError;
        }
  ) => {
    if ("data" in response) {
      if (response.data.result) {
        // Set alert: success
        alerts.addAlert(
          "add-member-success",
          "Assigned " + props.from + " '" + props.id + "' to hosts",
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
  };

  // - Add
  const onAddHost = (items: AvailableItems[]) => {
    const newHostNames = items.map((item) => item.key);
    if (props.id === undefined || newHostNames.length == 0) {
      return;
    }

    if (props.from === "host") {
      addHostsFromHosts([props.id, entityType, newHostNames]).then(
        (response) => {
          handleAddResponse(response);
        }
      );
    } else if (props.from === "service") {
      const payload: ServiceAddRemoveHostPayload = {
        serviceId: props.id,
        hostsList: newHostNames,
      };
      setSpinning(true);
      addHostsFromServices(payload).then((response) => {
        handleAddResponse(response);
      });
    }
  };

  // Handle delete response
  const handleDeleteResponse = (
    response:
      | {
          data: FindRPCResponse;
        }
      | {
          error: FetchBaseQueryError | SerializedError;
        }
  ) => {
    if ("data" in response) {
      if (response.data.result) {
        // Set alert: success
        alerts.addAlert(
          "remove-hosts-success",
          "Removed members from " + props.from + " '" + props.id + "'",
          "success"
        );
        // Refresh
        props.onRefreshData();
        // Reset delete button
        setHostsSelected([]);
        // Close modal
        setShowDeleteModal(false);
      } else if (response.data.error) {
        // Set alert: error
        const errorMessage = response.data.error as unknown as ErrorResult;
        alerts.addAlert("remove-hosts-error", errorMessage.message, "danger");
      }
    }
    setSpinning(false);
  };

  // - Delete
  const onDeleteHost = () => {
    if (props.id === undefined) return;

    if (props.from === "host") {
      setSpinning(true);
      removeHostsFromHosts([props.id, entityType, hostsSelected]).then(
        (response) => {
          handleDeleteResponse(response);
        }
      );
    } else if (props.from === "service") {
      const payload: ServiceAddRemoveHostPayload = {
        serviceId: props.id,
        hostsList: hostsSelected,
      };
      setSpinning(true);
      removeHostsFromServices(payload).then((response) => {
        handleDeleteResponse(response);
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
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={isDeleteEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        totalItems={managedby_host.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfHostsTable
        hosts={hosts}
        checkedItems={hostsSelected}
        onCheckItemsChange={setHostsSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={managedby_host.length}
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
          title={`Assign hosts to user ${props.id}`}
          ariaLabel="Add user of host modal"
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title="Delete user from Hosts"
          onDelete={onDeleteHost}
          spinning={spinning}
        >
          <MemberOfHostsTable
            hosts={availableHosts.filter((host) =>
              hostsSelected.includes(host.fqdn)
            )}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default ManagedByHosts;
