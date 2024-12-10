import { Metadata, ParamMetadata } from "src/utils/datatypes/globalDataTypes";
import { parseAPIDatetime, toGeneralizedTime } from "./utils";

export type BasicType = string | number | boolean | null | undefined | [];

export type IPAObject = Record<string, unknown>;

export interface IPAParamDefinition {
  name: string;
  ipaObject?: Record<string, unknown>;
  onChange?: (ipaObject: IPAObject) => void;
  objectName: string;
  metadata: Metadata;
  propertyName?: string;
  alwaysWritable?: boolean;
  readOnly?: boolean;
  required?: boolean;
  ariaLabel?: string;
}

export interface ParamProperties {
  writable: boolean;
  required: boolean;
  readOnly: boolean;
  value: BasicType;
  onChange: (value: BasicType) => void;
  paramMetadata: ParamMetadata;
}

export function getParamMetadata(
  metadata: Metadata,
  objectName: string,
  paramName: string
): ParamMetadata | null {
  const objects = metadata.objects || {};
  const object = objects[objectName] || null;
  if (!object) {
    window.console.error(`Object ${objectName} not found in metadata`);
    return null;
  }

  const takesParams = object["takes_params"] || [];
  const param = takesParams.find((param) => param.name === paramName);
  if (!param) {
    window.console.error(
      `Param ${paramName} not found in object ${objectName}`
    );
    return null;
  }
  return param;
}

function isFieldWritable(acis: Record<string, string>, attr: string): boolean {
  const aci = acis[attr];
  if (typeof aci === "string") {
    return aci.includes("w");
  }
  return false;
}

export function isWritable(
  paramMetadata: ParamMetadata,
  ipaObject?: IPAObject,
  alwaysWritable?: boolean
): boolean {
  if (alwaysWritable) {
    return true;
  }
  if (paramMetadata.primary_key) {
    return false;
  }
  if (paramMetadata.flags && paramMetadata.flags.includes("no_update")) {
    return false;
  }

  if (!ipaObject) {
    return true; // assume writable
  }

  const aci: Record<string, string> = ipaObject[
    "attributelevelrights"
  ] as Record<string, string>;
  if (aci) {
    const paramWritable = isFieldWritable(aci, paramMetadata.name);
    const allWritable = isFieldWritable(aci, "*");

    // assume old w_if_no_aci behavior by default. I.e. if object class is
    // writable than field is also writable (if param ACIs are not defined)
    const paramACIsDefined = aci[paramMetadata.name] !== undefined;
    const ocWritable = isFieldWritable(aci, "objectclass");

    return paramWritable || (!paramACIsDefined && ocWritable) || allWritable;
  }

  return true; // we don't know, assume writable
}

export function isRequired(
  parDef: IPAParamDefinition,
  param: ParamMetadata,
  writable: boolean
): boolean {
  if (parDef.readOnly) return false;
  if (!writable) return false;
  if (parDef.required !== undefined) return parDef.required;
  return (param && param.required) || false;
}

export function getValue(
  ipaObject: Record<string, unknown> | undefined,
  name: string
): BasicType {
  if (!ipaObject) {
    return "";
  }
  return ipaObject[name] as BasicType;
}

export function getParamProperties(
  parDef: IPAParamDefinition
): ParamProperties {
  const propName = parDef.propertyName || parDef.name;
  const paramMetadata = getParamMetadata(
    parDef.metadata,
    parDef.objectName,
    propName
  );
  if (!paramMetadata) {
    return {
      writable: false,
      required: false,
      readOnly: true,
      value: "",
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange: () => {},
      paramMetadata: {} as ParamMetadata,
    };
  }
  const writable = isWritable(
    paramMetadata,
    parDef.ipaObject,
    parDef.alwaysWritable
  );
  const required = isRequired(parDef, paramMetadata, writable);
  const readOnly = parDef.readOnly === undefined ? !writable : parDef.readOnly;
  const value = getValue(parDef.ipaObject, propName);
  const onChange = (value: BasicType) => {
    if (parDef.onChange) {
      parDef.onChange({ ...parDef.ipaObject, [propName]: value });
    }
  };

  return {
    writable,
    required,
    readOnly,
    value,
    onChange,
    paramMetadata,
  };
}

