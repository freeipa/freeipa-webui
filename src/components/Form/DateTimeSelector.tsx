import React, { useEffect, useState } from "react";
// PatternFly
import {
  DatePicker,
  InputGroup,
  TimePicker,
  isValidDate,
} from "@patternfly/react-core";

interface PropsToDateTimeSelector {
  datetime: Date | null;
  onChange?: (timeValue: Date | null) => void;
  name: string;
  ariaLabel?: string;
  isDisabled?: boolean;
}

export const yyyyMMddFormat = (date: Date) =>
  `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;

const hhMMFormat = (date: Date) => {
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return hours + ":" + minutes;
};

const DateTimeSelector = (props: PropsToDateTimeSelector) => {
  const [dateText, setDateText] = useState(
    props.datetime ? yyyyMMddFormat(props.datetime) : ""
  );
  const [dateValid, setDateValid] = useState(true);

  const [timeText, setTimeText] = useState(
    props.datetime ? hhMMFormat(props.datetime) : ""
  );
  const [timeValid, setTimeValid] = useState(true);

  useEffect(() => {
    if (props.datetime && isValidDate(props.datetime)) {
      const newTimeText = hhMMFormat(props.datetime);
      if (newTimeText !== timeText) {
        setTimeText(newTimeText);
      }

      const newDateText = yyyyMMddFormat(props.datetime);
      if (newDateText !== dateText) {
        setDateText(newDateText);
      }
    } else if (props.datetime === null) {
      setDateText("");
      // the TimePicker component will unfornately reset the time to current
      // time if the time is set to an empty string
      setTimeText("");
    }
  }, [props.datetime]);

  const onDateTimeChange = (
    date: string,
    time: string,
    dateValid: boolean,
    timeValid: boolean
  ) => {
    if (!props.onChange) return;

    // both date and time are empty -> clear the value
    if (date === "" && time === "") {
      props.onChange(null);
      return;
    }

    // one part is invalid -> skip the update as invalid datetime might be set
    // to null which represents an empty value.
    // The limitation is that revert might not reset the value as the source
    // might still have the original value.
    if (!dateValid || !timeValid) {
      return;
    }

    // valid date -> update the datetime
    props.onChange(new Date(date + "T" + time + ":00Z"));
  };

  const onDateChange = (
    _event: React.FormEvent<HTMLInputElement>,
    inputDate: string,
    newFromDate: Date | undefined
  ) => {
    const newDateValid = isValidDate(newFromDate);
    setDateText(inputDate);
    setDateValid(newDateValid);
    onDateTimeChange(inputDate, timeText, newDateValid, timeValid);
  };

  const onTimeChange = (_event, time, hour, minute) => {
    const newTimeValid = Number.isInteger(hour) && Number.isInteger(minute);
    setTimeText(time);
    setTimeValid(newTimeValid);
    onDateTimeChange(dateText, time, dateValid, newTimeValid);
  };

  return (
    <InputGroup>
      <DatePicker
        name={props.name}
        value={dateText}
        onChange={onDateChange}
        aria-label={props.ariaLabel || props.name}
        placeholder="YYYY-MM-DD"
        isDisabled={props.isDisabled || false}
      />
      <TimePicker
        name={props.name}
        time={timeText}
        aria-label={props.ariaLabel || props.name}
        onChange={onTimeChange}
        is24Hour={true}
        isDisabled={props.isDisabled || false}
      />
    </InputGroup>
  );
};

export default DateTimeSelector;
