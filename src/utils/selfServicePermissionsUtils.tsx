import {
  SelfServicePermission,
  SELF_SERVICE_ATTRS,
} from "src/utils/datatypes/globalDataTypes";
import { convertApiObj, toArray, BasicType } from "./ipaObjectUtils";

export const SELF_SERVICE_ATTR_OPTIONS = SELF_SERVICE_ATTRS.map((attr) => ({
  value: attr,
  children: attr,
  "data-cy": `select-attrs-${attr}`,
}));

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
  return {
    ...partialToSelfServicePermission(converted),
    permissions: toArray(apiRecord.permissions as BasicType).filter(
      (val): val is string => typeof val === "string"
    ),
    attrs: toArray(apiRecord.attrs as BasicType).filter(
      (val): val is string => typeof val === "string"
    ),
  };
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
