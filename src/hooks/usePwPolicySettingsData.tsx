import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { usePwPolicyShowQuery } from "src/services/rpcPwdPolicies";
// Data types
import { PwPolicy, Metadata } from "src/utils/datatypes/globalDataTypes";

type PwPolicySettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalPwPolicy: Partial<PwPolicy>;
  pwPolicy: Partial<PwPolicy>;
  setPwPolicy: (fqdn: Partial<PwPolicy>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<PwPolicy>;
};

const usePasswordPolicySettings = (
  pwPolicyId: string
): PwPolicySettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Password Policy
  const pwPolicyDetails = usePwPolicyShowQuery(pwPolicyId);
  const pwPolicyData = pwPolicyDetails.data;
  const isPwPolicyDataLoading = pwPolicyDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [pwPolicy, setPwPolicy] = React.useState<Partial<PwPolicy>>({});

  React.useEffect(() => {
    if (pwPolicyData && !pwPolicyDetails.isFetching) {
      setPwPolicy({ ...pwPolicyData });
    }
  }, [pwPolicyData, pwPolicyDetails.isFetching]);

  const settings = {
    isLoading: metadataLoading || isPwPolicyDataLoading,
    isFetching: pwPolicyDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalPwPolicy: pwPolicy,
    setPwPolicy,
    refetch: pwPolicyDetails.refetch,
    pwPolicy,
    modifiedValues: () => pwPolicy,
  } as PwPolicySettingsData;

  const getModifiedValues = (): Partial<PwPolicy> => {
    if (!pwPolicyData || !pwPolicyData.cn) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(pwPolicy)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(pwPolicy[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (pwPolicyData[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalPwPolicy' and 'pwPolicy' objects
  React.useEffect(() => {
    if (!pwPolicyData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(pwPolicy)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(pwPolicyData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (pwPolicyData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [pwPolicy, pwPolicyData]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { usePasswordPolicySettings };
