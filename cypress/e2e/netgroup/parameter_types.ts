import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";

export type NetgroupMemberType =
  | "user"
  | "group"
  | "host"
  | "hostgroup"
  | "netgroup"
  | "externalhost";

const netgroupMemberTypes: NetgroupMemberType[] = [
  "user",
  "group",
  "host",
  "hostgroup",
  "netgroup",
  "externalhost",
];

defineParameterType({
  name: "NetgroupMemberType",
  regexp: new RegExp(netgroupMemberTypes.join("|")),
  transformer: (s: string) => s as NetgroupMemberType,
});
