// Data types
import { SudoRule } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "ipaenabledflag",
  "dn",
  "description",
  "sudoorder",
]);
const dateValues = new Set([]);

export function apiToSudoRule(apiRecord: Record<string, unknown>): SudoRule {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<SudoRule>;
  return partialSudoRuleToSudoRule(converted) as SudoRule;
}

export function partialSudoRuleToSudoRule(
  partialSudoRule: Partial<SudoRule>
): SudoRule {
  return {
    ...createEmptySudoRule(),
    ...partialSudoRule,
  };
}

// Get empty User object initialized with default values
export function createEmptySudoRule(): SudoRule {
  const sudoRule: SudoRule = {
    cn: "",
    ipaenabledflag: true,
    dn: "",
    description: "",
    sudoorder: "",
  };

  return sudoRule;
}
