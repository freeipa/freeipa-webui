// RPC
import {
  Command,
  useGetObjectMetadataQuery,
  useGetUsersFullDataQuery,
} from "src/services/rpc";

import { Metadata } from "src/utils/datatypes/globalDataTypes";

type UserSettingsData = {
  isLoading: boolean;
  metadata: Metadata;
  userData?: Record<string, unknown>;
  pwPolicyData?: Record<string, unknown>;
  krbtPolicyData?: Record<string, unknown>;
  certData?: Record<string, unknown>;
};

const useUserSettingsData = (userId: string): UserSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  const userFullDataQuery = useGetUsersFullDataQuery(userId);
  const userFullData = userFullDataQuery.data;
  const isFullDataLoading = userFullDataQuery.isLoading;

  const settingsData = {
    isLoading: metadataLoading || isFullDataLoading,
    metadata,
  } as UserSettingsData;

  if (userFullData) {
    settingsData.userData = userFullData.user;
    settingsData.pwPolicyData = userFullData.pwPolicy;
    settingsData.krbtPolicyData = userFullData.krbtPolicy;
    settingsData.certData = userFullData.cert;
  }

  return settingsData;
};

export default useUserSettingsData;
