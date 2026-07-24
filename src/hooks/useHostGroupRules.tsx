import React from "react";
// RPC
import {
  useDefaultGroupShowQuery,
  useAutomemberFindBasicInfoQuery,
  useSearchHostGroupRulesEntriesQuery,
} from "src/services/rpcAutomember";
import { GenericPayload } from "src/services/rpc";
// Error types
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Data types
import {
  AutomemberEntry,
  groupType,
} from "src/utils/datatypes/globalDataTypes";
import { useGettingHostGroupsQuery } from "src/services/rpcHostGroups";
import { API_VERSION_BACKUP } from "src/utils/utils";
import { useAppSelector } from "src/store/hooks";

type HostGroupsRulesDataArgs = {
  searchValue: string;
  startIdx: number;
  stopIdx: number;
};

type HostGroupsRulesData = {
  isLoading: boolean;
  isFetching: boolean;
  automembersIds: AutomemberEntry[];
  shownAutomembers: AutomemberEntry[];
  totalCount: number;
  hostGroups: string[];
  defaultGroup: string;
  refetch: () => void;
  errors?: Array<FetchBaseQueryError | SerializedError>;
};

const useHostGroupsRulesData = ({
  searchValue,
  startIdx,
  stopIdx,
}: HostGroupsRulesDataArgs): HostGroupsRulesData => {
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [hostGroups, setHostGroups] = React.useState<string[]>([]);
  const [automemberIdsList, setAutomemberIdsList] = React.useState<
    AutomemberEntry[]
  >([]);
  const [shownAutomembers, setShownAutomembers] = React.useState<
    AutomemberEntry[]
  >([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [defaultHostGroup, setDefaultHostGroup] = React.useState<string>("");
  const [error, setError] = React.useState<
    Array<FetchBaseQueryError | SerializedError>
  >([]);

  // API call: Get all host groups (needed for default selector and add modal)
  const hostGroupsQuery = useGettingHostGroupsQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: 0,
    stopIdx: 100,
  });
  const hostGroupsError = hostGroupsQuery.error;
  const hostGroupsData = hostGroupsQuery.data;
  const hostGroupsLoading = hostGroupsQuery.isLoading;

  React.useEffect(() => {
    if (hostGroupsData && !hostGroupsQuery.isFetching) {
      const count = hostGroupsData.result.count;
      const results = hostGroupsData.result.results;
      const hostGroupsList: groupType[] = [];
      for (let i = 0; i < count; i++) {
        hostGroupsList.push({
          cn: results[i].result.cn,
          description: results[i].result.description || "",
          dn: results[i].result.dn,
        });
      }
      setHostGroups(hostGroupsList.map((group) => group.cn.toString()));
    }
  }, [hostGroupsData, hostGroupsQuery.isFetching]);

  React.useEffect(() => {
    if (hostGroupsError) {
      setError((prev) => [...prev, hostGroupsError]);
    }
  }, [hostGroupsError]);

  // Full automember list for availableToAdd (unfiltered)
  const automembersQuery = useAutomemberFindBasicInfoQuery("hostgroup");
  const automembersError = automembersQuery.error;
  const automembersListData = automembersQuery.data;
  const automembersLoading = automembersQuery.isLoading;

  React.useEffect(() => {
    if (automembersListData && !automembersQuery.isFetching) {
      setAutomemberIdsList(automembersListData);
    }
  }, [automembersListData, automembersQuery.isFetching]);

  React.useEffect(() => {
    if (automembersError) {
      setError((prev) => [...prev, automembersError]);
    }
  }, [automembersError]);

  // Paginated / filtered table data
  const searchQuery = useSearchHostGroupRulesEntriesQuery({
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
  const defaultGroupQuery = useDefaultGroupShowQuery("hostgroup");
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
      setDefaultHostGroup(defaultGroup);
    }
  }, [defaultGroupData, defaultGroupQuery.isFetching]);

  React.useEffect(() => {
    if (defaultGroupError) {
      setError((prev) => [...prev, defaultGroupError]);
    }
  }, [defaultGroupError]);

  const hostGroupRulesData: HostGroupsRulesData = {
    isLoading:
      hostGroupsLoading ||
      automembersLoading ||
      defaultGroupLoading ||
      searchLoading,
    isFetching:
      hostGroupsQuery.isFetching ||
      automembersQuery.isFetching ||
      searchQuery.isFetching,
    automembersIds: automemberIdsList,
    shownAutomembers,
    totalCount,
    hostGroups: hostGroups,
    defaultGroup: defaultHostGroup,
    refetch: () => {
      hostGroupsQuery.refetch();
      automembersQuery.refetch();
      defaultGroupQuery.refetch();
      searchQuery.refetch();
    },
    errors: error.length > 0 ? error : undefined,
  };

  return hostGroupRulesData;
};

export { useHostGroupsRulesData };
