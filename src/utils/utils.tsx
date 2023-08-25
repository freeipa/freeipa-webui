/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
// Data type
import { Host, Metadata, Service, User } from "./datatypes/globalDataTypes";
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
