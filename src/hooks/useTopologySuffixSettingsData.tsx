import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useTopologySuffixShowQuery } from "src/services/rpcTopology";
// Data types
import { Metadata, TopologySuffix } from "src/utils/datatypes/globalDataTypes";
// Utils
import { apiToTopologySuffix } from "src/utils/topologyUtils";

type TopologySuffixSettingsData = {
  isLoading: boolean;
  refetch: () => void;
  metadata: Metadata;
  topologySuffix: Partial<TopologySuffix>;
};

const useTopologySuffixSettingsData = (
  topologySuffixId: string
): TopologySuffixSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};

  // [API call] Topology suffix
  const topologySuffixDetails = useTopologySuffixShowQuery(topologySuffixId);
  const topologySuffixData = topologySuffixDetails.data;

  // Data displayed in the settings form
  const [topologySuffix, setTopologySuffix] = React.useState<
    Partial<TopologySuffix>
  >({});

  React.useEffect(() => {
    if (topologySuffixData && !topologySuffixDetails.isFetching) {
      setTopologySuffix(apiToTopologySuffix(topologySuffixData.result.result));
    }
  }, [topologySuffixData, topologySuffixDetails.isFetching]);

  return {
    isLoading: metadataQuery.isLoading || topologySuffixDetails.isLoading,
    refetch: topologySuffixDetails.refetch,
    metadata,
    topologySuffix,
  };
};

export { useTopologySuffixSettingsData };
