import {
  api,
  Command,
  getCommand,
  getBatchCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToIDView } from "src/utils/idViewUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
// Data types
import { IDView } from "src/utils/datatypes/globalDataTypes";

/**
 * ID view-related endpoints:
 * getIDViewsFullData, getIDViewInfoByName, addIDView, removeIDViews, saveIDVIew,
 * unapplyHosts, unapplyHostgroups
 *
 * API commands:
 * - idview_add: https://freeipa.readthedocs.io/en/latest/api/idview_add.html
 * - idview_del: https://freeipa.readthedocs.io/en/latest/api/idview_del.html
 * - idview_show: https://freeipa.readthedocs.io/en/latest/api/idview_show.html
 * - idview_mod: https://freeipa.readthedocs.io/en/latest/api/idview_mod.html
 * - idview_unapply: https://freeipa.readthedocs.io/en/latest/api/idview_unapply.html
 */

export interface ViewAddPayload {
  viewName: string;
  version?: string;
  description?: string;
}

type ViewFullData = {
  idView?: Partial<IDView>;
};

export interface ViewApplyPayload {
  viewName: string;
  items: string[];
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getIDViewsFullData: build.query<ViewFullData, string>({
      query: (viewId) => {
        // Prepare search parameters
        const view_params = {
          all: true,
          rights: true,
        };

        const viewShowCommand: Command = {
          method: "idview_show",
          params: [[viewId], view_params],
        };

        const batchPayload: Command[] = [viewShowCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): ViewFullData => {
        const [viewResponse] = response.result.results;

        // Initialize data (to prevent 'undefined' values)
        const viewData = viewResponse.result;

        let viewObject = {};
        if (!viewResponse.error) {
          viewObject = apiToIDView(viewData);
        }

        return {
          idView: viewObject,
        };
      },
      providesTags: ["FullIDView"],
    }),
    /**
     * Add a ID view
     * @param {object} ViewAddPayload - ID View payload parameters
     * @param ViewAddPayload.groupName - The name of the view
     * @param ViewAddPayload.desc - The view description
     * @param ViewAddPayload.version - The api version
     */
    addIDView: build.mutation<FindRPCResponse, ViewAddPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["viewName"]],
          {
            version: payloadData.version || API_VERSION_BACKUP,
          },
        ];

        if ("description" in payloadData && payloadData["description"] !== "") {
          params[1]["description"] = payloadData["description"];
        }

        return getCommand({
          method: "idview_add",
          params: params,
        });
      },
    }),
    /**
     * Remove ID views
     * @param {IDView[]} listOfViews - List of views to remove
     */
    removeIDViews: build.mutation<BatchRPCResponse, IDView[]>({
      query: (views) => {
        const viewsToDeletePayload: Command[] = [];
        views.map((view) => {
          const payloadItem = {
            method: "idview_del",
            params: [[view.cn], {}],
          } as Command;
          viewsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(viewsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    saveIDView: build.mutation<FindRPCResponse, Partial<IDView>>({
      query: (view) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...view,
        };
        delete params["cn"];
        const cn = view.cn !== undefined ? view.cn : "";
        return getCommand({
          method: "idview_mod",
          params: [[cn], params],
        });
      },
      invalidatesTags: ["FullIDView"],
    }),
    /**
     * Unapply the ID views from hosts
     * @param {string[]} hostNames - List of hosts
     */
    unapplyHosts: build.mutation<FindRPCResponse, string[]>({
      query: (hosts) => {
        return getCommand({
          method: "idview_unapply",
          params: [[], { host: hosts }],
        });
      },
      invalidatesTags: ["FullIDViewHosts"],
    }),
    /**
     * Unapply the ID views from host groups
     * @param {string[]} hostgroupNames - List of hostgroup names
     */
    unapplyHostgroups: build.mutation<FindRPCResponse, string[]>({
      query: (hostGroups) => {
        return getCommand({
          method: "idview_unapply",
          params: [[], { hostgroup: hostGroups }],
        });
      },
      invalidatesTags: ["FullIDViewHostgroups"],
    }),
    applyHosts: build.mutation<FindRPCResponse, ViewApplyPayload>({
      query: (payload) => {
        return getCommand({
          method: "idview_apply",
          params: [[payload.viewName], { host: payload.items }],
        });
      },
      invalidatesTags: ["FullIDViewHosts"],
    }),
    applyHostGroups: build.mutation<FindRPCResponse, ViewApplyPayload>({
      query: (payload) => {
        return getCommand({
          method: "idview_apply",
          params: [[payload.viewName], { hostgroup: payload.items }],
        });
      },
      invalidatesTags: ["FullIDViewHosts"],
    }),
  }),
  overrideExisting: false,
});

// Views
export const useGettingIDViewsQuery = (payloadData) => {
  payloadData["objName"] = "idview";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

export const {
  useAddIDViewMutation,
  useRemoveIDViewsMutation,
  useGetIDViewsFullDataQuery,
  useSaveIDViewMutation,
  useUnapplyHostsMutation,
  useUnapplyHostgroupsMutation,
  useApplyHostsMutation,
  useApplyHostGroupsMutation,
} = extendedApi;
