import React from "react";
import { Route } from "react-router";
import { usePluginRoutes } from "./hooks";

/**
 * Renders <Route> elements for every route registered by plugins.
 * Drop this inside the host's <Routes> tree.
 */
export const DynamicRoutes: React.FC = () => {
  const routes = usePluginRoutes();

  return (
    <>
      {routes.map((r) => (
        <Route
          key={`plugin-${r.pluginId}-${r.path}`}
          path={r.path}
          element={<r.component />}
        />
      ))}
    </>
  );
};
