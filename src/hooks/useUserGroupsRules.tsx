import React from "react";
import { useGetGenericListQuery, GenericPayload } from "src/services/rpc";
// RPC
import {
  useDefaultGroupShowQuery,
  useAutomemberFindBasicInfoQuery,
  useSearchUserGroupRulesEntriesQuery,
} from "src/services/rpcAutomember";
// Error types
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Data types
import {
  AutomemberEntry,
  groupType,
} from "src/utils/datatypes/globalDataTypes";
import { API_VERSION_BACKUP } from "src/utils/utils";
import { useAppSelector } from "src/store/hooks";

type UserGroupsRulesDataArgs = {
  searchValue: string;
  startIdx: number;
  stopIdx: number;
};

type UserGroupsRulesData = {
  isLoading: boolean;
  isFetching: boolean;
  automembersIds: AutomemberEntry[];
  shownAutomembers: AutomemberEntry[];
  totalCount: number;
  userGroups: string[];
  defaultGroup: string;
  refetch: () => void;
  errors?: Array<FetchBaseQueryError | SerializedError>;
};

const useUserGroupsRulesData = ({
  searchValue,
  startIdx,
  stopIdx,
}: UserGroupsRulesDataArgs): UserGroupsRulesData => {
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [userGroups, setUserGroups] = React.useState<string[]>([]);
  const [automemberIdsList, setAutomemberIdsList] = React.useState<
    AutomemberEntry[]
  >([]);
  const [shownAutomembers, setShownAutomembers] = React.useState<
    AutomemberEntry[]
  >([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [defaultUserGroup, setDefaultUserGroup] = React.useState<string>("");
  const [error, setError] = React.useState<
    Array<FetchBaseQueryError | SerializedError>
  >([]);

  // API call: Get all user groups
  const userGroupsQuery = useGetGenericListQuery("group");
  const userGroupsError = userGroupsQuery.error;
  const userGroupsData =
    (userGroupsQuery.data?.result.result as unknown as groupType[]) || [];
  const userGroupsLoading = userGroupsQuery.isLoading;

  React.useEffect(() => {
    if (userGroupsData && !userGroupsQuery.isFetching) {
      const groups: string[] = [];
      userGroupsData.map((group) => {
        groups.push(group.cn.toString());
      });
      setUserGroups(groups);
    }
  }, [userGroupsData, userGroupsQuery.isFetching]);

  React.useEffect(() => {
    if (userGroupsError) {
      setError((prev) => [...prev, userGroupsError]);
    }
  }, [userGroupsError]);

  // Full automember list for availableToAdd (unfiltered)
  const automembersQuery = useAutomemberFindBasicInfoQuery("group");
  const automembersError = automembersQuery.error;
  const automembersList = automembersQuery.data || [];
  const automembersLoading = automembersQuery.isLoading;

  React.useEffect(() => {
    if (automembersList && !automembersQuery.isFetching) {
      setAutomemberIdsList(automembersList);
    }
  }, [automembersList, automembersQuery.isFetching]);

  React.useEffect(() => {
    if (automembersError) {
      setError((prev) => [...prev, automembersError]);
    }
  }, [automembersError]);

  // Paginated / filtered table data
  const searchQuery = useSearchUserGroupRulesEntriesQuery({
    searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx,
    stopIdx,
  } as GenericPayload);
  const searchError = searchQuery.error;
  const searchData = searchQuery.data;
  const searchLoading = searchQuery.isLoading;

  React.useEffect(() => {
    if (searchData && !searchQuery.isFetching) {
      setShownAutomembers(searchData.automemberRules);
      setTotalCount(searchData.totalCount);
    }
  }, [searchData, searchQuery.isFetching]);

  React.useEffect(() => {
    if (searchError) {
      setError((prev) => [...prev, searchError]);
    }
  }, [searchError]);

  // API call: Get default group for automember
  const defaultGroupQuery = useDefaultGroupShowQuery("group");
  const defaultGroupError = defaultGroupQuery.error;
  const defaultGroupData = defaultGroupQuery.data || "";
  const defaultGroupLoading = defaultGroupQuery.isLoading;

  React.useEffect(() => {
    if (defaultGroupData && !defaultGroupQuery.isFetching) {
      // Get from LDAP syntax. E.g: 'cn=groupname,ou=groups,dc=example,dc=com'
      let defaultGroup = "";
      if (defaultGroupData !== "No default (fallback) group set") {
        const defaultSplitByComma = defaultGroupData[0].split(",")[0];
        defaultGroup = defaultSplitByComma.replace("cn=", "");
      }
      setDefaultUserGroup(defaultGroup);
    }
  }, [defaultGroupData, defaultGroupQuery.isFetching]);

  React.useEffect(() => {
    if (defaultGroupError) {
      setError((prev) => [...prev, defaultGroupError]);
    }
  }, [defaultGroupError]);

  const userGroupRulesData: UserGroupsRulesData = {
    isLoading:
      userGroupsLoading ||
      automembersLoading ||
      defaultGroupLoading ||
      searchLoading,
    isFetching:
      userGroupsQuery.isFetching ||
      automembersQuery.isFetching ||
      searchQuery.isFetching,
    automembersIds: automemberIdsList,
    shownAutomembers,
    totalCount,
    userGroups: userGroups,
    defaultGroup: defaultUserGroup,
    refetch: () => {
      userGroupsQuery.refetch();
      automembersQuery.refetch();
      defaultGroupQuery.refetch();
      searchQuery.refetch();
    },
    errors: error.length > 0 ? error : undefined,
  };

  return userGroupRulesData;
};

export { useUserGroupsRulesData };
