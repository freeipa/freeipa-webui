import { useState, useEffect } from "react";
import { useAppSelector } from "src/store/hooks";

// RPC
import { useSysAccountShowQuery } from "src/services/rpcSystemAccounts";
// Data types
import { SysAccount } from "src/utils/datatypes/globalDataTypes";
import { Metadata } from "src/services/types/metadata";

type SysAccountSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  notFound: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalSysAccount: Partial<SysAccount>;
  sysAccount: Partial<SysAccount>;
  setSysAccount: (sysAccount: Partial<SysAccount>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<SysAccount>;
};

const useSysAccountSettings = (
  sysAccountId: string
): SysAccountSettingsData => {
  // [API call] Metadata
  const metadata = useAppSelector((state) => state.global.metadata);

  // [API call] System account
  const sysAccountQuery = useSysAccountShowQuery(sysAccountId);
  const sysAccountData = sysAccountQuery.data;
  const isSysAccountLoading = sysAccountQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [sysAccount, setSysAccount] = useState<Partial<SysAccount>>({});
  const [originalSysAccount, setOriginalSysAccount] = useState<
    Partial<SysAccount>
  >({});

  useEffect(() => {
    if (
      sysAccountData &&
      sysAccountData.length > 0 &&
      !sysAccountQuery.isFetching
    ) {
      setSysAccount({ ...sysAccountData[0] });
      setOriginalSysAccount({ ...sysAccountData[0] });
    }
  }, [sysAccountData, sysAccountQuery.isFetching]);

  // Query has settled but returned no valid system account
  const notFound =
    !isSysAccountLoading &&
    !sysAccountQuery.isFetching &&
    (sysAccountQuery.isError ||
      (sysAccountQuery.isSuccess &&
        (!sysAccountData ||
          sysAccountData.length === 0 ||
          !sysAccountData[0].uid)));

  const getModifiedValues = (): Partial<SysAccount> => {
    if (!originalSysAccount) {
      return {};
    }

    const modifiedValues: Partial<SysAccount> = {};
    for (const [key, value] of Object.entries(sysAccount)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalSysAccount[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (originalSysAccount[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };

  useEffect(() => {
    if (!originalSysAccount) {
      return;
    }
    let isModified = false;
    for (const [key, value] of Object.entries(sysAccount)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalSysAccount[key]) !== JSON.stringify(value)) {
          isModified = true;
          break;
        }
      } else {
        if (originalSysAccount[key] !== value) {
          isModified = true;
          break;
        }
      }
    }
    setModified(isModified);
  }, [sysAccount, originalSysAccount]);

  const onResetValues = () => {
    setSysAccount({ ...originalSysAccount });
    setModified(false);
  };

  return {
    isLoading: isSysAccountLoading,
    isFetching: sysAccountQuery.isFetching,
    notFound,
    modified,
    setModified,
    metadata,
    originalSysAccount,
    sysAccount,
    setSysAccount,
    refetch: sysAccountQuery.refetch,
    modifiedValues: getModifiedValues,
    resetValues: onResetValues,
  };
};

export { useSysAccountSettings };
