import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { usePrivilegeShowQuery } from "src/services/rpcPrivileges";
// Data types
import { Privilege, Metadata } from "src/utils/datatypes/globalDataTypes";

type PrivilegeSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalPrivilege: Partial<Privilege>;
  privilege: Partial<Privilege>;
  setPrivilege: (privilege: Partial<Privilege>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Privilege>;
};

const usePrivilegeSettings = (privilegeId: string): PrivilegeSettingsData => {
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  const privilegeQuery = usePrivilegeShowQuery(privilegeId);
  const privilegeData = privilegeQuery.data;
  const isPrivilegeLoading = privilegeQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [privilege, setPrivilege] = useState<Partial<Privilege>>({});
  const [originalPrivilege, setOriginalPrivilege] = useState<
    Partial<Privilege>
  >({});

  useEffect(() => {
    setInitialized(false);
    setPrivilege({});
    setOriginalPrivilege({});
  }, [privilegeId]);

  useEffect(() => {
    if (privilegeData !== undefined && !privilegeQuery.isFetching) {
      if (privilegeData.length > 0) {
        setPrivilege({ ...privilegeData[0] });
        setOriginalPrivilege({ ...privilegeData[0] });
      } else {
        setPrivilege({});
        setOriginalPrivilege({});
      }
      setInitialized(true);
    }
  }, [privilegeData, privilegeQuery.isFetching]);

  const getModifiedValues = (): Partial<Privilege> => {
    if (!originalPrivilege) {
      return {};
    }

    const modifiedValues: Partial<Privilege> = {};
    for (const [key, value] of Object.entries(privilege)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalPrivilege[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (originalPrivilege[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };

  useEffect(() => {
    if (!originalPrivilege) {
      return;
    }
    let isModified = false;
    for (const [key, value] of Object.entries(privilege)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalPrivilege[key]) !== JSON.stringify(value)) {
          isModified = true;
          break;
        }
      } else {
        if (originalPrivilege[key] !== value) {
          isModified = true;
          break;
        }
      }
    }
    setModified(isModified);
  }, [privilege, originalPrivilege]);

  const onResetValues = () => {
    setPrivilege({ ...originalPrivilege });
    setModified(false);
  };

  return {
    isLoading: metadataLoading || isPrivilegeLoading || !initialized,
    isFetching: privilegeQuery.isFetching,
    modified,
    setModified,
    metadata,
    originalPrivilege,
    privilege,
    setPrivilege,
    refetch: privilegeQuery.refetch,
    modifiedValues: getModifiedValues,
    resetValues: onResetValues,
  };
};

export { usePrivilegeSettings };
