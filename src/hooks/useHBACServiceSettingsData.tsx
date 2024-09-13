import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetHbacServiceFullDataQuery } from "src/services/rpcHBACServices";
// Data types
import { HBACService, Metadata } from "src/utils/datatypes/globalDataTypes";

type SettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalService: Partial<HBACService>;
  service: Partial<HBACService>;
  setService: (service: Partial<HBACService>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<HBACService>;
};

const useHBACServiceSettings = (srvId: string): SettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] HBAC service
  const srvFullDataQuery = useGetHbacServiceFullDataQuery(srvId);
  const srvFullData = srvFullDataQuery.data;
  const isFullDataLoading = srvFullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [service, setService] = useState<Partial<HBACService>>({});

  useEffect(() => {
    if (srvFullData && !srvFullDataQuery.isFetching) {
      setService({ ...srvFullData.service });
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
    originalService: service,
    service,
    setService,
    refetch: srvFullDataQuery.refetch,
    modifiedValues: () => service,
  } as SettingsData;

  if (srvFullData) {
    settings.originalService = srvFullData.service || {};
  } else {
    settings.originalService = {};
  }

  const getModifiedValues = (): Partial<HBACService> => {
    if (!srvFullData || !srvFullData.service) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(service)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(srvFullData.service[key]) !== JSON.stringify(value)
        ) {
          modifiedValues[key] = value;
        }
      } else if (srvFullData.service[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalService' and 'service' objects
  useEffect(() => {
    if (!srvFullData || !srvFullData.service) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(service)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(srvFullData.service[key]) !== JSON.stringify(value)
        ) {
          modified = true;
          break;
        }
      } else {
        if (srvFullData.service[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [service, srvFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useHBACServiceSettings };
