import React from "react";
import { ExtensionPointId } from "./types";
import { pluginRegistry } from "./PluginRegistry";
import { extensionPointsMap } from "./extensionPoints";

interface ExtensionSlotProps {
  /**
   * The ID of the extension point to render extensions for.
   * Can be either a string ID or an ExtensionPoint object.
   */
  extensionPointId: ExtensionPointId | string;

  /**
   * Optional context data to pass to the extension components
   */
  context?: Record<string, any>;
}

/**
 * Component that renders all registered extensions for a specific extension point
 */
export const ExtensionSlot = (props: ExtensionSlotProps) => {
  const { extensionPointId, context = {} } = props;

  // Handle both string IDs and ExtensionPoint objects
  const effectiveExtensionPointId =
    typeof extensionPointId === "string"
      ? extensionPointsMap[
          extensionPointId as keyof typeof extensionPointsMap
        ] || extensionPointId
      : extensionPointId;

  const extensions = pluginRegistry.getExtensions(
    effectiveExtensionPointId as ExtensionPointId
  );

  if (extensions.length === 0) {
    console.debug(
      `No extensions found for extension point: ${
        typeof extensionPointId === "string"
          ? extensionPointId
          : extensionPointId.id
      }`
    );
    return null;
  }

  return (
    <>
      {extensions.map((extension, index) => {
        const { component: Component } = extension;
        return (
          <Component
            key={`${
              typeof extensionPointId === "string"
                ? extensionPointId
                : extensionPointId.id
            }-${index}`}
            {...context}
          />
        );
      })}
    </>
  );
};
