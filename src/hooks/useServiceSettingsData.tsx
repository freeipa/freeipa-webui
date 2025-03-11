import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetServicesFullDataQuery } from "src/services/rpcServices";
// Data types
import {
  Service,
  Metadata,
  Certificate,
} from "src/utils/datatypes/globalDataTypes";

type ServiceSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalService: Partial<Service>;
  service: Partial<Service>;
  setService: (fqdn: Partial<Service>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Service>;
  certData?: Certificate[];
};

const useServiceSettings = (serviceId: string): ServiceSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Service
  const serviceFullDataQuery = useGetServicesFullDataQuery(serviceId);
  const serviceFullData = serviceFullDataQuery.data;
  const isFullDataLoading = serviceFullDataQuery.isLoading;

  const [modified, setModified] = useState(false);

  // Data displayed and modified by the user
  const [service, setService] = useState<Partial<Service>>({});

  useEffect(() => {
    if (serviceFullData && !serviceFullDataQuery.isFetching) {
      setService({ ...serviceFullData.service });
    }
  }, [serviceFullData, serviceFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: serviceFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resetValues: () => {},
    originalService: service,
    setService,
    refetch: serviceFullDataQuery.refetch,
    service,
    modifiedValues: () => service,
  } as ServiceSettingsData;

  if (serviceFullData) {
    settings.originalService = serviceFullData.service || {};
    settings.certData = serviceFullData.cert;
  } else {
    settings.originalService = {};
  }

  const getModifiedValues = (): Partial<Service> => {
    if (!serviceFullData || !serviceFullData.service) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(service)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(serviceFullData.service[key]) !== JSON.stringify(value)
        ) {
          modifiedValues[key] = value;
        }
      } else if (serviceFullData.service[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalService' and 'service' objects
  useEffect(() => {
    if (!serviceFullData || !serviceFullData.service) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(service)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(serviceFullData.service[key]) !== JSON.stringify(value)
        ) {
          modified = true;
          break;
        }
      } else {
        if (serviceFullData.service[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [service, serviceFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useServiceSettings };
