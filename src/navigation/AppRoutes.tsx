/* eslint-disable react/prop-types */
import * as React from "react";
// React router dom
import { Navigate, Route, Routes } from "react-router-dom";
import { NotFound } from "src/components/errors/PageErrors";
// Layouts
import DataSpinner from "src/components/layouts/DataSpinner";
// Redux
import { useAppSelector } from "src/store/hooks";

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
import AutoMemRulesTabs from "src/pages/AutoMemUserRules/AutoMemRulesTabs";
import HBACRules from "src/pages/HBACRules/HBACRules";
import HBACServices from "src/pages/HBACServices/HBACServices";
import HBACServiceGroups from "src/pages/HBACServiceGroups/HBACServiceGroups";
import HBACTest from "src/pages/HBACTest/HBACTest";
import SudoRules from "src/pages/SudoRules/SudoRules";
import SudoRulesTabs from "src/pages/SudoRules/SudoRulesTabs";
import SudoCmds from "src/pages/SudoCmds/SudoCmds";
import SudoCmdsTabs from "src/pages/SudoCmds/SudoCmdsTabs";
import SudoCmdGroups from "src/pages/SudoCmdGroups/SudoCmdGroups";
import SudoCmdGroupsTabs from "src/pages/SudoCmdGroups/SudoCmdGroupsTabs";
import SELinuxUserMaps from "src/pages/SELinuxUserMaps/SELinuxUserMaps";
import PasswordPolicies from "src/pages/PasswordPolicies/PasswordPolicies";
import KrbTicketPolicy from "src/pages/KrbTicketPolicy/KrbTicketPolicy";
import UserGroupsTabs from "src/pages/UserGroups/UserGroupsTabs";
import HostGroupsTabs from "src/pages/HostGroups/HostGroupsTabs";
import IDViewsTabs from "src/pages/IDViews/IDViewsTabs";
import LoginMainPage from "src/login/LoginMainPage";
import NetgroupsTabs from "src/pages/Netgroups/NetgroupsTabs";
import HBACServicesTabs from "src/pages/HBACServices/HBACServicesTabs";
import HBACRulesTabs from "src/pages/HBACRules/HBACRulesTabs";
import HBACServiceGroupsTabs from "src/pages/HBACServiceGroups/HBACServiceGroupsTabs";
import ResetPasswordPage from "src/login/ResetPasswordPage";
import SetupBrowserConfig from "src/pages/SetupBrowserConfig";
import Configuration from "src/pages/Configuration/Configuration";
import SyncOtpPage from "src/login/SyncOtpPage";
import SubordinateIDs from "src/pages/SubordinateIDs/SubordinateIDs";
import SubIdsStatistics from "src/pages/SubordinateIDs/SubIdsStatistics";
import SubIdsTabs from "src/pages/SubordinateIDs/SubIdsTabs";
import PasswordPoliciesTabs from "src/pages/PasswordPolicies/PasswordPoliciesTabs";
import IdpReferences from "src/pages/IdPReferences/IdpReferences";
import IdpReferencesTabs from "src/pages/IdPReferences/IdpReferencesTabs";
import CertificateMappingPage from "src/pages/CertificateMapping/CertificateMapping";
import CertificateMappingGlobalConfig from "src/pages/CertificateMapping/CertificateMappingGlobalConfig";
import CertificateMappingMatch from "src/pages/CertificateMapping/CertificateMappingMatch";
import CertificateMappingTabs from "src/pages/CertificateMapping/CertificateMappingTabs";
import DnsZones from "src/pages/DNSZones/DnsZones";

