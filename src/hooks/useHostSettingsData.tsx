import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetHostsFullDataQuery } from "src/services/rpcHosts";
// Data types
import { Host, Metadata } from "src/utils/datatypes/globalDataTypes";

type HostSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalHost: Partial<Host>;
  host: Partial<Host>;
  setHost: (fqdn: Partial<Host>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Host>;
  certData?: Record<string, unknown>;
};

const useHostSettings = (hostId: string): HostSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Host
  const hostFullDataQuery = useGetHostsFullDataQuery(hostId);
  const hostFullData = hostFullDataQuery.data;
  const isFullDataLoading = hostFullDataQuery.isLoading;

  const [modified, setModified] = useState(false);

  // Data displayed and modified by the user
  const [host, setHost] = useState<Partial<Host>>({});

  useEffect(() => {
    if (hostFullData && !hostFullDataQuery.isFetching) {
      setHost({ ...hostFullData.host });
    }
  }, [hostFullData, hostFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: hostFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalHost: host,
    setHost,
    refetch: hostFullDataQuery.refetch,
    host,
    modifiedValues: () => host,
  } as HostSettingsData;

  if (hostFullData) {
    settings.originalHost = hostFullData.host || {};
    settings.certData = hostFullData.cert;
  } else {
    settings.originalHost = {};
  }

  const getModifiedValues = (): Partial<Host> => {
    if (!hostFullData || !hostFullData.host) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(host)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(hostFullData.host[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (hostFullData.host[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalHost' and 'host' objects
  useEffect(() => {
    if (!hostFullData || !hostFullData.host) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(host)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(hostFullData.host[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (hostFullData.host[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [host, hostFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useHostSettings };
