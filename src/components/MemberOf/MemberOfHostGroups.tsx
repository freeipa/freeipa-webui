import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { Host, HostGroup } from "src/utils/datatypes/globalDataTypes";
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
  useAddToHostGroupsMutation,
  useGetHostGroupInfoByNameQuery,
  useGettingHostGroupsQuery,
  useRemoveFromHostGroupsMutation,
} from "src/services/rpcHostGroups";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToHostGroup } from "src/utils/hostGroupUtils";

interface MemberOfHostGroupsProps {
  entity: Partial<Host> | Partial<HostGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
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
  const [indirectHostGroupsSelected, setIndirectHostGroupsSelected] =
    React.useState<string[]>([]);

  // Loaded Host groups based on paging and member attributes
  const [hostGroups, setHostGroups] = React.useState<HostGroup[]>([]);

  // Choose the correct Host groups based on the membership direction
  const memberof_hostgroup = props.entity.memberof_hostgroup || [];
  const memberofindirect_hostgroup =
    props.entity.memberofindirect_hostgroup || [];
  let hostGroupNames =
    membershipDirection === "direct"
      ? memberof_hostgroup
      : memberofindirect_hostgroup;
  hostGroupNames = [...hostGroupNames];

  const columnNames = ["Host group name", "Description"];
  const properties = ["cn", "description"];

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
    props.setDirection(membershipDirection);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (hostGroupNamesToLoad.length > 0) {
      fullHostGroupsQuery.refetch();
    }
  }, [hostGroupNamesToLoad]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entity]);

  // Update host groups
  React.useEffect(() => {
    if (fullHostGroupsQuery.data && !fullHostGroupsQuery.isFetching) {
      setHostGroups(fullHostGroupsQuery.data);
    }
  }, [fullHostGroupsQuery.data, fullHostGroupsQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "hosts") {
      return "host";
    } else if (props.from === "host-groups") {
      return "hostgroup";
    } else {
      // Return 'user' as default
      return "host";
    }
  };

  // Computed "states"
  const showTableRows = hostGroups.length > 0;
  const entityType = getEntityType();

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullHostGroupsQuery.isFetching && !props.isDataLoading;
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
  }, [showAddModal, adderSearchValue, props.entity]);

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
      items = items.filter(
        (item) =>
          !memberof_hostgroup.includes(item.key) && item.key !== props.id
      );

      setAvailableHostGroups(avalHostGroups);
      setAvailableItems(items);
    }
  }, [hostGroupsQuery.data, hostGroupsQuery.isFetching]);

  // - Add
  const onAddHostGroup = (items: AvailableItems[]) => {
    const newRoleNames = items.map((item) => item.key);
    if (props.id === undefined || newRoleNames.length == 0) {
      return;
    }

    setSpinning(true);
    addMemberToHostGroups([props.id, entityType, newRoleNames]).then(
      (response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "add-member-success",
              `Assigned item(s) to host groups`,
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
      }
    );
  };

  // - Delete
  const onDeleteHostGroup = () => {
    setSpinning(true);
    removeMembersFromHostGroups([
      props.id,
      entityType,
      hostGroupsSelected,
    ]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-host-groups-success",
            `Removed item(s) from host groups`,
            "success"
          );
          // Refresh
          props.onRefreshData();
          // Reset delete button
          setHostGroupsSelected([]);
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
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
            ? hostGroupsSelected.length > 0
            : indirectHostGroupsSelected.length > 0
        }
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
      <MemberTable
        entityList={hostGroups}
        idKey="cn"
        from="host-groups"
        columnNamesToShow={columnNames}
        propertiesToShow={properties}
        checkedItems={
          membershipDirection === "direct"
            ? hostGroupsSelected
            : indirectHostGroupsSelected
        }
        onCheckItemsChange={
          membershipDirection === "direct"
            ? setHostGroupsSelected
            : setIndirectHostGroupsSelected
        }
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
      <MemberOfAddModal
        showModal={showAddModal}
        onCloseModal={() => setShowAddModal(false)}
        availableItems={availableItems}
        onAdd={onAddHostGroup}
        onSearchTextChange={setAdderSearchValue}
        title={`Add '${props.id}' into host groups`}
        ariaLabel="Add host of host group modal"
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={`Remove '${props.id}' from host groups`}
        onDelete={onDeleteHostGroup}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableHostGroups.filter((hostGroup) =>
            membershipDirection === "direct"
              ? hostGroupsSelected.includes(hostGroup.cn)
              : indirectHostGroupsSelected.includes(hostGroup.cn)
          )}
          from="host-groups"
          idKey="cn"
          columnNamesToShow={columnNames}
          propertiesToShow={properties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default MemberOfHostGroups;
