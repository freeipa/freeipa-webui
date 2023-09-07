import { getLabel } from "src/language";

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
    label: getLabel("Identity"),
    group: "",
    title: "Identity title",
    path: "",
    items: [
      {
        label: getLabel("Users"),
        group: usersGroupRef,
        title: "Users title",
        path: "",
        items: [
          {
            label: getLabel("Active users"),
            group: ActiveUsersGroupRef,
            title: "Active users title",
            path: `${URL_PREFIX}/active-users`,
            items: [
              {
                label: getLabel("Active users Settings"),
                group: ActiveUsersGroupRef,
                title: "Active users Settings title",
                path: `${URL_PREFIX}/active-users/settings`,
              },
            ],
          },
          {
            label: getLabel("Stage users"),
            group: StageUsersGroupRef,
            title: "Stage users title",
            path: `${URL_PREFIX}/stage-users`,
            items: [
              {
                label: getLabel("Stage users Settings"),
                group: StageUsersGroupRef,
                title: "Stage users Settings title",
                path: `${URL_PREFIX}/stage-users/settings`,
              },
            ],
          },
          {
            label: getLabel("Preserved users"),
            group: PreservedUsersGroupRef,
            title: "Preserved users title",
            path: `${URL_PREFIX}/preserved-users`,
            items: [
              {
                label: getLabel("Preserved users Settings"),
                group: PreservedUsersGroupRef,
                title: "Preserved users Settings title",
                path: `${URL_PREFIX}/preserved-users/settings`,
              },
            ],
          },
        ],
      },
      {
        label: getLabel("Hosts"),
        group: HostsGroupRef,
        title: "Hosts title",
        items: [],
        path: `${URL_PREFIX}/hosts`,
      },
      {
        label: getLabel("Services"),
        group: ServicesGroupRef,
        title: "Services title",
        items: [],
        path: `${URL_PREFIX}/services`,
      },
      {
        label: getLabel("Groups"),
        group: GroupsGroupRef,
        title: "Groups title",
        path: "",
        items: [
          {
            label: getLabel("User groups"),
            group: UserGroupsGroupRef,
            title: "User groups title",
            path: `${URL_PREFIX}/user-groups`,
          },
          {
            label: getLabel("Host groups"),
            group: HostGroupsGroupRef,
            title: "Host groups title",
            path: `${URL_PREFIX}/host-groups`,
          },
          {
            label: getLabel("Net groups"),
            group: NetgroupsGroupRef,
            title: "Netgroups title",
            path: `${URL_PREFIX}/netgroups`,
          },
        ],
      },
      {
        label: getLabel("ID views"),
        group: IdViewsGroupRef,
        title: "ID views title",
        items: [],
        path: `${URL_PREFIX}/id-views`,
      },
      {
        label: getLabel("Automember"),
        group: AutomemberGroupRef,
        title: "Automamber title",
        path: "",
        items: [
          {
            label: getLabel("User Group Rules"),
            group: UserGroupRulesGroupRef,
            title: "User Group Rules title",
            path: `${URL_PREFIX}/user-group-rules`,
          },
          {
            label: getLabel("Host Group Rules"),
            group: HostGroupRulesGroupRef,
            title: "Host Group Rules title",
            path: `${URL_PREFIX}/host-group-rules`,
          },
        ],
      },
    ],
  },
  {
    label: getLabel("Policy"),
    group: "",
    title: "Policy title",
    path: "",
    items: [
      {
        label: getLabel("Host-based access control"),
        group: HostBasedAccessControlGroupRef,
        title: "Host-based access control title",
        path: "",
        items: [
          {
            label: getLabel("HBAC rules"),
            group: HbacRulesGroupRef,
            title: "HBAC rules title",
            path: `${URL_PREFIX}/hbac-rules`,
          },
          {
            label: getLabel("HBAC services"),
            group: HbacServicesGroupRef,
            title: "HBAC services title",
            path: `${URL_PREFIX}/hbac-services`,
          },
          {
            label: getLabel("HBAC service groups"),
            group: HbacServiceGroupsGroupRef,
            title: "HBAC service groups title",
            path: `${URL_PREFIX}/hbac-service-groups`,
          },
          {
            label: getLabel("HBAC test"),
            group: HbacTestGroupRef,
            title: "HBAC test title",
            path: `${URL_PREFIX}/hbac-test`,
          },
        ],
      },
      {
        label: getLabel("Sudo"),
        group: SudoGroupRef,
        title: "Sudo title",
        path: "",
        items: [
          {
            label: getLabel("Sudo rules"),
            group: SudoRulesGroupRef,
            title: "Sudo rules title",
            path: `${URL_PREFIX}/sudo-rules`,
          },
          {
            label: getLabel("Sudo commands"),
            group: SudoCommandsGroupRef,
            title: "Sudo commands title",
            path: `${URL_PREFIX}/sudo-commands`,
          },
          {
            label: getLabel("Sudo command groups"),
            group: SudoCommandGroupsGroupRef,
            title: "Sudo command groups title",
            path: `${URL_PREFIX}/sudo-command-groups`,
          },
        ],
      },
      {
        label: getLabel("SELinux user maps"),
        group: SelinuxUserMapsGroupRef,
        title: "SELinux user maps title",
        path: "",
        items: [],
      },
      {
        label: getLabel("Password policies"),
        group: PasswordPoliciesGroupRef,
        title: "Password policies title",
        path: "",
        items: [],
      },
      {
        label: getLabel("Kerberos ticket policy"),
        group: KerberosTicketPolicyGroupRef,
        title: "Kerberos ticket policy title",
        path: "",
        items: [],
      },
    ],
  },
];
