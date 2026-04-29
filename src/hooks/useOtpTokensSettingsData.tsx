import React from "react";
// RPC
import { useShowOtpTokenQuery } from "src/services/rpcOtpTokens";
import { useGetActiveUsersQuery } from "src/services/rpcUsers";
import { useGetObjectMetadataQuery } from "src/services/rpc";
// Data types
import { Metadata, OtpToken, User } from "src/utils/datatypes/globalDataTypes";
import { apiToOtpToken } from "src/utils/otpTokensUtils";

type OtpTokensSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
  modified: boolean;
  setModified: (modified: boolean) => void;
  otpToken: Partial<OtpToken>;
  users: User[];
  metadata: Metadata;
  originalOtpToken: Partial<OtpToken>;
  setOtpToken: (otpToken: Partial<OtpToken>) => void;
  modifiedValues: () => Partial<OtpToken>;
  resetValues: () => void;
};

const useOtpTokensSettingsData = (
  otpTokenId: string
): OtpTokensSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] OTP token
  const otpTokenQuery = useShowOtpTokenQuery(otpTokenId);
  const otpTokenData = otpTokenQuery.data;
  const isOtpTokenLoading = otpTokenQuery.isLoading;

  // [API call] Active users
  const activeUsersQuery = useGetActiveUsersQuery();
  const activeUsers = activeUsersQuery.data;
  const isActiveUsersLoading = activeUsersQuery.isLoading;

  // States
  const [otpToken, setOtpToken] = React.useState<Partial<OtpToken>>({});
  const [originalOtpToken, setOriginalOtpToken] = React.useState<
    Partial<OtpToken>
  >({});
  const [users, setUsers] = React.useState<User[]>([]);
  const [modified, setModified] = React.useState(false);

  React.useEffect(() => {
    if (otpTokenData && !otpTokenQuery.isFetching) {
      const otpTokenResult: OtpToken = apiToOtpToken(
        otpTokenData.result.result
      );
      setOtpToken(otpTokenResult);
      setOriginalOtpToken(otpTokenResult);
    }
  }, [otpTokenData, otpTokenQuery.isFetching]);

  React.useEffect(() => {
    if (activeUsers && !activeUsersQuery.isFetching) {
      setUsers(activeUsers);
    }
  }, [activeUsers, activeUsersQuery.isFetching]);

  const settings: OtpTokensSettingsData = {
    isLoading: metadataLoading || isOtpTokenLoading || isActiveUsersLoading,
    isFetching: otpTokenQuery.isFetching || activeUsersQuery.isFetching,
    refetch: () => {
      metadataQuery.refetch();
      otpTokenQuery.refetch();
      activeUsersQuery.refetch();
    },
    modified,
    setModified,
    otpToken,
    users,
    metadata,
    originalOtpToken,
    setOtpToken,
    modifiedValues: () => otpToken,
    resetValues: () => {},
  };

  const getModifiedValues = (): Partial<OtpToken> => {
    if (!otpToken) {
      return {};
    }

    const modifiedValues = {};
    Object.keys(otpToken).forEach((key) => {
      if (originalOtpToken[key] !== otpToken[key]) {
        modifiedValues[key] = otpToken[key];
      }
    });
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalOtpToken' and 'otpToken' objects
  React.useEffect(() => {
    if (!otpToken || !originalOtpToken) {
      return;
    }

    let modified = false;

    for (const [key, value] of Object.entries(otpToken)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalOtpToken[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else if (originalOtpToken[key] !== value) {
        modified = true;
        break;
      }
    }
    setModified(modified);
  }, [otpTokenData, otpToken, originalOtpToken]);

  // Reset values
  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useOtpTokensSettingsData };
