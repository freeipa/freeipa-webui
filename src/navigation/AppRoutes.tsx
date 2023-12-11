import * as React from "react";
// React router dom
import { Navigate, Route, Routes } from "react-router-dom";
import { NotFound } from "src/components/errors/PageErrors";

// PAGE COMPONENTS
import ActiveUsers from "src/pages/ActiveUsers/ActiveUsers";
import ActiveUsersTabs from "src/pages/ActiveUsers/ActiveUsersTabs";
import StageUsers from "src/pages/StageUsers/StageUsers";
import StageUsersTabs from "src/pages/StageUsers/StageUsersTabs";
import PreservedUsers from "src/pages/PreservedUsers/PreservedUsers";
import PreservedUsersTabs from "src/pages/PreservedUsers/PreservedUsersTabs";
import UserGroups from "src/pages/UserGroups/UserGroups";
import HostGroups from "src/pages/HostGroups/HostGroups";
import Netgroups from "src/pages/Netgroups/Netgroups";
import Hosts from "src/pages/Hosts/Hosts";
import HostsTabs from "src/pages/Hosts/HostsTabs";
import Services from "src/pages/Services/Services";
import ServicesTabs from "src/pages/Services/ServicesTabs";
import IDViews from "src/pages/IDViews/IDViews";
import AutoMemHostRules from "src/pages/AutoMemHostRules/AutoMemHostRules";
import AutoMemUserRules from "src/pages/AutoMemUserRules/AutoMemUserRules";
import HBACRules from "src/pages/HBACRules/HBACRules";
import HBACServices from "src/pages/HBACServices/HBACServices";
import HBACServiceGroups from "src/pages/HBACServiceGroups/HBACServiceGroups";
import HBACTest from "src/pages/HBACTest/HBACTest";
import SudoRules from "src/pages/SudoRules/SudoRules";
import SudoCmds from "src/pages/SudoCmds/SudoCmds";
import SudoCmdGroups from "src/pages/SudoCmdGroups/SudoCmdGroups";
import SELinuxUserMaps from "src/pages/SELinuxUserMaps/SELinuxUserMaps";
import PasswordPolicies from "src/pages/PasswordPolicies/PasswordPolicies";
import KrbTicketPolicy from "src/pages/KrbTicketPolicy/KrbTicketPolicy";

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
        <Route path="settings" element={<PreservedUsersTabs />} />
      </Route>
      <Route path="hosts">
        <Route path="" element={<Hosts />} />
        <Route path="settings" element={<HostsTabs />} />
      </Route>
      <Route path="services">
        <Route path="" element={<Services />} />
        <Route path="settings" element={<ServicesTabs />} />
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
        <Route path="" element={<IDViews />} />
      </Route>
      <Route path="user-group-rules">
        <Route path="" element={<AutoMemUserRules />} />
      </Route>
      <Route path="host-group-rules">
        <Route path="" element={<AutoMemHostRules />} />
      </Route>
      <Route path="hbac-rules">
        <Route path="" element={<HBACRules />} />
      </Route>
      <Route path="hbac-services">
        <Route path="" element={<HBACServices />} />
      </Route>
      <Route path="hbac-service-groups">
        <Route path="" element={<HBACServiceGroups />} />
      </Route>
      <Route path="hbac-test">
        <Route path="" element={<HBACTest />} />
      </Route>
      <Route path="sudo-rules">
        <Route path="" element={<SudoRules />} />
      </Route>
      <Route path="sudo-commands">
        <Route path="" element={<SudoCmds />} />
      </Route>
      <Route path="sudo-command-groups">
        <Route path="" element={<SudoCmdGroups />} />
      </Route>
      <Route path="selinux-user-maps">
        <Route path="" element={<SELinuxUserMaps />} />
      </Route>
      <Route path="password-policies">
        <Route path="" element={<PasswordPolicies />} />
      </Route>
      <Route path="kerberos-ticket-policy">
        <Route path="" element={<KrbTicketPolicy />} />
      </Route>
    </Route>
    <Route
      path={URL_PREFIX + "/"}
      element={<Navigate to={URL_PREFIX + "/active-users"} replace />}
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
