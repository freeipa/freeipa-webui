import React from "react";
// RPC
import { useGetObjectMetadataQuery, KwError } from "src/services/rpc";
import { useDnsZoneDetailsQuery } from "src/services/rpcDnsZones";
// Data types
import {
  DnsPermissionType,
  DNSZone,
  Metadata,
} from "src/utils/datatypes/globalDataTypes";
// Utils
import { apiToDnsZone } from "src/utils/dnsZonesUtils";

type DnsZonesSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  dnsZone: Partial<DNSZone>;
  originalDnsZone: Partial<DNSZone>;
  setDnsZone: (dnsZone: Partial<DNSZone>) => void;
  permissionsData: DnsPermissionType | KwError | null;
  refetch: () => void;
  modifiedValues: () => Partial<DNSZone>;
};

const useDnsZonesData = (dnsZoneId: string): DnsZonesSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] DNS Zones
  const dnsZoneDetails = useDnsZoneDetailsQuery(dnsZoneId);
  const dnsZoneData = dnsZoneDetails.data;
  const isDnsZoneDataLoading = dnsZoneDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [dnsZone, setDnsZone] = React.useState<Partial<DNSZone>>({});
  // duplicate state to get all values parsed from the API
  const [dnsZoneDup, setDnsZoneDup] = React.useState<Partial<DNSZone>>({});
  // Permissions data
  const [permissionsData, setPermissionsData] = React.useState<
    DnsPermissionType | KwError | null
  >(null);

  React.useEffect(() => {
    if (dnsZoneData && !dnsZoneDetails.isFetching) {
      // Get the DNS zones data and convert it to the expected format
      const zoneData: DNSZone = apiToDnsZone(
        dnsZoneData.result.results[0].result
      );
      setDnsZone(zoneData);
      setDnsZoneDup(zoneData);

      // Get the permissions data
      const permissions = dnsZoneData.result.results[1];
      if (permissions.error_code !== undefined) {
        setPermissionsData({
          type: "error",
          ...permissions,
        }) as unknown as KwError;
      } else if (permissions.result.ipapermissiontype !== undefined) {
        const result = permissions.result;
        setPermissionsData({
          type: "dns_permission",
          ...result,
        } as DnsPermissionType);
      }
    }
  }, [dnsZoneData, dnsZoneDetails.isFetching]);

  const settings: DnsZonesSettingsData = {
    isLoading: metadataLoading || isDnsZoneDataLoading,
    isFetching: dnsZoneDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalDnsZone: dnsZone,
    setDnsZone,
    refetch: dnsZoneDetails.refetch,
    dnsZone,
    permissionsData: permissionsData,
    modifiedValues: () => dnsZone,
  };

  const getModifiedValues = (): Partial<DNSZone> => {
    if (!dnsZoneDup || !dnsZoneData) {
      return {};
    }

    const modifiedValues = {};

    Object.keys(dnsZone).forEach((key) => {
      if (dnsZoneDup[key] !== dnsZone[key]) {
        modifiedValues[key] = dnsZone[key];
      }
    });

    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalDnsZone' and 'dnsZone' objects
  // - As there are some complex values (e.g. 'idnsname' is an object that contains '__dns_name__')
  //    we use dnsZoneDup to compare the values
  React.useEffect(() => {
    if (!dnsZoneDup || !dnsZoneData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(dnsZone)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(dnsZoneDup[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (dnsZoneDup[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [dnsZone, dnsZoneData, dnsZoneDup]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useDnsZonesData };
