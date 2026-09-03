import { useState, useEffect } from "react";
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetPermissionByIdQuery } from "src/services/rpcPermissions";
import { Permission, Metadata } from "src/utils/datatypes/globalDataTypes";

type PermissionSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalPermission: Partial<Permission>;
  permission: Partial<Permission>;
  setPermission: (permission: Partial<Permission>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Permission>;
};

const usePermissionSettings = (cn: string): PermissionSettingsData => {
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  const permissionQuery = useGetPermissionByIdQuery(cn, {
    skip: !cn,
  });
  const permissionData = permissionQuery.data;
  const isPermissionLoading = permissionQuery.isLoading;

  const [modified, setModified] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [permission, setPermission] = useState<Partial<Permission>>({});
  const [originalPermission, setOriginalPermission] = useState<
    Partial<Permission>
  >({});

  useEffect(() => {
    setInitialized(false);
    setPermission({});
    setOriginalPermission({});
  }, [cn]);

  useEffect(() => {
    if (permissionQuery.isError) {
      setPermission({});
      setOriginalPermission({});
      setInitialized(true);
      return;
    }
    if (permissionData !== undefined && !permissionQuery.isFetching) {
      if (permissionData.length > 0) {
        setPermission({ ...permissionData[0] });
        setOriginalPermission({ ...permissionData[0] });
      } else {
        setPermission({});
        setOriginalPermission({});
      }
      setInitialized(true);
    }
  }, [permissionData, permissionQuery.isFetching, permissionQuery.isError]);

  const getModifiedValues = (): Partial<Permission> => {
    if (!originalPermission) {
      return {};
    }

    const modifiedValues: Partial<Permission> = {};
    for (const [key, value] of Object.entries(permission)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalPermission[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (originalPermission[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };

  useEffect(() => {
    if (!originalPermission) {
      return;
    }
    let isModified = false;
    for (const [key, value] of Object.entries(permission)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalPermission[key]) !== JSON.stringify(value)) {
          isModified = true;
          break;
        }
      } else {
        if (originalPermission[key] !== value) {
          isModified = true;
          break;
        }
      }
    }
    setModified(isModified);
  }, [permission, originalPermission]);

  const onResetValues = () => {
    setPermission({ ...originalPermission });
    setModified(false);
  };

  return {
    isLoading: metadataLoading || isPermissionLoading || !initialized,
    isFetching: permissionQuery.isFetching,
    modified,
    setModified,
    metadata,
    originalPermission,
    permission,
    setPermission,
    refetch: permissionQuery.refetch,
    modifiedValues: getModifiedValues,
    resetValues: onResetValues,
  };
};

export { usePermissionSettings };
