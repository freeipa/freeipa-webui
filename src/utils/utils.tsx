import React from "react";
// Data type
import {
  DN,
  HBACRule,
  HBACService,
  HBACServiceGroup,
  Host,
  HostGroup,
  IDView,
  IDViewOverrideUser,
  IDViewOverrideGroup,
  IdRange,
  Metadata,
  Netgroup,
  Service,
  SudoCmd,
  SudoCmdGroup,
  SudoRule,
  User,
  UserGroup,
  AutomemberEntry,
  PwPolicy,
  IDPServer,
  CertificateMapping,
  DNSZone,
  DNSRecord,
  DNSForwardZone,
} from "./datatypes/globalDataTypes";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// PatternFly
import {
  CheckboxField,
  FieldConfig,
  NumberInputField,
  RadioGroupField,
  SelectField,
} from "src/components/Form/Field";
import { Content } from "@patternfly/react-core";

/**
 * Functions that can be reusable and called by several components throughout the application.
 */

/**
 * Default API version (in case this is not available in Redux ATM)
 */
export const API_VERSION_BACKUP = "2.254";

/**
 * Helper method: Given an users list and status, check if some entry has different status
 * @param {boolean} status - The status to check against
 * @param {User[]} usersList - Array of users to check
 * @returns {boolean} - True if all users have the same status, false otherwise
 */
export const checkEqualStatus = (status: boolean, usersList: User[]) => {
  const usersWithOtherStatus = usersList.filter(
    (user) => user.nsaccountlock !== status
  );
  return usersWithOtherStatus.length === 0;
};

/**
 * Helper method: Given an general-type (T) list and status, check if some entry has different status
 * @param {boolean} status - The status to check against
 * @param {T[]} elementsList - Array of elements to check
 * @param {string} statusElementName - Name of the status element to check
 * @returns {boolean} - True if all elements have the same status, false otherwise
 */
// @typescript-eslint/no-unused-vars
export const checkEqualStatusGen = <T,>(
  status: boolean,
  elementsList: T[],
  statusElementName: string
) => {
  const elementsWithOtherStatus = elementsList.filter(
    (element) => element[statusElementName] !== status
  );
  return elementsWithOtherStatus.length === 0;
};

/**
 * Helper method: Given a HBAC rule list and status, check if some entry has different status
 * @param {boolean} status - The status to check against
 * @param {HBACRule[]} rulesList - Array of HBAC rules to check
 * @returns {boolean} - True if all rules have the same status, false otherwise
 */
export const checkEqualStatusHbacRule = (
  status: boolean,
  rulesList: HBACRule[]
) => {
  const rulesWithOtherStatus = rulesList.filter(
    (rule) => rule.ipaenabledflag[0] !== status
  );
  return rulesWithOtherStatus.length === 0;
};

/**
 * Helper method: Given a Sudo rule list and status, check if some entry has different status
 * @param {boolean} status - The status to check against
 * @param {SudoRule[]} rulesList - Array of Sudo rules to check
 * @returns {boolean} - True if all rules have the same status, false otherwise
 */
export const checkEqualStatusSudoRule = (
  status: boolean,
  rulesList: SudoRule[]
) => {
  const rulesWithOtherStatus = rulesList.filter(
    (rule) => rule.ipaenabledflag[0] !== status
  );
  return rulesWithOtherStatus.length === 0;
};

/**
 * Determine whether a user is selectable or not
 */
export const isUserSelectable = (user: User) => user.uid !== "";

/**
 * Determine whether a host is selectable or not
 */
export const isHostSelectable = (host: Host) => host.fqdn != "";

/**
 * Determine whether a netgroup is selectable or not
 */
export const isNetgroupSelectable = (group: Netgroup) => group.cn != "";

/**
 * Determine whether a HbacRule is selectable or not
 */
export const isHbacRuleSelectable = (rule: HBACRule) => rule.cn != "";

/**
 * Determine whether a HbacService is selectable or not
 */
export const isHbacServiceSelectable = (service: HBACService) =>
  service.cn != "";

/**
 * Determine whether a HbacServiceGroup is selectable or not
 */
