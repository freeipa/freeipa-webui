import { useState, useEffect } from "react";
import { useAppSelector } from "src/store/hooks";

// RPC
import { useGetNetgroupFullDataQuery } from "src/services/rpcNetgroups";
// Data types
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
import { Metadata } from "src/services/types/metadata";

type NetgroupSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalGroup: Partial<Netgroup>;
  netgroup: Partial<Netgroup>;
  setNetgroup: (netgroup: Partial<Netgroup>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Netgroup>;
};

const useNetgroupSettings = (groupId: string): NetgroupSettingsData => {
  // [API call] Metadata
  const metadataQuery = {
    data: useAppSelector((state) => state.global.metadata),
  };
  const metadata = metadataQuery.data;

  // [API call] Host Group
  const netgroupFullDataQuery = useGetNetgroupFullDataQuery(groupId);
  const groupFullData = netgroupFullDataQuery.data;
  const isFullDataLoading = netgroupFullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [netgroup, setNetgroup] = useState<Partial<Netgroup>>({});

  useEffect(() => {
    if (groupFullData && !netgroupFullDataQuery.isFetching) {
      setNetgroup({ ...groupFullData.netgroup });
    }
  }, [groupFullData, netgroupFullDataQuery.isFetching]);

  const settings = {
    isLoading: isFullDataLoading,
    isFetching: netgroupFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalGroup: netgroup,
    netgroup,
    setNetgroup,
    refetch: netgroupFullDataQuery.refetch,
    modifiedValues: () => netgroup,
  } as NetgroupSettingsData;

  if (groupFullData) {
    settings.originalGroup = groupFullData.netgroup || {};
  } else {
    settings.originalGroup = {};
  }

  const getModifiedValues = (): Partial<Netgroup> => {
    if (!groupFullData || !groupFullData.netgroup) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(netgroup)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(groupFullData.netgroup[key]) !== JSON.stringify(value)
        ) {
          modifiedValues[key] = value;
        }
      } else if (groupFullData.netgroup[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalGroup' and 'group' objects
  useEffect(() => {
    if (!groupFullData || !groupFullData.netgroup) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(netgroup)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(groupFullData.netgroup[key]) !== JSON.stringify(value)
        ) {
          modified = true;
          break;
        }
      } else {
        if (groupFullData.netgroup[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [netgroup, groupFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useNetgroupSettings };
