import React from "react";
// Utils
import {
  parseFullDateStringToUTCFormat,
  toGeneralizedTime,
} from "src/utils/utils";
import {
  BasicType,
  IPAParamDefinition,
  ParamProperties,
  getParamProperties,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";
import { ParamMetadata } from "src/utils/datatypes/globalDataTypes";
// Components
import DateTimeSelector from "./DateTimeSelector";

export interface DateParam {
  __datetime__: string;
}

export interface ValueDateTime {
  valueDate: string;
  valueTime: string;
}

export interface ParamPropertiesDateTime {
  writable: boolean;
  required: boolean;
  readOnly: boolean;
  value: Date | null;
  onChange: (value: BasicType) => void;
  paramMetadata: ParamMetadata;
}

function getParamPropertiesDateTime(
  parDef: IPAParamDefinition
): ParamPropertiesDateTime {
  const paramProms: ParamProperties = getParamProperties(parDef);

  let valueDate: Date | null;
  if (paramProms.value instanceof Date) {
    valueDate = paramProms.value as Date;
  } else if (typeof paramProms.value === "string") {
    valueDate = parseFullDateStringToUTCFormat(paramProms.value as string);
  } else {
    valueDate = null;
  }
  return {
    writable: paramProms.writable,
    required: paramProms.required,
    readOnly: paramProms.readOnly,
    value: valueDate,
    onChange: paramProms.onChange,
    paramMetadata: paramProms.paramMetadata,
  };
}

const IpaCalendar = (props: IPAParamDefinition) => {
  const { readOnly, value } = getParamPropertiesDateTime(props);

  const onDateChange = (date: Date) => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      updateIpaObject(
        props.ipaObject,
        props.onChange,
        toGeneralizedTime(date),
        props.name
      );
    }
  };

  return (
    <DateTimeSelector
      datetime={value}
      onChange={onDateChange}
      name={props.name}
      ariaLabel="Kerberos principal expiration date"
      isDisabled={readOnly}
    />
  );
};

export default IpaCalendar;
