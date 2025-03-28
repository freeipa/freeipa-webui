import React, { useState, useEffect } from "react";
import { FormGroup, Radio } from "@patternfly/react-core";

interface User {
  inetuserstatus?: string | string[];
  [key: string]: unknown;
}

interface UserStatusFieldProps {
  value?: string;
  onChange?: (value: User) => void;
  user?: User;
}

/**
 * Component that renders a user status radio field for the user edit form
 */
const UserStatusField = (props: UserStatusFieldProps) => {
  const { value: initialValue = "active", onChange = () => {}, user } = props;

  // get initial value from user if available
  const getCurrentStatus = () => {
    if (
      user &&
      user.inetuserstatus &&
      Array.isArray(user.inetuserstatus) &&
      user.inetuserstatus.length > 0
    ) {
      return user.inetuserstatus[0];
    }
    // if string value is provided directly
    if (user && typeof user.inetuserstatus === "string") {
      return user.inetuserstatus;
    }
    return initialValue || "active";
  };

  const [value, setValue] = useState<string>(getCurrentStatus());

  // update internal state when user changes
  useEffect(() => {
    setValue(getCurrentStatus());
  }, [user]);

  const handleChange = (newValue: string) => {
    // update internal state
    setValue(newValue);

    // update the user object if provided
    if (user && typeof user === "object") {
      const updatedUser = { ...user };

      updatedUser.inetuserstatus = newValue;

      onChange(updatedUser);
    }
  };

  return (
    <FormGroup label="User Status" fieldId="user-status-field">
      <Radio
        id="status-active"
        name="user-status"
        label="Active"
        description="User is active and can work on tasks"
        isChecked={value === "active"}
        onChange={() => handleChange("active")}
      />
      <Radio
        id="status-inactive"
        name="user-status"
        label="Inactive"
        description="User is inactive and cannot work on tasks"
        isChecked={value === "inactive"}
        onChange={() => handleChange("inactive")}
      />
      <Radio
        id="status-disabled"
        name="user-status"
        label="Disabled"
        description="User is disabled for task execution"
        isChecked={value === "disabled"}
        onChange={() => handleChange("disabled")}
      />
    </FormGroup>
  );
};

export default UserStatusField;
