// Data types
import { SudoCmdGroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set(["cn", "dn", "description"]);
const dateValues = new Set([]);

export function apiToSudoCmdGroup(
  apiRecord: Record<string, unknown>
): SudoCmdGroup {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<SudoCmdGroup>;
  return partialSudoCmdGroupToSudoCmdGroup(converted) as SudoCmdGroup;
}

export function partialSudoCmdGroupToSudoCmdGroup(
  partialSudoCmd: Partial<SudoCmdGroup>
): SudoCmdGroup {
  return {
    ...createEmptySudoCmdGroup(),
    ...partialSudoCmd,
  };
}

// Get empty object initialized with default values
export function createEmptySudoCmdGroup(): SudoCmdGroup {
  const sudoCmdGroup: SudoCmdGroup = {
    cn: "",
    dn: "",
    description: "",
    member_sudocmd: [],
  };

  return sudoCmdGroup;
}
