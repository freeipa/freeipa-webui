import { ExecOptions } from "child_process";
import { exec, IPA_PREFIX } from "./utils";
import { CLEANUP_SPECS } from "./cleanupSpecs";

export type CleanupMetadata = {
  find: string[];
  del: string[];
  omit?: string[];
};

type IpaCleanupParams = {
  serverName: string;
  adminLogin: string;
  adminPassword: string;
};

export async function ipaCleanup({
  serverName,
  adminLogin,
  adminPassword,
}: IpaCleanupParams) {
  const EXEC_OPTIONS: Readonly<ExecOptions> = {
    maxBuffer: 20 * 1024 * 1024,
    env: {
      ...process.env,
      CYPRESS_ADMIN_LOGIN: adminLogin,
      CYPRESS_ADMIN_PASSWORD: adminPassword,
    },
  };

  const standardPromises = CLEANUP_SPECS.map((spec) =>
    runStandardCleanup({ cleanupMetadata: spec }, EXEC_OPTIONS)
  );

  const allPromises = [
    ...standardPromises,
    runServiceCleanup(serverName, EXEC_OPTIONS),
  ];

  await Promise.all(allPromises);

  return null;
}

function logError(message: string) {
  process.stderr.write(`${message}\n`);
}

function logWarning(message: string) {
  process.stdout.write(`CLEANUP: ${message}\n`);
}

function parseItems(stdout: string): string[] {
  return stdout
    .split("\n")
    .map((line) => line.split(":")[1]?.trim() || "")
    .filter((u) => u.length > 0);
}

async function ipaFind(
  findArgs: string[],
  EXEC_OPTIONS: Readonly<ExecOptions>
): Promise<string[]> {
  const cmd = `${IPA_PREFIX} ${findArgs.join(" ")}`;

  try {
    const { stdout } = await exec(cmd, EXEC_OPTIONS);
    return parseItems(String(stdout));
  } catch {
    return [];
  }
}

async function ipaDel(
  delArgs: string[],
  items: string[],
  EXEC_OPTIONS: Readonly<ExecOptions>
): Promise<void> {
  const deleted: string[] = [];

  for (const item of items) {
    const cmd = `${IPA_PREFIX} ${delArgs.join(" ")} "${item}"`;

    try {
      await exec(cmd, EXEC_OPTIONS);
      deleted.push(item);
    } catch (e) {
      logError(`SKIP: cannot delete "${item}" – reason: ${e ?? String(e)}`);
    }
  }
  if (deleted.length > 0) {
    logWarning(`DELETED: ${deleted.join(", ")}`);
  }
}

async function runStandardCleanup(
  spec: {
    cleanupMetadata: CleanupMetadata;
  },
  EXEC_OPTIONS: Readonly<ExecOptions>
) {
  const { find, del, omit = [] } = spec.cleanupMetadata;

  const allItems = await ipaFind(find, EXEC_OPTIONS);
  const items = allItems.filter((u) => !omit.includes(u));

  await ipaDel(del, items, EXEC_OPTIONS);
}

async function runServiceCleanup(
  serverName: string,
  EXEC_OPTIONS: Readonly<ExecOptions>
) {
  const host = serverName;

  const keepPrefixes = [
    `HTTP/${host}`,
    `DNS/${host}`,
    `dogtag/${host}`,
    `ipa-dnskeysyncd/${host}`,
    `ldap/${host}`,
  ];

  const allItems = await ipaFind(["service-find", "--pkey-only"], EXEC_OPTIONS);
  const items = allItems.filter(
    (u) => u.length > 0 && !keepPrefixes.some((prefix) => u.startsWith(prefix))
  );

  if (items.length === 0) {
    return;
  }

  await ipaDel(["service-del"], items, EXEC_OPTIONS);
}
