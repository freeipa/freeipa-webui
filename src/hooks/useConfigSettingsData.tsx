import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetConfigQuery } from "src/services/rpcConfig";
// Data types
import { Config, Metadata } from "src/utils/datatypes/globalDataTypes";

type ConfigSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalConfig: Partial<Config>;
  config: Partial<Config>;
  setConfig: (hostGroup: Partial<Config>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Config>;
};

const useConfigSettings = (): ConfigSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Config
  const configQuery = useGetConfigQuery();
  const configData = configQuery.data;
  const isFullDataLoading = configQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [config, setConfig] = useState<Partial<Config>>({});

  useEffect(() => {
    if (configData && !configQuery.isFetching) {
      setConfig({ ...configData });
    }
  }, [configData, configQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: configQuery.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalConfig: config,
    config,
    setConfig,
    refetch: configQuery.refetch,
    modifiedValues: () => config,
  } as ConfigSettingsData;

  if (configData) {
    settings.originalConfig = configData || {};
  } else {
    settings.originalConfig = {};
  }

  const getModifiedValues = (): Partial<Config> => {
    if (!configData) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(config)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(configData[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (configData[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalConfig' and 'config' objects
  useEffect(() => {
    if (!configData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(config)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(configData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (configData[key].toString() !== value.toString()) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [config, configData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useConfigSettings };
