// Data types
import { Automember } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

// Parse the 'textInputField' data into expected data type
// - TODO: Adapt it to work with many types of data
export const asRecord = (
  element: Partial<Automember>,
  onElementChange: (element: Partial<Automember>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Automember);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set(["cn", "description", "automemberdefaultgroup"]);
const dateValues = new Set([]);

export function apiToAutomember(
  apiRecord: Record<string, unknown>
): Automember {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Automember>;
  return partialAutomemberToAutomember(converted) as Automember;
}

export function partialAutomemberToAutomember(
  partialSudoRule: Partial<Automember>
): Automember {
  return {
    ...createEmptyAutomember(),
    ...partialSudoRule,
  };
}

// Get empty User object initialized with default values
export function createEmptyAutomember(): Automember {
  const automember: Automember = {
    cn: "",
    description: "",
    automemberdefaultgroup: "",
    automemberinclusiveregex: [],
    automemberexclusiveregex: [],
    member: [],
    no_member: [],
    in_memberof: [],
    not_in_memberof: [],
    memberindirect: [],
    memberofindirect: [],
    membermanager: [],
  };

  return automember;
}
