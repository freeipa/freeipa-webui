import { exec as cpExec, ExecOptions } from "child_process";
import util from "util";

const exec = util.promisify(cpExec);

const IPA_PREFIX = "podman exec webui ipa";

let execOptions: ExecOptions = { maxBuffer: 20 * 1024 * 1024 };

function log(message: string) {
  console.log(message);
}

function parseItems(stdout: string): string[] {
  return stdout
    .split("\n")
    .map((line) => line.split(":")[1]?.trim() || "")
    .filter((u) => u.length > 0);
}

async function ipaFind(findArgs: string[]): Promise<string[]> {
  const cmd = `${IPA_PREFIX} ${findArgs.join(" ")}`;
  log(`FIND: ${cmd}`);

  try {
    const { stdout } = await exec(cmd, execOptions);
    return parseItems(String(stdout));
  } catch (e) {
    log(`FIND ERROR: ${cmd} -> ${e}`);
    return [];
  }
}

async function ipaDel(
  delArgs: string[],
  items: string[]
): Promise<{ deleted: string[]; skipped: string[] }> {
  const deleted: string[] = [];
  const skipped: string[] = [];

  for (const item of items) {
    const cmd = `${IPA_PREFIX} ${delArgs.join(" ")} "${item}"`;
    log(`DEL: ${cmd}`);

    try {
      await exec(cmd, execOptions);
      deleted.push(item);
    } catch (e) {
      skipped.push(item);
      log(`SKIP: cannot delete "${item}" – reason: ${e ?? String(e)}`);
    }
  }

  return { deleted, skipped };
}

async function runStandardCleanup(spec: {
  kind: string;
  find: string[];
  del: string[];
  omit?: string[];
}) {
  const { kind, find, del, omit = [] } = spec;

  log(
    `cleanup[${kind}] starting: find=[${find.join(
      " "
    )}] del=[${del.join(" ")}] omit=[${omit.join(", ")}]`
  );

  const allItems = await ipaFind(find);
  const items = allItems.filter((u) => !omit.includes(u));

  if (items.length === 0) {
    log(`cleanup[${kind}] nothing to delete`);
    return;
  }

  const sample = items.slice(0, 10).join(", ");
  const suffix = items.length > 10 ? " ..." : "";
  log(
    `cleanup[${kind}] about to delete ${items.length} item(s): ${sample}${suffix}`
  );

  const { deleted, skipped } = await ipaDel(del, items);

  log(
    `cleanup[${kind}] done: deleted=${deleted.length}, skipped=${skipped.length}`
  );
}

async function runServiceCleanup(serverName: string) {
  const host = serverName;

  const keepPrefixes = [
    `HTTP/${host}`,
    `DNS/${host}`,
    `dogtag/${host}`,
    `ipa-dnskeysyncd/${host}`,
    `ldap/${host}`,
  ];

  log(`cleanup[service] starting: keep=[${keepPrefixes.join(", ")}]`);

  const cmd = `${IPA_PREFIX} service-find --pkey-only`;

  let stdout: string;
  try {
    const res = await exec(cmd, execOptions);
    stdout = String(res.stdout);
  } catch (e) {
    log(
      `FIND(service) ERROR: ${cmd} -> ${
        e ?? String(e)
      }; skipping service cleanup`
    );
    return;
  }

  const allItems = parseItems(stdout);
  const items = allItems.filter(
    (u) => u.length > 0 && !keepPrefixes.some((prefix) => u.startsWith(prefix))
  );

  if (items.length === 0) {
    log(`cleanup[service] nothing to delete`);
    return;
  }

  const sample = items.slice(0, 10).join(", ");
  const suffix = items.length > 10 ? " ..." : "";
  log(
    `cleanup[service] about to delete ${items.length} service(s): ${sample}${suffix}`
  );

  const deleted: string[] = [];
  const skipped: string[] = [];

  for (const u of items) {
    const delCmd = `${IPA_PREFIX} service-del "${u}"`;
    log(`DEL(service): ${delCmd}`);
    try {
      await exec(delCmd, execOptions);
      deleted.push(u);
    } catch (e) {
      skipped.push(u);
      log(`SKIP(service): cannot delete "${u}" – reason: ${e ?? String(e)}`);
    }
  }

  log(
    `cleanup[service] done: deleted=${deleted.length}, skipped=${skipped.length}`
  );
}

