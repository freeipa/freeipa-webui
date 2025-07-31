import { BreadCrumbItem } from "src/components/layouts/BreadCrumb";

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
const IdentityProviderReferencesGroupRef = "identity-provider-references";
const CertificateMappingGroupRef = "cert-id-mapping-rules";
const CertificateMappingConfigGroupRef = "cert-id-mapping-global-config";
const CertificateMappingMatchGroupRef = "cert-id-mapping-match";
// NETWORK SERVICES
// - DNS zones
const DNSZonesGroupRef = "dns-zones";
const DNSForwardZonesGroupRef = "dns-forward-zones";
// IPA SERVER
// - Configuration
const ConfigRef = "configuration";

// List of navigation routes (UI)
export const navigationRoutes = [
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
  {
    label: "Network services",
    group: "",
    title: `${BASE_TITLE} - Network services`,
    path: "",
    items: [
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
        ],
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
        label: "Configuration",
        group: ConfigRef,
        title: `${BASE_TITLE} - Configuration`,
        path: "configuration",
        items: [],
      },
    ],
  },
];

/**
 * Given a path, returns its first level group name (if it belongs to any)
 * @param {path} URL path
 * @returns {string[]} Group name
 * @example "active-users" --> ["", "users", "active users"]
 */
export const getGroupByPath = (path: string) => {
  const fullPath: string[] = [];
  navigationRoutes.forEach((route) => {
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
export const getBreadCrumbByPath = (path: string) => {
  const fullPath: BreadCrumbItem[] = [];
  navigationRoutes.forEach((route) => {
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
export const getTitleByPath = (path: string) => {
  let title = "";
  navigationRoutes.forEach((route) => {
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
