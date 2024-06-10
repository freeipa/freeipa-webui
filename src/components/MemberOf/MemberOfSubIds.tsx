import React from "react";
// PatternFly
import { Pagination, PaginationVariant } from "@patternfly/react-core";
// Data types
import { SubId, User } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfTableSubIds from "./MemberOfTableSubIds";
import MemberOfSubIdToolbar from "./MemberOfSubIdToolbar";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// RPC
import {
  useAssignSubIdsMutation,
  useGetSubIdsInfoByNameQuery,
} from "src/services/rpcSubIds";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
// React Router DOM
import { useSearchParams } from "react-router-dom";

interface MemberOfSubIdsProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const MemberOfSubIds = (props: MemberOfSubIdsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const [searchParams, setSearchParams] = useSearchParams();

  // API calls
  const [assignSubIds] = useAssignSubIdsMutation();

  // Page indexes
  const [page, setPage] = React.useState(
    parseInt(searchParams.get("p") || "1")
  );
  const [perPage, setPerPage] = React.useState(10);

  // Other states
  const [subIdsSelected, setSubIdsSelected] = React.useState<string[]>([]);

  // Loaded Subordinate IDs based on paging and member attributes
  const [subIds, setSubIds] = React.useState<SubId[]>([]);

  const memberof_subid = props.user.memberof_subid || [];

  const getSubIdsNameToLoad = (): string[] => {
    let toLoad = [...memberof_subid];
    toLoad.sort();

    // Apply paging
    toLoad = paginate(toLoad, page, perPage);
    return toLoad;
  };

  const [subIdsNamesToLoad, setSubIdsNamesToLoad] = React.useState<string[]>(
    getSubIdsNameToLoad()
  );

  // Load Subordinate IDs
  const fullSubIdsQuery = useGetSubIdsInfoByNameQuery({
    subIdsList: subIdsNamesToLoad,
    version: API_VERSION_BACKUP,
  });

  // Handle URLs with pagination and search values
  React.useEffect(() => {
    let searchParamsNew = {};

    if (page > 1) {
      searchParamsNew = {
        ...searchParamsNew,
        p: page.toString(),
      };
    }

    setSearchParams(searchParamsNew, { replace: true });
  }, [page]);

  // Refresh Subordinate IDs
  React.useEffect(() => {
    const subIdsNames = getSubIdsNameToLoad();
    setSubIdsNamesToLoad(subIdsNames);
  }, [props.user, page, perPage]);

  React.useEffect(() => {
    if (subIdsNamesToLoad.length > 0) {
      fullSubIdsQuery.refetch();
    }
  }, [subIdsNamesToLoad]);

  // Update Subordinate IDs
  React.useEffect(() => {
    if (fullSubIdsQuery.data && !fullSubIdsQuery.isFetching) {
      setSubIds(fullSubIdsQuery.data);
    }
  }, [fullSubIdsQuery.data, fullSubIdsQuery.isFetching]);

  // Computed "states"
  const showTableRows = subIds.length > 0;
  const isEnabledAutoAssign = subIds.length === 0;

  // Assign Subordinate IDs
  const onAssignSubIds = () => {
    if (!props.user.uid) {
      alerts.addAlert(
        "assign-ids-error-missing-uid",
        "User ID is missing",
        "danger"
      );
      return;
    }
    assignSubIds(props.user.uid).then((response) => {
      if ("data" in response) {
        if (response.data.error) {
          alerts.addAlert(
            "assign-ids-error",
            "Error assigning Subordinate IDs",
            "danger"
          );
        } else {
          const data = response.data.result;
          alerts.addAlert("assign-ids-success", data.summary, "success");
          props.onRefreshUserData();
        }
      }
    });
  };

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfSubIdToolbar
        refreshButtonEnabled={!props.isUserDataLoading}
        onRefreshButtonClick={props.onRefreshUserData}
        autoAssignButtonEnabled={isEnabledAutoAssign}
        onAutoAssignSubIdsClick={onAssignSubIds}
        totalItems={memberof_subid.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberOfTableSubIds
        subIds={subIds}
        checkedItems={subIdsSelected}
        onCheckItemsChange={setSubIdsSelected}
        showTableRows={showTableRows}
        showCheckboxColumn={false}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={memberof_subid.length}
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

export default MemberOfSubIds;
