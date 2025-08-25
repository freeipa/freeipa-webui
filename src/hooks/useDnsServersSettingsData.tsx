import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useDnsServersShowQuery } from "src/services/rpcDnsServers";
// Data types
import { Metadata, DnsServer } from "src/utils/datatypes/globalDataTypes";
import { apiToDnsServer } from "src/utils/dnsServersUtils";

type DnsServersSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalDnsServer: Partial<DnsServer>;
  dnsServer: Partial<DnsServer>;
  setDnsServer: (dnsServer: Partial<DnsServer>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<DnsServer>;
};

const useDnsServersSettingsData = (
  dnsServerId: string
): DnsServersSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] DNS server
  const dnsServerDetails = useDnsServersShowQuery(dnsServerId);
  const dnsServerData = dnsServerDetails.data;
  const isDnsServerDataLoading = dnsServerDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [dnsServer, setDnsServer] = React.useState<Partial<DnsServer>>({});
  const [dnsServerDup, setDnsServerDup] = React.useState<Partial<DnsServer>>(
    {}
  );

  React.useEffect(() => {
    if (
      dnsServerData &&
      !dnsServerDetails.isFetching &&
      "result" in dnsServerData.result
    ) {
      const currentDnsServer: DnsServer = apiToDnsServer(
        dnsServerData.result.result
      );
      setDnsServer(currentDnsServer);
      setDnsServerDup(currentDnsServer);
    }
  }, [dnsServerData, dnsServerDetails.isFetching]);

  const settings: DnsServersSettingsData = {
    isLoading: metadataLoading || isDnsServerDataLoading,
    isFetching: dnsServerDetails.isFetching,
    modified,
    setModified,
    resetValues: () => {},
    metadata,
    originalDnsServer: dnsServer,
    dnsServer,
    setDnsServer,
    refetch: dnsServerDetails.refetch,
    modifiedValues: () => dnsServer,
  };

  const getModifiedValues = (): Partial<DnsServer> => {
    if (dnsServer === dnsServerData) return {};
    if (!dnsServerDup || !dnsServerData) return {};
    if (dnsServerData === null) return { ...dnsServer };

    const modifiedValues = {};

    Object.keys(dnsServer).forEach((key) => {
      if (dnsServerDup[key] !== dnsServer[key]) {
        modifiedValues[key] = dnsServer[key];
      }
    });
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalDnsServer' and 'dnsServer' objects
  React.useEffect(() => {
    if (!dnsServerDup || !dnsServerData) return;

    let modified = false;

    for (const [key, value] of Object.entries(dnsServer)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(dnsServerDup[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else if (dnsServerDup[key] !== value) {
        modified = true;
        break;
      }
    }
    setModified(modified);
  }, [dnsServer, dnsServerData, dnsServerDup]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useDnsServersSettingsData };
