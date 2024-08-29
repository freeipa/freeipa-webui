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
import { HostGroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  MemberPayload,
  useAddAsMemberHGMutation,
  useGetHostGroupInfoByNameQuery,
  useGettingHostGroupsQuery,
  useRemoveAsMemberHGMutation,
} from "src/services/rpcHostGroups";
import { apiToHostGroup } from "src/utils/hostGroupUtils";

interface PropsToMembersHostGroups {
  entity: Partial<HostGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_hostgroup: string[];
  memberindirect_hostgroup?: string[];
  membershipDisabled?: boolean;
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
}

const MembersHostGroups = (props: PropsToMembersHostGroups) => {
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
  const [hostGroupsSelected, setHostGroupsSelected] = React.useState<string[]>(
    []
  );
  const [indirectHostGroupsSelected, setIndirectHostGroupsSelected] =
    React.useState<string[]>([]);

  // Loaded hostGroups based on paging and member attributes
  const [hostGroups, setHostGroups] = React.useState<HostGroup[]>([]);

  // Choose the correct hostgroups based on the membership direction
  const member_hostgroup = props.member_hostgroup || [];
  const memberindirect_hostgroup = props.memberindirect_hostgroup || [];
  let hostGroupNames =
    membershipDirection === "direct"
      ? member_hostgroup
      : memberindirect_hostgroup;
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

  // Load host groups
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
    setMembershipDirection(props.direction);
  }, [props.entity]);

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
  const hostGroupColumnNames = ["Host group name", "Description"];
  const hostGroupProperties = ["cn", "description"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullHostGroupsQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'HostGroup'
  // API calls
  const [addMemberToHostGroups] = useAddAsMemberHGMutation();
  const [removeMembersFromHostGroups] = useRemoveAsMemberHGMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableHostGroups, setAvailableHostGroups] = React.useState<
    HostGroup[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available host groups, delay the search for opening the modal
  const hostGroupsQuery = useGettingHostGroupsQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available host groups search
  React.useEffect(() => {
    if (showAddModal) {
      hostGroupsQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available host groups
  React.useEffect(() => {
    if (hostGroupsQuery.data && !hostGroupsQuery.isFetching) {
      // transform data to host groups
      const count = hostGroupsQuery.data.result.count;
      const results = hostGroupsQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalHostGroups: HostGroup[] = [];
      for (let i = 0; i < count; i++) {
        const hostGroup = apiToHostGroup(results[i].result);
        avalHostGroups.push(hostGroup);
        items.push({
          key: hostGroup.cn,
          title: hostGroup.cn,
        });
      }
      items = items.filter(
        (item) =>
          !member_hostgroup.includes(item.key) &&
          !memberindirect_hostgroup.includes(item.key) &&
          item.key !== props.id
      );

      setAvailableHostGroups(avalHostGroups);
      setAvailableItems(items);
    }
  }, [hostGroupsQuery.data, hostGroupsQuery.isFetching]);

  // Add
  const onAddHostGroup = (items: AvailableItems[]) => {
    const newHostGroupNames = items.map((item) => item.key);
    if (props.id === undefined || newHostGroupNames.length == 0) {
      return;
    }

    const payload = {
      hostGroup: props.id,
      entityType: "hostgroup",
      idsToAdd: newHostGroupNames,
    } as MemberPayload;

    setSpinning(true);
    addMemberToHostGroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new host groups to host group '" + props.id + "'",
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
  const onDeleteHostGroups = () => {
    const payload = {
      hostGroup: props.id,
      entityType: "hostgroup",
      idsToAdd: hostGroupsSelected,
    } as MemberPayload;

    setSpinning(true);
    removeMembersFromHostGroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-hostgroups-success",
            "Removed host groups from host group '" + props.id + "'",
            "success"
          );
          // Refresh
          props.onRefreshData();
          // Disable 'remove' button
          if (membershipDirection === "direct") {
            setHostGroupsSelected([]);
          } else {
            setIndirectHostGroupsSelected([]);
          }
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
          setPage(1);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert(
            "remove-hostgroups-error",
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
          deleteButtonEnabled={
            membershipDirection === "direct"
              ? hostGroupsSelected.length > 0
              : indirectHostGroupsSelected.length > 0
          }
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          helpIconEnabled={true}
          totalItems={hostGroupNames.length}
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
      )}
      <MemberTable
        entityList={hostGroups}
        idKey="cn"
        from="host-groups"
        columnNamesToShow={hostGroupColumnNames}
        propertiesToShow={hostGroupProperties}
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
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddHostGroup}
          onSearchTextChange={setAdderSearchValue}
          title={"Assign host groups to host group: " + props.id}
          ariaLabel={"Add host groups modal"}
          spinning={spinning}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete host groups from host group: " + props.id}
          onDelete={onDeleteHostGroups}
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
            columnNamesToShow={hostGroupColumnNames}
            propertiesToShow={hostGroupProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MembersHostGroups;