export const isHbacServiceGroupSelectable = (group: HBACServiceGroup) =>
  group.cn != "";

/**
 * Determine whether a service is selectable or not
 */
export const isServiceSelectable = (service: Service) =>
  service.krbcanonicalname != "";

/**
 * Determine whether a sudo command is selectable or not
 */
export const isSudoCmdSelectable = (cmd: SudoCmd) => cmd.sudocmd != "";

/**
 * Determine whether a sudo command group is selectable or not
 */
export const isSudoCmdGroupSelectable = (group: SudoCmdGroup) => group.cn != "";

/**
 * Determine whether a UserGroup is selectable or not
 */
export const isUserGroupSelectable = (group: UserGroup) => group.cn != "";

/**
 * Determine whether a hostGroup is selectable or not
 */
export const isHostGroupSelectable = (hostGroup: HostGroup) =>
  hostGroup.cn != "";

/**
 * Determine whether a ID view is selectable or not
 */
export const isViewSelectable = (view: IDView) => view.cn != "";

/**
 * Determine whether a SudoRule is selectable or not
 */
export const isSudoRuleSelectable = (rule: SudoRule) => rule.cn != "";

/**
 * Determine whether a IDViewOverrideUser is selectable or not
 */
export const isUserOverrideSelectable = (user: IDViewOverrideUser) =>
  user.ipaanchoruuid != "";

/**
 * Determine whether a IDViewOverrideGroup is selectable or not
 */
export const isGroupOverrideSelectable = (user: IDViewOverrideGroup) =>
  user.ipaanchoruuid != "";

/**
 * Determine whether a Automember User group is selectable or not
 * - Also works for Automember Host group rules
 */
export const isAutomemberUserGroupSelectable = (automember: AutomemberEntry) =>
  automember.automemberRule != "";

export const isPwPolicySelectable = (pwPolicy: PwPolicy) => pwPolicy.cn !== "";

export const isIdpServerSelectable = (idpServer: IDPServer) =>
  idpServer.cn !== "";

export const isCertMapSelectable = (certMap: CertificateMapping) =>
  certMap.cn !== "";

export const isDnsZoneSelectable = (dnsZone: DNSZone) =>
  dnsZone.idnsname !== "";

export const isDnsRecordSelectable = (dnsRecord: DNSRecord) =>
  dnsRecord.idnsname !== "";

export const isDnsForwardZoneSelectable = (dnsForwardZone: DNSForwardZone) =>
  dnsForwardZone.idnsname !== "";

export const isDnsServerSelectable = (dnsServerId: string) =>
  dnsServerId !== "";

export const isIdRangeSelectable = (idRange: IdRange) => idRange.cn !== "";

/**
 * Write JSX error messages into 'apiErrorsJsx' array
 * @param {FetchBaseQueryError | SerializedError} errorFromApiCall -  Error from the API call
 * @param {string} contextMessage - Context error message
 * @param {string} key - Unique key for the error element
 * @returns {JSX.Element} - JSX element containing the error message
 */
export const apiErrorToJsXError = (
  errorFromApiCall: FetchBaseQueryError | SerializedError,
  contextMessage: string,
  key: string
) => {
  let errorJsx: JSX.Element = <></>;

  if ("originalStatus" in errorFromApiCall) {
    // The original status is accessible here (error 401)
    errorJsx = (
      <Content component="p" key={key}>
        {errorFromApiCall.originalStatus + " " + contextMessage}
      </Content>
    );
  } else if ("status" in errorFromApiCall) {
    // you can access all properties of `FetchBaseQueryError` here
    errorJsx = (
      <Content component="p" key={key}>
        {errorFromApiCall.status + " " + contextMessage}
      </Content>
    );
  } else {
    // you can access all properties of `SerializedError` here
    errorJsx = (
      <div key={key} style={{ alignSelf: "center", marginTop: "16px" }}>
        <Content component="p">{contextMessage}</Content>
        <Content component="p">
          {"ERROR CODE: " + errorFromApiCall.code}
        </Content>
        <Content component="p">{errorFromApiCall.message}</Content>
      </div>
    );
  }

  return errorJsx;
};

