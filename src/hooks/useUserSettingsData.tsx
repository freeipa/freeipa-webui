import { useState, useEffect } from "react";

// RPC
import {
  useGetActiveUsersQuery,
  useGetIdpServerQuery,
  useGetObjectMetadataQuery,
  useGetRadiusProxyQuery,
  useGetUsersFullQuery,
  useGetStageUsersFullQuery,
} from "src/services/rpc";
// Data types
import {
  IDPServer,
  KrbPolicy,
  Metadata,
  PwPolicy,
  RadiusServer,
  User,
} from "src/utils/datatypes/globalDataTypes";

type UserSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalUser: Partial<User>;
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
  pwPolicyData: Partial<PwPolicy>;
  krbtPolicyData: Partial<KrbPolicy>;
  certData?: Record<string, unknown>;
  refetch: () => void;
  modifiedValues: () => Partial<User>;
  radiusServers: RadiusServer[];
  activeUsersList: Partial<User>[];
  idpServers: IDPServer[];
};

const useUserSettings = (userId: string): UserSettingsData => {
  return useSettingsData(userId, "active");
};

const useStageUserSettings = (userId: string): UserSettingsData => {
  return useSettingsData(userId, "stage");
};

const useSettingsData = (
  userId: string,
  userType: string
): UserSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] User
  let userFullDataQuery = useGetUsersFullQuery(userId);
  if (userType === "stage") {
    userFullDataQuery = useGetStageUsersFullQuery(userId);
  }
  const userFullData = userFullDataQuery.data;
  const isFullDataLoading = userFullDataQuery.isLoading;

  // [API call] RADIUS proxy server
  const radiusProxyQuery = useGetRadiusProxyQuery();
  const radiusProxyData = radiusProxyQuery.data;
  const isRadiusProxyLoading = radiusProxyQuery.isLoading;

  // [API call] IdP server
  const idpQuery = useGetIdpServerQuery();
  const idpData = idpQuery.data;
  const isIdpLoading = idpQuery.isLoading;

  // [API call] Active users (uid list)
  const activeUsersListQuery = useGetActiveUsersQuery();
  const activeUsersListData = activeUsersListQuery.data;
  const isActiveUsersListLoading = activeUsersListQuery.isLoading;

  const [modified, setModified] = useState(false);

  // Data displayed and modified by the user
  const [user, setUser] = useState<Partial<User>>({});

  useEffect(() => {
    if (userFullData && !userFullDataQuery.isFetching) {
      setUser({ ...userFullData.user });
    }
  }, [userFullData, userFullDataQuery.isFetching]);

  const settings = {
    isLoading:
      metadataLoading ||
      isFullDataLoading ||
      isRadiusProxyLoading ||
      isIdpLoading ||
      isActiveUsersListLoading,
    isFetching: userFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resetValues: () => {},
    originalUser: user,
    user,
    setUser,
    radiusServers: radiusProxyData || [],
    idpServers: idpData || [],
    activeUsersList: activeUsersListData || [],
    refetch: userFullDataQuery.refetch,
    modifiedValues: () => user,
    pwPolicyData: {},
    krbtPolicyData: {},
  } as UserSettingsData;

  if (userFullData) {
    settings.originalUser = userFullData.user || {};
    settings.pwPolicyData = userFullData.pwPolicy || {};
    settings.krbtPolicyData =
      userFullData.krbtPolicy || ({} as Partial<KrbPolicy>);
    settings.certData = userFullData.cert;
  } else {
    settings.originalUser = {};
  }

  const getModifiedValues = (): Partial<User> => {
    if (!userFullData || !userFullData.user) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(user)) {
      if (userFullData.user[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalUser' and 'user' objects
  useEffect(() => {
    if (!userFullData || !userFullData.user) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(user)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(userFullData.user[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (userFullData.user[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [user, userFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useUserSettings, useStageUserSettings };
