import { Metadata, ParamMetadata } from "src/utils/datatypes/globalDataTypes";
import { isSimpleValue } from "./userUtils";

export type BasicType = string | number | boolean | null | undefined | [];

export type IPAObject = Record<string, unknown>;

export interface IPAParamDefinition {
  id?: string; //
  value?: string; //
  name: string;
  ipaObject?: Record<string, unknown>;
  onChange?: (ipaObject: IPAObject) => void;
  objectName: string;
  metadata: Metadata;
  propertyName?: string;
  alwaysWritable?: boolean;
  readOnly?: boolean;
  required?: boolean;
  label?: string;
}

// TEST
export interface IPAParamDefinitionWithIndex {
  id?: string; //
  value?: string; //
  name: string;
  ipaObject?: Record<string, unknown>;
  onChange?: (ipaObject: IPAObject) => void; // , idx: number
  onChangeWithIndex?: boolean; //
  objectName: string;
  metadata: Metadata;
  propertyName?: string;
  alwaysWritable?: boolean;
  readOnly?: boolean;
  required?: boolean;
  idx: number;
}

export interface ParamProperties {
  writable: boolean;
  required: boolean;
  readOnly: boolean;
  value: BasicType;
  onChange: (value: BasicType) => void;
  paramMetadata: ParamMetadata;
}

// TEST
export interface ParamPropertiesWithIndex {
  writable: boolean;
  required: boolean;
  readOnly: boolean;
  value: BasicType;
  onChange: (value: BasicType) => void;
  paramMetadata: ParamMetadata;
  idx: number;
}

function getParamMetadata(
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

function isWritable(
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

function isRequired(
  parDef: IPAParamDefinition,
  param: ParamMetadata,
  writable: boolean
): boolean {
  if (parDef.readOnly) return false;
  if (!writable) return false;
  if (parDef.required !== undefined) return parDef.required;
  return (param && param.required) || false;
}

// TEST
function isRequiredWithId(
  parDef: IPAParamDefinitionWithIndex,
  param: ParamMetadata,
  writable: boolean
): boolean {
  if (parDef.readOnly) return false;
  if (!writable) return false;
  if (parDef.required !== undefined) return parDef.required;
  return (param && param.required) || false;
}

function getValue(
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

// TEST
export function getParamPropertiesWithIndex(
  parDef: IPAParamDefinitionWithIndex
): ParamPropertiesWithIndex {
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
      idx: 0,
    };
  }
  const writable = isWritable(
    paramMetadata,
    parDef.ipaObject,
    parDef.alwaysWritable
  );
  const required = isRequiredWithId(parDef, paramMetadata, writable);
  const readOnly = parDef.readOnly === undefined ? !writable : parDef.readOnly;
  const value = getValue(parDef.ipaObject, propName);
  const onChange = (value: BasicType) => {
    if (parDef.onChange) {
      if (!isSimpleValue(propName)) {
        if (parDef.ipaObject !== undefined) {
          // Modify array
          const objToModify = [...(parDef.ipaObject[propName] as string[])];
          let elementToChange = objToModify[parDef.idx];
          elementToChange = value as string;
          objToModify[parDef.idx] = elementToChange;

          // Apply changes
          parDef.onChange({ ...parDef.ipaObject, [propName]: objToModify });
        }
      }
    }
  };
  const idx = parDef.idx;
  return {
    writable,
    required,
    readOnly,
    value,
    onChange,
    paramMetadata,
    idx,
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
  for (const [key, value] of Object.entries(apiRecord)) {
    if (simpleValues.has(key)) {
      obj[key] = convertToString(value as BasicType);
    } else if (dateValues.has(key)) {
      // TODO convert to Datetime object
      obj[key] = value;
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
