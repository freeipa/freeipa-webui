import React from "react";
// Routing
import { useNavigate } from "react-router-dom";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useShowDnsRecordQuery } from "src/services/rpcDnsZones";
import { useGetHostByIdQuery } from "src/services/rpcHosts";
// Data types
import { DNSRecord, Host, Metadata } from "src/utils/datatypes/globalDataTypes";
// Utils
import { apiToDnsRecord } from "src/utils/dnsRecordUtils";

type DnsRecordsSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  dnsRecord: Partial<DNSRecord>;
  originalDnsRecord: Partial<DNSRecord>;
  setDnsRecord: (dnsRecord: Partial<DNSRecord>) => void;
  host: Partial<Host>;
  setHost: (host: Partial<Host>) => void;
  originalHost: Partial<Host>;
  refetch: () => void;
  modifiedValues: () => Partial<DNSRecord>;
};

const useDnsRecordsData = (
  dnsZoneId: string,
  recordName: string
): DnsRecordsSettingsData => {
  const navigate = useNavigate();

  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] DNS Record
  const dnsRecordDetails = useShowDnsRecordQuery({
    dnsZoneId,
    recordName,
  });
  const dnsRecordData = dnsRecordDetails.data;
  const isDnsRecordDataLoading = dnsRecordDetails.isLoading;

  // [API call] Host
  const hostDetails = useGetHostByIdQuery(recordName + dnsZoneId);
  const hostData = hostDetails.data;
  const isHostDataLoading = hostDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [dnsRecord, setDnsRecord] = React.useState<Partial<DNSRecord>>({});
  const [host, setHost] = React.useState<Partial<Host>>({});

  // Redirect to main DNS records pages if the record is empty
  const handleEmptyRecord = () => {
    navigate("/dns-zones/" + dnsZoneId + "/dns-records", {
      replace: true,
    });
  };

  React.useEffect(() => {
    if (dnsRecordData && !dnsRecordDetails.isFetching) {
      if (dnsRecordData.result !== null) {
        const recordData: DNSRecord = apiToDnsRecord(
          dnsRecordData.result.result
        );
        setDnsRecord(recordData);
      } else {
        handleEmptyRecord();
      }
    }
  }, [dnsRecordData, dnsRecordDetails.isFetching]);

  React.useEffect(() => {
    if (hostData && !hostDetails.isFetching) {
      setHost(hostData);
    }
  }, [hostData, hostDetails.isFetching]);

  const settings: DnsRecordsSettingsData = {
    isLoading: metadataLoading || isDnsRecordDataLoading || isHostDataLoading,
    isFetching: dnsRecordDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalDnsRecord: dnsRecord,
    dnsRecord,
    setDnsRecord,
    host,
    setHost,
    originalHost: host,
    refetch: dnsRecordDetails.refetch,
    modifiedValues: () => dnsRecord,
  };

  const getModifiedValues = (): Partial<DNSRecord> => {
    if (dnsRecordData && dnsRecordData.result !== null) {
      const transformedDnsRecord = apiToDnsRecord(
        dnsRecordData?.result.result || {}
      );
      if (!dnsRecordData || !transformedDnsRecord) {
        return {};
      }

      const modifiedValues = {};
      for (const [key, value] of Object.entries(dnsRecord)) {
        if (Array.isArray(value)) {
          if (
            JSON.stringify(transformedDnsRecord[key]) !== JSON.stringify(value)
          ) {
            modifiedValues[key] = value;
          }
        } else if (transformedDnsRecord[key] !== value) {
          modifiedValues[key] = value;
        }
      }
      return modifiedValues;
    }
    handleEmptyRecord();
    return {};
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalDnsRecord' and 'dnsRecord' objects
  React.useEffect(() => {
    if (dnsRecordData && dnsRecordData.result !== null) {
      const transformedDnsRecord = apiToDnsRecord(
        dnsRecordData?.result.result || {}
      );
      if (!dnsRecordData || !transformedDnsRecord) {
        return;
      }
      let modified = false;
      for (const [key, value] of Object.entries(dnsRecord)) {
        if (Array.isArray(value)) {
          if (
            JSON.stringify(transformedDnsRecord[key]) !== JSON.stringify(value)
          ) {
            modified = true;
            break;
          }
        } else if (transformedDnsRecord[key] !== value) {
          modified = true;
          break;
        }
      }
      setModified(modified);
    } else {
      handleEmptyRecord();
    }
  }, [dnsRecord, dnsRecordData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useDnsRecordsData };
