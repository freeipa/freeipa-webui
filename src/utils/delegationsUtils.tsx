import { Delegation } from "src/utils/datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: Partial<Delegation>,
  onElementChange: (element: Partial<Delegation>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Delegation);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set(["aciname", "memberof", "group", "aci"]);
const dateValues = new Set<string>([]);

export function apiToDelegation(
  apiRecord: Record<string, unknown>
): Delegation {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Delegation>;
  return partialToDelegation(converted);
}

export function partialToDelegation(partial: Partial<Delegation>): Delegation {
  return {
    ...createEmptyDelegation(),
    ...partial,
  };
}

export function createEmptyDelegation(): Delegation {
  return {
    aciname: "",
    permissions: [],
    attrs: [],
    memberof: "",
    group: "",
    aci: "",
  };
}
