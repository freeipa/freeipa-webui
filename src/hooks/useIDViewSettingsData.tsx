import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetIDViewsFullDataQuery } from "src/services/rpcIDViews";
// Data types
import { IDView, Metadata } from "src/utils/datatypes/globalDataTypes";

type IDViewSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalView: Partial<IDView>;
  idView: Partial<IDView>;
  setIDView: (idView: Partial<IDView>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<IDView>;
};

const useIDViewSettings = (viewId: string): IDViewSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Host Group
  const idViewFullDataQuery = useGetIDViewsFullDataQuery(viewId);
  const idViewFullData = idViewFullDataQuery.data;
  const isFullDataLoading = idViewFullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [idView, setIDView] = useState<Partial<IDView>>({});

  useEffect(() => {
    if (idViewFullData && !idViewFullDataQuery.isFetching) {
      setIDView({ ...idViewFullData.idView });
    }
  }, [idViewFullData, idViewFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: idViewFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalView: idView,
    idView,
    setIDView,
    refetch: idViewFullDataQuery.refetch,
    modifiedValues: () => idView,
  } as IDViewSettingsData;

  if (idViewFullData) {
    settings.originalView = idViewFullData.idView || {};
  } else {
    settings.originalView = {};
  }

  const getModifiedValues = (): Partial<IDView> => {
    if (!idViewFullData || !idViewFullData.idView) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(idView)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(idViewFullData.idView[key]) !== JSON.stringify(value)
        ) {
          modifiedValues[key] = value;
        }
      } else if (idViewFullData.idView[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalGroup' and 'group' objects
  useEffect(() => {
    if (!idViewFullData || !idViewFullData.idView) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(idView)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (
          JSON.stringify(idViewFullData.idView[key]) !== JSON.stringify(value)
        ) {
          modified = true;
          break;
        }
      } else {
        if (idViewFullData.idView[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [idView, idViewFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useIDViewSettings };