/**
 * Get the current realm of the user
 * @param {Metadata} metadata - The metadata object containing kerberos policy info
 * @returns {string} - The realm of the user
 */
export const getRealmFromKrbPolicy = (metadata: Metadata) => {
  let realm = "";
  if (metadata.objects !== undefined) {
    const krbPolicy = metadata.objects.krbtpolicy.container_dn as string;
    if (krbPolicy !== undefined) {
      // Get realm from krbtpolicy
      //  - Format: "cn=REALM, cn=kerberos"
      realm = krbPolicy.split(",")[0].split("=")[1];
    }
  }
  return realm;
};

/**
 * Date time parameters
 */
const templates = {
  human: "YYYY-MM-DD HH:mm:ssZ",
  generalized: "YYYYMMDDHHmmssZ",
};

const dates = [
  ["YYYY-MM-DD", /^(\d{4})-(\d{2})-(\d{2})$/],
  ["YYYYMMDD", /^(\d{4})(\d{2})(\d{2})$/],
];

const times = [
  ["HH:mm:ss", /^(\d\d):(\d\d):(\d\d)$/],
  ["HH:mm", /^(\d\d):(\d\d)$/],
];

const generalized_regex = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/;
const datetime_regex =
  /^((?:\d{8})|(?:\d{4}-\d{2}-\d{2}))(?:(T| )(\d\d:\d\d(?::\d\d)?)(Z?))?$/;

/**
 * Parse full string date to UTC date format
 * '20230809120244Z' --> 'Sat Aug 09 2023 14:02:44 GMT+0200 (Central European Summer Time)'
 * @param {string} dateString - The date string to parse
 * @returns {Date | null} - The parsed Date object or null if parsing fails
 */
export const parseFullDateStringToUTCFormat = (dateString: string) => {
  let Y = 0,
    M = 0,
    D = 0,
    H = 0,
    m = 0,
    s = 0;
  let i, l, dateStr, timeStr, utc;

  const dt_match = datetime_regex.exec(dateString);
  const gt_match = generalized_regex.exec(dateString);

  if (dt_match) {
    dateStr = dt_match[1];
    timeStr = dt_match[3];
    utc = dt_match[4] || !timeStr;

    // error out if local time not supported
    if (!utc) return null;

    for (i = 0, l = dates.length; i < l; i++) {
      const dm = dates[i][1] as RegExp;
      dm.exec(dateStr);

      if (dm) {
        Y = dm[1];
        M = dm[2];
        D = dm[3];
        break;
      }
    }

    if (timeStr) {
      for (i = 0, l = times.length; i < l; i++) {
        const tm = times[i][1] as RegExp;
        tm.exec(timeStr);
        if (tm) {
          H = tm[1];
          m = tm[2] || 0;
          s = tm[3] || 0;
          break;
        }
      }
    }
  } else if (gt_match) {
    Y = +gt_match[1];
    M = +gt_match[2];
    D = +gt_match[3];
    H = +gt_match[4];
    m = +gt_match[5];
    s = +gt_match[6];
    utc = true;
  } else {
    return null;
  }

  const date = new Date();

  if (utc || !timeStr) {
    date.setUTCFullYear(Y, M - 1, D);
    date.setUTCHours(H, m, s, 0);
  } else {
    date.setFullYear(Y, M - 1, D);
    date.setHours(H, m, s, 0);
  }

  return date;
};

/**
 * Given a date, obtain the time in LDAP generalized time format
 */
