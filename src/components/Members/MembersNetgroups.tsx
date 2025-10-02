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
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
// RPC
import { ErrorResult, MemberPayload } from "src/services/rpc";
import {
  useAddAsMemberNGMutation,
  useGetNetgroupInfoByNameQuery,
  useGettingNetgroupsQuery,
  useRemoveAsMemberNGMutation,
} from "src/services/rpcNetgroups";
import { apiToNetgroup } from "src/utils/netgroupsUtils";

interface PropsToMembersNetgroups {
  entity: Partial<Netgroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_netgroup: string[];
  memberindirect_netgroup?: string[];
  setDirection: (direction: MembershipDirection) => void;
  direction: MembershipDirection;
}

const MembersNetgroups = (props: PropsToMembersNetgroups) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

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
  const [netgroupsSelected, setNetgroupsSelected] = React.useState<string[]>(
    []
  );
  const [indirectNetgroupsSelected, setIndirectNetgroupsSelected] =
    React.useState<string[]>([]);

  // Loaded netGroups based on paging and member attributes
  const [netgroups, setNetgroups] = React.useState<Netgroup[]>([]);

  // Choose the correct netgroups based on the membership direction
  const member_netgroup = props.member_netgroup || [];
  const memberindirect_netgroup = props.memberindirect_netgroup || [];
  let netgroupNames =
    membershipDirection === "direct"
      ? member_netgroup
      : memberindirect_netgroup;
  netgroupNames = [...netgroupNames];

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
    const netGroupsNames = getNetgroupsNameToLoad();
    setNetgroupNamesToLoad(netGroupsNames);
    props.setDirection(membershipDirection);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    setMembershipDirection(props.direction);
  }, [props.entity]);

  React.useEffect(() => {
    if (netgroupNamesToLoad.length > 0) {
      fullNetgroupsQuery.refetch();
    }
  }, [netgroupNamesToLoad]);

  // Update netgroups
  React.useEffect(() => {
    if (fullNetgroupsQuery.data && !fullNetgroupsQuery.isFetching) {
      setNetgroups(fullNetgroupsQuery.data);
    }
  }, [fullNetgroupsQuery.data, fullNetgroupsQuery.isFetching]);

  // Computed "states"
  const showTableRows = netgroups.length > 0;
  const netgroupColumnNames = ["Netgroup name", "Description"];
  const netgroupProperties = ["cn", "description"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullNetgroupsQuery.isFetching && !props.isDataLoading;
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // API calls
  const [addMemberToNetgroups] = useAddAsMemberNGMutation();
  const [removeMembersFromNetgroups] = useRemoveAsMemberNGMutation();
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
        (item) =>
          !member_netgroup.includes(item.key) &&
          !memberindirect_netgroup.includes(item.key) &&
          item.key !== props.id
      );

      setAvailableNetgroups(avalNetgroups);
      setAvailableItems(items);
    }
  }, [netgroupsQuery.data, netgroupsQuery.isFetching]);

  // Add
  const onAddNetgroup = (items: AvailableItems[]) => {
    const newHostGroupNames = items.map((item) => item.key);
    if (props.id === undefined || newHostGroupNames.length == 0) {
      return;
    }

    const payload = {
      entryName: props.id,
      entityType: "netgroup",
      idsToAdd: newHostGroupNames,
    } as MemberPayload;

    setSpinning(true);
    addMemberToNetgroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new netgroups to netgroup '" + props.id + "'",
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
  const onDeleteNetgroups = () => {
    const payload = {
      entryName: props.id,
      entityType: "netgroup",
      idsToAdd: netgroupsSelected,
    } as MemberPayload;

    setSpinning(true);
    removeMembersFromNetgroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-netgroups-success",
            "Removed netgroups from netgroup '" + props.id + "'",
            "success"
          );
          // Refresh
          props.onRefreshData();
          // Disable delete button
          if (membershipDirection === "direct") {
            setNetgroupsSelected([]);
          } else {
            setIndirectNetgroupsSelected([]);
          }
          // Close modal
          setShowDeleteModal(false);
          // Back to page 1
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
      <MemberTable
        entityList={netgroups}
        idKey="cn"
        from="netgroups"
        columnNamesToShow={netgroupColumnNames}
        propertiesToShow={netgroupProperties}
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
      <Pagination
        className="pf-v6-u-pb-0 pf-v6-u-pr-md"
        itemCount={netgroupNames.length}
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
        onAdd={onAddNetgroup}
        onSearchTextChange={setAdderSearchValue}
        title={"Assign netgroups to netgroup: " + props.id}
        ariaLabel={"Add netgroups modal"}
        spinning={spinning}
      />
      <MemberOfDeleteModal
        showModal={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        title={"Delete netgroups from netgroup: " + props.id}
        onDelete={onDeleteNetgroups}
        spinning={spinning}
      >
        <MemberTable
          entityList={availableNetgroups.filter((hostGroup) =>
            membershipDirection === "direct"
              ? netgroupsSelected.includes(hostGroup.cn)
              : indirectNetgroupsSelected.includes(hostGroup.cn)
          )}
          from="netgroups"
          idKey="cn"
          columnNamesToShow={netgroupColumnNames}
          propertiesToShow={netgroupProperties}
          showTableRows
        />
      </MemberOfDeleteModal>
    </>
  );
};

export default MembersNetgroups;
