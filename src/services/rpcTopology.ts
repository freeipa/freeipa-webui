import { api, FindRPCResponse, getCommand } from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
import {
  cnType,
  TopologySegment,
  TopologySuffix,
} from "src/utils/datatypes/globalDataTypes";
import { apiToTopologySuffix } from "src/utils/topologyUtils";

/**
 * Topology-related endpoints: findTopologyFullDataQuery
 *
 * API commands:
 * - topologysuffix_find: https://freeipa.readthedocs.io/en/latest/api/topologysuffix_find.html
 * - topologyssegment_find: https://freeipa.readthedocs.io/en/latest/api/topologyssegment_find.html
 */

interface TopologyFullDataPayload {
  cn: string;
  sizelimit: number;
  version?: string;
}

interface TopologyFullData {
  topologySuffixes: TopologySuffix[];
  topologySegments: (TopologySegment | null)[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Find topology full data
     * @param {string} cn - The CN of the topology
     * @returns {TopologyFullData} - The topology full data
     */
    findTopologyFullData: build.query<
      TopologyFullData,
      TopologyFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { cn, sizelimit, version } = payloadData;

        const params = {
          sizelimit,
          version: version || API_VERSION_BACKUP,
        };

        // Make call using 'fetchWithBQ'
        const getResultTopology = await fetchWithBQ(
          getCommand({
            method: "topologysuffix_find",
            params: [[cn], params],
          })
        );

        // Return possible errors
        if (getResultTopology.error) {
          return { error: getResultTopology.error };
        }

        // If no error: cast and assign 'data'
        const responseDataTopology = getResultTopology.data as FindRPCResponse;

        const topologyIds: string[] = [];
        const topologyItemsCount = responseDataTopology.result.result
          .length as number;

        for (let i = 0; i < topologyItemsCount && i < sizelimit; i++) {
          const topologyId = responseDataTopology.result.result[i] as cnType;
          const { cn } = topologyId;
          topologyIds.push(cn[0] as string);
        }

        const topologySuffixes: TopologySuffix[] = [];
        for (let i = 0; i < topologyItemsCount && i < sizelimit; i++) {
          topologySuffixes.push(
            apiToTopologySuffix(
              responseDataTopology.result.result[i] as Record<string, unknown>
            )
          );
        }

        // Find the topology segments and feed them with the data we just got
        const topologySegments: (TopologySegment | null)[] = [];
        for (const topologyId of topologyIds) {
          const getTopologySegmentsResult = await fetchWithBQ(
            getCommand({
              method: "topologysegment_find",
              params: [[topologyId], params],
            })
          );

          if (getTopologySegmentsResult.error) {
            return { error: getTopologySegmentsResult.error };
          }

          const responseDataTopologySegments =
            getTopologySegmentsResult.data as FindRPCResponse;
          const topSegment = responseDataTopologySegments.result.result;
          if (topSegment.length === 0) {
            topologySegments.push(null);
          } else {
            const segment = topSegment as unknown as TopologySegment;
            segment.suffixType = topologyId;
            topologySegments.push(segment);
          }
        }

        return {
          data: {
            topologySuffixes,
            topologySegments,
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useFindTopologyFullDataQuery } = extendedApi;
