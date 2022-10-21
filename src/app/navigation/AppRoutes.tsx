import * as React from "react";
// React router dom
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";

// PAGE COMPONENTS
import ActiveUsers from "app/pages/ActiveUsers/ActiveUsers";
import ActiveUsersTabs from "app/pages/ActiveUsers/ActiveUsersTabs";
import StageUsers from "app/pages/StageUsers/StageUsers";
import StageUsersTabs from "app/pages/StageUsers/StageUsersTabs";
import PreservedUsers from "app/pages/PreservedUsers/PreservedUsers";
import UserGroups from "app/pages/UserGroups/UserGroups";
import HostGroups from "app/pages/HostGroups/HostGroups";
import Netgroups from "app/pages/Netgroups/Netgroups";

// Navigation
import { URL_PREFIX } from "./NavRoutes";

// Renders routes (React)
export const AppRoutes = (): React.ReactElement => (
  <Routes>
    <Route path={URL_PREFIX}>
      <Route path="active-users">
        <Route path="" element={<ActiveUsers />} />
        <Route path="settings" element={<ActiveUsersTabs />} />
      </Route>
      <Route path="stage-users">
        <Route path="" element={<StageUsers />} />
        <Route path="settings" element={<StageUsersTabs />} />
      </Route>
      <Route path="preserved-users">
        <Route path="" element={<PreservedUsers />} />
      </Route>
      <Route path="hosts">
        <Route path="" />
      </Route>
      <Route path="services">
        <Route path="" />
      </Route>
      <Route path="user-groups">
        <Route path="" element={<UserGroups />} />
      </Route>
      <Route path="host-groups">
        <Route path="" element={<HostGroups />} />
      </Route>
      <Route path="netgroups">
        <Route path="" element={<Netgroups />} />
      </Route>
      <Route path="id-views">
        <Route path="" />
      </Route>
      <Route path="user-group-rules">
        <Route path="" />
      </Route>
      <Route path="host-group-rules">
        <Route path="" />
      </Route>
      <Route path="hbac-rules">
        <Route path="" />
      </Route>
      <Route path="hbac-services">
        <Route path="" />
      </Route>
      <Route path="hbac-service-groups">
        <Route path="" />
      </Route>
      <Route path="hbac-test">
        <Route path="" />
      </Route>
      <Route path="sudo-rules">
        <Route path="" />
      </Route>
      <Route path="sudo-commands">
        <Route path="" />
      </Route>
      <Route path="sudo-command-group">
        <Route path="" />
      </Route>
      <Route path="selinux-user-maps">
        <Route path="" />
      </Route>
      <Route path="password-policies">
        <Route path="" />
      </Route>
      <Route path="kerberos-ticket-policy">
        <Route path="" />
      </Route>
    </Route>
    <Route
      path=""
      element={<Navigate to={URL_PREFIX + "/active-users"} replace />}
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
