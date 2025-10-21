import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useDnsGlobalConfigFindQuery } from "src/services/rpcDnsGlobalConfig";
// Data types
import { DnsConfig, Metadata } from "src/utils/datatypes/globalDataTypes";
import { apiToDnsConfig } from "src/utils/dnsConfigUtils";

type DnsConfigSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalDnsConfig: Partial<DnsConfig>;
  dnsConfig: Partial<DnsConfig>;
  setDnsConfig: (cn: Partial<DnsConfig>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<DnsConfig>;
};

const useDnsConfigData = (): DnsConfigSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] DNS global config
  const dnsGlobalConfigDetails = useDnsGlobalConfigFindQuery();
  const dnsGlobalConfigData = dnsGlobalConfigDetails.data;
  const isDnsGlobalConfigDataLoading = dnsGlobalConfigDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [dnsConfig, setDnsConfig] = React.useState<Partial<DnsConfig>>({});
  const [dnsConfigDup, setDnsConfigDup] = React.useState<Partial<DnsConfig>>(
    {}
  );

  React.useEffect(() => {
    if (
      dnsGlobalConfigData &&
      !dnsGlobalConfigDetails.isFetching &&
      "result" in dnsGlobalConfigData &&
      dnsGlobalConfigData.result !== null &&
      "result" in dnsGlobalConfigData.result
    ) {
      const currentDnsConfig: DnsConfig = apiToDnsConfig(
        dnsGlobalConfigData.result.result
      );
      setDnsConfig(currentDnsConfig);
      setDnsConfigDup(currentDnsConfig);
    }
  }, [dnsGlobalConfigData, dnsGlobalConfigDetails.isFetching]);

  const settings: DnsConfigSettingsData = {
    isLoading: metadataLoading || isDnsGlobalConfigDataLoading,
    isFetching: dnsGlobalConfigDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalDnsConfig: dnsConfig,
    setDnsConfig,
    refetch: dnsGlobalConfigDetails.refetch,
    dnsConfig,
    modifiedValues: () => dnsConfig,
  };

  const getModifiedValues = (): Partial<DnsConfig> => {
    if (
      !dnsGlobalConfigData ||
      !dnsConfigDup ||
      !dnsConfig ||
      dnsConfig === dnsConfigDup
    ) {
      return {};
    }

    const modifiedValues = {};

    Object.keys(dnsConfig).forEach((key) => {
      if (dnsConfigDup[key] !== dnsConfig[key]) {
        modifiedValues[key] = dnsConfig[key];
      }
    });

    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalDnsConfig' and 'dnsConfig' objects
  React.useEffect(() => {
    if (!dnsGlobalConfigData || !dnsConfigDup || !dnsConfig) {
      return;
    }

    let modified = false;

    for (const [key, value] of Object.entries(dnsConfig)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(dnsConfigDup[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else if (dnsConfigDup[key] !== value) {
        modified = true;
        break;
      }
    }
    setModified(modified);
  }, [dnsGlobalConfigData, dnsConfig, dnsConfigDup]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useDnsConfigData };
