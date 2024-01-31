// RPC
import React from "react";
import { BatchRPCResponse, useGetUserGroupsQuery } from "src/services/rpc";
// Data types
import { UserGroupNew } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, normalizeString } from "src/utils/utils";

type MemberOfData = {
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
  userGroupsFullList: UserGroupNew[];
};

const useUserMemberOfData = (): MemberOfData => {
  // [API call] User groups
  // TODO: Normalize data to prevent array of arrays
  const userGroupsQuery = useGetUserGroupsQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: API_VERSION_BACKUP,
  });

  const [userGroupsFullList, setUserGroupsFullList] = React.useState<
    UserGroupNew[]
  >([]);
  const userGroupsData = userGroupsQuery.data || {};
  const isUserGroupsLoading = userGroupsQuery.isLoading;

  React.useEffect(() => {
    if (userGroupsData !== undefined && !userGroupsQuery.isFetching) {
      const dataParsed = userGroupsData as BatchRPCResponse;
      const count = dataParsed.result.count;
      const results = dataParsed.result.results;

      const userGroupsTempList: UserGroupNew[] = [];

      for (let i = 0; i < count; i++) {
        userGroupsTempList.push({
          cn: normalizeString(results[i].result.cn),
          gidnumber: normalizeString(results[i].result.gidnumber),
          description: normalizeString(results[i].result.description),
          dn: results[i].result.dn,
        });
      }
      setUserGroupsFullList(userGroupsTempList);
    }
  }, [userGroupsData, userGroupsQuery.isFetching]);

  // [API call] Refresh
  const refetch = () => {
    userGroupsQuery.refetch();
  };

  // Return data
  return {
    isFetching: userGroupsQuery.isFetching,
    isLoading: isUserGroupsLoading,
    refetch,
    userGroupsFullList,
  } as MemberOfData;
};

export { useUserMemberOfData };
