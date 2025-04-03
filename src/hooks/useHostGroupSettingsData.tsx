import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetHostGroupsFullDataQuery } from "src/services/rpcHostGroups";
// Data types
import { HostGroup, Metadata } from "src/utils/datatypes/globalDataTypes";

type HostGroupSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalGroup: Partial<HostGroup>;
  hostGroup: Partial<HostGroup>;
  setHostGroup: (hostGroup: Partial<HostGroup>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<HostGroup>;
};

const useHostGroupSettings = (groupId: string): HostGroupSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Host Group
  const hostGroupFullDataQuery = useGetHostGroupsFullDataQuery(groupId);
  const groupFullData = hostGroupFullDataQuery.data;
  const isFullDataLoading = hostGroupFullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [hostGroup, setHostGroup] = useState<Partial<HostGroup>>({});

  useEffect(() => {
    if (groupFullData && !hostGroupFullDataQuery.isFetching) {
      setHostGroup({ ...groupFullData.hostGroup });
    }
  }, [groupFullData, hostGroupFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: hostGroupFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalGroup: hostGroup,
    hostGroup,
    setHostGroup,
    refetch: hostGroupFullDataQuery.refetch,
    modifiedValues: () => hostGroup,
  } as HostGroupSettingsData;

  if (groupFullData) {
    settings.originalGroup = groupFullData.hostGroup || {};
  } else {
    settings.originalGroup = {};
  }

  const getModifiedValues = (): Partial<HostGroup> => {
    if (!groupFullData || !groupFullData.hostGroup) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(hostGroup)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(groupFullData.hostGroup[key]) !== JSON.stringify(value)
        ) {
          modifiedValues[key] = value;
        }
      } else if (groupFullData.hostGroup[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalGroup' and 'group' objects
  useEffect(() => {
    if (!groupFullData || !groupFullData.hostGroup) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(hostGroup)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(groupFullData.hostGroup[key]) !== JSON.stringify(value)
        ) {
          modified = true;
          break;
        }
      } else {
        if (groupFullData.hostGroup[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [hostGroup, groupFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useHostGroupSettings };
