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
import {
  BatchRPCResponse,
  ErrorResult,
  useAddToNetgroupsMutation,
  useGettingNetgroupsQuery,
} from "src/services/rpc";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToNetgroup } from "src/utils/netgroupsUtils";
import MemberOfAddModal, { AvailableItems } from "./MemberOfAddModal";

interface MemberOfNetroupsProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const memberOfNetgroups = (props: MemberOfNetroupsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [addMemberToNetgroup] = useAddToNetgroupsMutation();

  // Netgroups from current user
  const [netgroupsFromUser, setNetgroupsFromUser] = React.useState<Netgroup[]>(
    []
  );

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // Current user ID
  const uid = props.user.uid;

  // API call
  // - Full info of available Netgroups
  const netgroupsQuery = useGettingNetgroupsQuery({
    user: uid,
    apiVersion: API_VERSION_BACKUP,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  // - Not member of
  const netgroupsNotMemberOfQuery = useGettingNetgroupsQuery({
    no_user: uid,
    apiVersion: API_VERSION_BACKUP,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const [netgroupsFullList, setNetgroupsFullList] = React.useState<Netgroup[]>(
    []
  );
  const [netgroupsNotMemberOfFullList, setNetgroupsNotMemberOfFullList] =
    React.useState<Netgroup[]>([]);

  const netgroupsData = netgroupsQuery.data || {};
  const netgroupsNotMemberOfData = netgroupsNotMemberOfQuery.data || {};

  React.useEffect(() => {
    if (netgroupsData && !netgroupsQuery.isFetching) {
      const dataParsed = netgroupsData as BatchRPCResponse;
      const count = dataParsed.result.count;
      const results = dataParsed.result.results;

      const netgroupsTempList: Netgroup[] = [];

      for (let i = 0; i < count; i++) {
        netgroupsTempList.push(apiToNetgroup(results[i].result));
      }
      setNetgroupsFullList(netgroupsTempList);
    }
  }, [netgroupsData, netgroupsQuery.isFetching]);

  React.useEffect(() => {
    if (
      netgroupsNotMemberOfData !== undefined &&
      !netgroupsNotMemberOfQuery.isFetching
    ) {
      const dataParsed = netgroupsNotMemberOfData as BatchRPCResponse;
      const count = dataParsed.result.count;
      const results = dataParsed.result.results;

      const netgroupsNotMemberOfTempList: Netgroup[] = [];

      for (let i = 0; i < count; i++) {
        netgroupsNotMemberOfTempList.push(apiToNetgroup(results[i].result));
      }
      setNetgroupsNotMemberOfFullList(netgroupsNotMemberOfTempList);
    }
  }, [netgroupsNotMemberOfData, netgroupsNotMemberOfQuery.isFetching]);

  // Get full data of the 'User groups' assigned to user
  React.useEffect(() => {
    const netgroupsParsed: Netgroup[] = [];
    props.user.memberof_netgroup?.map((netgroup) => {
      netgroupsFullList.map((ng) => {
        if (ng.cn === netgroup) {
          netgroupsParsed.push(ng);
        }
      });
    });
    if (JSON.stringify(netgroupsFromUser) !== JSON.stringify(netgroupsParsed)) {
      setNetgroupsFromUser(netgroupsParsed);
    }
  }, [netgroupsFullList]);

  // Refetch User groups when user data changes
  React.useEffect(() => {
    netgroupsQuery.refetch();
    netgroupsNotMemberOfQuery.refetch();
  }, [props.user, netgroupsFromUser]);

  // Other states
  const [netgroupsSelected, setNetgroupsSelected] = React.useState<string[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState("");

  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

  const [showAddModal, setShowAddModal] = React.useState(false);

  // Computed "states"
  const someItemSelected = netgroupsSelected.length > 0;
  const [shownNetgroups, setShownNetgroups] = React.useState<Netgroup[]>(
    paginate(netgroupsFromUser, page, perPage)
  );
  const showTableRows = netgroupsFromUser.length > 0;

  // Update 'shownNetgroups' when 'netgroupsFromUser' changes
  React.useEffect(() => {
    setShownNetgroups(paginate(netgroupsFromUser, page, perPage));
  }, [netgroupsFromUser]);

  // Parse availableItems to 'AvailableItems' type
  const parseAvailableItems = (itemsList: Netgroup[]) => {
    const avItems: AvailableItems[] = [];
    itemsList.map((item) => {
      avItems.push({
        key: item.cn,
        title: item.cn,
      });
    });
    return avItems;
  };

  const availableNetgroupsItems: AvailableItems[] = parseAvailableItems(
    netgroupsNotMemberOfFullList
  );

  // Buttons functionality
  // - Refresh
  const isRefreshButtonEnabled =
    !netgroupsQuery.isFetching && !props.isUserDataLoading;

  // - Add
  const isAddButtonEnabled =
    !netgroupsQuery.isFetching && !props.isUserDataLoading;

  // Add new member to 'Netgroup'
  const onAddToNetgroup = (toUid: string, type: string, newData: string[]) => {
    addMemberToNetgroup([toUid, type, newData]).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Added new members to netgroup '" + toUid + "'",
            "success"
          );
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

  const onAddNetgroup = (items: AvailableItems[]) => {
    const newItems = items.map((item) => item.key);
    const newNetgroups = netgroupsFullList.filter((group) =>
      newItems.includes(group.cn)
    );
    if (props.user.uid !== undefined) {
      onAddToNetgroup(props.user.uid, "user", newItems);
      const updatedNetgroups = netgroupsFromUser.concat(newNetgroups);
      setNetgroupsFromUser(updatedNetgroups);
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
        deleteButtonEnabled={someItemSelected}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDeleteButtonClick={() => {}}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        membershipDirectionEnabled={true}
        membershipDirection={membershipDirection}
        onMembershipDirectionChange={setMembershipDirection}
        helpIconEnabled={true}
        totalItems={netgroupsFromUser.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfTableNetgroups
        netgroups={shownNetgroups}
        checkedItems={netgroupsSelected}
        onCheckItemsChange={setNetgroupsSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={netgroupsFromUser.length}
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
          availableItems={availableNetgroupsItems}
          onAdd={onAddNetgroup}
          onSearchTextChange={setSearchValue}
          title={"Add '" + props.user.uid + "' into Netgroups"}
          ariaLabel="Add user of netgroup modal"
        />
      )}
    </>
  );
};

export default memberOfNetgroups;
