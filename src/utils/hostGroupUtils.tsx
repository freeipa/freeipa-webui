// Data types
import { HostGroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set(["cn", "description", "dn"]);
const dateValues = new Set([]);

export function apiToHostGroup(apiRecord: Record<string, unknown>): HostGroup {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<HostGroup>;
  return partialGroupToGroup(converted) as HostGroup;
}

export function partialGroupToGroup(
  partialGroup: Partial<HostGroup>
): HostGroup {
  return {
    ...createEmptyGroup(),
    ...partialGroup,
  };
}

// Get empty User object initialized with default values
export function createEmptyGroup(): HostGroup {
  const group: HostGroup = {
    dn: "",
    cn: "",
    description: "",
  };

  return group;
}
