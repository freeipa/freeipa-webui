import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetSudoCmdGroupsFullDataQuery } from "src/services/rpcSudoCmdGroups";
// Data types
import { SudoCmdGroup, Metadata } from "src/utils/datatypes/globalDataTypes";

type SettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalGroup: Partial<SudoCmdGroup>;
  group: Partial<SudoCmdGroup>;
  setGroup: (group: Partial<SudoCmdGroup>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<SudoCmdGroup>;
};

const useSudoCmdGroupsSettings = (command: string): SettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Host Group
  const fullDataQuery = useGetSudoCmdGroupsFullDataQuery(command);
  const fullData = fullDataQuery.data;
  const isFullDataLoading = fullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [group, setGroup] = useState<Partial<SudoCmdGroup>>({});

  useEffect(() => {
    if (fullData && !fullDataQuery.isFetching) {
      setGroup({ ...fullData.group });
    }
  }, [fullData, fullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: fullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalGroup: group,
    group,
    setGroup,
    refetch: fullDataQuery.refetch,
    modifiedValues: () => group,
  } as SettingsData;

  if (fullData) {
    settings.originalGroup = fullData.group || {};
  } else {
    settings.originalGroup = {};
  }

  const getModifiedValues = (): Partial<SudoCmdGroup> => {
    if (!fullData || !fullData.group) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(group)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(fullData.group[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (fullData.group[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalGroup' and 'group' objects
  useEffect(() => {
    if (!fullData || !fullData.group) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(group)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(fullData.group[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (fullData.group[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [group, fullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useSudoCmdGroupsSettings };
