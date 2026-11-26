import { useState, useEffect } from "react";
import { useAppSelector } from "src/store/hooks";
// RPC
import { useRadiusServerShowQuery } from "src/services/rpcRadiusServers";
// Data types
import { RadiusServer } from "src/utils/datatypes/globalDataTypes";
import { Metadata } from "src/services/types/metadata";

type RadiusServerSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalRadiusServer: Partial<RadiusServer>;
  radiusServer: Partial<RadiusServer>;
  setRadiusServer: (server: Partial<RadiusServer>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<RadiusServer>;
};

const useRadiusServerSettings = (
  serverId: string
): RadiusServerSettingsData => {
  // Metadata from global Redux state
  const metadata = useAppSelector((state) => state.global.metadata);

  // [API call] RADIUS Server
  const serverQuery = useRadiusServerShowQuery(serverId);

  const [modified, setModified] = useState(false);
  const [radiusServer, setRadiusServer] = useState<Partial<RadiusServer>>({});
  const [originalRadiusServer, setOriginalRadiusServer] = useState<
    Partial<RadiusServer>
  >({});

  useEffect(() => {
    if (serverQuery.data && !serverQuery.isFetching) {
      setRadiusServer({ ...serverQuery.data });
      setOriginalRadiusServer({ ...serverQuery.data });
    }
  }, [
    serverQuery.data,
    serverQuery.isFetching,
    serverQuery.fulfilledTimeStamp,
  ]);

  const getModifiedValues = (): Partial<RadiusServer> => {
    if (!originalRadiusServer) {
      return {};
    }

    const modifiedValues: Partial<RadiusServer> = {};
    for (const [key, value] of Object.entries(radiusServer)) {
      if (Array.isArray(value)) {
        if (
          JSON.stringify(originalRadiusServer[key]) !== JSON.stringify(value)
        ) {
          modifiedValues[key] = value;
        }
      } else if (originalRadiusServer[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };

  useEffect(() => {
    if (!originalRadiusServer) {
      return;
    }
    let isModified = false;
    for (const [key, value] of Object.entries(radiusServer)) {
      if (Array.isArray(value)) {
        if (
          JSON.stringify(originalRadiusServer[key]) !== JSON.stringify(value)
        ) {
          isModified = true;
          break;
        }
      } else {
        if (originalRadiusServer[key] !== value) {
          isModified = true;
          break;
        }
      }
    }
    setModified(isModified);
  }, [radiusServer, originalRadiusServer]);

  const onResetValues = () => {
    setRadiusServer({ ...originalRadiusServer });
    setModified(false);
  };

  return {
    isLoading: serverQuery.isLoading,
    isFetching: serverQuery.isFetching,
    modified,
    setModified,
    metadata,
    originalRadiusServer,
    radiusServer,
    setRadiusServer,
    refetch: serverQuery.refetch,
    modifiedValues: getModifiedValues,
    resetValues: onResetValues,
  };
};

export { useRadiusServerSettings };
