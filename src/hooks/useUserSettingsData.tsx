import { useState, useEffect } from "react";

// RPC
import {
  useGetIdpServerQuery,
  useGetObjectMetadataQuery,
  useGetRadiusProxyQuery,
  useGetUsersFullDataQuery,
} from "src/services/rpc";
// Data types
import {
  IDPServer,
  Metadata,
  RadiusServer,
  User,
} from "src/utils/datatypes/globalDataTypes";

type UserSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  resetValues: () => void;
  metadata: Metadata;
  originalUser: Partial<User>;
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
  pwPolicyData?: Record<string, unknown>;
  krbtPolicyData?: Record<string, unknown>;
  certData?: Record<string, unknown>;
  refetch: () => void;
  modifiedValues: () => Partial<User>;
  radiusServers: RadiusServer[];
  idpServers: IDPServer[];
};

const useUserSettingsData = (userId: string): UserSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] User
  const userFullDataQuery = useGetUsersFullDataQuery(userId);
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

  const [modified, setModified] = useState(false);

  // Data displayed and modified by the user
  const [user, setUser] = useState<Partial<User>>({});

  useEffect(() => {
    if (userFullData && !userFullDataQuery.isFetching) {
      setUser({ ...userFullData.user });
    }
  }, [userFullData, userFullDataQuery.isFetching]);

  const settingsData = {
    isLoading:
      metadataLoading ||
      isFullDataLoading ||
      isRadiusProxyLoading ||
      isIdpLoading,
    isFetching: userFullDataQuery.isFetching,
    modified,
    metadata,
    user,
    setUser,
    radiusServers: radiusProxyData || [],
    idpServers: idpData || [],
    refetch: userFullDataQuery.refetch,
  } as UserSettingsData;

  if (userFullData) {
    settingsData.originalUser = userFullData.user || {};
    settingsData.pwPolicyData = userFullData.pwPolicy;
    settingsData.krbtPolicyData = userFullData.krbtPolicy;
    settingsData.certData = userFullData.cert;
  } else {
    settingsData.originalUser = {};
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
  settingsData.modifiedValues = getModifiedValues;

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
  settingsData.resetValues = onResetValues;

  return settingsData;
};

export default useUserSettingsData;
