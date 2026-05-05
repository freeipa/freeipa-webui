import React from "react";
import { NavItem } from "@patternfly/react-core";
import { NavLink } from "react-router";
import { usePluginNavItems } from "./hooks";

/**
 * Renders PatternFly NavItem elements for every nav entry registered by
 * plugins. Drop this at the end of the host's sidebar Nav component.
 */
export const DynamicNav: React.FC = () => {
  const navItems = usePluginNavItems();

  if (navItems.length === 0) {
    return null;
  }

  return (
    <>
      {navItems.map((item) => (
        <NavItem key={`plugin-nav-${item.pluginId}-${item.path}`}>
          <NavLink to={item.path}>{item.label}</NavLink>
        </NavItem>
      ))}
    </>
  );
};