export function convertToString(value: BasicType): string {
  if (value === null || value === undefined) {
    return "";
  } else if (typeof value === "number" || typeof value === "boolean") {
    return value.toString();
  } else {
    return String(value);
  }
}

export function convertApiObj(
  apiRecord: Record<string, unknown>,
  simpleValues: Set<string>,
  dateValues: Set<string>
) {
  const obj = {};
  if (apiRecord !== undefined) {
    for (const [key, value] of Object.entries(apiRecord)) {
      if (simpleValues.has(key)) {
        obj[key] = convertToString(value as BasicType);
      } else if (dateValues.has(key)) {
        obj[key] = parseAPIDatetime(value);
      } else {
        obj[key] = value;
      }
    }
  }
  return obj;
}

export function convertToApiObj(
  obj: Record<string, unknown>,
  dateValues: Set<string>
): Record<string, unknown> {
  const apiObj = {};

  for (const [key, value] of Object.entries(obj)) {
    if (dateValues.has(key) && value instanceof Date) {
      apiObj[key] = toGeneralizedTime(value);
    } else {
      apiObj[key] = value;
    }
  }

  return apiObj;
}

export function isValueModified(
  value: unknown,
  originalValue: unknown
): boolean {
  let modified = false;
  // For DateTime
  if (value instanceof Date && originalValue instanceof Date) {
    modified = value.getTime() !== originalValue.getTime();
  } else if (Array.isArray(value)) {
    // Using 'JSON.stringify' when comparing arrays (to prevent data type false positives)
    modified = JSON.stringify(originalValue) !== JSON.stringify(value);
  } else {
    modified = originalValue !== value;
  }
  return modified;
}

export function getModifiedValues(
  current: Record<string, unknown>,
  original: Record<string, unknown> | null
): Record<string, unknown> {
  if (current === original) return {};
  if (original === null) return { ...current };

  const modifiedValues: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(current)) {
    if (isValueModified(value, original[key])) {
      modifiedValues[key] = value;
    }
  }
  return modifiedValues;
}

export function isObjectModified(
  current: Record<string, unknown> | null,
  original: Record<string, unknown> | null
): boolean {
  if (current === original) return false;
  if (current === null || original === null) return true;

  for (const [key, value] of Object.entries(current)) {
    if (isValueModified(value, original[key])) {
      return true;
    }
  }
  return false;
}

export const updateIpaObject = (
  ipaObject: Record<string, unknown>,
  setIpaObject: (ipaObject: Record<string, unknown>) => void,
  newValue: unknown,
  paramName: string
) => {
  setIpaObject({ ...ipaObject, [paramName]: newValue });
};

export function toArray(value: BasicType): BasicType[] {
  if (Array.isArray(value)) {
    return value;
  } else if (value === null || value === undefined) {
    return [];
  } else {
    return [value];
  }
}

/**
 * Updates the list of checked values when a specific checkbox is clicked
 * @param checked
 * @param elementToChange
 * @param valueAsArray
 * @param ipaObject
 * @param onChange
 * @param name
 */
export const updateCheckboxList = (
  checked: boolean,
  elementToChange: string,
  valueAsArray: string[],
  ipaObject: Record<string, unknown>,
  onChange: (ipaObject: Record<string, unknown>) => void,
  name: string
) => {
  const updatedList = [...valueAsArray];
  if (checked) {
    updatedList.push(elementToChange);
  } else {
    const index = updatedList.indexOf(elementToChange);
    if (index > -1) {
      updatedList.splice(index, 1);
    }
  }
  updateIpaObject(ipaObject, onChange, updatedList, name);
};
