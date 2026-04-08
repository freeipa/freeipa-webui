/**
 * Pure helpers for Healthcheck data shaping, formatting, and RPC helpers.
 *
 * Exports cover: payload normalization, table row building, severity filtering,
 * user-visible strings for the Web UI, and error text for alerts.
 */

/** ``all`` shows every check; other values filter by the ``result`` field. */
export type HealthcheckSeverityFilter =
  | "all"
  | "SUCCESS"
  | "CRITICAL"
  | "ERROR"
  | "WARNING";

/** Known ``result`` severities used for multi-select filters and sorting. */
export type HealthcheckKnownSeverity =
  | "SUCCESS"
  | "CRITICAL"
  | "ERROR"
  | "WARNING";

/** ``result`` values we treat as displayable healthcheck messages in the UI. */
export const HEALTHCHECK_KNOWN_RESULT_LEVELS = new Set<string>([
  "SUCCESS",
  "CRITICAL",
  "ERROR",
  "WARNING",
]);

/** Display / checkbox order (most severe first). */
export const HEALTHCHECK_SEVERITY_DISPLAY_ORDER: readonly HealthcheckKnownSeverity[] =
  ["CRITICAL", "ERROR", "WARNING", "SUCCESS"] as const;

const HEALTHCHECK_SEVERITY_SORT_RANK = new Map<string, number>([
  ["CRITICAL", 0],
  ["ERROR", 1],
  ["WARNING", 2],
  ["SUCCESS", 3],
]);

/**
 * Sort rank for ``result`` (lower = more severe). Unknown values sort last.
 */
export function healthcheckSeveritySortRank(result: string): number {
  const u = result.trim().toUpperCase();
  return HEALTHCHECK_SEVERITY_SORT_RANK.get(u) ?? 99;
}

const HEALTHCHECK_DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
});

/** Uppercase trimmed ``result`` string from a check object, or empty if missing. */
function normalizedResultString(item: unknown): string {
  if (!item || typeof item !== "object" || !("result" in item)) {
    return "";
  }
  const r = (item as Record<string, unknown>).result;
  return typeof r === "string" ? r.trim().toUpperCase() : "";
}

/**
 * Flatten payload to a list of check objects (single check becomes one element).
 */
export function collectHealthcheckItems(data: unknown): unknown[] {
  if (data === null || data === undefined) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (typeof data === "object") {
    return [data];
  }
  return [];
}

/** True if the item has a ``result`` in SUCCESS / CRITICAL / ERROR / WARNING. */
export function hasKnownSeverityResultItem(item: unknown): boolean {
  const u = normalizedResultString(item);
  return u !== "" && HEALTHCHECK_KNOWN_RESULT_LEVELS.has(u);
}

/**
 * True when at least one check uses a known severity ``result`` (the levels
 * shown in the filter). If none match, the UI should show “no messages”
 * instead of raw JSON.
 */
export function hasAnyKnownSeverityMessages(data: unknown): boolean {
  return collectHealthcheckItems(data).some(hasKnownSeverityResultItem);
}

/** True if the report contains at least one check with result CRITICAL. */
export function hasAnyCriticalHealthcheckResult(data: unknown): boolean {
  return collectHealthcheckItems(data).some(
    (item) => normalizedResultString(item) === "CRITICAL"
  );
}

/** True when stringified payload would be only an empty JSON array ``[]``. */
export function isEmptyHealthcheckJsonArray(data: unknown): boolean {
  return Array.isArray(data) && data.length === 0;
}

/** Counts of checks per known ``result`` severity (full report, not filtered). */
export type HealthcheckSeverityCounts = {
  SUCCESS: number;
  ERROR: number;
  WARNING: number;
  CRITICAL: number;
};

/**
 * Count items in the payload by ``result`` (SUCCESS / ERROR / WARNING /
 * CRITICAL). Unknown or missing ``result`` values are ignored.
 */
export function countHealthcheckResultsBySeverity(
  data: unknown
): HealthcheckSeverityCounts {
  const counts: HealthcheckSeverityCounts = {
    SUCCESS: 0,
    ERROR: 0,
    WARNING: 0,
    CRITICAL: 0,
  };
  for (const item of collectHealthcheckItems(data)) {
    const u = normalizedResultString(item);
    if (u === "SUCCESS") {
      counts.SUCCESS++;
    } else if (u === "ERROR") {
      counts.ERROR++;
    } else if (u === "WARNING") {
      counts.WARNING++;
    } else if (u === "CRITICAL") {
      counts.CRITICAL++;
    }
  }
  return counts;
}

export type HealthcheckTableRow = {
  id: string;
  timestampRaw: string;
  timestamp: string;
  result: string;
  source: string;
  check: string;
  /** Primary user-oriented message (``msg`` / ``message``), for the info popover. */
  userMessage: string;
  details: string;
};

const LABEL_COLOR_BY_SEVERITY = new Map<
  string,
  "green" | "yellow" | "orange" | "red" | "grey"
>([
  ["SUCCESS", "green"],
  ["WARNING", "yellow"],
  ["ERROR", "orange"],
  ["CRITICAL", "red"],
]);

/**
 * PatternFly ``Label`` color for a healthcheck ``result`` string:
 * SUCCESS green, WARNING yellow, ERROR orange, CRITICAL red.
 */
export function healthcheckResultLabelColor(
  result: string
): "green" | "yellow" | "orange" | "red" | "grey" {
  return LABEL_COLOR_BY_SEVERITY.get(result.trim().toUpperCase()) ?? "grey";
}

/** Primary text fields ``msg`` / ``message`` on the check object (top level). */
function healthcheckMessageText(o: Record<string, unknown>): string {
  if (typeof o.msg === "string" && o.msg.trim() !== "") {
    return o.msg;
  }
  if (typeof o.message === "string" && o.message.trim() !== "") {
    return o.message;
  }
  return "";
}

/** ``key`` field from the check or from nested ``kw``, for expiry-style checks. */
function healthcheckKeyText(o: Record<string, unknown>): string {
  if (typeof o.key === "string" && o.key.trim() !== "") {
    return o.key;
  }
  if (o.kw && typeof o.kw === "object" && !Array.isArray(o.kw)) {
    const kw = o.kw as Record<string, unknown>;
    if (typeof kw.key === "string" && kw.key.trim() !== "") {
      return kw.key;
    }
  }
  return "";
}

