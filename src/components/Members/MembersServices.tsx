import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import MemberOfAddModal, { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "./MemberTable";
// Data types
import { Service, UserGroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToService } from "src/utils/serviceUtils";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useGetServicesInfoByUidQuery,
  useGettingServicesQuery,
} from "src/services/rpcServices";
import {
  MemberPayload,
  useAddAsMemberMutation,
  useRemoveAsMemberMutation,
} from "src/services/rpcUserGroups";

interface PropsToMembersServices {
  entity: Partial<UserGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_service: string[];
  memberindirect_service?: string[];
  membershipDisabled?: boolean;
}

const MembersServices = (props: PropsToMembersServices) => {
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
  const [servicesSelected, setServicesSelected] = React.useState<string[]>([]);

  // Loaded services based on paging and member attributes
  const [services, setServices] = React.useState<Service[]>([]);

  // Choose the correct services based on the membership direction
  const member_service = props.member_service || [];
  const memberindirect_service = props.memberindirect_service || [];
  let serviceNames =
    membershipDirection === "direct" ? member_service : memberindirect_service;
  serviceNames = [...serviceNames];

  const getServicesNameToLoad = (): string[] => {
    let toLoad = [...serviceNames];
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

  const [serviceNamesToLoad, setServiceNamesToLoad] = React.useState<string[]>(
    getServicesNameToLoad()
  );

  // Load services
  const fullServicesQuery = useGetServicesInfoByUidQuery(serviceNamesToLoad);

  // Refresh services
  React.useEffect(() => {
    const servicesNames = getServicesNameToLoad();
    setServiceNamesToLoad(servicesNames);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (serviceNamesToLoad.length > 0) {
      fullServicesQuery.refetch();
    }
  }, [serviceNamesToLoad]);

  // Update services
  React.useEffect(() => {
    if (fullServicesQuery.data && !fullServicesQuery.isFetching) {
      setServices(fullServicesQuery.data);
    }
  }, [fullServicesQuery.data, fullServicesQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "user-groups") {
      return "user group";
    } else {
      // Return 'group' as default
      return "group";
    }
  };

  // Computed "states"
  const someItemSelected = servicesSelected.length > 0;
  const showTableRows = services.length > 0;
  const entityType = getEntityType();
  const serviceColumnNames = ["Principal name"];
  const serviceProperties = ["krbcanonicalname"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullServicesQuery.isFetching && !props.isDataLoading;
  const isDeleteEnabled =
    someItemSelected && membershipDirection !== "indirect";
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'Service'
  // API calls
  const [addMemberToService] = useAddAsMemberMutation();
  const [removeMembersFromServices] = useRemoveAsMemberMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableServices, setAvailableServices] = React.useState<Service[]>(
    []
  );
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available services, delay the search for opening the modal
  const servicesQuery = useGettingServicesQuery({
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
      // transform data to services
      const count = servicesQuery.data.result.count;
      const results = servicesQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalServices: Service[] = [];
      for (let i = 0; i < count; i++) {
        const service = apiToService(results[i].result);
        avalServices.push(service);
        items.push({
          key: service.krbcanonicalname,
          title: service.krbcanonicalname,
        });
      }
      items = items.filter((item) => !member_service.includes(item.key));

      setAvailableServices(avalServices);
      setAvailableItems(items);
    }
  }, [servicesQuery.data, servicesQuery.isFetching]);

  // Add
  const onAddService = (items: AvailableItems[]) => {
    const newServiceNames = items.map((item) => item.key);
    if (props.id === undefined || newServiceNames.length == 0) {
      return;
    }

    const payload = {
      userGroup: props.id,
      entityType: "service",
      idsToAdd: newServiceNames,
    } as MemberPayload;

    setSpinning(true);
    addMemberToService(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new services to " + entityType + " " + props.id,
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
  const onDeleteService = () => {
    const payload = {
      userGroup: props.id,
      entityType: "service",
      idsToAdd: servicesSelected,
    } as MemberPayload;

    setSpinning(true);
    removeMembersFromServices(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-services-success",
            "Removed services from " + entityType + " '" + props.id + "'",
            "success"
          );
          // Refresh
          props.onRefreshData();
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
          setPage(1);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert(
            "remove-services-error",
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
      {membershipDisabled ? (
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
          totalItems={serviceNames.length}
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
          deleteButtonEnabled={isDeleteEnabled}
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          membershipDirectionEnabled={true}
          membershipDirection={membershipDirection}
          onMembershipDirectionChange={setMembershipDirection}
          helpIconEnabled={true}
          totalItems={serviceNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      )}
      <MemberTable
        entityList={services}
        idKey="krbcanonicalname"
        columnNamesToShow={serviceColumnNames}
        propertiesToShow={serviceProperties}
        checkedItems={servicesSelected}
        onCheckItemsChange={setServicesSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={serviceNames.length}
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
          onAdd={onAddService}
          onSearchTextChange={setAdderSearchValue}
          title={"Assign services to " + entityType + " " + props.id}
          ariaLabel={"Add " + entityType + " of service modal"}
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete " + entityType + " from Services"}
          onDelete={onDeleteService}
          spinning={spinning}
        >
          <MemberTable
            entityList={availableServices.filter((service) =>
              servicesSelected.includes(service.krbcanonicalname)
            )}
            idKey="krbcanonicalname"
            columnNamesToShow={serviceColumnNames}
            propertiesToShow={serviceProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MembersServices;
