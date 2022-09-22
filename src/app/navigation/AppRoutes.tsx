import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
// import { useDocumentTitle } from "./utils/useDocumentTitle";

// PAGE COMPONENTS
import ActiveUsers from "app/pages/ActiveUsers/ActiveUsers";
import ActiveUsersTabs from "app/pages/ActiveUsers/ActiveUsersTabs";
import StageUsers from "app/pages/StageUsers/StageUsers";
import PreservedUsers from "app/pages/PreservedUsers/PreservedUsers";
// import ActiveUsersSettings from "./pages/ActiveUsersSettings";
// import ActiveUsersIsMemberOf from "./pages/ActiveUsersIsMemberOf";
// import ActiveUsersIsMemberOfAdd from "./pages/ActiveUsersIsMemberOfAdd";
// Navigation
import { URL_PREFIX } from "./NavRoutes";

// Renders routes
export const AppRoutes = (): React.ReactElement => (
  <Routes>
    <Route path={URL_PREFIX}>
      <Route path="active-users">
        <Route path="" element={<ActiveUsers />} />
        <Route path="settings" element={<ActiveUsersTabs />} />
      </Route>
      <Route path="stage-users">
        <Route path="" element={<StageUsers />} />
      </Route>
      <Route path="preserved-users">
        <Route path="" element={<PreservedUsers />} />
      </Route>
    </Route>
    <Route
      path=""
      element={<Navigate to={URL_PREFIX + "/active-users"} replace />}
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
