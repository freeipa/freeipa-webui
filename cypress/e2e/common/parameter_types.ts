import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";

export type MemberOfModal = "member-of-add-modal" | "member-of-delete-modal";

const memberOfModals: MemberOfModal[] = [
  "member-of-add-modal",
  "member-of-delete-modal",
];

defineParameterType({
  name: "MemberOfModal",
  regexp: new RegExp(memberOfModals.join("|")),
  transformer: (s: string) => s as MemberOfModal,
});
