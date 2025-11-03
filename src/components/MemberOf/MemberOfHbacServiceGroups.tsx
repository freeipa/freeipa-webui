import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import {
  HBACService,
  HBACServiceGroup,
} from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberTable from "src/components/tables/MembershipTable";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useGettingHbacServiceGroupQuery,
  useAddToHbacServiceGroupsMutation,
  useRemoveFromHbacServiceGroupsMutation,
  useGetHbacServiceGroupInfoByNameQuery,
} from "src/services/rpcHBACSvcGroups";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToHBACServiceGroup } from "src/utils/hbacServiceGrpUtils";

interface MemberOfHbacServicesProps {
  entity: Partial<HBACService>;
  id: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
}

const MemberOfHbacServices = (props: MemberOfHbacServicesProps) => {
  const dispatch = useAppDispatch();

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const [hbacGroupsSelected, setHbacGroupsSelected] = React.useState<string[]>(
    []
  );
  const [hbacGroups, setHbacGroups] = React.useState<HBACServiceGroup[]>([]);
  const memberof_hbacsvcgroup = props.entity.memberof_hbacsvcgroup || [];
  const columnNames = ["HBAC service group", "Description"];
  const properties = ["cn", "description"];

  const getHbacGroupNameToLoad = (): string[] => {
    let toLoad = [...memberof_hbacsvcgroup];
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

  const [hbacGroupNamesToLoad, setHbacGroupNamesToLoad] = React.useState<
    string[]
  >(getHbacGroupNameToLoad());

  // Load HBAC groups
  const fullHbacGroupsQuery = useGetHbacServiceGroupInfoByNameQuery({
    groupNamesList: hbacGroupNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Refresh HBAC groups
  React.useEffect(() => {
    const hbacGroupsNames = getHbacGroupNameToLoad();
    setHbacGroupNamesToLoad(hbacGroupsNames);
  }, [props.entity, searchValue, page, perPage]);

  React.useEffect(() => {
    if (hbacGroupNamesToLoad.length > 0) {
      fullHbacGroupsQuery.refetch();
    }
  }, [hbacGroupNamesToLoad]);

  // Update HBAC svc group
  React.useEffect(() => {
    if (fullHbacGroupsQuery.data && !fullHbacGroupsQuery.isFetching) {
      setHbacGroups(fullHbacGroupsQuery.data);
    }
  }, [fullHbacGroupsQuery.data, fullHbacGroupsQuery.isFetching]);

  // Computed "states"
  const showTableRows = hbacGroups.length > 0;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  // - Refresh
  const isRefreshButtonEnabled =
    !fullHbacGroupsQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled = isRefreshButtonEnabled;

  // Add new member to 'HBAC services'
  // API calls
  const [addMemberToHbacGroups] = useAddToHbacServiceGroupsMutation();
  const [removeMembersFromHbacGroup] = useRemoveFromHbacServiceGroupsMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableHbacGroups, setAvailableHbacGroups] = React.useState<
    HBACServiceGroup[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available HBAC services, delay the search for opening the modal
  const hbacGroupsQuery = useGettingHbacServiceGroupQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available HBAC services search
  React.useEffect(() => {
    if (showAddModal) {
      hbacGroupsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available HBAC services
  React.useEffect(() => {
    if (hbacGroupsQuery.data && !hbacGroupsQuery.isFetching) {
      // transform data to HBAC services
      const count = hbacGroupsQuery.data.result.count;
      const results = hbacGroupsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalHbacGroups: HBACServiceGroup[] = [];
      for (let i = 0; i < count; i++) {
        const hbacgroup = apiToHBACServiceGroup(results[i].result);
        avalHbacGroups.push(hbacgroup);
        items.push({
          key: hbacgroup.cn,
          title: hbacgroup.cn,
        });
      }
      items = items.filter((item) => !memberof_hbacsvcgroup.includes(item.key));

      setAvailableHbacGroups(avalHbacGroups);
      setAvailableItems(items);
    }
  }, [hbacGroupsQuery.data, hbacGroupsQuery.isFetching]);

  // - Add
  const onAddHbacService = (items: AvailableItems[]) => {
    const newHbacServiceNames = items.map((item) => item.key);
    if (props.id === undefined || newHbacServiceNames.length == 0) {
      return;
    }
    setSpinning(true);
    addMemberToHbacGroups([props.id, "hbacsvc", newHbacServiceNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data?.result) {
            if (response.data.result.results[0].error) {
              const errorMessage = response.data.result.results[0]
                .error as string;
              dispatch(
                addAlert({
                  name: "add-member-error",
                  title: errorMessage,
                  variant: "danger",
                })
              );
            } else {
              // Set alert: success
              dispatch(
                addAlert({
                  name: "add-member-success",
                  title: `Assigned '${props.id}' to HBAC service groups`,
                  variant: "success",
                })
              );
            }
            // Refresh data
            props.onRefreshData();
            // Close modal
            setShowAddModal(false);
          } else if (response.data?.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            dispatch(
              addAlert({
                name: "add-member-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
          }
        }
        setSpinning(false);
      }
    );
  };

  // - Delete
  const onDeleteHbacServices = () => {
    setSpinning(true);
    removeMembersFromHbacGroup([props.id, "hbacsvc", hbacGroupsSelected]).then(
      (response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Set alert: success
            dispatch(
              addAlert({
                name: "remove-hbac-services-success",
                title: `Removed '${props.id}' from HBAC service groups`,
                variant: "success",
              })
            );
            // Refresh
            props.onRefreshData();
            // Reset delete button
            setHbacGroupsSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Back to page 1
            setPage(1);
          } else if (response.data?.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            dispatch(
              addAlert({
                name: "remove-hbac-services-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
          }
          setSpinning(false);
        }
      }
    );
  };

  return (
    <>
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        onSearch={() => {}}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={hbacGroupsSelected.length > 0}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        totalItems={memberof_hbacsvcgroup.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={hbacGroups}
        idKey="cn"
        from="hbac-services"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={hbacGroupsSelected}
        onCheckItemsChange={setHbacGroupsSelected}
        showTableRows={showTableRows}
      />
      {memberof_hbacsvcgroup.length > 0 && (
        <Pagination
          className="pf-v6-u-pb-0 pf-v6-u-pr-md"
          itemCount={memberof_hbacsvcgroup.length}
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
        onAdd={onAddHbacService}
        onSearchTextChange={setAdderSearchValue}
        title={`Add '${props.id}' to HBAC service groups`}
        ariaLabel={"Add HBAC service group member modal"}
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove '${props.id}' from HBAC service groups`}
        onDelete={onDeleteHbacServices}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableHbacGroups.filter((group) =>
            hbacGroupsSelected.includes(group.cn)
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

export default MemberOfHbacServices;
