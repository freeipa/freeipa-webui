import { useState, useEffect } from "react";

// RPC
import {
  useGetObjectMetadataQuery,
  useGetUsersFullDataQuery,
} from "src/services/rpc";

import { Metadata, User } from "src/utils/datatypes/globalDataTypes";

type UserSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  metadata: Metadata;
  originalUser?: Partial<User>;
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
  pwPolicyData?: Record<string, unknown>;
  krbtPolicyData?: Record<string, unknown>;
  certData?: Record<string, unknown>;
  refetch?: () => void;
};

const useUserSettingsData = (userId: string): UserSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  const userFullDataQuery = useGetUsersFullDataQuery(userId);
  const userFullData = userFullDataQuery.data;
  const isFullDataLoading = userFullDataQuery.isLoading;

  // Data displayed and modified by the user
  const [user, setUser] = useState<Partial<User>>({});
  useEffect(() => {
    if (userFullData && !userFullDataQuery.isFetching) {
      setUser({ ...userFullData.user });
    }
  }, [userFullData, userFullDataQuery.isFetching]);

  const settingsData = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: userFullDataQuery.isFetching,
    metadata,
    user,
    setUser,
    refetch: userFullDataQuery.refetch,
  } as UserSettingsData;

  if (userFullData) {
    settingsData.originalUser = userFullData.user;
    settingsData.pwPolicyData = userFullData.pwPolicy;
    settingsData.krbtPolicyData = userFullData.krbtPolicy;
    settingsData.certData = userFullData.cert;
  }

  useEffect(() => {
    if (!userFullData || !userFullData.user) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(user)) {
      if (userFullData.user[key] !== value) {
        modified = true;
        break;
      }
    }
    settingsData.modified = modified;
  }, [user, userFullData]);

  return settingsData;
};

export default useUserSettingsData;
