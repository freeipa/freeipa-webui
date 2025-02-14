import React from "react";
// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import {
  AutomemberShowPayload,
  useAutomemberShowQuery,
} from "src/services/rpcAutomember";
// Data types
import { Automember, Metadata } from "src/utils/datatypes/globalDataTypes";

type SettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalAutomember: Partial<Automember>;
  automember: Partial<Automember>;
  setAutomember: (automember: Partial<Automember>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<Automember>;
};

const useAutomemberSettingsData = (
  automemberId: string,
  automemberType: string
): SettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Automember rule
  const payload = {
    automemberId,
    type: automemberType,
  } as AutomemberShowPayload;
  const automemberFullDataQuery = useAutomemberShowQuery(payload);
  const automemberFullData = automemberFullDataQuery.data;
  const isFullDataLoading = automemberFullDataQuery.isLoading;

  // States
  const [modified, setModified] = React.useState(false);
  const [automember, setAutomember] = React.useState<Partial<Automember>>({});

  React.useEffect(() => {
    if (automemberFullData && !automemberFullDataQuery.isFetching) {
      setAutomember({ ...automemberFullData });
    }
  }, [automemberFullData, automemberFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: automemberFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resetValues: () => {},
    originalAutomember: automember,
    automember,
    setAutomember,
    refetch: automemberFullDataQuery.refetch,
    modifiedValues: () => automember,
  } as SettingsData;

  if (automemberFullData) {
    settings.originalAutomember = automemberFullData || {};
  } else {
    settings.originalAutomember = {};
  }

  const getModifiedValues = (): Partial<Automember> => {
    if (!automemberFullData) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(automember)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(automemberFullData[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (automemberFullData[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change between 'originalAutomember' and 'automember' objects
  React.useEffect(() => {
    if (!automemberFullData) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(automember)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(automemberFullData[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (automemberFullData[key] !== value) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [automember, automemberFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useAutomemberSettingsData };
