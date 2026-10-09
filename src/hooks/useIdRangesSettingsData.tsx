import React from "react";
import { useAppSelector } from "src/store/hooks";

// RPC
import { useIdRangeShowQuery } from "src/services/rpcIdRanges";
// Data types
import { IdRange } from "src/utils/datatypes/globalDataTypes";
import { Metadata } from "src/services/types/metadata";
// Utils
import { apiToIdRange } from "src/utils/idRangesUtils";

type IdRangesSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
  metadata: Metadata;
  idRange: Partial<IdRange>;
  setIdRange: (idRange: Partial<IdRange>) => void;
};

const useIdRangesSettingsData = (idRangeId: string): IdRangesSettingsData => {
  // [API call] Metadata
  const metadataQuery = {
    data: useAppSelector((state) => state.global.metadata),
  };
  const metadata = metadataQuery.data;

  // [API call] ID range
  const idRangeDetails = useIdRangeShowQuery(idRangeId);
  const idRangeData = idRangeDetails.data;
  const isIdRangeDataLoading = idRangeDetails.isLoading;

  // Data displayed and modified by the user
  const [idRange, setIdRange] = React.useState<Partial<IdRange>>({});

  React.useEffect(() => {
    if (idRangeData && !idRangeDetails.isFetching) {
      const rangeData: IdRange = apiToIdRange(idRangeData.result.result);
      setIdRange(rangeData);
    }
  }, [idRangeData, idRangeDetails.isFetching]);

  const settings: IdRangesSettingsData = {
    isLoading: isIdRangeDataLoading,
    isFetching: idRangeDetails.isFetching,
    refetch: idRangeDetails.refetch,
    metadata,
    idRange,
    setIdRange,
  };

  return settings;
};

export { useIdRangesSettingsData };
