/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
// Data type
import { DN, Host, Metadata, Service, User } from "./datatypes/globalDataTypes";
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
export const isHostSelectable = (host: Host) => host.fqdn != "";

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

// Get the current realm of the user
export const getRealmFromKrbPolicy = (metadata: Metadata) => {
  let realm = "";
  if (metadata.objects !== undefined) {
    const krbPolicy = metadata.objects.krbtpolicy.container_dn as string;
    if (krbPolicy !== undefined) {
      // Get realm from krbtpolicy
      //  - Format: "cn=REALM, cn=kerberos"
      realm = krbPolicy.split(",")[0].split("=")[1];
    }
  }
  return realm;
};

// Date time parameters
const templates = {
  human: "YYYY-MM-DD HH:mm:ssZ",
  generalized: "YYYYMMDDHHmmssZ",
};

const dates = [
  ["YYYY-MM-DD", /^(\d{4})-(\d{2})-(\d{2})$/],
  ["YYYYMMDD", /^(\d{4})(\d{2})(\d{2})$/],
];

const times = [
  ["HH:mm:ss", /^(\d\d):(\d\d):(\d\d)$/],
  ["HH:mm", /^(\d\d):(\d\d)$/],
];

const generalized_regex = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/;
const datetime_regex =
  /^((?:\d{8})|(?:\d{4}-\d{2}-\d{2}))(?:(T| )(\d\d:\d\d(?::\d\d)?)(Z?))?$/;

// Parse full string date to UTC date format
// '20230809120244Z' --> 'Sat Aug 09 2023 14:02:44 GMT+0200 (Central European Summer Time)'
export const parseFullDateStringToUTCFormat = (dateString: string) => {
  let Y = 0,
    M = 0,
    D = 0,
    H = 0,
    m = 0,
    s = 0;
  let i, l, dateStr, timeStr, utc;

  const dt_match = datetime_regex.exec(dateString);
  const gt_match = generalized_regex.exec(dateString);

  if (dt_match) {
    dateStr = dt_match[1];
    timeStr = dt_match[3];
    utc = dt_match[4] || !timeStr;

    // error out if local time not supported
    if (!utc) return null;

    for (i = 0, l = dates.length; i < l; i++) {
      const dm = dates[i][1] as RegExp;
      dm.exec(dateStr);

      if (dm) {
        Y = dm[1];
        M = dm[2];
        D = dm[3];
        break;
      }
    }

    if (timeStr) {
      for (i = 0, l = times.length; i < l; i++) {
        const tm = times[i][1] as RegExp;
        tm.exec(timeStr);
        if (tm) {
          H = tm[1];
          m = tm[2] || 0;
          s = tm[3] || 0;
          break;
        }
      }
    }
  } else if (gt_match) {
    Y = +gt_match[1];
    M = +gt_match[2];
    D = +gt_match[3];
    H = +gt_match[4];
    m = +gt_match[5];
    s = +gt_match[6];
    utc = true;
  } else {
    return null;
  }

  const date = new Date();

  if (utc || !timeStr) {
    date.setUTCFullYear(Y, M - 1, D);
    date.setUTCHours(H, m, s, 0);
  } else {
    date.setFullYear(Y, M - 1, D);
    date.setHours(H, m, s, 0);
  }

  return date;
};

// Given a date, obtain the time in LDAP generalized time format
const formatDate = (date, format, local) => {
  const fmt = format || templates.human;
  let str;

  if (local) {
    const year = fmt.replace(/YYYY/i, date.getFullYear());
    const month = year.replace(
      /MM/i,
      (date.getMonth() + 1).toString().padStart(2, "0")
    );
    const day = month.replace(
      /DD/i,
      date.getDate().toString().padStart(2, "0")
    );
    const hour = day.replace(
      /HH/i,
      date.getHours().toString().padStart(2, "0")
    );
    const minute = hour.replace(
      /mm/i,
      date.getMinutes().toString().padStart(2, "0")
    );
    str = minute.replace(/ss/i, date.getSeconds().toString().padStart(2, "0"));
  } else {
    const year = fmt.replace(/YYYY/i, date.getUTCFullYear());
    const month = year.replace(
      /MM/i,
      (date.getUTCMonth() + 1).toString().padStart(2, "0")
    );
    const day = month.replace(
      /DD/i,
      date.getUTCDate().toString().padStart(2, "0")
    );
    const hour = day.replace(
      /HH/i,
      date.getUTCHours().toString().padStart(2, "0")
    );
    const minute = hour.replace(
      /mm/i,
      date.getUTCMinutes().toString().padStart(2, "0")
    );
    str = minute.replace(
      /ss/i,
      date.getUTCSeconds().toString().padStart(2, "0")
    );
  }
  return str;
};

export const toGeneralizedTime = (date: Date) => {
  return formatDate(date, templates.generalized, false);
};

// Get different values from DN
export const parseDn = (dn: string) => {
  const result = {} as DN;
  if (dn === undefined) return result;

  // TODO: Use proper LDAP DN parser
  const rdns = dn.split(",");
  for (let i = 0; i < rdns.length; i++) {
    const rdn = rdns[i];
    if (!rdn) continue;

    const parts = rdn.split("=");
    const name = parts[0].toLowerCase();
    const value = parts[1];

    const old_value = result[name];
    if (!old_value) {
      result[name] = value;
    } else if (typeof old_value == "string") {
      result[name] = [old_value, value];
    } else {
      result[name].push(value);
    }
  }

  return result as DN;
};
