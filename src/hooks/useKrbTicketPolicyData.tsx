import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useKrbtPolicyShowQuery } from "src/services/rpcKrbTicketPolicy";
// Data types
import { KrbTicket, Metadata } from "src/utils/datatypes/globalDataTypes";

type KrbTicketSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalPwPolicy: Partial<KrbTicket>;
  krbTicket: Partial<KrbTicket>;
  setKrbTicket: (cn: Partial<KrbTicket>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<KrbTicket>;
};

const useKrbTicketPolicyData = (): KrbTicketSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Password Policy
  const krbTicketDetails = useKrbtPolicyShowQuery();
  const krbTicketData = krbTicketDetails.data;
  const isKrbTicketDataLoading = krbTicketDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [krbTicket, setKrbTicket] = React.useState<Partial<KrbTicket>>({});

  React.useEffect(() => {
    if (krbTicketData && !krbTicketDetails.isFetching) {
      setKrbTicket({ ...krbTicketData });
    }
  }, [krbTicketData, krbTicketDetails.isFetching]);

  const settings: KrbTicketSettingsData = {
    isLoading: metadataLoading || isKrbTicketDataLoading,
    isFetching: krbTicketDetails.isFetching,
    modified,
    setModified,
    metadata,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resetValues: () => {},
    originalPwPolicy: krbTicket,
    setKrbTicket,
    refetch: krbTicketDetails.refetch,
    krbTicket,
    modifiedValues: () => krbTicket,
  };

  const getModifiedValues = (): Partial<KrbTicket> => {
    if (!krbTicketData) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(krbTicket)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(krbTicket[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (krbTicketData[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalPwPolicy' and 'pwPolicy' objects
  React.useEffect(() => {
    if (!krbTicketData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(krbTicket)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(krbTicketData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (krbTicketData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [krbTicket, krbTicketData]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useKrbTicketPolicyData };
