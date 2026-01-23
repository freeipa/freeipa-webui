import { Given } from "@badeball/cypress-cucumber-preprocessor";

// Allowed member entity values (readonly tuple)
const MEMBER_ENTITIES = [
  "user group",
  "hostgroup",
  "host",
  "user",
  "netgroup",
  "externalhost",
  "group",
] as const;

export type MemberEntity = (typeof MEMBER_ENTITIES)[number];

export const isMemberEntity = (value: string): value is MemberEntity => {
  return MEMBER_ENTITIES.includes(value as MemberEntity);
};

export const assertMemberEntity = (value: string): void => {
  if (!isMemberEntity(value)) {
    throw new Error(`Invalid member entity: ${value}`);
  }
};

type NetgroupMemberTableType =
  | "member_netgroup"
  | "member_user"
  | "member_group"
  | "member_host"
  | "member_hostgroup";

const NETGROUP_MEMBER_OPTIONS_MAP: Readonly<
  Record<NetgroupMemberTableType, string>
> = {
  member_netgroup: "--netgroups",
  member_user: "--users",
  member_group: "--groups",
  member_host: "--hosts",
  member_hostgroup: "--hostgroups",
};

Given("{string} exists in table {string}", (name: string, table: string) => {
  const [netgroupName, memberType] = table.split("/");

  const option =
    NETGROUP_MEMBER_OPTIONS_MAP[memberType as NetgroupMemberTableType];
  if (!option) {
    throw new Error(
      `Unsupported member type "${memberType}". ` +
        `Update NETGROUP_MEMBER_OPTIONS_MAP in member_of.ts to support this type.`
    );
  }

  cy.ipa({
    command: "netgroup-add-member",
    name: netgroupName,
    specificOptions: `${option}=${name}`,
  });
});
