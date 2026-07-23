import React from "react";
// PatternFly
import { PaginationVariant } from "@patternfly/react-core";
// Data types
import { SubId, User } from "src/utils/datatypes/globalDataTypes";
// Components
import MemberOfTableSubIds from "./MemberOfTableSubIds";
import MemberOfSubIdToolbar from "./MemberOfSubIdToolbar";
import PaginationLayout from "../layouts/PaginationLayout";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useAssignSubIdsMutation,
  useGetSubIdsInfoByNameQuery,
} from "src/services/rpcSubIds";
// Utils
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";

interface MemberOfSubIdsProps {
  user: Partial<User>;
  isUserDataLoading: boolean;
  onRefreshUserData: () => void;
}

const MemberOfSubIds = (props: MemberOfSubIdsProps) => {
  const dispatch = useAppDispatch();

  const { page, perPage } = useListPageSearchParams();

  // API calls
  const [assignSubIds] = useAssignSubIdsMutation();

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
      dispatch(
        addAlert({
          name: "assign-ids-error-missing-uid",
          title: "User ID is missing",
          variant: "danger",
        })
      );
      return;
    }
    assignSubIds(props.user.uid).then((response) => {
      if ("data" in response) {
        if (response.data?.error) {
          dispatch(
            addAlert({
              name: "assign-ids-error",
              title: "Error assigning Subordinate IDs",
              variant: "danger",
            })
          );
        } else {
          const data = response.data?.result;
          dispatch(
            addAlert({
              name: "assign-ids-success",
              title: data?.summary,
              variant: "success",
            })
          );
          props.onRefreshUserData();
        }
      }
    });
  };

  return (
    <>
      <MemberOfSubIdToolbar
        refreshButtonEnabled={!props.isUserDataLoading}
        onRefreshButtonClick={props.onRefreshUserData}
        autoAssignButtonEnabled={isEnabledAutoAssign}
        onAutoAssignSubIdsClick={onAssignSubIds}
        totalItems={memberof_subid.length}
      />
      <MemberOfTableSubIds
        subIds={subIds}
        checkedItems={subIdsSelected}
        onCheckItemsChange={setSubIdsSelected}
        showTableRows={showTableRows}
        showCheckboxColumn={false}
      />
      {memberof_subid.length > 0 && (
        <PaginationLayout
          list={subIds}
          totalCount={memberof_subid.length}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v6-u-pb-0 pf-v6-u-pr-md"
        />
      )}
    </>
  );
};

export default MemberOfSubIds;
