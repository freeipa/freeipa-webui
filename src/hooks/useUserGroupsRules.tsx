import React from "react";
import { useGetGenericListQuery } from "src/services/rpc";
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

type UserGroupsRulesData = {
  isLoading: boolean;
  isFetching: boolean;
  automembersIds: AutomemberEntry[];
  userGroups: string[];
  defaultGroup: string;
  refetch: () => void;
  errors?: Array<FetchBaseQueryError | SerializedError>;
};

const useUserGroupsRulesData = (): UserGroupsRulesData => {
  // States
  const [userGroups, setUserGroups] = React.useState<string[]>([]);
  const [automemberIdsList, setAutomemberIdsList] = React.useState<
    AutomemberEntry[]
  >([]);
  const [defaultUserGroup, setDefaultUserGroup] = React.useState<string>("");
  const [userGroupsGeneralData, setUserGroupsGeneralData] = React.useState<
    groupType[]
  >([]);
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
      setUserGroupsGeneralData(userGroupsData);
      const userGroups: string[] = [];
      userGroupsData.map((group) => {
        userGroups.push(group.cn.toString());
      });
      setUserGroups(userGroups);
    }
  }, [userGroupsData, userGroupsQuery.isFetching]);

  React.useEffect(() => {
    if (userGroupsError) {
      const errorsUpdated = [...error];
      errorsUpdated.push(userGroupsError);
      setError(errorsUpdated);
    }
  }, [userGroupsError]);

  // API call: Get all automembers
  const automembersQuery = useAutomemberFindBasicInfoQuery("group");
  const automembersError = automembersQuery.error;
  const automembersList = automembersQuery.data || [];
  const automembersLoading = automembersQuery.isLoading;

  React.useEffect(() => {
    if (automembersList && !automembersQuery.isFetching) {
      setAutomemberIdsList(automembersList);
    }
  }, [automembersList, automembersQuery.isFetching, userGroupsGeneralData]);

  React.useEffect(() => {
    if (automembersError) {
      const errorsUpdated = [...error];
      errorsUpdated.push(automembersError);
      setError(errorsUpdated);
    }
  }, [automembersError]);

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
      const errorsUpdated = [...error];
      errorsUpdated.push(defaultGroupError);
      setError(errorsUpdated);
    }
  }, [defaultGroupError]);

  // Return object with all data
  const userGroupRulesData: UserGroupsRulesData = {
    isLoading: userGroupsLoading || automembersLoading || defaultGroupLoading,
    isFetching: userGroupsQuery.isFetching,
    automembersIds: automemberIdsList,
    userGroups: userGroups,
    defaultGroup: defaultUserGroup,
    refetch: () => {
      userGroupsQuery.refetch();
      automembersQuery.refetch();
      defaultGroupQuery.refetch();
    },
    errors: error.length > 0 ? error : undefined,
  };

  return userGroupRulesData;
};

export { useUserGroupsRulesData };
