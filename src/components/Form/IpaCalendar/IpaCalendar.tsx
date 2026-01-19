import React from "react";
// Utils
import { parseFullDateStringToUTCFormat } from "src/utils/utils";
import {
  BasicType,
  IPAParamDefinition,
  ParamProperties,
  getParamProperties,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";
import { ParamMetadata } from "src/utils/datatypes/globalDataTypes";
// Components
import DateTimeSelector from "../DateTimeSelector";

interface ParamPropertiesDateTime {
  writable: boolean;
  required: boolean;
  readOnly: boolean;
  value: Date | null;
  onChange: (value: BasicType) => void;
  paramMetadata: ParamMetadata;
}

export interface IpaCalendarProps extends IPAParamDefinition {
  dataCy: string;
  isDisabled?: boolean;
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

const IpaCalendar = (props: IpaCalendarProps) => {
  const { readOnly, value } = getParamPropertiesDateTime(props);

  const onDateChange = (date: Date | null) => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      updateIpaObject(props.ipaObject, props.onChange, date, props.name);
    }
  };

  return (
    <DateTimeSelector
      dataCy={props.dataCy}
      datetime={value}
      onChange={onDateChange}
      name={props.name}
      ariaLabel={props.ariaLabel}
      isDisabled={props.isDisabled || readOnly}
    />
  );
};

export default IpaCalendar;
