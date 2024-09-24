import { useState, useEffect } from "react";

// RPC
import { useGetObjectMetadataQuery } from "src/services/rpc";
import { useGetSudoRuleFullDataQuery } from "src/services/rpcSudoRules";
// Data types
import { SudoRule, Metadata } from "src/utils/datatypes/globalDataTypes";

type SettingsData = {
  isLoading: boolean;
  isFetching: boolean;
  modified: boolean;
  setModified: (value: boolean) => void;
  resetValues: () => void;
  metadata: Metadata;
  originalRule: Partial<SudoRule>;
  rule: Partial<SudoRule>;
  setRule: (rule: Partial<SudoRule>) => void;
  refetch: () => void;
  modifiedValues: () => Partial<SudoRule>;
};

const useSudoRuleSettings = (ruleId: string): SettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Host Group
  const ruleFullDataQuery = useGetSudoRuleFullDataQuery(ruleId);
  const ruleFullData = ruleFullDataQuery.data;
  const isFullDataLoading = ruleFullDataQuery.isLoading;
  const [modified, setModified] = useState(false);
  const [rule, setRule] = useState<Partial<SudoRule>>({});

  useEffect(() => {
    if (ruleFullData && !ruleFullDataQuery.isFetching) {
      setRule({ ...ruleFullData.rule });
    }
  }, [ruleFullData, ruleFullDataQuery.isFetching]);

  const settings = {
    isLoading: metadataLoading || isFullDataLoading,
    isFetching: ruleFullDataQuery.isFetching,
    modified,
    setModified,
    metadata,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resetValues: () => {},
    originalRule: rule,
    rule,
    setRule,
    refetch: ruleFullDataQuery.refetch,
    modifiedValues: () => rule,
  } as SettingsData;

  if (ruleFullData) {
    settings.originalRule = ruleFullData.rule || {};
  } else {
    settings.originalRule = {};
  }

  const getModifiedValues = (): Partial<SudoRule> => {
    if (!ruleFullData || !ruleFullData.rule) {
      return {};
    }

    const modifiedValues = {};
    for (const [key, value] of Object.entries(rule)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(ruleFullData.rule[key]) !== JSON.stringify(value)) {
          modifiedValues[key] = value;
        }
      } else if (ruleFullData.rule[key] !== value) {
        modifiedValues[key] = value;
      }
    }
    return modifiedValues;
  };
  settings.modifiedValues = getModifiedValues;

  // Detect any change in 'originalRule' and 'rule' objects
  useEffect(() => {
    if (!ruleFullData || !ruleFullData.rule) {
      return;
    }
    let modified = false;
    for (const [key, value] of Object.entries(rule)) {
      if (Array.isArray(value)) {
        // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
        if (JSON.stringify(ruleFullData.rule[key]) !== JSON.stringify(value)) {
          modified = true;
          break;
        }
      } else {
        if (ruleFullData.rule[key].toString() !== value.toString()) {
          modified = true;
          break;
        }
      }
    }
    setModified(modified);
  }, [rule, ruleFullData]);

  const onResetValues = () => {
    setModified(false);
  };
  settings.resetValues = onResetValues;

  return settings;
};

export { useSudoRuleSettings };
