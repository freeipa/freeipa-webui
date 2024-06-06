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
  datetime: Date | null;
  onChange?: (timeValue: Date) => void;
  name: string;
  ariaLabel?: string;
  isDisabled?: boolean;
}

const hhMMFormat = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return hours + ":" + minutes;
};

function cloneDate(date: Date): Date {
  return parseFullDateStringToUTCFormat(toGeneralizedTime(date)) as Date;
}

const DateTimeSelector = (props: PropsToDateTimeSelector) => {
  // On change date handler
  const onDateChange = (
    _event: React.FormEvent<HTMLInputElement>,
    inputDate: string,
    newFromDate: Date | undefined
  ) => {
    let updatedFromDate = new Date();
    if (props.datetime && isValidDate(props.datetime)) {
      updatedFromDate = cloneDate(props.datetime);
    }

    if (!newFromDate || !isValidDate(newFromDate)) return;

    updatedFromDate.setFullYear(newFromDate.getFullYear());
    updatedFromDate.setMonth(newFromDate.getMonth());
    updatedFromDate.setDate(newFromDate.getDate());

    if (props.onChange) {
      props.onChange(updatedFromDate);
    }
  };

  // On change time handler
  const onTimeChange = (_event, time, hour, minute) => {
    let updatedFromDate = new Date();
    if (props.datetime && isValidDate(props.datetime)) {
      updatedFromDate = cloneDate(props.datetime);
    }

    if (!updatedFromDate || isValidDate(updatedFromDate)) return;

    updatedFromDate.setHours(hour);
    updatedFromDate.setMinutes(minute);
    if (props.onChange) {
      props.onChange(updatedFromDate);
    }
  };

  return (
    <InputGroup>
      <DatePicker
        name={props.name}
        value={props.datetime ? yyyyMMddFormat(props.datetime) : ""}
        onChange={onDateChange}
        aria-label={props.ariaLabel || props.name}
        placeholder="YYYY-MM-DD"
        isDisabled={props.isDisabled || false}
      />
      <TimePicker
        name={props.name}
        time={props.datetime ? hhMMFormat(props.datetime) : ""}
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
