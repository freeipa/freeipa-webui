import React from "react";
// RPC
import { useFindTopologyFullDataQuery } from "src/services/rpcTopology";
import { useFindServerQuery } from "src/services/rpcServer";
// Data types
import {
  TopologySuffix,
  TopologySegment,
  IpaServer,
} from "src/utils/datatypes/globalDataTypes";

type TopologyGraphData = {
  isLoading: boolean;
  refetch: () => void;
  servers: IpaServer[];
  topologySuffixes: TopologySuffix[];
  topologySegments: TopologySegment[];
};

const useTopologyGraph = (): TopologyGraphData => {
  const [topologySuffixes, setTopologySuffixes] = React.useState<
    TopologySuffix[]
  >([]);
  const [topologySegments, setTopologySegments] = React.useState<
    TopologySegment[]
  >([]);
  const [servers, setServers] = React.useState<IpaServer[]>([]);

  // [API call] Topology suffix & segments
  const {
    refetch: refetchTopology,
    data: topologyData,
    isLoading: isTopologyDataLoading,
  } = useFindTopologyFullDataQuery({
    cn: "",
    sizelimit: 100,
  });

  // [API call] Server
  const {
    refetch: refetchServer,
    data: serverData,
    isLoading: isServerDataLoading,
  } = useFindServerQuery({
    cn: "",
    sizelimit: 100,
  });

  React.useEffect(() => {
    if (!isTopologyDataLoading && !isServerDataLoading) {
      setTopologySuffixes(topologyData?.topologySuffixes || []);
      setTopologySegments(
        topologyData?.topologySegments.filter(
          (s): s is TopologySegment => s !== null
        ) || []
      );
      setServers(serverData || []);
    }
  }, [isTopologyDataLoading, isServerDataLoading, topologyData, serverData]);

  return {
    isLoading: isTopologyDataLoading || isServerDataLoading,
    refetch: () => {
      refetchTopology();
      refetchServer();
    },
    topologySuffixes,
    topologySegments,
    servers,
  };
};

export { useTopologyGraph };
