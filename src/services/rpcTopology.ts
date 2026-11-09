import {
  api,
  Command,
  getBatchCommand,
  BatchRPCResponse,
  FindRPCResponse,
  getCommand,
} from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
import {
  cnType,
  TopologySegment,
  TopologySuffix,
} from "src/utils/datatypes/globalDataTypes";
import { apiToTopologySuffix } from "src/utils/topologyUtils";

/**
 * Topology-related endpoints: findTopologyFullDataQuery, getTopologySuffixesFullData
 *
 * API commands:
 * - topologysuffix_find: https://freeipa.readthedocs.io/en/latest/api/topologysuffix_find.html
 * - topologysuffix_show: https://freeipa.readthedocs.io/en/latest/api/topologysuffix_show.html
 * - topologysegment_find: https://freeipa.readthedocs.io/en/latest/api/topologysegment_find.html
 */

interface TopologyFullDataPayload {
  cn: string;
  sizelimit: number;
  version?: string;
}

interface TopologySuffixesFullDataPayload {
  searchValue: string;
  apiVersion?: string;
  sizelimit: number;
  startIdx: number;
  stopIdx: number;
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
          const segmentsArray = responseDataTopologySegments.result
            .result as unknown as Record<string, unknown>[];
          if (segmentsArray.length === 0) {
            topologySegments.push(null);
          } else {
            for (const segmentData of segmentsArray) {
              const segment = segmentData as unknown as TopologySegment;
              segment.suffixType = topologyId;
              topologySegments.push(segment);
            }
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

    getTopologySuffixesFullData: build.query<
      BatchRPCResponse,
      TopologySuffixesFullDataPayload
    >({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, apiVersion, sizelimit, startIdx, stopIdx } =
          payloadData;
        const apiVersionUsed = apiVersion || API_VERSION_BACKUP;

        const findCommand: Command = {
          method: "topologysuffix_find",
          params: [
            [searchValue],
            { pkey_only: true, sizelimit, version: apiVersionUsed },
          ],
        };

        const findResult = await fetchWithBQ(getCommand(findCommand));
        if (findResult.error) return { error: findResult.error };

        const findResponse = findResult.data as FindRPCResponse;
        const totalCount = findResponse.result.result.length as number;
        const ids: string[] = [];

        for (let i = startIdx; i < totalCount && i < stopIdx; i++) {
          const item = findResponse.result.result[i] as Record<string, unknown>;
          ids.push((item.cn as string[])[0]);
        }

        const showCommands: Command[] = ids.map((id) => ({
          method: "topologysuffix_show",
          params: [[id], {}],
        }));

        const showResult = await fetchWithBQ(
          getBatchCommand(showCommands, apiVersionUsed)
        );
        const response = showResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = totalCount;
        }

        return { data: response };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useFindTopologyFullDataQuery,
  useGetTopologySuffixesFullDataQuery,
} = extendedApi;
