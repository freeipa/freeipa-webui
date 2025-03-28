import React from "react";
import { ExtensionPointId } from "./types";
import { pluginRegistry } from "./PluginRegistry";

interface ExtensionSlotProps {
  /**
   * The ID of the extension point to render extensions for.
   */
  extensionPointId: ExtensionPointId;

  /**
   * Optional context data to pass to the extension components
   */
  context?: Record<string, unknown>;
}

/**
 * Component that renders all registered extensions for a specific extension point
 */
export const ExtensionSlot = (props: ExtensionSlotProps) => {
  const { extensionPointId, context = {} } = props;

  const extensions = pluginRegistry.getExtensions(extensionPointId);

  if (extensions.length === 0) {
    console.debug(
      `No extensions found for extension point: ${extensionPointId.id}`
    );
    return null;
  }

  return (
    <>
      {extensions.map((extension, index) => {
        const { component: Component } = extension;
        return (
          <Component key={`${extensionPointId.id}-${index}`} {...context} />
        );
      })}
    </>
  );
};
