import React from "react";
// PatternFly
import { CalendarMonth, DropdownItem } from "@patternfly/react-core";
// Layouts
import DataTimePickerLayout from "src/components/layouts/Calendar/DataTimePickerLayout";
// Components
import CalendarButton from "src/components/layouts/Calendar/CalendarButton";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Utils
import {
  getFullDate,
  getFullTime,
  getLDAPGeneralizedTime,
  parseFullDateStringToUTCFormat,
} from "src/utils/utils";
// ipaObject Utils
import {
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";
import CalendarLayout from "src/components/layouts/Calendar/CalendarLayout";

const IpaCalendar = (props: IPAParamDefinition) => {
  // Date and time picker (Calendar)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [isTimeOpen, setIsTimeOpen] = React.useState(false);
  const [valueDate, setValueDate] = React.useState("YYYY-MM-DD");
  const [valueTime, setValueTime] = React.useState("HH:MM");
  const times = Array.from(new Array(10), (_, i) => i + 10);
  const defaultTime = "10:00";

  const { readOnly } = getParamProperties(props);

  // Initialize parameters got from the 'User' object
  React.useEffect(() => {
    if (props.ipaObject !== undefined) {
      // Parse ipaObject into 'User' type to access the 'datetime' parameter
      const user = props.ipaObject as unknown as User;
      if (user[props.name] && user[props.name][0].__datetime__) {
        // Parse to UTC format
        const paramUtcDate = parseFullDateStringToUTCFormat(
          user[props.name][0].__datetime__
        );

        // Get date
        const fullDate = getFullDate(paramUtcDate);
        setValueDate(fullDate);

        // Get time
        const fullTime = getFullTime(paramUtcDate);
        setValueTime(fullTime);
      }
    }
  }, [props.ipaObject]);

  // 'onToggle' calendar function
  const onToggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
    setIsTimeOpen(false);
  };

  // 'onToggle' time function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const onToggleTime = (_ev: any) => {
    setIsTimeOpen(!isTimeOpen);
    setIsCalendarOpen(false);
  };

  // On selecting a date from the calendar
  const onSelectCalendar = (newValueDate: Date) => {
    const newValue = getFullDate(newValueDate);
    setValueDate(newValue);

    setIsCalendarOpen(!isCalendarOpen);
    // setting default time when it is not picked
    let valTime = valueTime;
    if (valueTime === "HH:MM") {
      setValueTime(defaultTime);
      valTime = defaultTime;
    }

    // Convert to LDAP format
    const newFullDate = new Date(newValue + " " + valTime);
    const LDAPDate = getLDAPGeneralizedTime(newFullDate);

    // Update 'ipaObject' with the new date
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      updateIpaObject(props.ipaObject, props.onChange, LDAPDate, props.name);
    }
  };

  // On selecting a time from the dropdown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelectTime = (ev: any) => {
    const newTime = ev.target.value as string;

    setValueTime(newTime);
    setIsTimeOpen(!isTimeOpen);

    const newFullDate = new Date(valueDate + " " + newTime);
    const LDAPDate = getLDAPGeneralizedTime(newFullDate);

    // Update 'ipaObject' with the new date
    // - Parse to ISO format (to return to the "user_mod" API call)
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      updateIpaObject(props.ipaObject, props.onChange, LDAPDate, props.name);
    }
  };

  const timeOptions = times.map((time) => (
    <DropdownItem key={time} component="button" value={`${time}:00`}>
      {`${time}:00`}
    </DropdownItem>
  ));

  const calendar = (
    <CalendarMonth
      date={new Date(valueDate)}
      onChange={onSelectCalendar}
      disabled={readOnly}
    />
  );

  const time = (
    <DataTimePickerLayout
      dropdownOnSelect={onSelectTime}
      toggleAriaLabel="Toggle the time picker menu"
      toggleIndicator={null}
      toggleOnToggle={onToggleTime}
      toggleStyle={{ padding: "6px 16px" }}
      dropdownIsOpen={isTimeOpen}
      dropdownItems={timeOptions}
    />
  );

  const calendarButton = (
    <CalendarButton
      ariaLabel="Toggle the calendar"
      onClick={onToggleCalendar}
    />
  );

  return (
    <CalendarLayout
      name={props.name}
      position="bottom"
      bodyContent={calendar}
      showClose={false}
      isVisible={isCalendarOpen}
      hasNoPadding={true}
      hasAutoWidth={true}
      textInputId="date-time"
      textInputAriaLabel="date and time picker"
      textInputValue={valueDate + " " + valueTime}
    >
      {readOnly ? <></> : calendarButton}
      {readOnly ? <></> : time}
    </CalendarLayout>
  );
};

export default IpaCalendar;
