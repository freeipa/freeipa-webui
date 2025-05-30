import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import {
  User,
  Netgroup,
  Host,
  HostGroup,
} from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar from "./MemberOfToolbar";
import MemberTable from "src/components/tables/MembershipTable";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useAddToNetgroupsMutation,
  useGetNetgroupInfoByNameQuery,
  useGettingNetgroupsQuery,
  useRemoveFromNetgroupsMutation,
} from "src/services/rpcNetgroups";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToNetgroup } from "src/utils/netgroupsUtils";
// Modals
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";
import MemberOfDeleteModal from "./MemberOfDeleteModal";

interface MemberOfNetgroupsProps {
  entity: Partial<User> | Partial<Host> | Partial<HostGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  membershipDisabled?: boolean;
  setDirection?: (direction: MembershipDirection) => void;
  direction?: MembershipDirection;
}

const memberOfNetgroups = (props: MemberOfNetgroupsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const membershipDisabled =
    props.membershipDisabled === undefined ? false : props.membershipDisabled;

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
  const [netgroupsSelected, setNetgroupsSelected] = React.useState<string[]>(
    []
  );
  const [indirectNetgroupsSelected, setIndirectNetgroupsSelected] =
    React.useState<string[]>([]);

  // Loaded netgroups based on paging and member attributes
  const [netgroups, setNetgroups] = React.useState<Netgroup[]>([]);

  // Choose the correct netgroups based on the membership direction
  const memberof_netgroup = props.entity.memberof_netgroup || [];
  const memberofindirect_netgroup =
    "memberofindirect_netgroup" in props.entity
      ? (props.entity.memberofindirect_netgroup as string[])
      : [];
  let netgroupNames =
    membershipDirection === "direct"
      ? memberof_netgroup
      : memberofindirect_netgroup;
  netgroupNames = [...netgroupNames];

  const columnNames = ["Netgroup name", "Description"];
  const properties = ["cn", "description"];

  const getNetgroupsNameToLoad = (): string[] => {
    let toLoad = [...netgroupNames];
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

  const [netgroupNamesToLoad, setNetgroupNamesToLoad] = React.useState<
    string[]
  >(getNetgroupsNameToLoad());

  // Load netgroups
  const fullNetgroupsQuery = useGetNetgroupInfoByNameQuery({
    netgroupNamesList: netgroupNamesToLoad,
    no_members: true,
    version: API_VERSION_BACKUP,
  });

  // Refresh netgroups
  React.useEffect(() => {
    const netgroupsNames = getNetgroupsNameToLoad();
    setNetgroupNamesToLoad(netgroupsNames);
    if (props.setDirection) {
      props.setDirection(membershipDirection);
    }
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (netgroupNamesToLoad.length > 0) {
      fullNetgroupsQuery.refetch();
    }
  }, [netgroupNamesToLoad]);

  React.useEffect(() => {
    if (props.direction) {
      setMembershipDirection(props.direction);
    }
  }, [props.entity]);

  // Update netgroups
  React.useEffect(() => {
    if (fullNetgroupsQuery.data && !fullNetgroupsQuery.isFetching) {
      setNetgroups(fullNetgroupsQuery.data);
    }
  }, [fullNetgroupsQuery.data, fullNetgroupsQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "active-users") {
      return "user";
    } else if (props.from === "hosts") {
      return "host";
    } else if (props.from === "user-groups") {
      return "group";
    } else if (props.from === "host-groups") {
      return "hostgroup";
    } else if (props.from === "netgroups") {
      return "netgroup";
    } else {
      // Return 'user' as default
      return "user";
    }
  };

  // Computed "states"
  const showTableRows = netgroups.length > 0;
  const entityType = getEntityType();

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullNetgroupsQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'Netgroup'
  // API calls
  const [addMemberToNetgroups] = useAddToNetgroupsMutation();
  const [removeMembersFromNetgroups] = useRemoveFromNetgroupsMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableNetgroups, setAvailableNetgroups] = React.useState<
    Netgroup[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available netgroups, delay the search for opening the modal
  const netgroupsQuery = useGettingNetgroupsQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available netgroups search
  React.useEffect(() => {
    if (showAddModal) {
      netgroupsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available netgroups
  React.useEffect(() => {
    if (netgroupsQuery.data && !netgroupsQuery.isFetching) {
      // transform data to netgroups
      const count = netgroupsQuery.data.result.count;
      const results = netgroupsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalNetgroups: Netgroup[] = [];
      for (let i = 0; i < count; i++) {
        const netgroup = apiToNetgroup(results[i].result);
        avalNetgroups.push(netgroup);
        items.push({
          key: netgroup.cn,
          title: netgroup.cn,
        });
      }
      items = items.filter(
        (item) => !memberof_netgroup.includes(item.key) && item.key !== props.id
      );

      setAvailableNetgroups(avalNetgroups);
      setAvailableItems(items);
    }
  }, [netgroupsQuery.data, netgroupsQuery.isFetching]);

  // - Add
  const onAddNetgroup = (items: AvailableItems[]) => {
    const newNetgroupNames = items.map((item) => item.key);
    if (props.id === undefined || newNetgroupNames.length == 0) {
      return;
    }

    setSpinning(true);
    addMemberToNetgroups([props.id, entityType, newNetgroupNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Set alert: success
            alerts.addAlert(
              "add-member-success",
              `Assigned '${props.id}' to netgroups`,
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
      }
    );
  };

  // - Delete
  const onDeleteNetgroup = () => {
    setSpinning(true);
    removeMembersFromNetgroups([props.id, entityType, netgroupsSelected]).then(
      (response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-netgroups-success",
              `Removed '${props.id}' from netgroups`,
              "success"
            );
            // Refresh
            props.onRefreshData();
            // Reset delete button
            setNetgroupsSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Go back to page 1
            setPage(1);
          } else if (response.data?.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-netgroups-error",
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
      {membershipDisabled ? (
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshData}
          deleteButtonEnabled={
            membershipDirection === "direct"
              ? netgroupsSelected.length > 0
              : indirectNetgroupsSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          membershipDirectionEnabled={true}
          membershipDirection={membershipDirection}
          onMembershipDirectionChange={setMembershipDirection}
          helpIconEnabled={true}
          totalItems={netgroupNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      ) : (
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshData}
          deleteButtonEnabled={
            membershipDirection === "direct"
              ? netgroupsSelected.length > 0
              : indirectNetgroupsSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          helpIconEnabled={true}
          totalItems={netgroupNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      )}
      <MemberTable
        entityList={netgroups}
        idKey="cn"
        from="netgroups"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={
          membershipDirection === "direct"
            ? netgroupsSelected
            : indirectNetgroupsSelected
        }
        onCheckItemsChange={
          membershipDirection === "direct"
            ? setNetgroupsSelected
            : setIndirectNetgroupsSelected
        }
        showTableRows={showTableRows}
      />
      {netgroupNames.length > 0 && (
        <Pagination
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          itemCount={netgroupNames.length}
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
        onAdd={onAddNetgroup}
        onSearchTextChange={setAdderSearchValue}
        title={`Add '${props.id}' into netgroups`}
        ariaLabel={"Add " + entityType + " of netgroup modal"}
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove '${props.id}' from netgroups`}
        onDelete={onDeleteNetgroup}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableNetgroups.filter((netgroup) =>
            membershipDirection === "direct"
              ? netgroupsSelected.includes(netgroup.cn)
              : indirectNetgroupsSelected.includes(netgroup.cn)
          )}
          from="netgroups"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default memberOfNetgroups;
