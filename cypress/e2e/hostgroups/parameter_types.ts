import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";

export type HostGroupsMembersTab = "host" | "hostgroup";

const hostGroupsMembersTabs: HostGroupsMembersTab[] = ["hostgroup", "host"];

defineParameterType({
  name: "HostGroupsMembersTab",
  regexp: new RegExp(hostGroupsMembersTabs.join("|")),
  transformer: (s: string) => s as HostGroupsMembersTab,
});
