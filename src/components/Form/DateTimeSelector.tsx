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

interface PropsToDateTimeSelector {
  timeValue: string; // Generalized time format ('YYYYMMDDHHMMSSZ')
  setTimeValue: (timeValue: string) => void;
  name: string;
  ariaLabel?: string;
  isDisabled?: boolean;
}

const DateTimeSelector = (props: PropsToDateTimeSelector) => {
  const [valueDate, setValueDate] = React.useState<Date | null>(null);

  // Parse the current date into 'Date' format
  React.useEffect(() => {
    if (props.timeValue) {
      const date = parseFullDateStringToUTCFormat(props.timeValue);
      setValueDate(date);
    }
  }, [props.timeValue]);

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
        // Parse to generalized format
        props.setTimeValue(toGeneralizedTime(newFromDate));
      }
    }
  };

  // On change time handler
  const onTimeChange = (_event, time, hour, minute) => {
    let updatedFromDate = new Date();
    if (valueDate && isValidDate(valueDate)) {
      updatedFromDate = valueDate;
    }
    updatedFromDate.setHours(hour);
    updatedFromDate.setMinutes(minute);

    setValueDate(updatedFromDate);
    // Parse to generalized format
    props.setTimeValue(toGeneralizedTime(updatedFromDate));
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
        name={props.name}
        value={valueDate !== null ? yyyyMMddFormat(valueDate) : ""}
        onChange={onDateChange}
        aria-label={props.ariaLabel || props.name}
        placeholder="YYYY-MM-DD"
        isDisabled={props.isDisabled || false}
      />
      <TimePicker
        name={props.name}
        time={valueDate !== null ? hhMMFormat(valueDate) : ""}
        aria-label={props.ariaLabel || props.name}
        onChange={onTimeChange}
        placeholder="HH:MM"
        is24Hour={true}
        isDisabled={props.isDisabled || false}
      />
    </InputGroup>
  );
};

export default DateTimeSelector;
