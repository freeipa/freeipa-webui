import React, { useState, useEffect } from "react";
import { FormGroup, Radio, Skeleton, Button } from "@patternfly/react-core";
import { pluginApiService } from "src/services";

interface UserStatusFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  isReadOnly?: boolean;
  userId?: string;
  user?: any;
}

/**
 * Component that renders a user status radio field for the user edit form
 */
const UserStatusField: React.FC<UserStatusFieldProps> = ({
  value: initialValue = "active",
  onChange = (val: string) => {
    console.log("Status changed:", val);
  },
  isReadOnly = false,
  userId,
  user,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialValue);
  const [statusUpdated, setStatusUpdated] = useState<boolean>(false);

  // Get userId from either direct prop or from user object
  const effectiveUserId = userId || (user && user.uid && user.uid[0]);

  // Update internal state when props change
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Handler for radio selection
  const handleChange = (newValue: string) => {
    // Update internal state
    setValue(newValue);

    // Call the onChange handler from parent
    onChange(newValue);

    // Set status update flag
    setStatusUpdated(true);
  };

  // Handler for save button
  const handleSave = () => {
    setLoading(true);
    setStatusUpdated(false);

    console.log(`Saving user ${effectiveUserId} status to ${value}`);

    // Make the API call to update the status
    pluginApiService
      .put(`/user-status/${effectiveUserId}`, { status: value })
      .then(() => {
        console.log("Status updated successfully");
      })
      .catch((err) => {
        console.error("Error updating status:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Skeleton height="80px" />;
  }

  return (
    <FormGroup label="User Status" fieldId="user-status">
      <Radio
        id="status-active"
        name="user-status"
        label="Active"
        description="User is active and can work on tasks"
        isChecked={value === "active"}
        onChange={() => handleChange("active")}
        isDisabled={isReadOnly || loading}
      />
      <Radio
        id="status-inactive"
        name="user-status"
        label="Inactive"
        description="User is inactive and cannot work on tasks"
        isChecked={value === "inactive"}
        onChange={() => handleChange("inactive")}
        isDisabled={isReadOnly || loading}
      />
      <Radio
        id="status-disabled"
        name="user-status"
        label="Disabled"
        description="User is disabled for task execution"
        isChecked={value === "disabled"}
        onChange={() => handleChange("disabled")}
        isDisabled={isReadOnly || loading}
      />

      {statusUpdated && (
        <Button
          variant="primary"
          onClick={handleSave}
          isDisabled={loading}
          className="pf-v5-u-mt-md"
        >
          Save Status
        </Button>
      )}
    </FormGroup>
  );
};

export default UserStatusField;
