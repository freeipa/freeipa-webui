// Data types
import { SubId } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: Partial<SubId>,
  onElementChange: (element: Partial<SubId>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as SubId);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "ipauniqueid",
  "ipaowner",
  "ipasubgidnumber",
  "ipasubuidnumber",
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

export function partialSubIdToSubId(partialSudoRule: Partial<SubId>): SubId {
  return {
    ...createEmptySubId(),
    ...partialSudoRule,
  };
}

// Get empty User object initialized with default values
export function createEmptySubId(): SubId {
  const subId: SubId = {
    ipauniqueid: "",
    ipaowner: "",
    ipasubgidnumber: "",
    ipasubuidnumber: "",
    description: "",
    ipasubuidcount: "",
    ipasubgidcount: "",
    dn: "",
  };

  return subId;
}
