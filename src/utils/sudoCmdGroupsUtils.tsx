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
  return partialSudoCmdToSudoCmdGroup(converted) as SudoCmdGroup;
}

export function partialSudoCmdToSudoCmdGroup(
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
  };

  return sudoCmdGroup;
}
