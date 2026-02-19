import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useIdRangeShowQuery } from "src/services/rpcIdRanges";
// Data types
import { IdRange, Metadata } from "src/utils/datatypes/globalDataTypes";
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
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

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
    isLoading: metadataLoading || isIdRangeDataLoading,
    isFetching: idRangeDetails.isFetching,
    refetch: idRangeDetails.refetch,
    metadata,
    idRange,
    setIdRange,
  };

  return settings;
};

export { useIdRangesSettingsData };
