// Navigation
export const URL_PREFIX = "/ipa/modern_ui";

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

// List of navigation routes (UI)
export const navigationRoutes = [
  {
    label: "Identity",
    group: "",
    title: "Identity title",
    path: "",
    items: [
      {
        label: "Users",
        group: usersGroupRef,
        title: "Users title",
        path: "",
        items: [
          {
            label: "Active users",
            group: ActiveUsersGroupRef,
            title: "Active users title",
            path: `${URL_PREFIX}/active-users`,
            items: [
              {
                label: "Active users Settings",
                group: ActiveUsersGroupRef,
                title: "Active users Settings title",
                path: `${URL_PREFIX}/active-users/settings`,
              },
            ],
          },
          {
            label: "Stage users",
            group: StageUsersGroupRef,
            title: "Stage users title",
            path: `${URL_PREFIX}/stage-users`,
            items: [
              {
                label: "Stage users Settings",
                group: StageUsersGroupRef,
                title: "Stage users Settings title",
                path: `${URL_PREFIX}/stage-users/settings`,
              },
            ],
          },
          {
            label: "Preserved users",
            group: PreservedUsersGroupRef,
            title: "Preserved users title",
            path: `${URL_PREFIX}/preserved-users`,
          },
        ],
      },
      {
        label: "Hosts",
        group: HostsGroupRef,
        title: "Hosts title",
        items: [],
        path: `${URL_PREFIX}/hosts`,
      },
      {
        label: "Services",
        group: ServicesGroupRef,
        title: "Services title",
        items: [],
        path: `${URL_PREFIX}/services`,
      },
      {
        label: "Groups",
        group: GroupsGroupRef,
        title: "Groups title",
        path: "",
        items: [
          {
            label: "User groups",
            group: UserGroupsGroupRef,
            title: "User groups title",
            path: `${URL_PREFIX}/user-groups`,
          },
          {
            label: "Host groups",
            group: HostGroupsGroupRef,
            title: "Host groups title",
            path: `${URL_PREFIX}/host-groups`,
          },
          {
            label: "Netgroups",
            group: NetgroupsGroupRef,
            title: "Netgroups title",
            path: `${URL_PREFIX}/netgroups`,
          },
        ],
      },
      {
        label: "ID views",
        group: IdViewsGroupRef,
        title: "ID views title",
        items: [],
        path: `${URL_PREFIX}/id-views`,
      },
      {
        label: "Automember",
        group: AutomemberGroupRef,
        title: "Automamber title",
        path: "",
        items: [
          {
            label: "User Group Rules",
            group: UserGroupRulesGroupRef,
            title: "User Group Rules title",
            path: `${URL_PREFIX}/user-group-rules`,
          },
          {
            label: "Host Group Rules",
            group: HostGroupRulesGroupRef,
            title: "Host Group Rules title",
            path: `${URL_PREFIX}/host-group-rules`,
          },
        ],
      },
    ],
  },
  {
    label: "Policy",
    group: "",
    title: "Policy title",
    path: "",
    items: [
      {
        label: "Host-based access control",
        group: HostBasedAccessControlGroupRef,
        title: "Host-based access control title",
        path: "",
        items: [
          {
            label: "HBAC rules",
            group: HbacRulesGroupRef,
            title: "HBAC rules title",
            path: `${URL_PREFIX}/hbac-rules`,
          },
          {
            label: "HBAC services",
            group: HbacServicesGroupRef,
            title: "HBAC services title",
            path: `${URL_PREFIX}/hbac-services`,
          },
          {
            label: "HBAC service groups",
            group: HbacServiceGroupsGroupRef,
            title: "HBAC service groups title",
            path: `${URL_PREFIX}/hbac-service-groups`,
          },
          {
            label: "HBAC test",
            group: HbacTestGroupRef,
            title: "HBAC test title",
            path: `${URL_PREFIX}/hbac-test`,
          },
        ],
      },
      {
        label: "Sudo",
        group: SudoGroupRef,
        title: "Sudo title",
        path: "",
        items: [
          {
            label: "Sudo rules",
            group: SudoRulesGroupRef,
            title: "Sudo rules title",
            path: `${URL_PREFIX}/sudo-rules`,
          },
          {
            label: "Sudo commands",
            group: SudoCommandsGroupRef,
            title: "Sudo commands title",
            path: `${URL_PREFIX}/sudo-commands`,
          },
          {
            label: "Sudo command groups",
            group: SudoCommandGroupsGroupRef,
            title: "Sudo command groups title",
            path: `${URL_PREFIX}/sudo-command-groups`,
          },
        ],
      },
      {
        label: "SELinux user maps",
        group: SelinuxUserMapsGroupRef,
        title: "SELinux user maps title",
        path: "",
        items: [],
      },
      {
        label: "Password policies",
        group: PasswordPoliciesGroupRef,
        title: "Password policies title",
        path: "",
        items: [],
      },
      {
        label: "Kerberos ticket policy",
        group: KerberosTicketPolicyGroupRef,
        title: "Kerberos ticket policy title",
        path: "",
        items: [],
      },
    ],
  },
];
