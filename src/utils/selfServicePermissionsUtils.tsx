import { SelfServicePermission } from "src/utils/datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: Partial<SelfServicePermission>,
  onElementChange: (element: Partial<SelfServicePermission>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as SelfServicePermission);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set(["aciname", "aci"]);
const dateValues = new Set([]);

export function apiToSelfServicePermission(
  apiRecord: Record<string, unknown>
): SelfServicePermission {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<SelfServicePermission>;
  return partialToSelfServicePermission(converted);
}

export function partialToSelfServicePermission(
  partial: Partial<SelfServicePermission>
): SelfServicePermission {
  return {
    ...createEmptySelfServicePermission(),
    ...partial,
  };
}

export function createEmptySelfServicePermission(): SelfServicePermission {
  return {
    aciname: "",
    permissions: [],
    attrs: [],
    aci: "",
  };
}
