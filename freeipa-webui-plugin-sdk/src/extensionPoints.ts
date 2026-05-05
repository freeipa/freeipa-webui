import type { ExtensionPointDefinition } from "./types";

export const EXTENSION_POINTS = {
  DASHBOARD_CONTENT: "ipa/dashboard/content/v1",
  USER_DETAIL_SECTIONS: "ipa/users/detail/sections/v1",
  LOGIN_BRANDING: "ipa/login/branding/v1",
  HOST_GROUPS_TABLE_COLUMNS: "ipa/hostgroups/table/columns/v1",
  HEADER_TOOLS: "ipa/layout/header-tools/v1",
} as const;

export type ExtensionPointId =
  (typeof EXTENSION_POINTS)[keyof typeof EXTENSION_POINTS];

export const extensionPointDefinitions: ExtensionPointDefinition[] = [
  {
    id: EXTENSION_POINTS.DASHBOARD_CONTENT,
    description: "Add widgets or content blocks to the main Dashboard page.",
  },
  {
    id: EXTENSION_POINTS.USER_DETAIL_SECTIONS,
    description: "Add extra sections to the user detail/settings page.",
  },
  {
    id: EXTENSION_POINTS.LOGIN_BRANDING,
    description:
      "Customize login page branding (logo, text) via an effect component.",
  },
  {
    id: EXTENSION_POINTS.HOST_GROUPS_TABLE_COLUMNS,
    description: "Add extra columns to the Host Groups table.",
  },
  {
    id: EXTENSION_POINTS.HEADER_TOOLS,
    description: "Add items to the masthead/toolbar area.",
  },
];