export async function ipaCleanup({
  serverName,
  adminLogin,
  adminPassword,
}: {
  serverName: string;
  adminLogin: string;
  adminPassword: string;
}) {
  log(`ipaCleanup starting serverName=${serverName}`);

  // Authenticate with Kerberos first
  const kinitCmd = `echo "${adminPassword}" | podman exec -i webui kinit ${adminLogin}`;
  try {
    await exec(kinitCmd, { maxBuffer: 20 * 1024 * 1024 });
    log(`kinit successful for ${adminLogin}`);
  } catch (e) {
    log(`kinit failed: ${e}`);
    throw new Error(`Failed to authenticate with kinit: ${e}`);
  }

  // Set environment variables for exec commands
  execOptions = {
    maxBuffer: 20 * 1024 * 1024,
    env: {
      ...process.env,
      CYPRESS_ADMIN_LOGIN: adminLogin,
      CYPRESS_ADMIN_PASSWORD: adminPassword,
    },
  };

  const specs = [
    // TODO: Check - "Could not get Grouping Type interactively" error
    // {
    //   kind: "automember",
    //   find: ["automember-find", "--pkey-only"],
    //   del: ["automember-del"],
    // },
    {
      kind: "certmaprule",
      find: ["certmaprule-find", "--pkey-only"],
      del: ["certmaprule-del"],
    },
    {
      kind: "dnsforwardzone",
      find: ["dnsforwardzone-find", "--pkey-only"],
      del: ["dnsforwardzone-del"],
    },
    // TODO: Check - "Could not get Zone name interactively" error
    // {
    //   kind: "dnsrecord",
    //   find: ["dnsrecord-find", "--pkey-only"],
    //   del: ["dnsrecord-del"],
    // },
    {
      kind: "dnszone",
      find: ["dnszone-find", "--pkey-only"],
      del: ["dnszone-del"],
      omit: ["ipa.test."],
    },
    {
      kind: "group",
      find: ["group-find", "--pkey-only"],
      del: ["group-del"],
      omit: ["admins", "editors", "ipausers", "trust admins"],
    },
    {
      kind: "hbacrule",
      find: ["hbacrule-find", "--pkey-only"],
      del: ["hbacrule-del"],
      omit: ["allow_all"],
    },
    {
      kind: "hbacsvc",
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
      ],
    },
    {
      kind: "hbacsvcgroup",
      find: ["hbacsvcgroup-find", "--pkey-only"],
      del: ["hbacsvcgroup-del"],
      omit: ["ftp", "Sudo"],
    },
    {
      kind: "host",
      find: ["host-find", "--pkey-only"],
      del: ["host-del"],
      omit: ["webui.ipa.test"],
    },
    {
      kind: "hostgroup",
      find: ["hostgroup-find", "--pkey-only"],
      del: ["hostgroup-del"],
      omit: ["ipaservers"],
    },
    // TODO: Check - "Could not get ID View Name interactively" error
    // {
    //   kind: "idoverridegroup",
    //   find: ["idoverridegroup-find", "--pkey-only"],
    //   del: ["idoverridegroup-del"],
    // },
    // TODO: Check - "Could not get ID View Name interactively" error
    // {
    //   kind: "idoverrideuser",
    //   find: ["idoverrideuser-find", "--pkey-only"],
    //   del: ["idoverrideuser-del"],
    // },
    {
      kind: "idp",
      find: ["idp-find", "--pkey-only"],
      del: ["idp-del"],
    },
    {
      kind: "idrange",
      find: ["idrange-find", "--pkey-only"],
      del: ["idrange-del"],
      omit: ["IPA.TEST_id_range"],
    },
    {
      kind: "idview",
      find: ["idview-find", "--pkey-only"],
      del: ["idview-del"],
    },
    {
      kind: "netgroup",
      find: ["netgroup-find", "--pkey-only"],
      del: ["netgroup-del"],
    },
    {
      kind: "pwpolicy",
      find: ["pwpolicy-find", "--pkey-only"],
      del: ["pwpolicy-del"],
      omit: ["global_policy"],
    },
    {
      kind: "stageuser",
      find: ["stageuser-find", "--pkey-only"],
      del: ["stageuser-del"],
    },
    {
      kind: "sudocmd",
      find: ["sudocmd-find", "--pkey-only"],
      del: ["sudocmd-del"],
    },
    {
      kind: "sudocmdgroup",
      find: ["sudocmdgroup-find", "--pkey-only"],
      del: ["sudocmdgroup-del"],
    },
    {
      kind: "sudorule",
      find: ["sudorule-find", "--pkey-only"],
      del: ["sudorule-del"],
    },
    {
      kind: "trust",
      find: ["trust-find", "--pkey-only"],
      del: ["trust-del"],
    },
    {
      kind: "user",
      find: ["user-find", "--pkey-only"],
      del: ["user-del"],
      omit: ["admin"],
    },
  ];

  const standardPromises = specs.map((spec) => runStandardCleanup(spec));

  const allPromises = [...standardPromises, runServiceCleanup(serverName)];

  await Promise.all(allPromises);

  log("ipaCleanup finished");

  return null;
}
