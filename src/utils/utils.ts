// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
// Data type
import { User } from "./datatypes/globalDataTypes";

/*
 * Functions that can be reusable and called by several components throughout the application.
 */

// Helper method: Given an users list and status, check if some entry has different status
export const checkEqualStatus = (status: string, usersList: User[]) => {
  const usersWithOtherStatus = usersList.filter(
    (user) => user.status !== status
  );
  return usersWithOtherStatus.length === 0;
};

// Determine whether a user is selectable or not
export const isUserSelectable = (user: User) => user.userLogin !== "";
