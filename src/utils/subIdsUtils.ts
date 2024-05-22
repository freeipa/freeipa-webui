// Data types
import { SubId } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "src/utils/ipaObjectUtils";

const simpleValues = new Set([
  "ipauniqueid",
  "ipaowner",
  "ipasubuidnumber",
  "ipasubgidnumber",
  "description",
  "ipasubuidcount",
  "ipasubgidcount",
  "dn",
]);
const dateValues = new Set([]);

export function apiToSubId(apiRecord: Record<string, unknown>): SubId {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<SubId>;
  return partialSubIdToSubId(converted) as SubId;
}

export function partialSubIdToSubId(partialSubId: Partial<SubId>): SubId {
  return {
    ...createEmptySubId(),
    ...partialSubId,
  };
}

// Get empty object initialized with default values
export function createEmptySubId(): SubId {
  const subId: SubId = {
    ipauniqueid: "",
    ipaowner: "",
    ipasubuidnumber: "",
    ipasubgidnumber: "",
    description: "",
    ipasubuidcount: "",
    ipasubgidcount: "",
    dn: "",
  };

  return subId;
}
