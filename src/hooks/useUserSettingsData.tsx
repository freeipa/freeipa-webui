// RPC
import {
  Command,
  useGetObjectMetadataQuery,
  useGetUsersFullDataQuery,
} from "src/services/rpc";

const useUserSettingsData = (userId: string) => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Users data
  const userShowCommand: Command = {
    method: "user_show",
    params: [userId, { all: true, rights: true }],
  };

  const pwpolicyShowCommand: Command = {
    method: "pwpolicy_show",
    params: [[], { user: userId[0], all: true, rights: true }],
  };

  const krbtpolicyShowCommand: Command = {
    method: "krbtpolicy_show",
    params: [userId, { all: true, rights: true }],
  };

  const certFindCommand: Command = {
    method: "cert_find",
    params: [[], { user: userId[0], sizelimit: 0, all: true }],
  };

  const batchPayload: Command[] = [
    userShowCommand,
    pwpolicyShowCommand,
    krbtpolicyShowCommand,
    certFindCommand,
  ];

  const batchQuery = useGetUsersFullDataQuery(batchPayload);
  const batchResponse = batchQuery.data || {};
  const isBatchLoading = batchQuery.isLoading;

  return { metadata, metadataLoading, batchResponse, isBatchLoading };
};

export default useUserSettingsData;