/** ``msg`` / ``message`` read from nested ``kw`` when present. */
function healthcheckMessageTextFromKw(o: Record<string, unknown>): string {
  if (!o.kw || typeof o.kw !== "object" || Array.isArray(o.kw)) {
    return "";
  }
  return healthcheckMessageText(o.kw as Record<string, unknown>);
}

/**
 * True when details are empty or only an empty JSON object (``{}``), including
 * pretty-printed forms — so the UI can show an em dash instead of ``{}``.
 */
export function isEmptyHealthcheckDetailsDisplay(text: string): boolean {
  const t = text.trim();
  if (t === "") {
    return true;
  }
  if (t === "{}" || /^\{\s*\}$/.test(t)) {
    return true;
  }
  try {
    const parsed: unknown = JSON.parse(t);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      Object.keys(parsed as object).length === 0
    ) {
      return true;
    }
  } catch {
    // not JSON — treat as real content
  }
  return false;
}

/** Returns empty string when details are visually empty (see ``isEmptyHealthcheckDetailsDisplay``). */
function normalizeHealthcheckDetailsString(text: string): string {
  return isEmptyHealthcheckDetailsDisplay(text) ? "" : text;
}

/** Matches certmonger-style compact not-after times: ``YYYYMMDDHHmmss``. */
const COMPACT_TIMESTAMP_14 = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;

/**
 * If ``key`` is a 14-digit ``YYYYMMDDHHmmss`` string with a valid calendar
 * time, return a ``Date``; otherwise ``null``.
 */
export function parseCompactHealthcheckTimestamp(key: string): Date | null {
  const trimmed = key.trim();
  const m = trimmed.match(COMPACT_TIMESTAMP_14);
  if (!m) {
    return null;
  }
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const h = Number(m[4]);
  const mi = Number(m[5]);
  const s = Number(m[6]);
  if (y < 1970 || y > 2100) {
    return null;
  }
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59 || s > 59) {
    return null;
  }
  const date = new Date(y, mo - 1, d, h, mi, s);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d ||
    date.getHours() !== h ||
    date.getMinutes() !== mi ||
    date.getSeconds() !== s
  ) {
    return null;
  }
  return date;
}

/**
 * Pretty-print ``key`` when it is a compact 14-digit timestamp; otherwise
 * return ``key`` unchanged (e.g. SRV strings).
 */
export function formatHealthcheckKeyForDisplay(key: string): string {
  const date = parseCompactHealthcheckTimestamp(key);
  if (!date) {
    return key;
  }
  return HEALTHCHECK_DATE_TIME_FORMATTER.format(date);
}

/**
 * Pretty-print certificate expiry values: compact ``YYYYMMDDHHmmssZ``, plain
 * 14-digit compact times, or parseable ISO date strings.
 */
export function formatHealthcheckExpiryValue(raw: string): string {
  const t = raw.trim();
  if (t === "") {
    return t;
  }
  const compact =
    t.length === 15 && t.endsWith("Z") && /^\d{14}Z$/.test(t)
      ? t.slice(0, -1)
      : t;
  const d14 = parseCompactHealthcheckTimestamp(compact);
  if (d14) {
    return HEALTHCHECK_DATE_TIME_FORMATTER.format(d14);
  }
  const isoMs = Date.parse(t);
  if (!Number.isNaN(isoMs)) {
    return HEALTHCHECK_DATE_TIME_FORMATTER.format(new Date(isoMs));
  }
  return formatHealthcheckKeyForDisplay(t);
}

