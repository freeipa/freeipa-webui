import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { User, Netgroup } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfToolbar, { MembershipDirection } from "./MemberOfToolbar";
import MemberOfTableNetgroups from "./MemberOfTableNetgroups";
// Hooks
import useAlerts from "src/hooks/useAlerts";
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
// Navigation
import { useNavigate, useParams } from "react-router-dom";
import { URL_PREFIX } from "src/navigation/NavRoutes";

interface MemberOfNetroupsProps {
  user: Partial<User>;
  from: string;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const memberOfNetgroups = (props: MemberOfNetroupsProps) => {
  const navigate = useNavigate();
  const { uid } = useParams();

  React.useEffect(() => {
    if (props.user && props.user.uid) {
      navigate(
        URL_PREFIX + "/" + props.from + "/" + uid + "/memberof_netgroup"
      );
    }
  }, [props.user]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Other states
  const [netgroupsSelected, setNetgroupsSelected] = React.useState<string[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState("");

  // Loaded netgroups based on paging and member attributes
  const [netgroups, setNetgroups] = React.useState<Netgroup[]>([]);

  // Membership direction and netgroups
  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  // Choose the correct netgroups based on the membership direction
  const memberof_netgroup = props.user.memberof_netgroup || [];
  const memberofindirect_netgroup = props.user.memberofindirect_netgroup || [];
  let netgroupNames =
    membershipDirection === "direct"
      ? memberof_netgroup
      : memberofindirect_netgroup;
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

  // Reset page on direction change
  React.useEffect(() => {
    setPage(1);
  }, [membershipDirection]);

  // Refresh netgroups
  React.useEffect(() => {
    const netgroupsNames = getNetgroupsNameToLoad();
    setNetgroupNamesToLoad(netgroupsNames);
  }, [props.user, membershipDirection, searchValue, page, perPage]);

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
  const someItemSelected = netgroupsSelected.length > 0;
  const showTableRows = netgroups.length > 0;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullNetgroupsQuery.isFetching && !props.isUserDataLoading;
  const isDeleteEnabled =
    someItemSelected && membershipDirection !== "indirect";
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
  }, [showAddModal, adderSearchValue, props.user]);

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
      items = items.filter((item) => !netgroupNamesToLoad.includes(item.key));

      setAvailableNetgroups(avalNetgroups);
      setAvailableItems(items);
    }
  }, [netgroupsQuery.data, netgroupsQuery.isFetching]);

  // - Add
  const onAddNetgroup = (items: AvailableItems[]) => {
    const uid = props.user.uid;
    const newNetgroupNames = items.map((item) => item.key);
    if (uid === undefined || newNetgroupNames.length == 0) {
      return;
    }

    addMemberToNetgroups([uid, "user", newNetgroupNames]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            `Assigned user ${uid} to netgroups`,
            "success"
          );
          // Update displayed netgroups before they are updated via refresh
          const newNetgroups = netgroups.concat(
            availableNetgroups.filter((netgroup) =>
              newNetgroupNames.includes(netgroup.cn)
            )
          );
          setNetgroups(newNetgroups);

          // Refresh data
          props.onRefreshUserData();
          // Close modal
          setShowAddModal(false);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("add-member-error", errorMessage.message, "danger");
        }
      }
    });
  };

  // - Delete
  const onDeleteNetgroup = () => {
    if (props.user.uid) {
      removeMembersFromNetgroups([
        props.user.uid,
        "user",
        netgroupsSelected,
      ]).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-netgroups-success",
              "Removed netgroups from user '" + props.user.uid + "'",
              "success"
            );
            // Update displayed netgroups
            const newNetgroups = netgroups.filter(
              (netgroup) => !netgroupsSelected.includes(netgroup.cn)
            );
            setNetgroups(newNetgroups);
            // Update data
            setNetgroupsSelected([]);
            // Close modal
            setShowDeleteModal(false);
            // Refresh
            props.onRefreshUserData();
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-netgroups-error",
              errorMessage.message,
              "danger"
            );
          }
        }
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
        onRefreshButtonClick={props.onRefreshUserData}
        deleteButtonEnabled={isDeleteEnabled}
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
      <MemberOfTableNetgroups
        netgroups={netgroups}
        checkedItems={netgroupsSelected}
        onCheckItemsChange={setNetgroupsSelected}
        showTableRows={showTableRows}
      />
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
      {showAddModal && (
        <MemberOfAddModal
          showModal={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          availableItems={availableItems}
          onAdd={onAddNetgroup}
          onSearchTextChange={setAdderSearchValue}
          title={`Assign netgroups to user ${props.user.uid}`}
          ariaLabel="Add user of netgroup modal"
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title="Delete user from Netgroups"
          onDelete={onDeleteNetgroup}
        >
          <MemberOfTableNetgroups
            netgroups={netgroups.filter((netgroup) =>
              netgroupsSelected.includes(netgroup.cn)
            )}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default memberOfNetgroups;
