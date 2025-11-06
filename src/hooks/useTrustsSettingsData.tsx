/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
// Data types
import { Trust, Metadata } from "src/utils/datatypes/globalDataTypes";
// Utils
import { apiToTrust } from "src/utils/trustsUtils";
import { useTrustShowQuery } from "src/services/rpcTrusts";

type TrustsSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  trust: Partial<Trust>;
  originalTrust: Partial<Trust>;
  setTrust: (trust: Partial<Trust>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Trust>;
};

const useTrustsSettingsData = (trustId: string): TrustsSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Trust
  const trustDetails = useTrustShowQuery(trustId);
  const trustData = trustDetails.data?.result?.result;
  const isTrustDataLoading = trustDetails.isLoading;
  const trustDataToTrust = apiToTrust(trustData || {});

  // States
  const [modified, setModified] = React.useState(false);
  const [trust, setTrust] = React.useState<Partial<Trust>>(trustDataToTrust);
  const [trustDuplicate, setTrustDuplicate] =
    React.useState<Partial<Trust>>(trustDataToTrust);

  // Detect any change between 'originalTrust' and 'trust' objects
  React.useEffect(() => {
    if (trustData && !trustDetails.isFetching) {
      setTrust(trustDataToTrust);
      setTrustDuplicate(trustDataToTrust);
    }
  }, [trustData, trustDetails.isFetching]);

  const settings: TrustsSettingsData = {
    isLoading: metadataLoading || isTrustDataLoading,
    isFetching: trustDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalTrust: trust,
    trust,
    setTrust,
    refetch: trustDetails.refetch,
    modifiedValues: () => trust,
  };

  settings.originalTrust = trustData || {};

  const getModifiedValues = (): Partial<Trust> => {
    if (!trustData || !trustDuplicate) {
      return {};
    }

    const modifiedValues = {};
    Object.keys(trust).forEach((key) => {
      if (trustDuplicate[key] !== trust[key]) {
        modifiedValues[key] = trust[key];
      }
    });
    return modifiedValues;
  };

  settings.modifiedValues = getModifiedValues;

  // Detect any change between 'originalTrust' and 'trust' objects
  React.useEffect(() => {
    if (!trustData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(trust)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(trustData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else if (trustData[key] !== value) {
        modified = true;
        break;
      }
    }
    setModified(modified);
  }, [trust, trustData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useTrustsSettingsData };
