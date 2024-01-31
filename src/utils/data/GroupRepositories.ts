/* eslint-disable prefer-const */

/*
 * This is a temporal file to hold the repositories (aka. the intial data lists)
 * used on the 'Active users' page > 'Is a member of' section.
 *
 * In the future, this must be retrieved from other source (eg.: API call, Redux, etc)
 */

import {
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
  HostGroup,
} from "../datatypes/globalDataTypes";

// USERS

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

// SERVICES
// - 'Roles' initial data
export let servicesRolesInitialData: Roles[] = [];
