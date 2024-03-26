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
import { BatchRPCResponse, useGettingNetgroupsQuery } from "src/services/rpc";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToNetgroup } from "src/utils/netgroupsUtils";

interface MemberOfNetroupsProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const memberOfNetgroups = (props: MemberOfNetroupsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

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

  const [netgroupsFullList, setNetgroupsFullList] = React.useState<Netgroup[]>(
    []
  );

  const netgroupsData = netgroupsQuery.data || {};

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

  // Other states
  const [netgroupsSelected, setNetgroupsSelected] = React.useState<string[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState("");

  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>("direct");

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

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSearch={() => {}}
        refreshButtonEnabled={true}
        onRefreshButtonClick={props.onRefreshUserData}
        deleteButtonEnabled={someItemSelected}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDeleteButtonClick={() => {}}
        addButtonEnabled={true}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onAddButtonClick={() => {}}
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
    </>
  );
};

export default memberOfNetgroups;