/** Rewrite ``key`` string fields for JSON detail blobs (recursive). */
function formatKeyStringsForDisplayDeep(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => formatKeyStringsForDisplayDeep(v));
  }
  const rec = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rec)) {
    if (k === "key" && typeof v === "string") {
      out[k] = formatHealthcheckKeyForDisplay(v);
    } else if (v !== null && typeof v === "object") {
      out[k] = formatKeyStringsForDisplayDeep(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Shallow copy of ``kw`` object on a check entry, or empty object. */
function getHealthcheckKwFlat(
  o: Record<string, unknown>
): Record<string, unknown> {
  if (o.kw && typeof o.kw === "object" && !Array.isArray(o.kw)) {
    return { ...(o.kw as Record<string, unknown>) };
  }
  return {};
}

/**
 * Replace ``{name}`` placeholders using scalar values from ``kw`` (e.g.
 * ``{server}``, ``{cpus}``, ``{workers}``).
 */
export function substituteKwPlaceholdersInString(
  template: string,
  kw: Record<string, unknown>
): string {
  return template.replace(
    /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g,
    (match, name: string) => {
      if (!Object.prototype.hasOwnProperty.call(kw, name)) {
        return match;
      }
      const v = kw[name];
      if (v === null || v === undefined) {
        return match;
      }
      if (
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean"
      ) {
        return String(v);
      }
      return match;
    }
  );
}

/** True when ``kw`` is only ``{ status: true }`` (success-only meta payloads). */
function isKwOnlyStatusTrue(kw: Record<string, unknown>): boolean {
  const keys = Object.keys(kw);
  return keys.length === 1 && keys[0] === "status" && kw.status === true;
}

const USER_MESSAGE_STATUS_TRUE =
  "The check completed successfully; no additional diagnostics are required for this item.";

const META_SERVICES_SOURCE = "ipahealthcheck.meta.services";
const META_CORE_SOURCE = "ipahealthcheck.meta.core";
const META_CORE_CHECK = "MetaCheck";
const CA_SYSTEM_CERT_TRUST_FLAG_CHECK = "CASystemCertTrustFlagCheck";
const IPA_FILE_CHECK = "IPAFileCheck";
const IPA_FILE_NSSDB_CHECK = "IPAFileNSSDBCheck";
const IPA_HOST_KEYTAB_CHECK = "IPAHostKeytab";
const IPA_TOPOLOGY_DOMAIN_CHECK = "IPATopologyDomainCheck";
const KEYTAB_CHECKS = new Set([
  "IPAHostKeytab",
  "DSKeytab",
  "HTTPKeytab",
  "DNSKeytab",
  "DNS_keysyncKeytab",
]);
const DOGTAG_CONNECTIVITY_CHECKS = new Set([
  "DogtagOCSPConnectivityCheck",
  "DogtagTKSConnectivityCheck",
  "DogtagTPSConnectivityCheck",
]);

/** One-line success text for ``ipahealthcheck.meta.services`` checks. */
function formatMetaServiceSuccessDetails(
  o: Record<string, unknown>,
  kw: Record<string, unknown>
): string | null {
  if (typeof o.source !== "string" || o.source !== META_SERVICES_SOURCE) {
    return null;
  }
  if (!isKwOnlyStatusTrue(kw)) {
    return null;
  }
  const service = typeof o.check === "string" ? o.check.trim() : "";
  if (service === "") {
    return null;
  }
  return `${service} is running. No additional diagnostics required.`;
}

/** First non-empty string among ``keys`` on object ``o``. */
function pickFirstNonEmptyString(
  o: Record<string, unknown>,
  keys: readonly string[]
): string {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(o, key)) {
      continue;
    }
    const value = o[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return "";
}

/** Host / IPA version summary for ``ipahealthcheck.meta.core`` MetaCheck. */
function formatMetaCoreCheckDetails(
  o: Record<string, unknown>,
  kw: Record<string, unknown>
): string | null {
  if (o.source !== META_CORE_SOURCE || o.check !== META_CORE_CHECK) {
    return null;
  }
  const host =
    pickFirstNonEmptyString(kw, ["fqdn", "host", "hostname", "server"]) ||
    pickFirstNonEmptyString(o, ["fqdn", "host", "hostname", "server"]);
  const ipaVersion =
    pickFirstNonEmptyString(kw, ["ipa_version", "version"]) ||
    pickFirstNonEmptyString(o, ["ipa_version", "version"]);
  const result =
    typeof o.result === "string" && o.result.trim() !== ""
      ? o.result.trim()
      : "UNKNOWN";

  const parts: string[] = [];
  if (host !== "") {
    parts.push(`Host: ${host}`);
  }
  if (ipaVersion !== "") {
    parts.push(`IPA version: ${ipaVersion}`);
  }
  if (parts.length === 0) {
    return (
      `Metadata check (${result}) completed. ` +
      `This entry records host and version context for this run.`
    );
  }
  return (
    `Metadata check (${result}) — ${parts.join("; ")}. ` +
    `This entry records environment context for this healthcheck run.`
  );
}

/** User-facing line for Dogtag OCSP/TKS/TPS connectivity checks. */
function formatDogtagConnectivityDetails(
  o: Record<string, unknown>,
  kw: Record<string, unknown>
): string | null {
  const check = typeof o.check === "string" ? o.check : "";
  if (!DOGTAG_CONNECTIVITY_CHECKS.has(check)) {
    return null;
  }
  const subsystem =
    check === "DogtagOCSPConnectivityCheck"
      ? "OCSP"
      : check === "DogtagTKSConnectivityCheck"
        ? "TKS"
        : "TPS";
  const endpoint =
    pickFirstNonEmptyStringFromKw(kw, [
      "url",
      "uri",
      "endpoint",
      "host",
      "hostname",
      "server",
      "target",
    ]) ||
    pickFirstNonEmptyString(o, ["url", "uri", "endpoint", "host", "server"]);
  const msg = substituteKwPlaceholdersInString(
    healthcheckMessageText(o) || healthcheckMessageTextFromKw(o),
    kw
  );
  const result =
    typeof o.result === "string" ? o.result.trim().toUpperCase() : "";

  if (result === "SUCCESS") {
    if (endpoint !== "") {
      return `${subsystem} connectivity is healthy. The subsystem responded at ${endpoint}.`;
    }
    return `${subsystem} connectivity is healthy. The subsystem responded successfully.`;
  }
  if (msg !== "") {
    if (endpoint !== "") {
      return `${subsystem} connectivity check reported an issue for ${endpoint}: ${msg}`;
    }
    return `${subsystem} connectivity check reported an issue: ${msg}`;
  }
  if (endpoint !== "") {
    return (
      `${subsystem} connectivity could not be confirmed for ${endpoint}. ` +
      `Verify service status, network reachability, and Dogtag subsystem health.`
    );
  }
  return (
    `${subsystem} connectivity could not be confirmed. ` +
    `Verify service status, network reachability, and Dogtag subsystem health.`
  );
}

/** File permission / ownership summary for ``IPAFileCheck`` / NSS DB variants. */
function formatIPAFileCheckDetails(kw: Record<string, unknown>): string | null {
  const filename = pickFirstNonEmptyStringFromKw(kw, [
    "filename",
    "file",
    "path",
    "name",
  ]);
  const modeFound = pickFirstNonEmptyStringFromKw(kw, [
    "mode",
    "found_mode",
    "current_mode",
    "actual_mode",
    "perm",
    "permission",
  ]);
  const modeExpected = pickFirstNonEmptyStringFromKw(kw, [
    "expected_mode",
    "required_mode",
  ]);
  const ownerFound = pickFirstNonEmptyStringFromKw(kw, [
    "owner",
    "uid",
    "found_owner",
    "current_owner",
    "actual_owner",
  ]);
  const ownerExpected = pickFirstNonEmptyStringFromKw(kw, [
    "expected_owner",
    "required_owner",
  ]);

  if (
    filename === "" &&
    modeFound === "" &&
    modeExpected === "" &&
    ownerFound === "" &&
    ownerExpected === ""
  ) {
    return null;
  }

  const modePart =
    modeExpected !== "" && modeFound !== ""
      ? `Permission expected=${modeExpected}, found=${modeFound}`
      : modeFound !== ""
        ? `Permission ${modeFound}`
        : modeExpected !== ""
          ? `Permission expected=${modeExpected}`
          : "Permission unavailable";
  const ownerPart =
    ownerExpected !== "" && ownerFound !== ""
      ? `Ownership expected=${ownerExpected}, found=${ownerFound}`
      : ownerFound !== ""
        ? `Ownership ${ownerFound}`
        : ownerExpected !== ""
          ? `Ownership expected=${ownerExpected}`
          : "Ownership unavailable";
  const prefix =
    filename !== "" ? `Filename: ${filename}` : "Filename: (unknown)";
  return `${prefix}; ${modePart}; ${ownerPart}`;
}

/** Keytab presence / path line for host and service keytab checks. */
function formatIPAHostKeytabDetails(
  o: Record<string, unknown>,
  kw: Record<string, unknown>
): string | null {
  if (!KEYTAB_CHECKS.has(String(o.check))) {
    return null;
  }
  const check = String(o.check);
  const keytabPath =
    pickFirstNonEmptyStringFromKw(kw, [
      "keytab",
      "keytab_path",
      "path",
      "filename",
      "file",
    ]) || "/etc/krb5.keytab";
  const result =
    typeof o.result === "string" ? o.result.trim().toUpperCase() : "";
  const msg = substituteKwPlaceholdersInString(
    healthcheckMessageText(o) || healthcheckMessageTextFromKw(o),
    kw
  ).toLowerCase();
  const present =
    result === "SUCCESS" ||
    /\b(found|present|ok|valid)\b/.test(msg) ||
    (!/\bmissing|not found|cannot|failed|denied|unreadable\b/.test(msg) &&
      msg !== "");

  const subject =
    check === IPA_HOST_KEYTAB_CHECK
      ? "Host keytab"
      : check === "DSKeytab"
        ? "Directory Server keytab"
        : check === "HTTPKeytab"
          ? "HTTP keytab"
          : check === "DNSKeytab"
            ? "DNS keytab"
            : "DNS keysync keytab";
  if (present) {
    return `${subject} is present and usable. Keytab file: ${keytabPath}`;
  }
  if (msg !== "") {
    return `${subject} is not usable. Keytab file: ${keytabPath}. Issue: ${msg}`;
  }
  return `${subject} is not present or not usable. Keytab file: ${keytabPath}`;
}

/** Lists topology suffix lines for ``IPATopologyDomainCheck``. */
function formatIPATopologyDomainDetails(
  o: Record<string, unknown>,
  kw: Record<string, unknown>
): string | null {
  if (o.check !== IPA_TOPOLOGY_DOMAIN_CHECK) {
    return null;
  }
  const lines: string[] = [];
  const suffixFromKey = pickFirstNonEmptyStringFromKw(kw, [
    "suffix",
    "suffix_name",
    "topologysuffix",
  ]);
  if (suffixFromKey !== "") {
    lines.push(`suffix: ${suffixFromKey}`);
  }
  for (const [k, v] of Object.entries(kw)) {
    if (typeof v !== "string" || v.trim() === "") {
      continue;
    }
    const key = k.toLowerCase();
    if (!key.includes("suffix")) {
      continue;
    }
    const value = v.trim();
    if (
      !lines.some((l) => l.toLowerCase() === `suffix: ${value.toLowerCase()}`)
    ) {
      lines.push(`suffix: ${value}`);
    }
  }
  if (lines.length === 0) {
    return "suffix: domain\nsuffix: ca";
  }
  return lines.join("\n");
}

const DNA_RANGE_CHECK = "IPADNARangeCheck";

const PKI_SERVER_HEALTHCHECK_CERTS_SOURCE = "pki.server.healthcheck.certs";
const PKI_SERVER_HEALTHCHECK_CERTS_EXPIRATION_CHECK = "expiration";
const PKI_SERVER_HEALTHCHECK_CERTS_EXPIRATION_FULL =
  "pki.server.healthcheck.certs.expiration";

const PKI_CERT_EXPIRATION_ID_KEYS = [
  "certid",
  "cert_id",
  "certId",
  "nickname",
  "subsystem",
  "tag",
  "certificate_id",
  "certificateId",
  "id",
] as const;

const PKI_CERT_EXPIRATION_DATE_KEYS = [
  "not_after",
  "notAfter",
  "not_valid_after",
  "notValidAfter",
  "expiration",
  "expires",
  "valid_until",
  "end",
] as const;

const PKI_CERT_TYPE_HINT_KEYS = [
  "type",
  "cert_type",
  "certType",
  "usage",
] as const;

/** First non-empty string value for ``keys`` inside ``kw``. */
function pickFirstNonEmptyStringFromKw(
  kw: Record<string, unknown>,
  keys: readonly string[]
): string {
  for (const k of keys) {
    if (!Object.prototype.hasOwnProperty.call(kw, k)) {
      continue;
    }
    const v = kw[k];
    if (typeof v === "string" && v.trim() !== "") {
      return v.trim();
    }
  }
  return "";
}

/** True for Dogtag PKI ``pki.server.healthcheck.certs`` expiration check shapes. */
function isPkiServerHealthcheckCertsExpiration(
  source: string,
  check: string
): boolean {
  if (check === PKI_SERVER_HEALTHCHECK_CERTS_EXPIRATION_FULL) {
    return true;
  }
  if (
    source === PKI_SERVER_HEALTHCHECK_CERTS_SOURCE &&
    check === PKI_SERVER_HEALTHCHECK_CERTS_EXPIRATION_CHECK
  ) {
    return true;
  }
  return false;
}

/** Human label (signing / SSL / …) for PKI cert expiration summary lines. */
function inferPkiExpirationCertKindLabel(
  kw: Record<string, unknown>,
  certid: string,
  msg: string
): string {
  const typeHint = pickFirstNonEmptyStringFromKw(kw, PKI_CERT_TYPE_HINT_KEYS);
  const hay = `${typeHint} ${certid} ${msg}`.toLowerCase();
  if (/audit/.test(hay) && /sign/.test(hay)) {
    return "Audit signing cert";
  }
  if (
    /ca_signing|casigning|signing|subsystemcert|subsystem cert|kra_transport|kra_storage|ocsp/.test(
      hay
    )
  ) {
    if (/ocsp/.test(hay)) {
      return "OCSP signing cert";
    }
    return "Signing cert";
  }
  if (/ssl|server.?cert|https|tomcat/.test(hay)) {
    return "SSL certificate";
  }
  return "Certificate";
}

/**
 * Dogtag ``pki.server.healthcheck.certs`` / ``expiration`` — single-line summary.
 */
export function formatPkiServerHealthcheckCertsExpirationDetails(
  o: Record<string, unknown>,
  kw: Record<string, unknown>
): string | null {
  const source = typeof o.source === "string" ? o.source.trim() : "";
  const check = typeof o.check === "string" ? o.check.trim() : "";
  if (!isPkiServerHealthcheckCertsExpiration(source, check)) {
    return null;
  }

  const certid = pickFirstNonEmptyStringFromKw(kw, PKI_CERT_EXPIRATION_ID_KEYS);
  let expiryRaw = pickFirstNonEmptyStringFromKw(
    kw,
    PKI_CERT_EXPIRATION_DATE_KEYS
  );

  const keyStr = healthcheckKeyText(o);
  if (expiryRaw === "" && keyStr !== "") {
    const keyCompact = keyStr.endsWith("Z") ? keyStr.slice(0, -1) : keyStr;
    if (parseCompactHealthcheckTimestamp(keyCompact)) {
      expiryRaw = keyStr;
    }
  }

  const msg = substituteKwPlaceholdersInString(
    healthcheckMessageText(o) || healthcheckMessageTextFromKw(o),
    kw
  );

  if (certid === "" || expiryRaw === "") {
    return null;
  }

  const kind = inferPkiExpirationCertKindLabel(kw, certid, msg);
  const expiryDisplay = formatHealthcheckExpiryValue(expiryRaw);
  return `${kind} certid:${certid} expiry date is ${expiryDisplay}`;
}

const DNA_KNOWN_KEYS = new Set([
  "range_start",
  "range_max",
  "next_start",
  "next_max",
  "msg",
]);

const CERT_EXPIRATION_CHECK_NAMES = new Set([
  "IPACertTracking",
  "IPACertfileExpirationCheck",
  "IPACertmongerExpirationCheck",
  "KRASystemCertExpiryCheck",
  "TPSSystemCertExpiryCheck",
  "TKSSystemCertExpiryCheck",
  "OCSPSystemCertExpiryCheck",
]);

const CERT_NICKNAME_KEYS = [
  "nickname",
  "cert-nickname",
  "cert_nickname",
  "certfile",
] as const;

/** NSS / IPA cert nickname from common ``kw`` keys. */
function pickCertNicknameFromKw(kw: Record<string, unknown>): string {
  for (const k of CERT_NICKNAME_KEYS) {
    const v = kw[k];
    if (typeof v === "string" && v.trim() !== "") {
      return v.trim();
    }
  }
  return "";
}

/** Parses ``certid: …`` fragment from a message substring. */
function pickCertIdFromMessage(msgPart: string): string {
  const m = msgPart.match(/certid\s*:\s*([^,\n;]+)/i);
  return m && m[1] ? m[1].trim() : "";
}

const CERT_ID_KEYS = [
  "certid",
  "cert_id",
  "certId",
  "id",
  "certificate_id",
] as const;

/** Trust flag expected vs found for ``CASystemCertTrustFlagCheck``. */
function formatCASystemCertTrustFlagDetails(
  o: Record<string, unknown>,
  kw: Record<string, unknown>
): string | null {
  if (o.check !== CA_SYSTEM_CERT_TRUST_FLAG_CHECK) {
    return null;
  }
  const certid = pickFirstNonEmptyStringFromKw(kw, CERT_ID_KEYS);
  const nickname = pickCertNicknameFromKw(kw);
  const found = pickFirstNonEmptyStringFromKw(kw, [
    "found",
    "current",
    "actual",
    "trust_flags",
    "trustFlags",
    "flags",
  ]);
  const expected = pickFirstNonEmptyStringFromKw(kw, [
    "expected",
    "wanted",
    "required",
    "required_flags",
    "expected_flags",
  ]);

  const certPart =
    certid !== "" && nickname !== ""
      ? `certid:${certid} nickname:${nickname}`
      : certid !== ""
        ? `certid:${certid}`
        : nickname !== ""
          ? `nickname:${nickname}`
          : "certificate";
  const trustPart =
    expected !== "" && found !== ""
      ? `trust flags expected=${expected}, found=${found}`
      : found !== ""
        ? `trust flags ${found}`
        : expected !== ""
          ? `expected trust flags ${expected}`
          : "trust flag mismatch";
  return `${certPart} ${trustPart}`;
}

const DNA_FIELD_ROWS: [string, string][] = [
  ["Range start", "range_start"],
  ["Range maximum", "range_max"],
  ["Next range start", "next_start"],
  ["Next range maximum", "next_max"],
];

/** Renders DNA range fields from ``IPADNARangeCheck`` ``kw``. */
function formatIPADNARangeCheckDetails(kw: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [label, key] of DNA_FIELD_ROWS) {
    if (Object.prototype.hasOwnProperty.call(kw, key)) {
      const v = kw[key];
      if (v !== undefined && v !== null) {
        lines.push(`${label}: ${String(v)}`);
      }
    }
  }
  if (typeof kw.msg === "string" && kw.msg.trim() !== "") {
    lines.push(kw.msg.trim());
  }
  for (const [k, v] of Object.entries(kw)) {
    if (DNA_KNOWN_KEYS.has(k)) {
      continue;
    }
    if (v !== null && v !== undefined && typeof v !== "object") {
      lines.push(`${k}: ${String(v)}`);
    }
  }
  return lines.join("\n");
}

/** Richer expiry line for IPA / subsystem cert checks using ``key`` + ``msg``. */
function enhanceCertExpirationLine(
  check: string,
  kw: Record<string, unknown>,
  keyRaw: string,
  keyDisplay: string,
  msgPart: string
): string | null {
  if (!CERT_EXPIRATION_CHECK_NAMES.has(check)) {
    return null;
  }
  if (!keyRaw || !parseCompactHealthcheckTimestamp(keyRaw)) {
    return null;
  }
  const nick = pickCertNicknameFromKw(kw);
  const certFromMsg = pickCertIdFromMessage(msgPart);
  const certLabel = nick || certFromMsg;
  if (check === "KRASystemCertExpiryCheck") {
    if (certLabel !== "") {
      return (
        `KRA system certificate ${certLabel} expires on ${keyDisplay}; ` +
        "renew it before this time to avoid KRA service impact."
      );
    }
    return (
      `KRA system certificate expires on ${keyDisplay}; renew it before this ` +
      "time to avoid KRA service impact."
    );
  }
  if (
    check === "IPACertmongerExpirationCheck" ||
    check === "IPACertfileExpirationCheck"
  ) {
    if (certLabel !== "") {
      return `${certLabel}:${keyDisplay}`;
    }
    if (msgPart !== "") {
      return `${msgPart}:${keyDisplay}`;
    }
    return `Certificate:${keyDisplay}`;
  }
  if (
    check === "TPSSystemCertExpiryCheck" ||
    check === "TKSSystemCertExpiryCheck" ||
    check === "OCSPSystemCertExpiryCheck"
  ) {
    const subsystem =
      check === "TPSSystemCertExpiryCheck"
        ? "TPS"
        : check === "TKSSystemCertExpiryCheck"
          ? "TKS"
          : "OCSP";
    if (certLabel !== "") {
      return (
        `${subsystem} system certificate ${certLabel} expires on ${keyDisplay}; ` +
        `renew it before this time to avoid ${subsystem} subsystem impact.`
      );
    }
    return (
      `${subsystem} system certificate expires on ${keyDisplay}; renew it before ` +
      `this time to avoid ${subsystem} subsystem impact.`
    );
  }
  if (nick !== "") {
    return `Expiration: ${keyDisplay} — Certificate: ${nick}`;
  }
  if (msgPart !== "") {
    return `Expiration: ${keyDisplay} — ${msgPart}`;
  }
  return `Expiration: ${keyDisplay}`;
}

/** Pretty JSON string for arbitrary detail object, with ``key`` fields formatted. */
function jsonDetailsFromObject(obj: unknown): string {
  const forJson = formatKeyStringsForDisplayDeep(obj);
  return normalizeHealthcheckDetailsString(JSON.stringify(forJson, null, 2));
}

const STANDARD_CHECK_KEYS = [
  "source",
  "check",
  "result",
  "msg",
  "message",
  "kw",
  "key",
] as const;

/** Copy of check object without standard top-level keys (for fallback JSON). */
function restWithoutStandardFields(
  o: Record<string, unknown>
): Record<string, unknown> {
  const rest = { ...o };
  for (const k of STANDARD_CHECK_KEYS) {
    delete rest[k];
  }
  return rest;
}

/** Empty details placeholder when no user-facing text should be shown. */
function formatGenericDetailsFallback(o: Record<string, unknown>): string {
  void o;
  return "";
}

type HealthcheckDetailsFormatter = (
  o: Record<string, unknown>,
  kw: Record<string, unknown>
) => string | null;

const DETAILS_FORMATTERS: HealthcheckDetailsFormatter[] = [
  formatMetaServiceSuccessDetails,
  formatMetaCoreCheckDetails,
  formatPkiServerHealthcheckCertsExpirationDetails,
  formatCASystemCertTrustFlagDetails,
  formatDogtagConnectivityDetails,
  formatIPAHostKeytabDetails,
  formatIPATopologyDomainDetails,
];

/** Runs registered check-specific formatters; returns first non-null string. */
function runDetailsFormatters(
  o: Record<string, unknown>,
  kw: Record<string, unknown>
): string | null {
  for (const formatter of DETAILS_FORMATTERS) {
    const text = formatter(o, kw);
    if (text !== null) {
      return text;
    }
  }
  return null;
}

/**
 * Human-readable detail cell: ``msg:key`` when both exist, else ``msg`` /
 * ``message`` / ``kw`` (JSON) / remaining fields.
 */
export function formatHealthcheckCellDetails(
  o: Record<string, unknown>
): string {
  const check = typeof o.check === "string" ? o.check : "";
  const kw = getHealthcheckKwFlat(o);
  const formatted = runDetailsFormatters(o, kw);
  if (formatted !== null) {
    return formatted;
  }

  if (check === IPA_FILE_CHECK || check === IPA_FILE_NSSDB_CHECK) {
    const ipaFileDetails = formatIPAFileCheckDetails(kw);
    if (ipaFileDetails !== null) {
      return ipaFileDetails;
    }
  }

  if (isKwOnlyStatusTrue(kw)) {
    return USER_MESSAGE_STATUS_TRUE;
  }

  if (check === DNA_RANGE_CHECK && Object.keys(kw).length > 0) {
    const dna = formatIPADNARangeCheckDetails(kw);
    if (dna !== "") {
      return substituteKwPlaceholdersInString(dna, kw);
    }
  }

  const msg = substituteKwPlaceholdersInString(
    healthcheckMessageText(o) || healthcheckMessageTextFromKw(o),
    kw
  );
  const key = healthcheckKeyText(o);
  const keyDisplay = key !== "" ? formatHealthcheckKeyForDisplay(key) : "";

  let out: string;

  if (msg !== "" && key !== "") {
    out =
      enhanceCertExpirationLine(check, kw, key, keyDisplay, msg) ??
      `${msg}:${keyDisplay}`;
  } else if (msg !== "") {
    out = msg;
  } else if (key !== "") {
    out =
      enhanceCertExpirationLine(check, kw, key, keyDisplay, "") ?? keyDisplay;
  } else if (o.kw !== undefined && o.kw !== null) {
    if (
      typeof o.kw === "object" &&
      !Array.isArray(o.kw) &&
      Object.keys(o.kw as object).length === 0
    ) {
      return formatGenericDetailsFallback(o);
    }
    try {
      const forJson = formatKeyStringsForDisplayDeep(o.kw);
      if (
        forJson &&
        typeof forJson === "object" &&
        !Array.isArray(forJson) &&
        isKwOnlyStatusTrue(forJson as Record<string, unknown>)
      ) {
        return USER_MESSAGE_STATUS_TRUE;
      }
      out = normalizeHealthcheckDetailsString(JSON.stringify(forJson, null, 2));
      if (isEmptyHealthcheckDetailsDisplay(out)) {
        return formatGenericDetailsFallback(o);
      }
    } catch {
      out = normalizeHealthcheckDetailsString(String(o.kw));
    }
  } else {
    const rest = restWithoutStandardFields(o);
    if (Object.keys(rest).length === 0) {
      return formatGenericDetailsFallback(o);
    }
    try {
      out = jsonDetailsFromObject(rest);
    } catch {
      return formatGenericDetailsFallback(o);
    }
  }
  const finalOut = substituteKwPlaceholdersInString(out, kw).trim();
  if (finalOut === "" || isEmptyHealthcheckDetailsDisplay(finalOut)) {
    return formatGenericDetailsFallback(o);
  }
  return finalOut;
}

/**
 * User-facing message for a check (``msg`` / ``message``, with ``kw``
 * placeholder substitution). Empty when only structured ``kw`` / other fields
 * carry data — use the Details column in that case.
 */
export function formatHealthcheckUserMessage(
  o: Record<string, unknown>
): string {
  const kw = getHealthcheckKwFlat(o);
  return substituteKwPlaceholdersInString(
    healthcheckMessageText(o) || healthcheckMessageTextFromKw(o),
    kw
  ).trim();
}

/**
 * Display value for the healthcheck ``when`` field (typically
 * ``YYYYMMDDHHmmssZ``). Falls back to em dash when missing/unparseable.
 */
export function formatHealthcheckRowTimestamp(
  o: Record<string, unknown>
): string {
  const raw = typeof o.when === "string" ? o.when.trim() : "";
  if (raw === "") {
    return "—";
  }
  const compact = raw.endsWith("Z") ? raw.slice(0, -1) : raw;
  const parsed = parseCompactHealthcheckTimestamp(compact);
  if (!parsed) {
    return raw;
  }
  return HEALTHCHECK_DATE_TIME_FORMATTER.format(parsed);
}

/** Raw ``when`` value (for stable sorting); empty when missing. */
export function getHealthcheckRowTimestampRaw(
  o: Record<string, unknown>
): string {
  return typeof o.when === "string" ? o.when.trim() : "";
}

/**
 * Builds table rows from filtered check JSON: maps each item, then merges rows
 * that share ``source|check|result`` (keeps latest timestamp, joins messages/details).
 */
export function buildHealthcheckTableRows(
  data: unknown
): HealthcheckTableRow[] {
  const rawRows = collectHealthcheckItems(data).map((item, index) => {
    const o =
      item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const result = typeof o.result === "string" ? o.result : "";
    const source = typeof o.source === "string" ? o.source : "";
    const check = typeof o.check === "string" ? o.check : "";
    const timestampRaw = getHealthcheckRowTimestampRaw(o);
    const timestamp = formatHealthcheckRowTimestamp(o);
    const userMessage = formatHealthcheckUserMessage(o);
    const details = formatHealthcheckCellDetails(o);
    return {
      id: `${source}|${check}|${index}`,
      timestampRaw,
      timestamp,
      result: result || "—",
      source: source || "—",
      check: check || "—",
      userMessage,
      details,
    };
  });

  const grouped = new Map<string, HealthcheckTableRow>();

  for (const row of rawRows) {
    const key = `${row.source}|${row.check}|${row.result}`;
    const existing = grouped.get(key);
    if (!existing) {
      grouped.set(key, { ...row, id: `${key}|grouped` });
      continue;
    }

    // Keep the latest timestamp in grouped rows.
    if (row.timestampRaw > existing.timestampRaw) {
      existing.timestampRaw = row.timestampRaw;
      existing.timestamp = row.timestamp;
    }
    if (row.userMessage !== "" && existing.userMessage !== row.userMessage) {
      existing.userMessage = existing.userMessage
        ? `${existing.userMessage}\n${row.userMessage}`
        : row.userMessage;
    }
    if (row.details !== "" && existing.details !== row.details) {
      existing.details = existing.details
        ? `${existing.details}\n\n- - -\n\n${row.details}`
        : row.details;
    }
  }

  const output: HealthcheckTableRow[] = [];
  const seenGrouped = new Set<string>();
  for (const row of rawRows) {
    const key = `${row.source}|${row.check}|${row.result}`;
    if (seenGrouped.has(key)) {
      continue;
    }
    const groupedRow = grouped.get(key);
    if (groupedRow) {
      output.push(groupedRow);
      seenGrouped.add(key);
    } else {
      output.push(row);
    }
  }
  return output;
}

/** Parsed shape of ``healthcheck_log_show`` RPC body (metadata + ``result`` payload). */
export type HealthcheckCommandPayload = {
  result: unknown;
  raw?: string;
  returncode?: number;
  healthcheck_version?: string;
  ipa_version?: string;
  pki_version?: string;
  output_file?: string;
};

const IPA_HEALTHCHECK_VER_UI_BAD_SUBSTRINGS = [
  "must be root",
  "you must be root",
  "run this script",
  "permission denied",
  "not permitted",
  "only root",
] as const;

const IPA_HEALTHCHECK_VER_PREFIX_RE =
  /^(ipa-healthcheck|ipahealthcheck)\s*:\s*/i;

/**
 * Strip unusable ``ipa-healthcheck --version`` / stderr leakage; keep a bare
 * version for display (``undefined`` → show "unavailable" in the UI).
 */
export function sanitizeHealthcheckToolVersionForUi(
  value: string | undefined
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  let s = value.trim();
  if (!s) {
    return undefined;
  }
  const reject = (t: string): boolean => {
    const low = t.toLowerCase();
    return IPA_HEALTHCHECK_VER_UI_BAD_SUBSTRINGS.some((frag) =>
      low.includes(frag)
    );
  };
  if (reject(s)) {
    return undefined;
  }
  while (IPA_HEALTHCHECK_VER_PREFIX_RE.test(s)) {
    s = s.replace(IPA_HEALTHCHECK_VER_PREFIX_RE, "").trim();
  }
  if (!s || reject(s)) {
    return undefined;
  }
  if (s.length > 256) {
    return undefined;
  }
  return s;
}

/**
 * IPA JSON-RPC may wrap command output in ``{ result: { … }, count, … }``.
 */
function peelHealthcheckLogShowRpcPayload(body: unknown): unknown {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }
  const o = body as Record<string, unknown>;
  const inner = o.result;
  if (
    inner !== null &&
    typeof inner === "object" &&
    !Array.isArray(inner) &&
    ("healthcheck_version" in inner ||
      "returncode" in inner ||
      "raw" in inner ||
      "output_file" in inner ||
      "ipa_version" in inner ||
      "pki_version" in inner)
  ) {
    return inner;
  }
  return body;
}

/**
 * Normalize RPC body: ``healthcheck_log_show`` returns ``result``, ``raw``,
 * ``returncode``, ``healthcheck_version``, and ``output_file``; older
 * responses may be checks-only.
 */
export function parseHealthcheckLogShowBody(
  body: unknown
): HealthcheckCommandPayload | null {
  if (body === null || body === undefined) {
    return null;
  }
  const peeled = peelHealthcheckLogShowRpcPayload(body);
  if (typeof peeled !== "object" || Array.isArray(peeled)) {
    return { result: peeled };
  }
  const o = peeled as Record<string, unknown>;
  if (
    "returncode" in o ||
    "output_file" in o ||
    "raw" in o ||
    "healthcheck_version" in o ||
    "ipa_version" in o ||
    "pki_version" in o
  ) {
    const rawHcv =
      typeof o.healthcheck_version === "string"
        ? o.healthcheck_version
        : undefined;
    return {
      result: o.result,
      raw: typeof o.raw === "string" ? o.raw : undefined,
      returncode: typeof o.returncode === "number" ? o.returncode : undefined,
      healthcheck_version: sanitizeHealthcheckToolVersionForUi(rawHcv),
      ipa_version:
        typeof o.ipa_version === "string" ? o.ipa_version : undefined,
      pki_version:
        typeof o.pki_version === "string" ? o.pki_version : undefined,
      output_file:
        typeof o.output_file === "string" ? o.output_file : undefined,
    };
  }
  return { result: peeled };
}

/**
 * Message for RTK Query / fetch failures (no JSON-RPC body), e.g. network
 * errors, HTTP 401/502, or failed fetch — not IPA ``data.error`` payloads.
 */
export function formatHealthcheckTransportError(err: unknown): string {
  if (err == null) {
    return "Unknown error (no response).";
  }
  if (typeof err === "string") {
    return err;
  }
  if (typeof err !== "object") {
    return String(err);
  }
  const o = err as Record<string, unknown>;
  if (typeof o.message === "string" && o.message.length > 0) {
    const code =
      typeof o.code === "string" && o.code.length > 0 ? `${o.code}: ` : "";
    return `${code}${o.message}`;
  }
  if (o.status !== undefined && o.status !== null) {
    const status = String(o.status);
    const parts: string[] = [status];
    if (typeof o.error === "string" && o.error.length > 0) {
      parts.push(o.error);
    }
    const data = o.data;
    if (typeof data === "string" && data.length > 0) {
      parts.push(data);
    } else if (
      data !== undefined &&
      data !== null &&
      typeof data === "object"
    ) {
      try {
        parts.push(JSON.stringify(data));
      } catch {
        parts.push("[unserializable data]");
      }
    }
    return parts.join(" — ");
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/** Readable message from IPA RPC ``error`` payload. */
export function formatHealthcheckRpcError(err: unknown): string {
  if (err == null) {
    return "Unknown error";
  }
  if (typeof err === "string") {
    return augmentHealthcheckServerHint(err);
  }
  const asResult = err as { message?: string };
  if (typeof asResult.message === "string" && asResult.message.length > 0) {
    return augmentHealthcheckServerHint(asResult.message);
  }
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message: unknown }).message;
    if (typeof m === "string" && m.length > 0) {
      return augmentHealthcheckServerHint(m);
    }
  }
  return String(err);
}

