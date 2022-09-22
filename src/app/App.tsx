import React from "react";

import "@patternfly/react-core/dist/styles/base.css";
// Layouts
import { AppLayout } from "./AppLayout";
// Navigation
import { AppRoutes } from "./navigation/AppRoutes";
import { Navigate, Route, Routes } from "react-router-dom";
// Pages
import ActiveUsers from "./pages/ActiveUsers/ActiveUsers";
import ActiveUsersTabs from "./pages/ActiveUsers/ActiveUsersTabs";
import StageUsers from "./pages/StageUsers/StageUsers";
import PreservedUsers from "./pages/PreservedUsers/PreservedUsers";

const App: React.FunctionComponent = () => {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
};

export default App;
