// RPC
import React from "react";
import { BatchRPCResponse, useGettingGroupsQuery } from "src/services/rpc";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
import { apiToGroup } from "src/utils/groupUtils";
// Utils
import { API_VERSION_BACKUP } from "src/utils/utils";

type MemberOfData = {
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
  userGroupsFullList: UserGroup[];
  isLoadingNotMembers: boolean;
  isFetchingNotMembers: boolean;
  notMemberOfRefetch: () => void;
  userGroupsNotMemberOfFullList: UserGroup[];
};

const useUserMemberOfData = ({
  uid,
  firstUserIdx,
  lastUserIdx,
}): MemberOfData => {
  // [API call] User groups
  // TODO: Normalize data to prevent array of arrays
  const userGroupsQuery = useGettingGroupsQuery({
    user: uid,
    apiVersion: API_VERSION_BACKUP,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const userGroupsNotMemberOfQuery = useGettingGroupsQuery({
    no_user: uid,
    apiVersion: API_VERSION_BACKUP,
    startIdx: firstUserIdx,
    stopIdx: 100, // Limited to max. 100 groups to show in the dual selector
  });

  const [userGroupsFullList, setUserGroupsFullList] = React.useState<
    UserGroup[]
  >([]);
  const userGroupsData = userGroupsQuery.data || {};
  const isUserGroupsLoading = userGroupsQuery.isLoading;

  React.useEffect(() => {
    if (userGroupsData !== undefined && !userGroupsQuery.isFetching) {
      const dataParsed = userGroupsData as BatchRPCResponse;
      const count = dataParsed.result.count;
      const results = dataParsed.result.results;

      const userGroupsTempList: UserGroup[] = [];

      for (let i = 0; i < count; i++) {
        userGroupsTempList.push(apiToGroup(results[i].result));
      }
      setUserGroupsFullList(userGroupsTempList);
    }
  }, [userGroupsData, userGroupsQuery.isFetching]);

  // Not member of
  const [userGroupsNotMemberOfFullList, setUserGroupsNotMemberOfFullList] =
    React.useState<UserGroup[]>([]);
  const userGroupsNotMemberOfData = userGroupsNotMemberOfQuery.data || {};
  const isUserGroupsNotMemberOfLoading = userGroupsNotMemberOfQuery.isLoading;

  React.useEffect(() => {
    if (
      userGroupsNotMemberOfData !== undefined &&
      !userGroupsNotMemberOfQuery.isFetching
    ) {
      const dataParsed = userGroupsNotMemberOfData as BatchRPCResponse;
      const count = dataParsed.result.count;
      const results = dataParsed.result.results;

      const userGroupsNotMemberOfTempList: UserGroup[] = [];

      for (let i = 0; i < count; i++) {
        userGroupsNotMemberOfTempList.push(apiToGroup(results[i].result));
      }
      setUserGroupsNotMemberOfFullList(userGroupsNotMemberOfTempList);
    }
  }, [userGroupsNotMemberOfData, userGroupsNotMemberOfQuery.isFetching]);

  // [API call] Refresh
  const refetch = () => {
    userGroupsQuery.refetch();
  };

  const notMemberOfRefetch = () => {
    userGroupsNotMemberOfQuery.refetch();
  };

  // Return data
  return {
    isLoading: isUserGroupsLoading,
    isFetching: userGroupsQuery.isFetching,
    refetch,
    userGroupsFullList,
    isLoadingNotMembers: isUserGroupsNotMemberOfLoading,
    ifFetchingNotMembers: userGroupsNotMemberOfQuery.isFetching,
    notMemberOfRefetch,
    userGroupsNotMemberOfFullList,
  } as unknown as MemberOfData;
};

export { useUserMemberOfData };
