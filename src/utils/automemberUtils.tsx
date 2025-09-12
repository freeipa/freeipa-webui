// Data types
import { Automember } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

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

function partialAutomemberToAutomember(
  partialSudoRule: Partial<Automember>
): Automember {
  return {
    ...createEmptyAutomember(),
    ...partialSudoRule,
  };
}

// Get empty User object initialized with default values
function createEmptyAutomember(): Automember {
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
