import { InternalizationResponse } from "src/utils/datatypes/Internalization";
import { api } from "./rpc";
import { API_VERSION_BACKUP } from "src/utils/utils";

type InternalizationPayload = {
  language: string;
};

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getInternalization: build.query<
      InternalizationResponse,
      InternalizationPayload
    >({
      query: ({ language }) => ({
        url: "/ipa/i18n_messages",
        method: "POST",
        headers: {
          "Accept-Language": language,
        },
        body: {
          method: "i18n_messages",
          params: [[], { version: API_VERSION_BACKUP }],
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetInternalizationQuery } = extendedApi;
