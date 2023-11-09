import React from "react";
// PatternFly
import {
  DatePicker,
  InputGroup,
  TimePicker,
  isValidDate,
} from "@patternfly/react-core";
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

function cloneDate(date: Date): Date {
  return parseFullDateStringToUTCFormat(toGeneralizedTime(date)) as Date;
}

const IpaCalendar = (props: IPAParamDefinition) => {
  const { readOnly, value } = getParamPropertiesDateTime(props);

  // On change date handler
  const onDateChange = (
    _event: React.FormEvent<HTMLInputElement>,
    inputDate: string,
    newFromDate: Date | undefined
  ) => {
    if (newFromDate !== undefined) {
      if (
        isValidDate(newFromDate) &&
        inputDate === yyyyMMddFormat(newFromDate)
      ) {
        if (value) {
          newFromDate.setHours(value.getHours());
          newFromDate.setMinutes(value.getMinutes());
        }
        // Update 'ipaObject' with the new date
        // - Parse to generalized format (to return to the "user_mod" API call)
        if (props.ipaObject !== undefined && props.onChange !== undefined) {
          const LDAPDate: string = toGeneralizedTime(newFromDate);
          updateIpaObject(
            props.ipaObject,
            props.onChange,
            LDAPDate,
            props.name
          );
        }
      }
    }
  };

  // On change time handler
  const onTimeChange = (_event, time, hour, minute) => {
    // Assume inital data is null
    // If the date is empty, create a new one with the current time
    let updatedFromDate: Date = new Date();
    if (value && isValidDate(value)) {
      updatedFromDate = cloneDate(value);
    }
    updatedFromDate.setHours(hour);
    updatedFromDate.setMinutes(minute);

    // Update 'ipaObject' with the new date
    // - Parse to generalized format (to return to the "user_mod" API call)
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      const LDAPDate = toGeneralizedTime(updatedFromDate);
      updateIpaObject(props.ipaObject, props.onChange, LDAPDate, props.name);
    }
  };

  // Parse the current date into 'YYYY-MM-DD' format
  const yyyyMMddFormat = (date: Date | null | undefined): string => {
    if (date === undefined || date === null) return "";

    // This convertion is needed to prevent any Date data type issues
    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate().toString().padStart(2, "0");

    const res = year.toString() + "-" + month.toString() + "-" + day;
    return res;
  };

  // Parse the current date into 'HH:MM' format
  const hhMMFormat = (date: Date | null | undefined): string => {
    if (date === undefined || date === null) return "";

    // This convertion is needed to prevent any Date data type issues
    const dt = new Date(date);
    const hours = dt.getHours().toString().padStart(2, "0");
    const minutes = dt.getMinutes().toString().padStart(2, "0");

    const res = hours + ":" + minutes;
    return res;
  };

  return (
    <InputGroup>
      <DatePicker
        name={"add-date-" + props.name}
        value={yyyyMMddFormat(value)}
        onChange={onDateChange}
        aria-label="Kerberos principal expiration date"
        placeholder="YYYY-MM-DD"
        isDisabled={readOnly}
      />
      <TimePicker
        name={"add-time-" + props.name}
        time={hhMMFormat(value)}
        aria-label="Kerberos principal expiration time"
        onChange={onTimeChange}
        placeholder="HH:MM"
        is24Hour={true}
        isDisabled={readOnly}
      />
    </InputGroup>
  );
};

export default IpaCalendar;
