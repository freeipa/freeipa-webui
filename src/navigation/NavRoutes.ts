import { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import { ConfigurationSettings } from "src/utils/configurationSettings";

// Navigation
export const URL_PREFIX = import.meta.env.BASE_URL;
const BASE_TITLE = "Identity Management";

// Group reference variables (group names)
// IDENTITY
// - Users
const usersGroupRef = "users";
const ActiveUsersGroupRef = "active-users";
const StageUsersGroupRef = "stage-users";
const PreservedUsersGroupRef = "preserved-users";
// - Hosts
const HostsGroupRef = "hosts";
// - Services
const ServicesGroupRef = "services";
// - Groups
const GroupsGroupRef = "groups";
const UserGroupsGroupRef = "user-groups";
const HostGroupsGroupRef = "host-groups";
const NetgroupsGroupRef = "netgroups";
// - Views
const IdViewsGroupRef = "id-views";
const IdRangesGroupRef = "id-ranges";
// - Automember
const AutomemberGroupRef = "automember";
const UserGroupRulesGroupRef = "user-group-rules";
const HostGroupRulesGroupRef = "host-group-rules";
// - Subordinate IDs
const SubordinateIDsGroupRef = "subordinate-ids";
const SubordinateIDsStatsGroupRef = "subordinate-id-statistics";
// POLICY
// - Host-based access control
const HostBasedAccessControlGroupRef = "host-based-access-control";
const HbacRulesGroupRef = "hbac-rules";
const HbacServicesGroupRef = "hbac-services";
const HbacServiceGroupsGroupRef = "hbac-service-groups";
const HbacTestGroupRef = "hbac-test";
// - Sudo
const SudoGroupRef = "sudo";
const SudoRulesGroupRef = "sudo-rules";
const SudoCommandsGroupRef = "sudo-commands";
const SudoCommandGroupsGroupRef = "sudo-command-groups";
// - SELinux user maps
const SelinuxUserMapsGroupRef = "selinux-user-maps";
// - Password policies
const PasswordPoliciesGroupRef = "password-policies";
// - Kerberos ticket policy
const KerberosTicketPolicyGroupRef = "kerberos-ticket-policy";
// AUTHENTICATION
const OtpTokensGroupRef = "otp-tokens";
const IdentityProviderReferencesGroupRef = "identity-provider-references";
const CertificateMappingGroupRef = "cert-id-mapping-rules";
const CertificateMappingConfigGroupRef = "cert-id-mapping-global-config";
const CertificateMappingMatchGroupRef = "cert-id-mapping-match";
// - RADIUS servers
const RadiusServersGroupRef = "radius-servers";
// OAUTH2 / IDP (ahdapa)
const AhdapaOAuth2GroupRef = "ahdapa-oauth2";
const AhdapaClientsGroupRef = "ahdapa-clients";
const AhdapaScopesGroupRef = "ahdapa-scopes";
const AhdapaAccessControlGroupRef = "ahdapa-access-control";
const AhdapaHbacGroupRef = "ahdapa-hbac";
const AhdapaWorkloadsGroupRef = "ahdapa-workloads";
const AhdapaSpiffeGroupRef = "ahdapa-spiffe";
const AhdapaFederationGroupRef = "ahdapa-federation";
const AhdapaFederatedAccountsGroupRef = "ahdapa-federated-accounts";
const AhdapaFederationPoliciesGroupRef = "ahdapa-federation-policies";
const AhdapaIpaIdpsGroupRef = "ahdapa-ipa-idps";
const AhdapaSaml2SpsGroupRef = "ahdapa-saml2-sps";
const AhdapaSaml2IdpsGroupRef = "ahdapa-saml2-idps";
const AhdapaInfraGroupRef = "ahdapa-infra";
const AhdapaKeysGroupRef = "ahdapa-keys";
const AhdapaNodesGroupRef = "ahdapa-nodes";
const AhdapaAuditGroupRef = "ahdapa-audit";
// NETWORK SERVICES
// - Automount
const AutomountLocationsGroupRef = "automount-locations";
// - DNS zones
const DNSZonesGroupRef = "dns-zones";
const DNSForwardZonesGroupRef = "dns-forward-zones";
const DNSServersGroupRef = "dns-servers";
const DNSGlobalConfigGroupRef = "dns-global-config";
// IPA SERVER
// - Trusts
const TrustsGroupRef = "trusts";
const TrustsGlobalConfigGroupRef = "trusts-config";
// - Topology
const TopologyGroupRef = "topology-graph";
// - Role-based access control
const RbacGroupRef = "rbac";
const PrivilegesGroupRef = "privileges";
const PermissionsGroupRef = "permissions";
const SelfServicePermissionsGroupRef = "selfservice-permissions";
const DelegationsGroupRef = "delegations";
// - System accounts
const SystemAccountsGroupRef = "system-accounts";
// - Configuration
const ConfigRef = "configuration";

// List of navigation routes (UI)
export const getNavigationRoutes = (
  configurationSettings: ConfigurationSettings
) => {
  const dnsIsEnabled = configurationSettings.dnsIsEnabled;
  const ahdapaIsAvailable = configurationSettings.ahdapaIsAvailable;
  return [
    {
      label: "Identity",
      group: "",
      title: `${BASE_TITLE} - Identity`,
      path: "",
      items: [
        {
          label: "Users",
          group: usersGroupRef,
          title: `${BASE_TITLE} - Users`,
          path: "",
          items: [
            {
              label: "Active users",
              group: ActiveUsersGroupRef,
              title: `${BASE_TITLE} - Active users`,
              path: "active-users",
              items: [
                {
                  label: "Active users Settings",
                  group: ActiveUsersGroupRef,
                  title: `${BASE_TITLE} - Settings`,
                  path: "active-users/:uid",
                },
              ],
            },
            {
              label: "Stage users",
              group: StageUsersGroupRef,
              title: `${BASE_TITLE} - Stage users`,
              path: "stage-users",
              items: [
                {
                  label: "Stage users Settings",
                  group: StageUsersGroupRef,
                  title: `${BASE_TITLE} - Settings`,
                  path: "stage-users/:uid",
                },
              ],
            },
            {
              label: "Preserved users",
              group: PreservedUsersGroupRef,
              title: `${BASE_TITLE} - Preserved users`,
              path: "preserved-users",
              items: [
                {
                  label: "Preserved users Settings",
                  group: PreservedUsersGroupRef,
                  title: `${BASE_TITLE} - Settings`,
                  path: "preserved-users/:uid",
                },
              ],
            },
          ],
        },
        {
          label: "Hosts",
          group: HostsGroupRef,
          title: `${BASE_TITLE} - Hosts`,
          items: [],
          path: "hosts",
        },
        {
          label: "Services",
          group: ServicesGroupRef,
          title: `${BASE_TITLE} - Services`,
          items: [],
          path: "services",
        },
        {
          label: "Groups",
          group: GroupsGroupRef,
          title: `${BASE_TITLE} - Groups`,
          path: "",
          items: [
            {
              label: "User groups",
              group: UserGroupsGroupRef,
              title: `${BASE_TITLE} - User groups`,
              path: "user-groups",
            },
            {
              label: "Host groups",
              group: HostGroupsGroupRef,
              title: `${BASE_TITLE} - Host groups`,
              path: "host-groups",
            },
            {
              label: "Netgroups",
              group: NetgroupsGroupRef,
              title: `${BASE_TITLE} - Netgroups`,
              path: "netgroups",
            },
          ],
        },
        {
          label: "ID views",
          group: IdViewsGroupRef,
          title: `${BASE_TITLE} - ID views`,
          items: [],
          path: "id-views",
        },
        {
          label: "Automember",
          group: AutomemberGroupRef,
          title: `${BASE_TITLE} - Automember`,
          path: "",
          items: [
            {
              label: "User Group Rules",
              group: UserGroupRulesGroupRef,
              title: `${BASE_TITLE} - User group rules`,
              path: "user-group-rules",
            },
            {
              label: "Host Group Rules",
              group: HostGroupRulesGroupRef,
              title: `${BASE_TITLE} - Host group rules`,
              path: "host-group-rules",
            },
          ],
        },
        {
          label: "Subordinate IDs",
          group: SubordinateIDsGroupRef,
          title: `${BASE_TITLE} - Subordinate IDs`,
          path: "",
          items: [
            {
              label: "Subordinate IDs",
              group: SubordinateIDsGroupRef,
              title: `${BASE_TITLE} - Subordinate IDs`,
              path: "subordinate-ids",
            },
            {
              label: "Subordinate ID Statistics",
              group: SubordinateIDsStatsGroupRef,
              title: `${BASE_TITLE} - Subordinate ID Statistics`,
              path: "subordinate-id-statistics",
            },
          ],
        },
        {
          label: "System accounts",
          group: SystemAccountsGroupRef,
          title: `${BASE_TITLE} - System accounts`,
          path: "system-accounts",
          items: [],
        },
      ],
    },
    {
      label: "Policy",
      group: "",
      title: `${BASE_TITLE} - Policy`,
      path: "",
      items: [
        {
          label: "Host-based access control",
          group: HostBasedAccessControlGroupRef,
          title: `${BASE_TITLE} - Host-based access control`,
          path: "",
          items: [
            {
              label: "HBAC rules",
              group: HbacRulesGroupRef,
              title: `${BASE_TITLE} - HBAC rules`,
              path: "hbac-rules",
            },
            {
              label: "HBAC services",
              group: HbacServicesGroupRef,
              title: `${BASE_TITLE} - HBAC services`,
              path: "hbac-services",
            },
            {
              label: "HBAC service groups",
              group: HbacServiceGroupsGroupRef,
              title: `${BASE_TITLE} - HBAC service groups`,
              path: "hbac-service-groups",
            },
            {
              label: "HBAC test",
              group: HbacTestGroupRef,
              title: `${BASE_TITLE} - HBAC test`,
              path: "hbac-test",
            },
          ],
        },
        {
          label: "Sudo",
          group: SudoGroupRef,
          title: `${BASE_TITLE} - Sudo`,
          path: "",
          items: [
            {
              label: "Sudo rules",
              group: SudoRulesGroupRef,
              title: `${BASE_TITLE} - Sudo rules`,
              path: "sudo-rules",
            },
            {
              label: "Sudo commands",
              group: SudoCommandsGroupRef,
              title: `${BASE_TITLE} - Sudo commands`,
              path: "sudo-commands",
            },
            {
              label: "Sudo command groups",
              group: SudoCommandGroupsGroupRef,
              title: `${BASE_TITLE} - Sudo command groups`,
              path: "sudo-command-groups",
            },
          ],
        },
        {
          label: "SELinux user maps",
          group: SelinuxUserMapsGroupRef,
          title: `${BASE_TITLE} - SELinux user maps`,
          path: "selinux-user-maps",
          items: [],
        },
        {
          label: "Password policies",
          group: PasswordPoliciesGroupRef,
          title: `${BASE_TITLE} - Password policies`,
          path: "password-policies",
          items: [],
        },
        {
          label: "Kerberos ticket policy",
          group: KerberosTicketPolicyGroupRef,
          title: `${BASE_TITLE} - Kerberos ticket policy`,
          path: "kerberos-ticket-policy",
          items: [],
        },
      ],
    },
    {
      label: "Authentication",
      group: "",
      title: `${BASE_TITLE} - Authentication`,
      path: "",
      items: [
        {
          label: "OTP tokens",
          group: OtpTokensGroupRef,
          title: `${BASE_TITLE} - OTP tokens`,
          path: "otp-tokens",
          items: [],
        },
        {
          label: "RADIUS servers",
          group: RadiusServersGroupRef,
          title: `${BASE_TITLE} - RADIUS servers`,
          path: "radius-servers",
          items: [],
        },
        {
          label: "Identity Provider references",
          group: IdentityProviderReferencesGroupRef,
          title: `${BASE_TITLE} - Identity Provider references`,
          path: "identity-provider-references",
          items: [],
        },
        {
          label: "Certificate mapping",
          group: CertificateMappingGroupRef,
          title: `${BASE_TITLE} - Certificate mapping`,
          path: "",
          items: [
            {
              label: "Certificate identity mapping rules",
              group: CertificateMappingGroupRef,
              title: `${BASE_TITLE} - Certificate identity mapping rules`,
              path: "cert-id-mapping-rules",
              items: [],
            },
            {
              label: "Certificate identity mapping global configuration",
              group: CertificateMappingConfigGroupRef,
              title: `${BASE_TITLE} - Certificate identity mapping global configuration`,
              path: "cert-id-mapping-global-config",
              items: [],
            },
            {
              label: "Certificate identity mapping match",
              group: CertificateMappingMatchGroupRef,
              title: `${BASE_TITLE} - Certificate identity mapping match`,
              path: "cert-id-mapping-match",
              items: [],
            },
          ],
        },
      ],
    },
    ...(ahdapaIsAvailable === true
      ? [
          {
            label: "OAuth2 / IdP",
            group: "",
            title: `${BASE_TITLE} - OAuth2 / IdP`,
            path: "",
            items: [
              {
                label: "OAuth2",
                group: AhdapaOAuth2GroupRef,
                title: `${BASE_TITLE} - OAuth2`,
                path: "",
                items: [
                  {
                    label: "Clients",
                    group: AhdapaClientsGroupRef,
                    title: `${BASE_TITLE} - OAuth2 Clients`,
                    path: "ahdapa-clients",
                    items: [],
                  },
                  {
                    label: "Scopes",
                    group: AhdapaScopesGroupRef,
                    title: `${BASE_TITLE} - OAuth2 Scopes`,
                    path: "ahdapa-scopes",
                    items: [],
                  },
                ],
              },
              {
                label: "Access control",
                group: AhdapaAccessControlGroupRef,
                title: `${BASE_TITLE} - Identity HBAC Policy`,
                path: "",
                items: [
                  {
                    label: "Identity HBAC policy",
                    group: AhdapaHbacGroupRef,
                    title: `${BASE_TITLE} - Identity HBAC Policy`,
                    path: "ahdapa-hbac",
                    items: [],
                  },
                ],
              },
              {
                label: "Workloads",
                group: AhdapaWorkloadsGroupRef,
                title: `${BASE_TITLE} - SPIFFE Workloads`,
                path: "",
                items: [
                  {
                    label: "SPIFFE workloads",
                    group: AhdapaSpiffeGroupRef,
                    title: `${BASE_TITLE} - SPIFFE Workloads`,
                    path: "ahdapa-spiffe",
                    items: [],
                  },
                ],
              },
              {
                label: "Federation",
                group: AhdapaFederationGroupRef,
                title: `${BASE_TITLE} - Federation`,
                path: "",
                items: [
                  {
                    label: "Federated accounts",
                    group: AhdapaFederatedAccountsGroupRef,
                    title: `${BASE_TITLE} - Federated Accounts`,
                    path: "ahdapa-federated-accounts",
                    items: [],
                  },
                  {
                    label: "Federation policies",
                    group: AhdapaFederationPoliciesGroupRef,
                    title: `${BASE_TITLE} - Federation Policies`,
                    path: "ahdapa-federation-policies",
                    items: [],
                  },
                  {
                    label: "IPA upstream IdPs",
                    group: AhdapaIpaIdpsGroupRef,
                    title: `${BASE_TITLE} - IPA Upstream IdPs`,
                    path: "ahdapa-ipa-idps",
                    items: [],
                  },
                  {
                    label: "SAML2 service providers",
                    group: AhdapaSaml2SpsGroupRef,
                    title: `${BASE_TITLE} - SAML2 Service Providers`,
                    path: "ahdapa-saml2-sps",
                    items: [],
                  },
                  {
                    label: "SAML2 upstream IdPs",
                    group: AhdapaSaml2IdpsGroupRef,
                    title: `${BASE_TITLE} - SAML2 Upstream IdPs`,
                    path: "ahdapa-saml2-idps",
                    items: [],
                  },
                ],
              },
              {
                label: "Infrastructure",
                group: AhdapaInfraGroupRef,
                title: `${BASE_TITLE} - Infrastructure`,
                path: "",
                items: [
                  {
                    label: "Signing keys",
                    group: AhdapaKeysGroupRef,
                    title: `${BASE_TITLE} - Signing Keys`,
                    path: "ahdapa-keys",
                    items: [],
                  },
                  {
                    label: "Cluster nodes",
                    group: AhdapaNodesGroupRef,
                    title: `${BASE_TITLE} - Cluster Nodes`,
                    path: "ahdapa-nodes",
                    items: [],
                  },
                  {
                    label: "Audit log",
                    group: AhdapaAuditGroupRef,
                    title: `${BASE_TITLE} - Audit Log`,
                    path: "ahdapa-audit",
                    items: [],
                  },
                ],
              },
            ],
          },
        ]
      : []),
    {
      label: "Network services",
      group: "",
      title: `${BASE_TITLE} - Network services`,
      path: "",
      items: [
        ...(dnsIsEnabled === true
          ? [
              {
                label: "DNS",
                group: DNSZonesGroupRef,
                title: `${BASE_TITLE} - DNS`,
                path: "",
                items: [
                  {
                    label: "DNS zones",
                    group: DNSZonesGroupRef,
                    title: `${BASE_TITLE} - DNS zones`,
                    path: "dns-zones",
                    items: [],
                  },
                  {
                    label: "DNS forward zones",
                    group: DNSForwardZonesGroupRef,
                    title: `${BASE_TITLE} - DNS forward zones`,
                    path: "dns-forward-zones",
                    items: [],
                  },
                  {
                    label: "DNS servers",
                    group: DNSServersGroupRef,
                    title: `${BASE_TITLE} - DNS servers`,
                    path: "dns-servers",
                    items: [],
                  },
                  {
                    label: "DNS global config",
                    group: DNSGlobalConfigGroupRef,
                    title: `${BASE_TITLE} - DNS global config`,
                    path: "dns-global-config",
                    items: [],
                  },
                ],
              },
            ]
          : []),
        {
          label: "Automount locations",
          group: AutomountLocationsGroupRef,
          title: `${BASE_TITLE} - Automount locations`,
          path: "automount-locations",
          items: [],
        },
      ],
    },
    {
      label: "IPA Server",
      group: "",
      title: `${BASE_TITLE} - IPA Server`,
      path: "",
      items: [
        {
          label: "Role-based access control",
          group: RbacGroupRef,
          title: `${BASE_TITLE} - Role-based access control`,
          path: "",
          items: [
            {
              label: "Roles",
              group: RbacGroupRef,
              title: `${BASE_TITLE} - Roles`,
              path: "roles",
              items: [],
            },
            {
              label: "Privileges",
              group: PrivilegesGroupRef,
              title: `${BASE_TITLE} - Privileges`,
              path: "privileges",
              items: [],
            },
            {
              label: "Permissions",
              group: PermissionsGroupRef,
              title: `${BASE_TITLE} - Permissions`,
              path: "permissions",
              items: [],
            },
            {
              label: "Self service permissions",
              group: SelfServicePermissionsGroupRef,
              title: `${BASE_TITLE} - Self service permissions`,
              path: "selfservice-permissions",
              items: [],
            },
            {
              label: "Delegations",
              group: DelegationsGroupRef,
              title: `${BASE_TITLE} - Delegations`,
              path: "delegations",
              items: [],
            },
          ],
        },
        {
          label: "Trusts",
          group: TrustsGroupRef,
          title: `${BASE_TITLE} - Trusts`,
          path: "trusts",
          items: [
            {
              label: "Trusts",
              group: TrustsGroupRef,
              title: `${BASE_TITLE} - Trusts`,
              path: "trusts",
              items: [],
            },
            {
              label: "Trusts global config",
              group: TrustsGlobalConfigGroupRef,
              title: `${BASE_TITLE} - Trusts global config`,
              path: "trusts-config",
              items: [],
            },
          ],
        },
        {
          label: "ID ranges",
          group: IdRangesGroupRef,
          title: `${BASE_TITLE} - ID ranges`,
          path: "id-ranges",
          items: [],
        },
        {
          label: "Topology",
          group: TopologyGroupRef,
          title: `${BASE_TITLE} - Topology`,
          path: "topology-graph",
          items: [
            {
              label: "Topology graph",
              group: TopologyGroupRef,
              title: `${BASE_TITLE} - Topology graph`,
              path: "topology-graph",
              items: [],
            },
          ],
        },
        {
          label: "Configuration",
          group: ConfigRef,
          title: `${BASE_TITLE} - Configuration`,
          path: "configuration",
          items: [],
        },
      ],
    },
  ];
};

/**
 * Given a path, returns its first level group name (if it belongs to any)
 * @param {path} URL path
 * @returns {string[]} Group name
 * @example "active-users" --> ["", "users", "active users"]
 */
export const getGroupByPath = (
  path: string,
  configurationSettings: ConfigurationSettings
) => {
  const fullPath: string[] = [];
  getNavigationRoutes(configurationSettings).forEach((route) => {
    route.items.forEach((subRoute) => {
      if (path === subRoute.path) {
        fullPath.push(route.group);
        fullPath.push(subRoute.group);
        return fullPath;
      }
      if (subRoute.items) {
        subRoute.items.forEach((subSubRoute) => {
          if (path === subSubRoute.path) {
            fullPath.push(route.group);
            fullPath.push(subRoute.group);
            fullPath.push(subSubRoute.group);
            return fullPath;
          }
        });
      }
    });
  });
  return fullPath;
};

/**
 * Given a path, returns its breadcrumb path
 * @param {path} URL path
 * @returns {BreadCrumbItem[]} Group name
 * @example "active users" --> [{ name: "Users", url: ""}, {name: "Active users", url: "/active-users"}]
 */
export const getBreadCrumbByPath = (
  path: string,
  configurationSettings: ConfigurationSettings
) => {
  const fullPath: BreadCrumbItem[] = [];
  getNavigationRoutes(configurationSettings).forEach((route) => {
    route.items.forEach((subRoute) => {
      if (path === subRoute.path) {
        const item: BreadCrumbItem = {
          name: subRoute.label,
          url: subRoute.path,
        };
        fullPath.push(item);
        return fullPath;
      }
      if (subRoute.items) {
        subRoute.items.forEach((subSubRoute) => {
          if (path === subSubRoute.path) {
            const itemSubRoute: BreadCrumbItem = {
              name: subRoute.label,
              url: subRoute.path,
            };
            const itemSubSubRoute: BreadCrumbItem = {
              name: subSubRoute.label,
              url: subSubRoute.path,
            };
            fullPath.push(itemSubRoute);
            fullPath.push(itemSubSubRoute);
            return fullPath;
          }
        });
      }
    });
  });
  return fullPath;
};

/**
 * Given a path, returns its title
 * @param {path} URL path
 * @returns {string} title
 * @example "active users" --> "Identity Management - Active users"
 */
export const getTitleByPath = (
  path: string,
  configurationSettings: ConfigurationSettings
) => {
  let title = "";
  getNavigationRoutes(configurationSettings).forEach((route) => {
    route.items.forEach((subRoute) => {
      if (path === subRoute.path) {
        title = subRoute.title;
        return title;
      }
      if (subRoute.items) {
        subRoute.items.forEach((subSubRoute) => {
          if (path === subSubRoute.path) {
            title = subSubRoute.title;
            return title;
          }
        });
      }
    });
  });
  return title;
};
