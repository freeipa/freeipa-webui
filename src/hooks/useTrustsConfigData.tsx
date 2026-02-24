import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGlobalTrustConfigShowQuery } from "src/services/rpcTrusts";
import { useGroupFindQuery } from "src/services/rpcUserGroups";
// Data types
import {
  GlobalTrustConfig,
  groupType,
  Metadata,
} from "src/utils/datatypes/globalDataTypes";
import { getModifiedValues, isObjectModified } from "src/utils/ipaObjectUtils";
import { apiToGlobalTrustConfig } from "src/utils/trustsConfigUtils";

type TrustsConfigSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalGlobalTrustConfig: Partial<GlobalTrustConfig>;
  globalTrustConfig: Partial<GlobalTrustConfig>;
  setGlobalTrustConfig: (cn: Partial<GlobalTrustConfig>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<GlobalTrustConfig>;
  userGroups: groupType[];
};

const useTrustsConfigData = (): TrustsConfigSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Global trust config
  const globalTrustConfigDetails = useGlobalTrustConfigShowQuery();
  const globalTrustConfigData = globalTrustConfigDetails.data;
  const isGlobalTrustConfigDataLoading = globalTrustConfigDetails.isLoading;

  // [API call] User groups
  const userGroupsDetails = useGroupFindQuery();
  const userGroupsData = userGroupsDetails.data;

  const [modified, setModified] = React.useState(false);

  // Data displayed and modified by the user
  const [globalTrustConfig, setGlobalTrustConfig] = React.useState<
    Partial<GlobalTrustConfig>
  >({});
  const [globalTrustConfigDup, setGlobalTrustConfigDup] = React.useState<
    Partial<GlobalTrustConfig>
  >({});
  const [userGroups, setUserGroups] = React.useState<groupType[]>([]);

  React.useEffect(() => {
    if (
      globalTrustConfigData &&
      !globalTrustConfigDetails.isFetching &&
      userGroupsData &&
      !userGroupsDetails.isFetching
    ) {
      setGlobalTrustConfig(
        apiToGlobalTrustConfig(globalTrustConfigData.result.result)
      );
      setGlobalTrustConfigDup(
        apiToGlobalTrustConfig(globalTrustConfigData.result.result)
      );
      setUserGroups(userGroupsData);
    }
  }, [
    globalTrustConfigData,
    globalTrustConfigDetails.isFetching,
    userGroupsDetails,
    userGroupsDetails.isFetching,
  ]);

  const settings: TrustsConfigSettingsData = {
    isLoading: metadataLoading || isGlobalTrustConfigDataLoading,
    isFetching: globalTrustConfigDetails.isFetching,
    modified,
    setModified,
    metadata,
    resetValues: () => {},
    originalGlobalTrustConfig: globalTrustConfig,
    globalTrustConfig,
    setGlobalTrustConfig,
    refetch: globalTrustConfigDetails.refetch,
    modifiedValues: () => globalTrustConfig,
    userGroups,
  };

  settings.modifiedValues = (): Partial<GlobalTrustConfig> => {
    return getModifiedValues(globalTrustConfig, globalTrustConfigDup || null);
  };

  React.useEffect(() => {
    const newModified = isObjectModified(
      globalTrustConfig,
      globalTrustConfigDup || null
    );
    if (newModified !== modified) {
      setModified(newModified);
    }
  }, [globalTrustConfig, globalTrustConfigDup]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useTrustsConfigData };
