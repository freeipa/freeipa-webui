import React from "react";
// Utils
import { parseFullDateStringToUTCFormat } from "src/utils/utils";
import {
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";
// Components
import DateTimeSelector from "../DateTimeSelector";

export interface IpaCalendarProps extends IPAParamDefinition {
  dataCy: string;
  isDisabled?: boolean;
}

function getParamPropertiesDateTime(parDef: IPAParamDefinition) {
  const paramProms = getParamProperties(parDef);

  let valueDate: Date | null;
  if (paramProms.value instanceof Date) {
    valueDate = paramProms.value as Date;
  } else if (typeof paramProms.value === "string") {
    valueDate = parseFullDateStringToUTCFormat(paramProms.value as string);
  } else {
    valueDate = null;
  }
  return {
    readOnly: paramProms.readOnly,
    value: valueDate,
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
