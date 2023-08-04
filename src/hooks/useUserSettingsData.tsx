import { useState, useEffect } from "react";

// RPC
import {
  useGetIdpServerQuery,
  useGetObjectMetadataQuery,
  useGetRadiusProxyQuery,
  useGetUsersFullDataQuery,
} from "src/services/rpc";

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
  setModified: (value: boolean) => void;
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
  radiusServer: RadiusServer[];
  idpServer: IDPServer[];
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

  // [API call] RADIUS proxy server
  const idpQuery = useGetIdpServerQuery();
  const idpData = idpQuery.data;
  const isIdpLoading = idpQuery.isLoading;

  const [modified, setModified] = useState(false);

  // Data displayed and modified by the user
  const [user, setUser] = useState<Partial<User>>({});
  const [radiusServer, setRadiusServer] = useState<RadiusServer[]>([]);
  const [idpServer, setIdpServer] = useState<IDPServer[]>([]);

  useEffect(() => {
    if (userFullData && !userFullDataQuery.isFetching) {
      setUser({ ...userFullData.user });
    }
  }, [userFullData, userFullDataQuery.isFetching]);

  useEffect(() => {
    if (radiusProxyData && !radiusProxyQuery.isFetching) {
      setRadiusServer({ ...radiusProxyData });
    }
  }, [radiusProxyData, radiusProxyQuery.isFetching]);

  useEffect(() => {
    if (idpData && !idpQuery.isFetching) {
      setIdpServer({ ...idpData });
    }
  }, [idpData, idpQuery.isFetching]);

  const settingsData = {
    isLoading:
      metadataLoading ||
      isFullDataLoading ||
      isRadiusProxyLoading ||
      isIdpLoading,
    isFetching: userFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    user,
    setUser,
    radiusServer,
    idpServer,
    refetch: userFullDataQuery.refetch,
  } as UserSettingsData;

  if (userFullData) {
    settingsData.originalUser = userFullData.user || {};
    settingsData.pwPolicyData = userFullData.pwPolicy;
    settingsData.krbtPolicyData = userFullData.krbtPolicy;
    settingsData.certData = userFullData.cert;
    settingsData.radiusServer = radiusProxyData || [];
    settingsData.idpServer = idpData || [];
  } else {
    settingsData.originalUser = {};
    settingsData.radiusServer = [];
    settingsData.idpServer = [];
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
        // 'JSON.stringify' when comparing arrays (to prevent data type false positives)
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

  // Detect any change for 'radiusServer'
  useEffect(() => {
    if (!radiusProxyData) {
      return;
    }

    let modified = false;

    for (const [key, value] of Object.entries(radiusProxyData)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(radiusProxyData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (radiusProxyData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [radiusServer, radiusProxyData]);

  // Detect any change for 'idpServer'
  useEffect(() => {
    if (!idpData) {
      return;
    }

    let modified = false;

    for (const [key, value] of Object.entries(idpData)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(idpData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (idpData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [idpServer, idpData]);

  const onResetValues = () => {
    setModified(false);
  };
  settingsData.resetValues = onResetValues;

  return settingsData;
};

export default useUserSettingsData;
