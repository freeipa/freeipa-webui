import React, { useState, useEffect } from "react";
import {
  Label,
  Badge,
  Skeleton,
  Flex,
  FlexItem,
  Radio,
  Button,
  Alert,
} from "@patternfly/react-core";
import { pluginApiService } from "src/services";

interface UserStatusWidgetProps {
  userId?: string;
  user?: any;
}

// User status response type
interface UserStatusResponse {
  status: string;
  userId: string;
}

/**
 * Component that displays a user's status in the user details page
 * and allows for direct editing
 */
const UserStatusWidget: React.FC<UserStatusWidgetProps> = ({
  userId,
  user,
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>("");

  // Get userId from either direct prop or from user object
  const effectiveUserId = userId || (user && user.uid && user.uid[0]);

  useEffect(() => {
    // Only fetch status if we have a userId
    if (!effectiveUserId) {
      setLoading(false);
      setError("No user ID available");
      return;
    }

    fetchStatus();
  }, [effectiveUserId]);

  const fetchStatus = async () => {
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      // Get the user's status from the API
      const response = await pluginApiService.get<UserStatusResponse>(
        `/user-status/${effectiveUserId}`
      );
      setStatus(response.status);
      setNewStatus(response.status); // Initialize edit value
    } catch (err) {
      console.error("Error fetching user status:", err);
      setError("Failed to load user status");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Update the user's status through the API
      await pluginApiService.put<UserStatusResponse>(
        `/user-status/${effectiveUserId}`,
        { status: newStatus }
      );
      setStatus(newStatus);
      setIsEditing(false);
      setSuccess(`User status updated to ${newStatus}`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewStatus(status || ""); // Reset to current status
    setIsEditing(false);
    setError(null);
  };

  // Helper function to render the status badge
  const renderStatusBadge = (status: string) => {
    let color = "grey";
    switch (status) {
      case "active":
        color = "green";
        break;
      case "inactive":
        color = "blue";
        break;
      case "disabled":
        color = "red";
        break;
    }

    return (
      <Badge color={color as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading && !isEditing) {
    return (
      <div style={{ padding: "8px 0" }}>
        <Skeleton width="100%" height="60px" />
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {error && (
        <Alert
          variant="danger"
          title={error}
          className="pf-v5-u-mb-md"
          isInline
        />
      )}

      {success && (
        <Alert
          variant="success"
          title={success}
          className="pf-v5-u-mb-md"
          isInline
        />
      )}

      {isEditing ? (
        <div>
          <Label>Change User Status:</Label>
          <div className="pf-v5-u-mt-md">
            <Radio
              id="widget-status-active"
              name="widget-user-status"
              label="Active"
              description="User is active and can work on tasks"
              isChecked={newStatus === "active"}
              onChange={() => setNewStatus("active")}
              isDisabled={loading}
            />
            <Radio
              id="widget-status-inactive"
              name="widget-user-status"
              label="Inactive"
              description="User is inactive and cannot work on tasks"
              isChecked={newStatus === "inactive"}
              onChange={() => setNewStatus("inactive")}
              isDisabled={loading}
            />
            <Radio
              id="widget-status-disabled"
              name="widget-user-status"
              label="Disabled"
              description="User is disabled for task execution"
              isChecked={newStatus === "disabled"}
              onChange={() => setNewStatus("disabled")}
              isDisabled={loading}
            />
          </div>
          <Flex className="pf-v5-u-mt-md">
            <FlexItem>
              <Button
                variant="primary"
                onClick={handleSave}
                isDisabled={loading}
                isLoading={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                variant="link"
                onClick={handleCancel}
                isDisabled={loading}
              >
                Cancel
              </Button>
            </FlexItem>
          </Flex>
        </div>
      ) : (
        <Flex>
          <FlexItem>
            <Label>Status:</Label>{" "}
            {status ? renderStatusBadge(status) : "No status available"}
          </FlexItem>
          <FlexItem>
            <Button
              variant="link"
              onClick={() => setIsEditing(true)}
              className="pf-v5-u-ml-md"
            >
              Edit
            </Button>
          </FlexItem>
        </Flex>
      )}
    </div>
  );
};

export default UserStatusWidget;
