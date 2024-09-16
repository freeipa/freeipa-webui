// Data types
import { SudoCmd } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set(["sudocmd", "dn", "description"]);
const dateValues = new Set([]);

export function apiToSudoCmd(apiRecord: Record<string, unknown>): SudoCmd {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<SudoCmd>;
  return partialSudoCmdToSudoCmd(converted) as SudoCmd;
}

export function partialSudoCmdToSudoCmd(
  partialSudoCmd: Partial<SudoCmd>
): SudoCmd {
  return {
    ...createEmptySudoCmd(),
    ...partialSudoCmd,
  };
}

// Get empty User object initialized with default values
export function createEmptySudoCmd(): SudoCmd {
  const sudoCmd: SudoCmd = {
    sudocmd: "",
    dn: "",
    description: "",
    memberof_sudocmdgroup: [],
  };

  return sudoCmd;
}
