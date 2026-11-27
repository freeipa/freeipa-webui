import React from "react";
import { useAppSelector } from "src/store/hooks";

/**
 * Custom hook containing modern WebUI configuration settings
 * This can be based on:
 * - metadata
 * - Redux data
 * - pre-defined parameters
 * The hook is flexible and more parameters can be added to be
 * consumed in other components
 */

export interface ConfigurationSettings {
  dnsIsEnabled: boolean;
  ahdapaIsAvailable: boolean;
  // ... other configuration settings here
}

const useConfigurationSettings = () => {
  const dnsIsEnabled = useAppSelector((state) => state.global.dnsIsEnabled);
  const ahdapaIsAvailable = useAppSelector(
    (state) => state.ahdapa?.available ?? false
  );

  const configurationSettings: ConfigurationSettings = React.useMemo(
    () => ({
      dnsIsEnabled: dnsIsEnabled,
      ahdapaIsAvailable: ahdapaIsAvailable,
      // ... other configuration settings here
    }),
    [dnsIsEnabled, ahdapaIsAvailable]
  );

  return configurationSettings;
};

export { useConfigurationSettings };
