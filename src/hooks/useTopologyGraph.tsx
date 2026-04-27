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
  const topologyFullDataQuery = useFindTopologyFullDataQuery({
    cn: "",
    sizelimit: 100,
  });
  const topologyFullData = topologyFullDataQuery.data;
  const isTopologyFullDataLoading = topologyFullDataQuery.isLoading;

  // [API call] Server
  const serverQuery = useFindServerQuery({
    cn: "",
    sizelimit: 100,
  });
  const serverData = serverQuery.data;
  const isServerDataLoading = serverQuery.isLoading;

  React.useEffect(() => {
    if (!isTopologyFullDataLoading && !isServerDataLoading) {
      setTopologySuffixes(topologyFullData?.topologySuffixes || []);
      setTopologySegments(
        topologyFullData?.topologySegments.filter(
          (s): s is TopologySegment => s !== null
        ) || []
      );
      setServers(serverData || []);
    }
  }, [isTopologyFullDataLoading, isServerDataLoading]);

  return {
    isLoading: isTopologyFullDataLoading || isServerDataLoading,
    refetch: () => {
      topologyFullDataQuery.refetch();
      serverQuery.refetch();
    },
    topologySuffixes,
    topologySegments,
    servers,
  };
};

export { useTopologyGraph };
