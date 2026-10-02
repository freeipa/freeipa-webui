import React from "react";
import { useAppSelector } from "src/store/hooks";

// RPC
import { useCertMapConfigFindQuery } from "src/services/rpcCertMapping";
// Data types
import { CertificateMappingConfig } from "src/utils/datatypes/globalDataTypes";
import { Metadata } from "src/services/types/metadata";

type CertMapConfigSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalCertMapConfig: Partial<CertificateMappingConfig>;
  certMapConfig: Partial<CertificateMappingConfig>;
  setCertMapConfig: (cn: Partial<CertificateMappingConfig>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<CertificateMappingConfig>;
};

const useCertMapConfigData = (): CertMapConfigSettingsData => {
  // [API call] Metadata
  const metadataQuery = {
    data: useAppSelector((state) => state.global.metadata),
  };
  const metadata = metadataQuery.data;

  // [API call] Certificate Mapping Config
  const certMapConfigDetails = useCertMapConfigFindQuery();
  const certMapConfigData = certMapConfigDetails.data;
  const isCertMapConfigDataLoading = certMapConfigDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [certMapConfig, setCertMapConfig] = React.useState<
    Partial<CertificateMappingConfig>
  >({});

  React.useEffect(() => {
    if (certMapConfigData && !certMapConfigDetails.isFetching) {
      setCertMapConfig({ ...certMapConfigData });
    }
  }, [certMapConfigData, certMapConfigDetails.isFetching]);

  const settings: CertMapConfigSettingsData = {
    isLoading: isCertMapConfigDataLoading,
    isFetching: certMapConfigDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalCertMapConfig: certMapConfig,
    setCertMapConfig,
    refetch: certMapConfigDetails.refetch,
    certMapConfig,
    modifiedValues: () => certMapConfig,
  };

  const getModifiedValues = (): Partial<CertificateMappingConfig> => {
    if (!certMapConfigData) {
      return {};
    }

    const modifiedValues = {};

    Object.keys(certMapConfig).forEach((key) => {
      if (certMapConfigData[key] !== certMapConfig[key]) {
        modifiedValues[key] = certMapConfig[key];
      }
    });

    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalPwPolicy' and 'pwPolicy' objects
  React.useEffect(() => {
    if (!certMapConfigData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(certMapConfig)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(certMapConfigData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (certMapConfigData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [certMapConfig, certMapConfigData]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useCertMapConfigData };
