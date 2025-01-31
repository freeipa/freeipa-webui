import React from "react";
// RPC
import {
  useDefaultGroupShowQuery,
  useAutomemberFindBasicInfoQuery,
} from "src/services/rpcAutomember";
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

type HostGroupsRulesData = {
  isLoading: boolean;
  isFetching: boolean;
  automembersIds: AutomemberEntry[];
  hostGroups: string[];
  defaultGroup: string;
  refetch: () => void;
  errors?: Array<FetchBaseQueryError | SerializedError>;
};

const useHostGroupsRulesData = (): HostGroupsRulesData => {
  // States
  const [hostGroups, setHostGroups] = React.useState<string[]>([]);
  const [automemberIdsList, setAutomemberIdsList] = React.useState<
    AutomemberEntry[]
  >([]);
  const [defaultHostGroup, setDefaultHostGroup] = React.useState<string>("");
  const [hostGroupsGeneralData, setHostGroupsGeneralData] = React.useState<
    groupType[]
  >([]);
  const [error, setError] = React.useState<
    Array<FetchBaseQueryError | SerializedError>
  >([]);

  // API call: Get all host groups
  const hostGroupsQuery = useGettingHostGroupsQuery({
    search: "",
    sizeLimit: 0,
    apiVersion: API_VERSION_BACKUP,
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
      setHostGroupsGeneralData(hostGroupsList);
      setHostGroups(hostGroupsList.map((group) => group.cn.toString()));
    }
  }, [hostGroupsData, hostGroupsQuery.isFetching]);

  React.useEffect(() => {
    if (hostGroupsError) {
      const errorsUpdated = [...error];
      errorsUpdated.push(hostGroupsError);
      setError(errorsUpdated);
    }
  }, [hostGroupsError]);

  // API call: Get all automembers
  // const automembersQuery = useAutomemberFindQuery("hostgroup");
  const automembersQuery = useAutomemberFindBasicInfoQuery("hostgroup");
  const automembersError = automembersQuery.error;
  const automembersListData = automembersQuery.data;
  const automembersLoading = automembersQuery.isLoading;

  React.useEffect(() => {
    if (automembersListData && !automembersQuery.isFetching) {
      setAutomemberIdsList(automembersListData);
    }
  }, [automembersListData, automembersQuery.isFetching, hostGroupsGeneralData]);

  React.useEffect(() => {
    if (automembersError) {
      const errorsUpdated = [...error];
      errorsUpdated.push(automembersError);
      setError(errorsUpdated);
    }
  }, [automembersError]);

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
      const errorsUpdated = [...error];
      errorsUpdated.push(defaultGroupError);
      setError(errorsUpdated);
    }
  }, [defaultGroupError]);

  // Return object with all data
  const hostGroupRulesData: HostGroupsRulesData = {
    isLoading: hostGroupsLoading || automembersLoading || defaultGroupLoading,
    isFetching: hostGroupsQuery.isFetching,
    automembersIds: automemberIdsList,
    hostGroups: hostGroups,
    defaultGroup: defaultHostGroup,
    refetch: () => {
      hostGroupsQuery.refetch();
      automembersQuery.refetch();
      defaultGroupQuery.refetch();
    },
    errors: error.length > 0 ? error : undefined,
  };

  return hostGroupRulesData;
};

export { useHostGroupsRulesData };
