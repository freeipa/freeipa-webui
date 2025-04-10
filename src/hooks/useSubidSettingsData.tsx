import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useSubidShowQuery } from "src/services/rpcSubIds";
// Data types
import { SubId, Metadata } from "src/utils/datatypes/globalDataTypes";

type SubidSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalSubid: Partial<SubId>;
  subid: Partial<SubId>;
  setSubid: (fqdn: Partial<SubId>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<SubId>;
};

const useSubidSettings = (subidId: string): SubidSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Subordinate ID
  const subidDetails = useSubidShowQuery(subidId);
  const subidData = subidDetails.data;
  const isSubidDataLoading = subidDetails.isLoading;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [subid, setSubid] = React.useState<Partial<SubId>>({});

  React.useEffect(() => {
    if (subidData && !subidDetails.isFetching) {
      setSubid({ ...subidData });
    }
  }, [subidData, subidDetails.isFetching]);

  const settings = {
    isLoading: metadataLoading || isSubidDataLoading,
    isFetching: subidDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalSubid: subid,
    setSubid,
    refetch: subidDetails.refetch,
    subid,
    modifiedValues: () => subid,
  } as SubidSettingsData;

  const getModifiedValues = (): Partial<SubId> => {
    if (!subidData || !subidData.ipauniqueid) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(subid)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(subidData[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (subidData[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalSubid' and 'subid' objects
  React.useEffect(() => {
    if (!subidData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(subid)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(subidData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (subidData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [subid, subidData]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useSubidSettings };
