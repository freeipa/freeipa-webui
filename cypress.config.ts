// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://server.ipa.demo/ipa/modern_ui/",
  },
  hosts: {
    "server.ipa.demo": "127.0.0.1",
  },
});