// Renders routes (React)
export const AppRoutes = ({ isInitialDataLoaded }): React.ReactElement => {
  // Redux: Get if user is logged in
  const userLoggedIn = useAppSelector((state) => state.auth.isUserLoggedIn);

  return (
    <>
      {!isInitialDataLoaded ? (
        <DataSpinner />
      ) : (
        <Routes>
          {userLoggedIn ? (
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
                  <Route
                    path=""
                    element={<ServicesTabs section="settings" />}
                  />
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
                  <Route
                    path="member_external"
                    element={<UserGroupsTabs section="member_external" />}
                  />
                  <Route
                    path="memberof_usergroup"
                    element={<UserGroupsTabs section="memberof_usergroup" />}
                  />
                  <Route
                    path="memberof_netgroup"
                    element={<UserGroupsTabs section="memberof_netgroup" />}
                  />
                  <Route
                    path="memberof_role"
                    element={<UserGroupsTabs section="memberof_role" />}
                  />
                  <Route
                    path="memberof_hbacrule"
                    element={<UserGroupsTabs section="memberof_hbacrule" />}
                  />
                  <Route
                    path="memberof_sudorule"
                    element={<UserGroupsTabs section="memberof_sudorule" />}
                  />
                  <Route
                    path="manager_user"
                    element={<UserGroupsTabs section="manager_user" />}
                  />
                  <Route
                    path="manager_usergroup"
                    element={<UserGroupsTabs section="manager_usergroup" />}
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
                  <Route
                    path="member_host"
                    element={<HostGroupsTabs section="member_host" />}
                  />
                  <Route
                    path="member_hostgroup"
                    element={<HostGroupsTabs section="member_hostgroup" />}
                  />
                  <Route
                    path="memberof_hostgroup"
                    element={<HostGroupsTabs section="memberof_hostgroup" />}
                  />
                  <Route
                    path="memberof_netgroup"
                    element={<HostGroupsTabs section="memberof_netgroup" />}
                  />
                  <Route
                    path="memberof_hbacrule"
                    element={<HostGroupsTabs section="memberof_hbacrule" />}
                  />
                  <Route
                    path="memberof_sudorule"
                    element={<HostGroupsTabs section="memberof_sudorule" />}
                  />
                  <Route
                    path="manager_user"
                    element={<HostGroupsTabs section="manager_user" />}
                  />
                  <Route
                    path="manager_usergroup"
                    element={<HostGroupsTabs section="manager_usergroup" />}
                  />
                </Route>
              </Route>
              <Route path="netgroups">
                <Route path="" element={<Netgroups />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={<NetgroupsTabs section="settings" />}
                  />
                  <Route
                    path="member_user"
                    element={<NetgroupsTabs section="member_user" />}
                  />
                  <Route
                    path="member_group"
                    element={<NetgroupsTabs section="member_group" />}
                  />
                  <Route
                    path="member_host"
                    element={<NetgroupsTabs section="member_host" />}
                  />
                  <Route
                    path="member_hostgroup"
                    element={<NetgroupsTabs section="member_hostgroup" />}
                  />
                  <Route
                    path="member_netgroup"
                    element={<NetgroupsTabs section="member_netgroup" />}
                  />
                  <Route
                    path="memberof_netgroup"
                    element={<NetgroupsTabs section="memberof_netgroup" />}
                  />
                </Route>
              </Route>
              <Route path="id-views">
                <Route path="" element={<IDViews />} />
                <Route path=":cn">
                  <Route path="" element={<IDViewsTabs section="settings" />} />
                  <Route
                    path="override-users"
                    element={<IDViewsTabs section="override-users" />}
                  />
                  <Route
                    path="override-groups"
                    element={<IDViewsTabs section="override-groups" />}
                  />
                  <Route
                    path="appliedto"
                    element={<IDViewsTabs section="appliedto" />}
                  />
                </Route>
              </Route>
              <Route path="user-group-rules">
                <Route path="" element={<AutoMemUserRules />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={
                      <AutoMemRulesTabs
                        section="settings"
                        automemberType="group"
                      />
                    }
                  />
                </Route>
              </Route>
              <Route path="host-group-rules">
                <Route path="" element={<AutoMemHostRules />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={
                      <AutoMemRulesTabs
                        section="settings"
                        automemberType="hostgroup"
                      />
                    }
                  />
                </Route>
              </Route>
              <Route path="hbac-rules">
                <Route path="" element={<HBACRules />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={<HBACRulesTabs section="settings" />}
                  />
                </Route>
              </Route>
              <Route path="subordinate-ids">
                <Route path="" element={<SubordinateIDs />} />
                <Route path=":ipauniqueid">
                  <Route path="" element={<SubIdsTabs section="settings" />} />
                </Route>
              </Route>
              <Route path="subordinate-id-statistics">
                <Route path="" element={<SubIdsStatistics />} />
              </Route>
              <Route path="hbac-services">
                <Route path="" element={<HBACServices />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={<HBACServicesTabs section="settings" />}
                  />
                  <Route
                    path="memberof_hbacsvcgroup"
                    element={
                      <HBACServicesTabs section="memberof_hbacsvcgroup" />
                    }
                  />
                </Route>
              </Route>
              <Route path="hbac-service-groups">
                <Route path="" element={<HBACServiceGroups />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={<HBACServiceGroupsTabs section="settings" />}
                  />
                  <Route
                    path="member_hbacsvc"
                    element={<HBACServiceGroupsTabs section="member_hbacsvc" />}
                  />
                </Route>
              </Route>
              <Route path="hbac-test">
                <Route path="" element={<HBACTest />} />
              </Route>
              <Route path="sudo-rules">
                <Route path="" element={<SudoRules />} />
                <Route
                  path=":cn"
                  element={<SudoRulesTabs section="settings" />}
                />
              </Route>
              <Route path="sudo-commands">
                <Route path="" element={<SudoCmds />} />
                <Route path=":sudocmd">
                  <Route
                    path=""
                    element={<SudoCmdsTabs section="settings" />}
                  />
                  <Route
                    path="memberof_sudocmdgroup"
                    element={<SudoCmdsTabs section="memberof_sudocmdgroup" />}
                  />
                </Route>
              </Route>
              <Route path="sudo-command-groups">
                <Route path="" element={<SudoCmdGroups />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={<SudoCmdGroupsTabs section="settings" />}
                  />
                  <Route
                    path="member_sudocmd"
                    element={<SudoCmdGroupsTabs section="member_sudocmd" />}
                  />
                </Route>
              </Route>
              <Route path="selinux-user-maps">
                <Route path="" element={<SELinuxUserMaps />} />
              </Route>
              <Route path="password-policies">
                <Route path="" element={<PasswordPolicies />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={<PasswordPoliciesTabs section="settings" />}
                  />
                </Route>
              </Route>
              <Route path="kerberos-ticket-policy">
                <Route path="" element={<KrbTicketPolicy />} />
              </Route>
              <Route path="identity-provider-references">
                <Route path="" element={<IdpReferences />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={<IdpReferencesTabs section="settings" />}
                  />
                </Route>
              </Route>
              <Route path="cert-id-mapping-rules">
                <Route path="" element={<CertificateMappingPage />} />
                <Route path=":cn">
                  <Route
                    path=""
                    element={<CertificateMappingTabs section="settings" />}
                  />
                </Route>
              </Route>
              <Route path="cert-id-mapping-global-config">
                <Route path="" element={<CertificateMappingGlobalConfig />} />
              </Route>
              <Route path="cert-id-mapping-match">
                <Route path="" element={<CertificateMappingMatch />} />
              </Route>
              <Route path="dns-zones">
                <Route path="" element={<DnsZones />} />
              </Route>
              <Route path="configuration" element={<Configuration />} />
              {/* Redirect to Active users page if user is logged in and navigates to the root page */}
              <Route path="login" element={<Navigate to={"/"} replace />} />
              <Route
                path=""
                element={<Navigate to={"active-users"} replace />}
              />
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <>
              <Route path="login" element={<LoginMainPage />} />
              <Route path="reset-password">
                <Route path=":uid" element={<ResetPasswordPage />} />
              </Route>
              <Route path="*" element={<Navigate to={"/login"} replace />} />
            </>
          )}
          {/* Browser configuration page */}
          <Route path="browser-config" element={<SetupBrowserConfig />} />
          {/* Sync OTP token page */}
          <Route path="sync-otp" element={<SyncOtpPage />} />
        </Routes>
      )}
    </>
  );
};
