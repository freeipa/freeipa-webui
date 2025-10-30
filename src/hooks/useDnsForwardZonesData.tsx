import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import {
  DnsForwardZoneModPayload,
  IPAddressWithPort,
  useGetDnsForwardZoneDetailsQuery,
} from "src/services/rpcDnsForwardZones";
// Data types
import { DNSForwardZone, Metadata } from "src/utils/datatypes/globalDataTypes";
// Utils
import { apiToDnsForwardZone } from "src/utils/dnsForwardZonesUtils";

const asIPAddressWithPort = (value: string): IPAddressWithPort => {
  const [ipAddress, port] = value.split(" port ");
  return { ipAddress: ipAddress, port: port ? parseInt(port, 10) : null };
};

const resultToDnsForwardZoneMod = (
  dnsForwardZoneData: DNSForwardZone
): DnsForwardZoneModPayload => {
  const { idnsforwarders, ...record } = dnsForwardZoneData;

  return {
    ...record,
    ...(idnsforwarders !== undefined && {
      idnsforwarders: idnsforwarders.map(asIPAddressWithPort),
    }),
  };
};

type DnsForwardZonesSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  resetValues: () => void;
  metadata: Metadata;
  dnsForwardZone: Partial<DnsForwardZoneModPayload>;
  originalDnsForwardZone: Partial<DnsForwardZoneModPayload>;
  setDnsForwardZone: (
    dnsForwardZone: Partial<DnsForwardZoneModPayload>
  ) => void;
  refetch: () => void;
  modifiedValues: () => Partial<DnsForwardZoneModPayload>;
};

const useDnsForwardZonesData = (
  dnsForwardZoneId: string
): DnsForwardZonesSettingsData => {
  // [API call] Metadata
  const { data: metadata, isLoading: metadataIsLoading } =
    useGetObjectMetadataQuery();

  // [API call] DNS Forward Zone
  const {
    data: dnsForwardZoneData,
    isLoading: isDnsForwardZoneDataLoading,
    isFetching: isDnsForwardZoneDataFetching,
    refetch,
  } = useGetDnsForwardZoneDetailsQuery({
    idnsname: dnsForwardZoneId,
  });

  // Data displayed and modified by the user
  const [dnsForwardZone, setDnsForwardZone] = React.useState<
    Partial<DnsForwardZoneModPayload>
  >({});

  const dnsForwardZoneDataParsed = resultToDnsForwardZoneMod(
    apiToDnsForwardZone(dnsForwardZoneData?.result?.result)
  );

  if (
    !isDnsForwardZoneDataLoading &&
    Object.keys(dnsForwardZone).length === 0
  ) {
    setDnsForwardZone(dnsForwardZoneDataParsed);
  }

  const modifiedValues = () =>
    Object.fromEntries(
      Object.entries(dnsForwardZone).filter(([key, value]) => {
        if (Array.isArray(value) || typeof value === "object") {
          return (
            JSON.stringify(dnsForwardZoneDataParsed[key]) !==
            JSON.stringify(value)
          );
        }
        return dnsForwardZoneDataParsed[key] !== value;
      })
    );

  const modified = Object.keys(modifiedValues()).length > 0;

  return {
    isLoading: metadataIsLoading || isDnsForwardZoneDataLoading,
    isFetching: isDnsForwardZoneDataFetching,
    modified,
    metadata: metadata || {},
    resetValues: () => setDnsForwardZone(dnsForwardZoneDataParsed),
    originalDnsForwardZone: dnsForwardZoneDataParsed,
    setDnsForwardZone,
    refetch,
    dnsForwardZone,
    modifiedValues,
  };
};

export { useDnsForwardZonesData };