/**
 * Appends operator hints for common ``healthcheck_log_show`` failures (bad JSON,
 * missing file, unknown ``report_file``, sudo/password issues).
 */
export function augmentHealthcheckServerHint(message: string): string {
  if (/file is not valid JSON:/i.test(message)) {
    return (
      `${message} ` +
      "Regenerate the report as JSON, for example: " +
      "ipa-healthcheck --output-type json --output-file " +
      "/var/log/ipa/healthcheck/healthcheck.log. " +
      "If the file contains old text output, overwrite it with the command " +
      "above or clear it before rerunning."
    );
  }
  if (/Healthcheck report file does not exist:/i.test(message)) {
    return (
      `${message} ` +
      "Create the report first as root on the IPA server: " +
      "mkdir -p /var/log/ipa/healthcheck && " +
      "ipa-healthcheck --output-file " +
      "/var/log/ipa/healthcheck/healthcheck.log. " +
      "If using the systemd unit, start it once with " +
      "systemctl start ipa-healthcheck.service."
    );
  }
  if (/Unknown option:\s*report_file/i.test(message)) {
    return (
      `${message} ` +
      "Install or upgrade ipaserver/plugins/healthcheck.py on the IPA server " +
      "so that healthcheck_log_show defines the report_file option, then " +
      "restart the HTTP service (for example: systemctl restart httpd)."
    );
  }
  if (
    /ipa-healthcheck produced no output/i.test(message) &&
    /password is required/i.test(message)
  ) {
    return (
      "Live healthcheck could not run: the API user needs passwordless sudo for " +
      "ipa-healthcheck, or run ipa-healthcheck --output-type json as root and " +
      "use this page with the JSON file path. Original error: " +
      message
    );
  }
  return message;
}

