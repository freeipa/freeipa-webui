import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useCertMapShowQuery } from "src/services/rpcCertMapping";
// Data types
import {
  CertificateMapping,
  Metadata,
} from "src/utils/datatypes/globalDataTypes";
import { isValueModified } from "src/utils/ipaObjectUtils";

type CertMappingSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalCertMapping: Partial<CertificateMapping>;
  certMapping: Partial<CertificateMapping>;
  setCertMapping: (fqdn: Partial<CertificateMapping>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<CertificateMapping>;
};

const useCertificateMappingSettingsData = (
  certMappingId: string
): CertMappingSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Certificate Mapping
  const certMappingDetails = useCertMapShowQuery(certMappingId);
  const certMappingData = certMappingDetails.data;
  const isCertMappingDataLoading = certMappingDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [certMapping, setCertMapping] = React.useState<
    Partial<CertificateMapping>
  >({});

  React.useEffect(() => {
    if (certMappingData && !certMappingDetails.isFetching) {
      setCertMapping({ ...certMappingData });
    }
  }, [certMappingData, certMappingDetails.isFetching]);

  const settings: CertMappingSettingsData = {
    isLoading: metadataLoading || isCertMappingDataLoading,
    isFetching: certMappingDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalCertMapping: certMapping,
    setCertMapping,
    refetch: certMappingDetails.refetch,
    certMapping,
    modifiedValues: () => certMapping,
  };

  const getModifiedValues = (): Partial<CertificateMapping> => {
    if (certMapping === certMappingData) return {};
    if (certMappingData === null) return { ...certMapping };

    const modifiedValues: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(certMapping)) {
      if (certMappingData && isValueModified(value, certMappingData[key])) {
        if (Array.isArray(value)) {
          modifiedValues[key] = certMapping[key];
        } else {
          modifiedValues[key] = value;
        }
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalCertMapping' and 'certMapping' objects
  React.useEffect(() => {
    if (!certMappingData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(certMapping)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(certMappingData[key]) !== JSON.stringify(value)) {
          // if (certMappingData && isValueModified(value, certMappingData[key])) {
          modified = true;
          break;
        }
      } else {
        if (certMappingData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [certMapping, certMappingData]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useCertificateMappingSettingsData };
