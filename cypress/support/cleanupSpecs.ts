import { CleanupMetadata } from "./ipaCleanup";

export const CLEANUP_SPECS: CleanupMetadata[] = [
  // TODO: Check - "Could not get Grouping Type interactively" error
  // {
  //   find: ["automember-find", "--pkey-only"],
  //   del: ["automember-del"],
  // },
  {
    find: ["certmaprule-find", "--pkey-only"],
    del: ["certmaprule-del"],
  },
  {
    find: ["dnsforwardzone-find", "--pkey-only"],
    del: ["dnsforwardzone-del"],
  },
  // TODO: Check - "Could not get Zone name interactively" error
  // {
  //   find: ["dnsrecord-find", "--pkey-only"],
  //   del: ["dnsrecord-del"],
  // },
  {
    find: ["dnszone-find", "--pkey-only"],
    del: ["dnszone-del"],
    omit: ["ipa.test.", "my-new-host.ipa.test"],
  },
  {
    find: ["group-find", "--pkey-only"],
    del: ["group-del"],
    omit: ["admins", "editors", "ipausers", "trust admins"],
  },
  {
    find: ["hbacrule-find", "--pkey-only"],
    del: ["hbacrule-del"],
    omit: ["allow_all", "allow_systemd-user"],
  },
  {
    find: ["hbacsvc-find", "--pkey-only"],
    del: ["hbacsvc-del"],
    omit: [
      "gdm",
      "gdm-password",
      "gssftp",
      "kdm",
      "login",
      "proftpd",
      "pure-ftpd",
      "sshd",
      "su",
      "su-l",
      "sudo",
      "sudo-i",
      "systemd-user",
      "vsftpd",
      "crond",
      "ftp",
    ],
  },
  {
    find: ["hbacsvcgroup-find", "--pkey-only"],
    del: ["hbacsvcgroup-del"],
    omit: ["ftp", "Sudo"],
  },
  {
    find: ["host-find", "--pkey-only"],
    del: ["host-del"],
    omit: ["webui.ipa.test"],
  },
  {
    find: ["hostgroup-find", "--pkey-only"],
    del: ["hostgroup-del"],
    omit: ["ipaservers"],
  },
  // TODO: Check - "Could not get ID View Name interactively" error
  // {
  //   find: ["idoverridegroup-find", "--pkey-only"],
  //   del: ["idoverridegroup-del"],
  // },
  // TODO: Check - "Could not get ID View Name interactively" error
  // {
  //   find: ["idoverrideuser-find", "--pkey-only"],
  //   del: ["idoverrideuser-del"],
  // },
  {
    find: ["idp-find", "--pkey-only"],
    del: ["idp-del"],
  },
  {
    find: ["idrange-find", "--pkey-only"],
    del: ["idrange-del"],
    omit: ["IPA.TEST_id_range", "IPA.TEST_subid_range"],
  },
  {
    find: ["idview-find", "--pkey-only"],
    del: ["idview-del"],
  },
  {
    find: ["netgroup-find", "--pkey-only"],
    del: ["netgroup-del"],
  },
  {
    find: ["pwpolicy-find", "--pkey-only"],
    del: ["pwpolicy-del"],
    omit: ["global_policy"],
  },
  {
    find: ["stageuser-find", "--pkey-only"],
    del: ["stageuser-del"],
  },
  {
    find: ["sudocmd-find", "--pkey-only"],
    del: ["sudocmd-del"],
  },
  {
    find: ["sudocmdgroup-find", "--pkey-only"],
    del: ["sudocmdgroup-del"],
  },
  {
    find: ["sudorule-find", "--pkey-only"],
    del: ["sudorule-del"],
  },
  {
    find: ["trust-find", "--pkey-only"],
    del: ["trust-del"],
  },
  {
    find: ["user-find", "--pkey-only"],
    del: ["user-del"],
    omit: ["admin"],
  },
];