const formatDate = (date, format, local) => {
  const fmt = format || templates.human;
  let str;

  if (local) {
    const year = fmt.replace(/YYYY/i, date.getFullYear());
    const month = year.replace(
      /MM/i,
      (date.getMonth() + 1).toString().padStart(2, "0")
    );
    const day = month.replace(
      /DD/i,
      date.getDate().toString().padStart(2, "0")
    );
    const hour = day.replace(
      /HH/i,
      date.getHours().toString().padStart(2, "0")
    );
    const minute = hour.replace(
      /mm/i,
      date.getMinutes().toString().padStart(2, "0")
    );
    str = minute.replace(/ss/i, date.getSeconds().toString().padStart(2, "0"));
  } else {
    const year = fmt.replace(/YYYY/i, date.getUTCFullYear());
    const month = year.replace(
      /MM/i,
      (date.getUTCMonth() + 1).toString().padStart(2, "0")
    );
    const day = month.replace(
      /DD/i,
      date.getUTCDate().toString().padStart(2, "0")
    );
    const hour = day.replace(
      /HH/i,
      date.getUTCHours().toString().padStart(2, "0")
    );
    const minute = hour.replace(
      /mm/i,
      date.getUTCMinutes().toString().padStart(2, "0")
    );
    str = minute.replace(
      /ss/i,
      date.getUTCSeconds().toString().padStart(2, "0")
    );
  }
  return str;
};

/**
 * Given a date, obtain the time in LDAP generalized time format
 * @param {Date | null} date - The date to convert
 * @returns {string} - The date in LDAP generalized time format or empty string if date is null
 */
export const toGeneralizedTime = (date: Date | null) => {
  if (!date) return "";
  const generalizedTimeDate = formatDate(date, templates.generalized, false);
  return generalizedTimeDate;
};

/**
 * Get different values from DN
 * @param {string} dn - DN to parse
 * @returns {DN} - Parsed DN object
 */
export const parseDn = (dn: string) => {
  const result = {} as DN;
  if (dn === undefined) return result;

  // TODO: Use proper LDAP DN parser
  const rdns = dn.split(",");
  for (let i = 0; i < rdns.length; i++) {
    const rdn = rdns[i];
    if (!rdn) continue;

    const parts = rdn.split("=");
    const name = parts[0].toLowerCase();
    const value = parts[1];

    const old_value = result[name];
    if (!old_value) {
      result[name] = value;
    } else if (typeof old_value == "string") {
      result[name] = [old_value, value];
    } else {
      result[name].push(value);
    }
  }

  return result as DN;
};

/**
 * Given a (potential) __datetime__ object, parse it into a Date object or null (if empty)
 * @param {any} param - The parameter potentially containing datetime information
 * @returns {Date | null} - The parsed Date object or null if parsing fails
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseAPIDatetime = (param: any) => {
  let parsedDate: Date | null = null;
  if (param !== undefined) {
    if (param[0].__datetime__ !== undefined) {
      parsedDate = parseFullDateStringToUTCFormat(
        param[0].__datetime__
      ) as Date;
    } else {
      parsedDate = parseFullDateStringToUTCFormat(param) as Date;
    }
  }
  return parsedDate;
};

/**
 * Validate IP address (IPv4 or IPv6)
 */
