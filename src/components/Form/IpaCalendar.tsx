import React from "react";
// PatternFly
import {
  DatePicker,
  InputGroup,
  TimePicker,
  isValidDate,
  yyyyMMddFormat,
} from "@patternfly/react-core";
// Utils
import {
  parseFullDateStringToUTCFormat,
  toGeneralizedTime,
} from "src/utils/utils";
import {
  BasicType,
  IPAParamDefinition,
  getParamMetadata,
  isRequired,
  isWritable,
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

const IpaCalendar = (props: IPAParamDefinition) => {
  const getValueDateTime = (ipaObject, propName) => {
    let paramUtcDate: Date | null = null;

    if (ipaObject !== undefined) {
      const paramValue = ipaObject[propName] as DateParam[];

      if (paramValue) {
        // Detect if date parameter exists
        let dateParam = "";
        // Processing different formats
        // i.e.: 'paramValue[0].__datetime__' or 'paramValue'
        if (paramValue[0].__datetime__) {
          dateParam = paramValue[0].__datetime__ as string;
        } else {
          dateParam = paramValue.toString();
        }
        // Parse to UTC format
        paramUtcDate = parseFullDateStringToUTCFormat(dateParam);
      }
    }
    return paramUtcDate;
  };

  function getParamPropertiesDateTime(
    parDef: IPAParamDefinition
  ): ParamPropertiesDateTime {
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
        value: null,
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
    const readOnly =
      parDef.readOnly === undefined ? !writable : parDef.readOnly;
    const value = getValueDateTime(parDef.ipaObject, propName);

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

  const { readOnly, value } = getParamPropertiesDateTime(props);
  const [valueDate, setValueDate] = React.useState<Date | null>(value || null);

  // Keep the values updated, thus preventing empty values
  React.useEffect(() => {
    if (props.ipaObject !== undefined) {
      setValueDate(value || null);
    }
  }, [props.ipaObject]);

  // On change date handler
  const onDateChange = (
    _event: React.FormEvent<HTMLInputElement>,
    inputDate: string,
    newFromDate: Date | undefined
  ) => {
    if (newFromDate !== undefined) {
      if (
        valueDate &&
        isValidDate(valueDate) &&
        isValidDate(newFromDate) &&
        inputDate === yyyyMMddFormat(newFromDate)
      ) {
        newFromDate.setHours(valueDate.getHours());
        newFromDate.setMinutes(valueDate.getMinutes());
      }
      if (
        isValidDate(newFromDate) &&
        inputDate === yyyyMMddFormat(newFromDate)
      ) {
        setValueDate(newFromDate);
        // Update 'ipaObject' with the new date
        // - Parse to generalized format (to return to the "user_mod" API call)
        if (props.ipaObject !== undefined && props.onChange !== undefined) {
          const LDAPDate = toGeneralizedTime(newFromDate);
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
    if (valueDate && isValidDate(valueDate)) {
      const updatedFromDate = valueDate;
      updatedFromDate.setHours(hour);
      updatedFromDate.setMinutes(minute);

      setValueDate(updatedFromDate);
      // Update 'ipaObject' with the new date
      // - Parse to generalized format (to return to the "user_mod" API call)
      if (props.ipaObject !== undefined && props.onChange !== undefined) {
        const LDAPDate = toGeneralizedTime(updatedFromDate);
        updateIpaObject(props.ipaObject, props.onChange, LDAPDate, props.name);
      }
    }
    // If the date is empty, create a new one with the current time
    if (valueDate === null) {
      const updatedFromDate = new Date();
      updatedFromDate.setHours(hour);
      updatedFromDate.setMinutes(minute);

      setValueDate(updatedFromDate);
      // Update 'ipaObject' with the new date
      // - Parse to generalized format (to return to the "user_mod" API call)
      if (props.ipaObject !== undefined && props.onChange !== undefined) {
        const LDAPDate = toGeneralizedTime(updatedFromDate);
        updateIpaObject(props.ipaObject, props.onChange, LDAPDate, props.name);
      }
    }
  };

  // Parse the current date into 'HH:MM' format
  const hhMMFormat = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return hours + ":" + minutes;
  };

  return (
    <InputGroup>
      <DatePicker
        name={"add-date-" + props.name}
        value={valueDate !== null ? yyyyMMddFormat(valueDate) : ""}
        onChange={onDateChange}
        aria-label="Kerberos principal expiration date"
        placeholder="YYYY-MM-DD"
        isDisabled={readOnly}
      />
      <TimePicker
        name={"add-time-" + props.name}
        time={valueDate !== null ? hhMMFormat(valueDate) : ""}
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
