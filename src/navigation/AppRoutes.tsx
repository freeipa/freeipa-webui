/* eslint-disable react/prop-types */
import * as React from "react";
// React router dom
import { Navigate, Route, Routes } from "react-router-dom";
import { NotFound } from "src/components/errors/PageErrors";
// Layouts
import DataSpinner from "src/components/layouts/DataSpinner";

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
import UserGroupsTabs from "src/pages/UserGroups/UserGroupsTabs";
import HostGroupsTabs from "src/pages/HostGroups/HostGroupsTabs";
import IDViewsTabs from "src/pages/IDViews/IDViewsTabs";
import LoginMainPage from "src/login/LoginMainPage";
import NetgroupsTabs from "src/pages/Netgroups/NetgroupsTabs";

// Renders routes (React)
export const AppRoutes = ({
  isInitialDataLoaded,
  isUserLoggedIn,
}): React.ReactElement => (
  <>
    {!isInitialDataLoaded ? (
      <DataSpinner />
    ) : (
      <Routes>
        {isUserLoggedIn ? (
          <>
            <Route path="active-users">
              <Route path="" element={<ActiveUsers />} />
              <Route path=":uid">
                <Route path="" element={<ActiveUsersTabs memberof="" />} />
                <Route
                  path="memberof_group"
                  element={<ActiveUsersTabs memberof="group" />}
                />
                <Route
                  path="memberof_netgroup"
                  element={<ActiveUsersTabs memberof="netgroup" />}
                />
                <Route
                  path="memberof_role"
                  element={<ActiveUsersTabs memberof="role" />}
                />
                <Route
                  path="memberof_hbacrule"
                  element={<ActiveUsersTabs memberof="hbacrule" />}
                />
                <Route
                  path="memberof_sudorule"
                  element={<ActiveUsersTabs memberof="sudorule" />}
                />
                <Route
                  path="memberof_subid"
                  element={<ActiveUsersTabs memberof="subid" />}
                />
              </Route>
            </Route>
            <Route path="stage-users">
              <Route path="" element={<StageUsers />} />
              <Route path=":uid">
                <Route path="" element={<StageUsersTabs />} />
              </Route>
            </Route>
            <Route path="preserved-users">
              <Route path="" element={<PreservedUsers />} />
              <Route path=":uid">
                <Route path="" element={<PreservedUsersTabs />} />
              </Route>
            </Route>
            <Route path="hosts">
              <Route path="" element={<Hosts />} />
              <Route path=":fqdn">
                <Route path="" element={<HostsTabs section="settings" />} />
                <Route
                  path="memberof_hostgroup"
                  element={<HostsTabs section="memberof_hostgroup" />}
                />
                <Route
                  path="memberof_netgroup"
                  element={<HostsTabs section="memberof_netgroup" />}
                />
                <Route
                  path="memberof_role"
                  element={<HostsTabs section="memberof_role" />}
                />
                <Route
                  path="memberof_hbacrule"
                  element={<HostsTabs section="memberof_hbacrule" />}
                />
                <Route
                  path="memberof_sudorule"
                  element={<HostsTabs section="memberof_sudorule" />}
                />
                <Route
                  path="managedby_host"
                  element={<HostsTabs section="managedby" />}
                />
              </Route>
            </Route>
            <Route path="services">
              <Route path="" element={<Services />} />
              <Route path=":id">
                <Route path="" element={<ServicesTabs section="settings" />} />
                <Route
                  path="memberof_role"
                  element={<ServicesTabs section="memberof" />}
                />
                <Route
                  path="managedby_host"
                  element={<ServicesTabs section="managedby" />}
                />
              </Route>
            </Route>
            <Route path="user-groups">
              <Route path="" element={<UserGroups />} />
              <Route path=":cn">
                <Route
                  path=""
                  element={<UserGroupsTabs section="settings" />}
                />
                <Route
                  path="member_user"
                  element={<UserGroupsTabs section="member_user" />}
                />
                <Route
                  path="member_group"
                  element={<UserGroupsTabs section="member_group" />}
                />
                <Route
                  path="member_service"
                  element={<UserGroupsTabs section="member_service" />}
                />
              </Route>
            </Route>
            <Route path="host-groups">
              <Route path="" element={<HostGroups />} />
              <Route path=":cn">
                <Route
                  path=""
                  element={<HostGroupsTabs section="settings" />}
                />
              </Route>
            </Route>
            <Route path="netgroups">
              <Route path="" element={<Netgroups />} />
              <Route path=":cn">
                <Route path="" element={<NetgroupsTabs section="settings" />} />
              </Route>
            </Route>
            <Route path="id-views">
              <Route path="" element={<IDViews />} />
              <Route path=":view">
                <Route path="" element={<IDViewsTabs section="settings" />} />
              </Route>
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
            {/* Redirect to Active users page if user is logged in and navigates to the root page */}
            <Route
              path="*"
              element={<Navigate to={"active-users"} replace />}
            />
          </>
        ) : (
          <>
            {console.log("User is not logged in.")}
            <Route path="login" element={<LoginMainPage />} />
            <Route path="*" element={<Navigate to={"login"} replace />} />
          </>
        )}
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    )}
  </>
);
