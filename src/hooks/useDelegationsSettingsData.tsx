import { useEffect, useState } from "react";
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetDelegationByIdQuery } from "src/services/rpcDelegations";
import { Delegation, Metadata } from "src/utils/datatypes/globalDataTypes";

type DelegationSettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalDelegation: Partial<Delegation>;
  delegation: Partial<Delegation>;
  setDelegation: (delegation: Partial<Delegation>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Delegation>;
};

const useDelegationSettings = (
  delegationId: string
): DelegationSettingsData => {
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  const delegationQuery = useGetDelegationByIdQuery(delegationId, {
    skip: !delegationId,
  });
  const delegationData = delegationQuery.data;
  const isDelegationLoading = delegationQuery.isLoading;

  const [modified, setModified] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [delegation, setDelegation] = useState<Partial<Delegation>>({});
  const [originalDelegation, setOriginalDelegation] = useState<
    Partial<Delegation>
  >({});

  useEffect(() => {
    setInitialized(false);
    setDelegation({});
    setOriginalDelegation({});
  }, [delegationId]);

  useEffect(() => {
    if (delegationData !== undefined && !delegationQuery.isFetching) {
      setDelegation({ ...delegationData });
      setOriginalDelegation({ ...delegationData });
      setInitialized(true);
    }
  }, [delegationData, delegationQuery.isFetching]);

  const getModifiedValues = (): Partial<Delegation> => {
    if (!originalDelegation) {
      return {};
    }

    const modifiedValues: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(delegation)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalDelegation[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (originalDelegation[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues as Partial<Delegation>;
  };

  useEffect(() => {
    if (!originalDelegation) {
      return;
    }

    let isModified = false;
    for (const [key, value] of Object.entries(delegation)) {
      if (Array.isArray(value)) {
        if (JSON.stringify(originalDelegation[key]) !== JSON.stringify(value)) {
          isModified = true;
          break;
        }
      } else if (originalDelegation[key] !== value) {
        isModified = true;
        break;
      }
    }

    setModified(isModified);
  }, [delegation, originalDelegation]);

  const onResetValues = () => {
    setDelegation({ ...originalDelegation });
    setModified(false);
  };

  return {
    isLoading: metadataLoading || isDelegationLoading || !initialized,
    isFetching: delegationQuery.isFetching,
    modified,
    setModified,
    metadata,
    originalDelegation,
    delegation,
    setDelegation,
    refetch: delegationQuery.refetch,
    modifiedValues: getModifiedValues,
    resetValues: onResetValues,
  };
};

export { useDelegationSettings };
