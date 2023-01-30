/* eslint-disable prefer-const */

/*
 * This is a temporal file to hold the repositories (aka. the intial data lists)
 * used on the 'Active users' page > 'Is a member of' section.
 *
 * In the future, this must be retrieved from other source (eg.: API call, Redux, etc)
 */

import {
  UserGroup,
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
  HostGroup,
} from "../datatypes/globalDataTypes";

// USERS
// 'User groups' initial data
export let userGroupsInitialData: UserGroup[] = [
  {
    name: "Initial admins",
    gid: "12345678",
    description: "This is a description for initial admins",
  },
  {
    name: "Other admins",
    gid: "234456567",
    description: "This is a description for other admins",
  },
  {
    name: "Other admins 1",
    gid: "234456567",
    description: "This is a description for other admins 1",
  },
  {
    name: "Other admins 2",
    gid: "234456567",
    description: "This is a description for other admins 2",
  },
  {
    name: "Other admins 3",
    gid: "234456567",
    description: "This is a description for other admins 3",
  },
  {
    name: "Other admins 4",
    gid: "234456567",
    description: "This is a description for other admins 4",
  },
  {
    name: "Other admins 5",
    gid: "234456567",
    description: "This is a description for other admins 5",
  },
  {
    name: "Other admins 6",
    gid: "234456567",
    description: "This is a description for other admins 6",
  },
  {
    name: "Other admins 7",
    gid: "234456567",
    description: "This is a description for other admins 7",
  },
  {
    name: "Other admins 8",
    gid: "234456567",
    description: "This is a description for other admins 8",
  },
  {
    name: "Other admins 9",
    gid: "234456567",
    description: "This is a description for other admins 9",
  },
  {
    name: "Other admins 10",
    gid: "234456567",
    description: "This is a description for other admins 10",
  },
  {
    name: "Other admins 11",
    gid: "234456567",
    description: "This is a description for other admins 11",
  },
  {
    name: "Other admins 12",
    gid: "234456567",
    description: "This is a description for other admins 12",
  },
];

// 'Netgroups' initial data
export let netgroupsInitialData: Netgroup[] = [
  {
    name: "netgroup1",
    description: "First netgroup",
  },
  {
    name: "netgroup2",
    description: "Second netgroup",
  },
];

// 'Roles' initial data
export let rolesInitialData: Roles[] = [];

// 'HBAC rules' initial data
export let hbacRulesInitialData: HBACRules[] = [
  {
    name: "allow_all",
    status: "Enabled",
    description: "Allow all users to access any host from any host",
  },
  {
    name: "allow_systemd-user",
    status: "Enabled",
    description:
      "Allow pam_systemd to run user@.service to create a system user session",
  },
];

// 'Sudo rules' initial data
export let sudoRulesInitialData: SudoRules[] = [];

// HOSTS
// - 'Host groups' initial data
export let hostsHostGroupsInitialData: HostGroup[] = [];

// - 'Netgroups' initial data
export let hostsNetgroupsInitialData: Netgroup[] = [
  {
    name: "netgroup1",
    description: "First netgroup",
  },
  {
    name: "netgroup2",
    description: "Second netgroup",
  },
];

// - 'Roles' initial data
export let hostsRolesInitialData: Roles[] = [];

// - 'HBAC rules' initial data
export let hostsHbacRulesInitialData: HBACRules[] = [
  {
    name: "allow_all",
    status: "Enabled",
    description: "Allow all users to access any host from any host",
  },
  {
    name: "allow_systemd-user",
    status: "Enabled",
    description:
      "Allow pam_systemd to run user@.service to create a system user session",
  },
];

// - 'Sudo rules' initial data
export let hostsSudoRulesInitialData: SudoRules[] = [];
