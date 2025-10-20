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
  // ... other configuration settings here
}

const useConfigurationSettings = () => {
  const dnsIsEnabled = useAppSelector((state) => state.global.dnsIsEnabled);

  const configurationSettings: ConfigurationSettings = React.useMemo(
    () => ({
      dnsIsEnabled: dnsIsEnabled,
      // ... other configuration settings here
    }),
    [dnsIsEnabled]
  );

  return configurationSettings;
};

export { useConfigurationSettings };
