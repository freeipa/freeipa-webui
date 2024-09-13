import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetHbacSvcGrpFullDataQuery } from "src/services/rpcHBACSvcGroups";
// Data types
import {
  HBACServiceGroup,
  Metadata,
} from "src/utils/datatypes/globalDataTypes";

type SettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalSvcGrp: Partial<HBACServiceGroup>;
  svcGroup: Partial<HBACServiceGroup>;
  setSvcGroup: (service: Partial<HBACServiceGroup>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<HBACServiceGroup>;
};

const useHBACServiceGroupSettings = (srvId: string): SettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] HBAC service group
  const srvFullDataQuery = useGetHbacSvcGrpFullDataQuery(srvId);
  const srvFullData = srvFullDataQuery.data;
  const isFullDataLoading = srvFullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [svcGroup, setSvcGroup] = useState<Partial<HBACServiceGroup>>({});

  useEffect(() => {
    if (srvFullData && !srvFullDataQuery.isFetching) {
      setSvcGroup({ ...srvFullData.svcGrp });
    }
  }, [srvFullData, srvFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: srvFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resetValues: () => {},
    originalSvcGrp: svcGroup,
    svcGroup,
    setSvcGroup,
    refetch: srvFullDataQuery.refetch,
    modifiedValues: () => svcGroup,
  } as SettingsData;

  if (srvFullData) {
    settings.originalSvcGrp = srvFullData.svcGrp || {};
  } else {
    settings.originalSvcGrp = {};
  }

  const getModifiedValues = (): Partial<HBACServiceGroup> => {
    if (!srvFullData || !srvFullData.svcGrp) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(svcGroup)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(srvFullData.svcGrp[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (srvFullData.svcGrp[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalSvcGrp' and 'svcGroup' objects
  useEffect(() => {
    if (!srvFullData || !srvFullData.svcGrp) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(svcGroup)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(srvFullData.svcGrp[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (srvFullData.svcGrp[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [svcGroup, srvFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useHBACServiceGroupSettings };
