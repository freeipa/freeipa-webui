import { IdRange } from "./datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "dn",
  "ipaautoprivategroups",
  "ipabaseid",
  "ipabaserid",
  "ipaidrangesize",
  "ipanttrusteddomainname",
  "ipanttrusteddomainsid",
  "iparangetype",
  "iparangetyperaw",
  "ipasecondarybaserid",
]);
const dateValues = new Set([]);

export function apiToIdRange(apiRecord: Record<string, unknown>): IdRange {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<IdRange>;
  return partialIdRangeToIdRange(converted);
}

export function partialIdRangeToIdRange(
  partialIdRange: Partial<IdRange>
): IdRange {
  return {
    ...createEmptyIdRange(),
    ...partialIdRange,
  };
}

export function createEmptyIdRange(): IdRange {
  return {
    cn: "",
    dn: "",
    ipaautoprivategroups: "",
    ipabaseid: 1,
    ipabaserid: 1,
    ipaidrangesize: 1,
    ipanttrusteddomainname: "",
    ipanttrusteddomainsid: "",
    iparangetype: "",
    iparangetyperaw: "",
    ipasecondarybaserid: 1,
  };
}
