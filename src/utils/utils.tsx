/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
// Data type
import { Host, Service, User } from "./datatypes/globalDataTypes";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// PatternFly
import TextLayout from "src/components/layouts/TextLayout";

/*
 * Functions that can be reusable and called by several components throughout the application.
 */

// Default API version (in case this is not available in Redux ATM)
export const API_VERSION_BACKUP = "2.251";

// Helper method: Given an users list and status, check if some entry has different status
export const checkEqualStatus = (status: boolean, usersList: User[]) => {
  const usersWithOtherStatus = usersList.filter(
    (user) => user.nsaccountlock !== status
  );
  return usersWithOtherStatus.length === 0;
};

// Determine whether a user is selectable or not
export const isUserSelectable = (user: User) => user.uid !== "";

// Determine whether a host is selectable or not
export const isHostSelectable = (host: Host) => host.id != "";

// Determine whether a service is selectable or not
export const isServiceSelectable = (service: Service) => service.id != "";

// Write JSX error messages into 'apiErrorsJsx' array
export const apiErrorToJsXError = (
  errorFromApiCall: FetchBaseQueryError | SerializedError,
  contextMessage: string,
  key: string
) => {
  let errorJsx: JSX.Element = <></>;

  if ("originalStatus" in errorFromApiCall) {
    // The original status is accessible here (error 401)
    errorJsx = (
      <TextLayout component="p" key={key}>
        {errorFromApiCall.originalStatus + " " + contextMessage}
      </TextLayout>
    );
  } else if ("status" in errorFromApiCall) {
    // you can access all properties of `FetchBaseQueryError` here
    errorJsx = (
      <TextLayout component="p" key={key}>
        {errorFromApiCall.status + " " + contextMessage}
      </TextLayout>
    );
  } else {
    // you can access all properties of `SerializedError` here
    errorJsx = (
      <div key={key} style={{ alignSelf: "center", marginTop: "16px" }}>
        <TextLayout component="p">{contextMessage}</TextLayout>
        <TextLayout component="p">
          {"ERROR CODE: " + errorFromApiCall.code}
        </TextLayout>
        <TextLayout component="p">{errorFromApiCall.message}</TextLayout>
      </div>
    );
  }

  return errorJsx;
};

// Parse full string date to UTC date format
// '20230809120244Z' --> 'Sat Aug 09 2023 14:02:44 GMT+0200 (Central European Summer Time)'
export const parseFullDateStringToUTCFormat = (date: string) => {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  const hour = date.substring(8, 10);
  const minutes = date.substring(10, 12);
  const seconds = date.substring(12, 14);

  const dateFormat = new Date(
    +year,
    +month - 1, // number between 0 and 11 (January to December).
    +day,
    +hour,
    +minutes,
    +seconds
  ); // UTC

  return dateFormat;
};

// Get the full day of a specific Date object
// - As the getDate() function returns a
//   number between 0 and 31, we need to add
//   a '0' in front of the number if it is
//   less than 10.
// - E.g.: 3 --> 03
export const getFullDay = (day: Date) => {
  return (day.getDate() < 10 ? "0" : "") + day.getDate();
};

// Get the full month of a specific Date object
// - As the getMonth() function returns a
//   number between 0 and 31, we need to add
//   a '0' in front of the number if it is
//   less than 10.
// - E.g.: 3 --> 03
export const getFullMonth = (month: Date) => {
  return (month.getMonth() + 1 < 10 ? "0" : "") + (month.getMonth() + 1);
};

// Get the full minutes of a specific Date object
// - As the getMinutes() function returns a
//   number between 0 and 59, we need to add
//   a '0' in front of the number if it is
//   less than 10.
// - E.g.: 9 --> 09
export const getFullMinutes = (minutes: Date) => {
  return (minutes.getMinutes() < 10 ? "0" : "") + minutes.getMinutes();
};

// Get the full seconds of a specific Date object
// - As the getSeconds() function returns a
//   number between 0 and 59, we need to add
//   a '0' in front of the number if it is
//   less than 10.
// - E.g.: 9 --> 09
export const getFullSeconds = (minutes: Date) => {
  return (minutes.getSeconds() < 10 ? "0" : "") + minutes.getSeconds();
};

// Given a date, obtain the date in the format 'YYYY-MM-DD'
export const getFullDate = (date: Date) => {
  const year = date.getFullYear();
  const month = getFullMonth(date);
  const day = getFullDay(date);

  return year + "-" + month + "-" + day;
};

// Given a date, obtain the time in the format 'HH:MM'
export const getFullTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = getFullMinutes(date);

  return hours + ":" + minutes;
};

// Given a date, obtain the time in LDAP generalized time format
export const getLDAPGeneralizedTime = (date: Date) => {
  const year = date.getFullYear();
  const month = getFullMonth(date);
  const day = getFullDay(date);
  const hours = date.getHours();
  const minutes = getFullMinutes(date);
  const seconds = getFullSeconds(date);

  return (
    year +
    "" +
    month +
    "" +
    day +
    "" +
    hours +
    "" +
    minutes +
    "" +
    seconds +
    "" +
    "Z"
  );
};