/**
 * Turn API / file payload into a list of checks: parse JSON strings, unwrap a
 * single check object, or use a ``checks`` array when present.
 */
export function normalizeHealthcheckResult(data: unknown): unknown {
  if (data === null || data === undefined) {
    return null;
  }
  let cur: unknown = data;
  if (typeof cur === "string") {
    const t = cur.trim();
    if (t === "") {
      return null;
    }
    try {
      cur = JSON.parse(t) as unknown;
    } catch {
      return data;
    }
  }
  if (Array.isArray(cur)) {
    return cur;
  }
  if (typeof cur === "object" && cur !== null) {
    const o = cur as Record<string, unknown>;
    if (Array.isArray(o.checks)) {
      return o.checks;
    }
    const hasResult = "result" in o;
    const hasCheckShape =
      typeof o.source === "string" || typeof o.check === "string";
    if (hasResult && hasCheckShape) {
      return [cur];
    }
  }
  return cur;
}

/**
 * Keep only healthcheck entries whose ``result`` matches the selected severity.
 */
export function filterHealthcheckBySeverity(
  data: unknown,
  severity: HealthcheckSeverityFilter
): unknown {
  if (severity === "all" || data === null || data === undefined) {
    return data;
  }
  const matchSeverity = (value: unknown): boolean =>
    typeof value === "string" && value.trim().toUpperCase() === severity;

  if (Array.isArray(data)) {
    return data.filter((item) => {
      if (item && typeof item === "object" && "result" in item) {
        return matchSeverity((item as Record<string, unknown>).result);
      }
      return false;
    });
  }
  if (typeof data === "object" && data !== null && "result" in data) {
    const r = (data as Record<string, unknown>).result;
    if (matchSeverity(r)) {
      return data;
    }
    return [];
  }
  return data;
}

/**
 * Keep entries whose ``result`` is in ``severities``. Empty set yields ``[]``.
 * When ``severities`` contains every known level, returns ``data`` unchanged.
 */
export function filterHealthcheckBySeverities(
  data: unknown,
  severities: ReadonlySet<string>
): unknown {
  if (data === null || data === undefined) {
    return data;
  }
  if (severities.size === 0) {
    return [];
  }
  if (
    severities.size === HEALTHCHECK_KNOWN_RESULT_LEVELS.size &&
    [...HEALTHCHECK_KNOWN_RESULT_LEVELS].every((s) => severities.has(s))
  ) {
    return data;
  }
  const matchSeverity = (value: unknown): boolean => {
    if (typeof value !== "string") {
      return false;
    }
    const u = value.trim().toUpperCase();
    return severities.has(u);
  };
  if (Array.isArray(data)) {
    return data.filter((item) => {
      if (item && typeof item === "object" && "result" in item) {
        return matchSeverity((item as Record<string, unknown>).result);
      }
      return false;
    });
  }
  if (typeof data === "object" && data !== null && "result" in data) {
    const r = (data as Record<string, unknown>).result;
    if (matchSeverity(r)) {
      return data;
    }
    return [];
  }
  return data;
}
