import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "src/components/tables/MembershipTable"; // Data types
import {
  HBACService,
  HBACServiceGroup,
} from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
// RPC
import { ErrorResult, MemberPayload } from "src/services/rpc";
import {
  useGetHBACServicesInfoByNameQuery,
  useGettingHbacServicesQuery,
} from "src/services/rpcHBACServices";
import {
  useAddMembersToHbacSvcGroupMutation,
  useRemoveMembersFromHbacSvcGroupMutation,
} from "src/services/rpcHBACSvcGroups";

import { apiToHBACService } from "src/utils/hbacServicesUtils";

interface PropsToMembersHBACServices {
  entity: Partial<HBACServiceGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_hbacsvc: string[];
}

const MembersHBACServices = (props: PropsToMembersHBACServices) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Get parameters from URL
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Other states
  const [membersSelected, setMembersSelected] = React.useState<string[]>([]);

  // Loaded members based on paging and member attributes
  const [members, setMembers] = React.useState<HBACService[]>([]);

  const getServicesNameToLoad = (): string[] => {
    let toLoad = [...props.member_hbacsvc];
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

  const [memberNamesToLoad, setMemberNamesToLoad] = React.useState<string[]>(
    getServicesNameToLoad()
  );

  // Load services
  const fullServicesQuery = useGetHBACServicesInfoByNameQuery({
    serviceNamesList: memberNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Refresh services
  React.useEffect(() => {
    const serviceNames = getServicesNameToLoad();
    setMemberNamesToLoad(serviceNames);
  }, [props.entity, searchValue, page, perPage]);

  React.useEffect(() => {
    if (memberNamesToLoad.length > 0) {
      fullServicesQuery.refetch();
    }
  }, [memberNamesToLoad]);

  React.useEffect(() => {
    if (fullServicesQuery.data && !fullServicesQuery.isFetching) {
      setMembers(fullServicesQuery.data);
    }
  }, [fullServicesQuery.data, fullServicesQuery.isFetching]);

  // Computed "states"
  const showTableRows = members.length > 0;
  const columnNames = ["HBAC Service", "Description"];
  const properties = ["cn", "description"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullServicesQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // API calls
  const [addMembers] = useAddMembersToHbacSvcGroupMutation();
  const [removeMembers] = useRemoveMembersFromHbacSvcGroupMutation();

  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableServices, setAvailableServices] = React.useState<
    HBACService[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available services, delay the search for opening the modal
  const servicesQuery = useGettingHbacServicesQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available services search
  React.useEffect(() => {
    if (showAddModal) {
      servicesQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available services
  React.useEffect(() => {
    if (servicesQuery.data && !servicesQuery.isFetching) {
      // transform data
      const count = servicesQuery.data.result.count;
      const results = servicesQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalServices: HBACService[] = [];
      for (let i = 0; i < count; i++) {
        const service = apiToHBACService(results[i].result);
        avalServices.push(service);
        items.push({
          key: service.cn,
          title: service.cn,
        });
      }
      items = items.filter(
        (item) =>
          !props.member_hbacsvc.includes(item.key) && item.key !== props.id
      );

      setAvailableServices(avalServices);
      setAvailableItems(items);
    }
  }, [servicesQuery.data, servicesQuery.isFetching]);

  // Add
  const onAddMember = (items: AvailableItems[]) => {
    const newMemberNames = items.map((item) => item.key);
    if (props.id === undefined || newMemberNames.length == 0) {
      return;
    }

    const payload = {
      entryName: props.id,
      entityType: "hbacsvc",
      idsToAdd: newMemberNames,
    } as MemberPayload;

    setSpinning(true);
    addMembers(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new HBAC service members to '" + props.id + "'",
            "success"
          );
          // Refresh data
          props.onRefreshData();
          // Close modal
          setShowAddModal(false);
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("add-member-error", errorMessage.message, "danger");
        }
      }
      setSpinning(false);
    });
  };

  // Delete
  const onDeleteMembers = () => {
    const payload = {
      entryName: props.id,
      entityType: "hbacsvc",
      idsToAdd: membersSelected,
    } as MemberPayload;

    setSpinning(true);
    removeMembers(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-members-success",
            "Removed HBAC service members from '" + props.id + "'",
            "success"
          );
          // Refresh
          props.onRefreshData();
          // Disable 'remove' button
          setMembersSelected([]);
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
          setPage(1);
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert(
            "remove-members-error",
            errorMessage.message,
            "danger"
          );
        }
      }
      setSpinning(false);
    });
  };

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        onSearch={() => {}}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={membersSelected.length > 0}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        totalItems={props.member_hbacsvc.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={members}
        idKey="cn"
        from="hbac-services"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={membersSelected}
        onCheckItemsChange={setMembersSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={props.member_hbacsvc.length}
        widgetId="pagination-options-menu-bottom"
        perPage={perPage}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={(_e, page) => setPage(page)}
        onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
      />
      <MemberOfAddModal
        showModal={showAddModal}
        onCloseModal={() => setShowAddModal(false)}
        availableItems={availableItems}
        onAdd={onAddMember}
        onSearchTextChange={setAdderSearchValue}
        title={"Assign HBAC service members to: " + props.id}
        ariaLabel={"Add mHBAC service members modal"}
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={"Delete HBAC service members from: " + props.id}
        onDelete={onDeleteMembers}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableServices.filter((service) =>
            membersSelected.includes(service.cn)
          )}
          from="hbac-services"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default MembersHBACServices;
