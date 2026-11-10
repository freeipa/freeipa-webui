import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetSelinuxUserMapFullDataQuery } from "src/services/rpcSelinuxUserMaps";
// Data types
import { SELinuxUserMap, Metadata } from "src/utils/datatypes/globalDataTypes";

type SettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalRule: Partial<SELinuxUserMap>;
  rule: Partial<SELinuxUserMap>;
  setRule: (rule: Partial<SELinuxUserMap>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<SELinuxUserMap>;
};

const useSelinuxUserMapSettings = (ruleId: string): SettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] SELinux user map
  const ruleFullDataQuery = useGetSelinuxUserMapFullDataQuery(ruleId);
  const ruleFullData = ruleFullDataQuery.data;
  const isFullDataLoading = ruleFullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [rule, setRule] = useState<Partial<SELinuxUserMap>>({});

  useEffect(() => {
    if (ruleFullData && !ruleFullDataQuery.isFetching) {
      setRule({ ...ruleFullData.selinuxUserMap });
    }
  }, [ruleFullData, ruleFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: ruleFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resetValues: () => {},
    originalRule: rule,
    rule,
    setRule,
    refetch: ruleFullDataQuery.refetch,
    modifiedValues: () => rule,
  } as SettingsData;

  if (ruleFullData) {
    settings.originalRule = ruleFullData.selinuxUserMap || {};
  } else {
    settings.originalRule = {};
  }

  const getModifiedValues = (): Partial<SELinuxUserMap> => {
    if (!ruleFullData || !ruleFullData.selinuxUserMap) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(rule)) {
      if (Array.isArray(value)) {
        if (
          JSON.stringify(ruleFullData.selinuxUserMap[key]) !==
          JSON.stringify(value)
        ) {
          modifiedValues[key] = value;
        }
      } else if (ruleFullData.selinuxUserMap[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  useEffect(() => {
    if (!ruleFullData || !ruleFullData.selinuxUserMap) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(rule)) {
      if (Array.isArray(value)) {
        if (
          JSON.stringify(ruleFullData.selinuxUserMap[key]) !==
          JSON.stringify(value)
        ) {
          modified = true;
          break;
        }
      } else {
        if (ruleFullData.selinuxUserMap[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [rule, ruleFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useSelinuxUserMapSettings };
