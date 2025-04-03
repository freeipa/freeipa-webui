import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetSudoCmdFullDataQuery } from "src/services/rpcSudoCmds";
// Data types
import { SudoCmd, Metadata } from "src/utils/datatypes/globalDataTypes";

type SettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalCmd: Partial<SudoCmd>;
  cmd: Partial<SudoCmd>;
  setCmd: (rule: Partial<SudoCmd>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<SudoCmd>;
};

const useSudoCmdsSettings = (command: string): SettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Host Group
  const fullDataQuery = useGetSudoCmdFullDataQuery(command);
  const fullData = fullDataQuery.data;
  const isFullDataLoading = fullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [cmd, setCmd] = useState<Partial<SudoCmd>>({});

  useEffect(() => {
    if (fullData && !fullDataQuery.isFetching) {
      setCmd({ ...fullData.cmd });
    }
  }, [fullData, fullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: fullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalCmd: cmd,
    cmd,
    setCmd,
    refetch: fullDataQuery.refetch,
    modifiedValues: () => cmd,
  } as SettingsData;

  if (fullData) {
    settings.originalCmd = fullData.cmd || {};
  } else {
    settings.originalCmd = {};
  }

  const getModifiedValues = (): Partial<SudoCmd> => {
    if (!fullData || !fullData.cmd) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(cmd)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(fullData.cmd[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (fullData.cmd[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalCmd' and 'cmd' objects
  useEffect(() => {
    if (!fullData || !fullData.cmd) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(cmd)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(fullData.cmd[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (fullData.cmd[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [cmd, fullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useSudoCmdsSettings };