export const isValidIpAddress = (ipAddress: string) => {
  const regexIPv4 =
    /^(?=(?:[^.]*\.){2,3}[^.]*$)(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){1,3}(?:\.\*)?$/;
  const regexIPv6 =
    /(?:^|(?<=\s))(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(?=\s|$)/;

  if (ipAddress === "") {
    // Empty IP address is ok
    return true;
  }

  if (ipAddress.includes(":")) {
    // IPv6
    return regexIPv6.test(ipAddress);
  } else {
    // IPv4
    return regexIPv4.test(ipAddress);
  }
};

/**
 * Some values in a table might not have a specific value defined
 *
 * (i.e. empty string ""). This is not allowed by the table component.
 * Therefore, this function will return "-" instead of "".
 */
export const parseEmptyString = (str: string) => {
  if (str === "") {
    return "-";
  }
  return str;
};

/**
 * Get a page (slice) from a list of elements
 * @param {Type[]} array - List of elements
 * @param {number} page - Page number
 * @param {number} perPage - Number of elements per page
 * @returns {Type[]} - List of elements for the given page
 */
export function paginate<Type>(
  array: Type[],
  page: number,
  perPage: number
): Type[] {
  const startIdx = (page - 1) * perPage;
  const endIdx = perPage * page;
  return array.slice(startIdx, endIdx);
}

/**
 * Check if an array contains any element of another array
 * @param {unknown[]} array1 - List of elements to be checked
 * @param {unknown[]} array2 - List of elements to be checked against
 * @returns {boolean} - True if there is any element in array1 that is also in array2
 */
export function containsAny(array1: unknown[], array2: unknown[]): boolean {
  return array1.some((item) => array2.includes(item));
}

/**
 * Returns hidden password string
 */
export const HIDDEN_PASSWORD = "********";

/**
 * Remove certificate delimiters
 * - This is needed to process the certificate in the API call
 */
export const removeCertificateDelimiters = (certificate: string) => {
  return certificate
    .replace(/-----BEGIN CERTIFICATE-----/g, "")
    .replace(/-----END CERTIFICATE-----/g, "")
    .replace(/\n/g, "");
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to be capitalized
 * @returns {string} - Capitalized string
 */
export default function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Helper function to get API record type name from display name
 * E.g. "A" -> "arecord"
 * @param {string} recordType - The display name of the record type
 * @returns {string} - The API record type name
 */
export const getRecordTypeName = (recordType: string): string => {
  const recordTypeMapping = {
    A: "arecord",
    AAAA: "aaaarecord",
    A6: "a6record",
    AFSDB: "afsdbrecord",
    CERT: "certrecord",
    CNAME: "cnamerecord",
    DNAME: "dnamerecord",
    DS: "dsrecord",
    DLV: "dlvrecord",
    KX: "kxrecord",
    LOC: "locrecord",
    MX: "mxrecord",
    NAPTR: "naptrrecord",
    NS: "nsrecord",
    PTR: "ptrrecord",
    SRV: "srvrecord",
    SSHFP: "sshfprecord",
    TLSA: "tlsarecord",
    TXT: "txtrecord",
    URI: "urirecord",
  };

  return recordTypeMapping[recordType];
};

/**
 * Set initial value for a field
 * @param {FieldConfig} field - Field configuration
 * @param {unknown} initialValues - Initial values
 * @returns {unknown} - Initial value
 * @returns {boolean} - Whether the field has a default value or not
 */
export const setInitialValue = (
  field: FieldConfig,
  initialValue?: boolean | number | string // | RecordTypeData
) => {
  let hasDefaultValue = false;
  let newInitialValue = initialValue ?? undefined;

  if (
    field.type === "checkbox" &&
    (field as CheckboxField).defaultValue !== undefined
  ) {
    newInitialValue = (field as CheckboxField).defaultValue as boolean;
    hasDefaultValue = true;
  } else if (
    field.type === "number" &&
    (field as NumberInputField).defaultValue !== undefined
  ) {
    newInitialValue = (field as NumberInputField).defaultValue as number;
    hasDefaultValue = true;
  } else if (
    field.type === "select" &&
    (field as SelectField).defaultValue !== undefined
  ) {
    newInitialValue = (field as SelectField).defaultValue as string;
    hasDefaultValue = true;
  } else if (
    field.type === "radio" &&
    (field as RadioGroupField).defaultValue !== undefined
  ) {
    newInitialValue = (field as RadioGroupField).defaultValue as string;
    hasDefaultValue = true;
  }
  return { newInitialValue, hasDefaultValue };
};

/**
 * Determine if a field has a default value
 * @param {FieldConfig} fieldConfig - Field configuration
 * @returns {boolean} - Whether the field has a default value or not
 */
export const hasDefaultValue = (fieldConfig: FieldConfig) => {
  return (
    fieldConfig &&
    ((fieldConfig.type === "select" &&
      (fieldConfig as SelectField).defaultValue !== undefined) ||
      (fieldConfig.type === "radio" &&
        (fieldConfig as RadioGroupField).defaultValue !== undefined))
  );
};

/**
 * Get the config value for a field
 * @param {FieldConfig} field - Field configuration
 * @returns {unknown} - The config value for the field
 */
export const getConfigValue = (field: FieldConfig) => {
  return field.type === "checkbox"
    ? (field as CheckboxField).defaultValue
    : field.type === "number"
      ? (field as NumberInputField).defaultValue
      : field.type === "select"
        ? (field as SelectField).defaultValue
        : field.type === "radio"
          ? (field as RadioGroupField).defaultValue
          : "";
};
