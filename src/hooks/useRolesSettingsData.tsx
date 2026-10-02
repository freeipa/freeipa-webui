import { useState, useEffect } from "react";
import { useAppSelector } from "src/store/hooks";

// RPC
import { useRoleShowQuery } from "src/services/rpcRoles";
// Data types
import { Role } from "src/utils/datatypes/globalDataTypes";
import { Metadata } from "src/services/types/metadata";

type RoleSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalRole: Partial<Role>;
  role: Partial<Role>;
  setRole: (role: Partial<Role>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Role>;
};

const useRoleSettings = (roleId: string): RoleSettingsData => {
  // [API call] Metadata
  const metadataQuery = {
    data: useAppSelector((state) => state.global.metadata),
  };
  const metadata = metadataQuery.data;

  // [API call] Role
  const roleQuery = useRoleShowQuery(roleId);
  const roleData = roleQuery.data;
  const isRoleLoading = roleQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [role, setRole] = useState<Partial<Role>>({});
  const [originalRole, setOriginalRole] = useState<Partial<Role>>({});

  useEffect(() => {
    if (roleData && roleData.length > 0 && !roleQuery.isFetching) {
      setRole({ ...roleData[0] });
      setOriginalRole({ ...roleData[0] });
    }
  }, [roleData, roleQuery.isFetching]);

  const getModifiedValues = (): Partial<Role> => {
    if (!originalRole) {
      return {};
    }

    const modifiedValues: Partial<Role> = {};
    for (const [key, value] of Object.entries(role)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalRole[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (originalRole[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };

  useEffect(() => {
    if (!originalRole) {
      return;
    }
    let isModified = false;
    for (const [key, value] of Object.entries(role)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalRole[key]) !== JSON.stringify(value)) {
          isModified = true;
          break;
        }
      } else {
        if (originalRole[key] !== value) {
          isModified = true;
          break;
        }
      }
    }
    setModified(isModified);
  }, [role, originalRole]);

  const onResetValues = () => {
    setRole({ ...originalRole });
    setModified(false);
  };

  return {
    isLoading: isRoleLoading,
    isFetching: roleQuery.isFetching,
    modified,
    setModified,
    metadata,
    originalRole,
    role,
    setRole,
    refetch: roleQuery.refetch,
    modifiedValues: getModifiedValues,
    resetValues: onResetValues,
  };
};

export { useRoleSettings };
