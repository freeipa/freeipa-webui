import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetUserGroupsFullDataQuery } from "src/services/rpcUserGroups";
// Data types
import {
  UserGroup,
  Metadata,
  PwPolicy,
} from "src/utils/datatypes/globalDataTypes";

type UserGroupSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalGroup: Partial<UserGroup>;
  userGroup: Partial<UserGroup>;
  setUserGroup: (usergroup: Partial<UserGroup>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<UserGroup>;
  pwPolicyData: Partial<PwPolicy>;
};

const useUserGroupSettings = (groupId: string): UserGroupSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Host
  const userGroupFullDataQuery = useGetUserGroupsFullDataQuery(groupId);
  const groupFullData = userGroupFullDataQuery.data;
  const isFullDataLoading = userGroupFullDataQuery.isLoading;

  const [modified, setModified] = useState(false);

  // Data displayed and modified by the user
  const [userGroup, setUserGroup] = useState<Partial<UserGroup>>({});

  useEffect(() => {
    if (groupFullData && !userGroupFullDataQuery.isFetching) {
      setUserGroup({ ...groupFullData.userGroup });
    }
  }, [groupFullData, userGroupFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: userGroupFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalGroup: userGroup,
    setUserGroup,
    refetch: userGroupFullDataQuery.refetch,
    userGroup,
    modifiedValues: () => userGroup,
    pwPolicyData: {},
  } as UserGroupSettingsData;

  if (groupFullData) {
    settings.originalGroup = groupFullData.userGroup || {};
    settings.pwPolicyData = groupFullData.pwPolicy || {};
  } else {
    settings.originalGroup = {};
  }

  const getModifiedValues = (): Partial<UserGroup> => {
    if (!groupFullData || !groupFullData.userGroup) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(userGroup)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(groupFullData.userGroup[key]) !== JSON.stringify(value)
        ) {
          modifiedValues[key] = value;
        }
      } else if (groupFullData.userGroup[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalHost' and 'host' objects
  useEffect(() => {
    if (!groupFullData || !groupFullData.userGroup) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(userGroup)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(groupFullData.userGroup[key]) !== JSON.stringify(value)
        ) {
          modified = true;
          break;
        }
      } else {
        if (groupFullData.userGroup[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [userGroup, groupFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useUserGroupSettings };
