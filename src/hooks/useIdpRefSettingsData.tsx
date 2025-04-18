import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useIdpShowQuery } from "src/services/rpcIdp";
// Data types
import { IDPServer, Metadata } from "src/utils/datatypes/globalDataTypes";

type IdpRefSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalIdpRef: Partial<IDPServer>;
  idpRef: Partial<IDPServer>;
  setIdpRef: (fqdn: Partial<IDPServer>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<IDPServer>;
};

const useIdpRefSettingsData = (idpRefId: string): IdpRefSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] IdP Reference
  const idpRefDetails = useIdpShowQuery(idpRefId);
  const idpRefData = idpRefDetails.data;
  const isIdpRefDataLoading = idpRefDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [idpRef, setIdpRef] = React.useState<Partial<IDPServer>>({});

  React.useEffect(() => {
    if (idpRefData && !idpRefDetails.isFetching) {
      setIdpRef({ ...idpRefData });
    }
  }, [idpRefData, idpRefDetails.isFetching]);

  const settings: IdpRefSettingsData = {
    isLoading: metadataLoading || isIdpRefDataLoading,
    isFetching: idpRefDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalIdpRef: idpRef,
    setIdpRef,
    refetch: idpRefDetails.refetch,
    idpRef,
    modifiedValues: () => idpRef,
  };

  const getModifiedValues = (): Partial<IDPServer> => {
    if (!idpRefData) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(idpRef)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(idpRef[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (idpRefData[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalIdpRef' and 'idpRef' objects
  React.useEffect(() => {
    if (!idpRefData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(idpRef)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(idpRefData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (idpRefData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [idpRef, idpRefData]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useIdpRefSettingsData };
