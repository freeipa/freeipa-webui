import { AutomountLocation } from "src/utils/datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

const simpleValues = new Set(["cn", "dn"]);
const dateValues = new Set([]);

export const apiToAutomountLocation = (
  apiRecord: Record<string, unknown>
): AutomountLocation => {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<AutomountLocation>;
  return partialAutomountLocationToAutomountLocation(converted);
};

export const partialAutomountLocationToAutomountLocation = (
  partial: Partial<AutomountLocation>
): AutomountLocation => {
  return { ...createEmptyAutomountLocation(), ...partial };
};

export const createEmptyAutomountLocation = (): AutomountLocation => {
  return {
    cn: "",
    dn: "",
  };
};
