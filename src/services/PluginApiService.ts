import { Command, api } from "./rpc";

/**
 * Constants for API service
 */
const API_CONSTANTS = {
  RESPONSE_DELAY_MS: 300,
  DEFAULT_STATUS: "active" as const,
  URL_PREFIXES: {
    USER_STATUS: "/user-status/",
  },
  STORAGE_KEYS: {
    USER_STATUS_PREFIX: "user-status-",
  },
};

// Allowed status values type
export type UserStatusValue = "active" | "inactive" | "disabled";

/**
 * Common interfaces for plugin API requests and responses
 */
// Base interfaces for request data
export interface PluginRequestData {
  [key: string]: unknown;
}

// User Status specific interfaces
export interface UserStatusData extends PluginRequestData {
  status: UserStatusValue;
  userId?: string;
}

// Plugin API Error type
export class PluginApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "PluginApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Validates if a value is a valid user status
 */
function isValidUserStatus(status: string): status is UserStatusValue {
  return ["active", "inactive", "disabled"].includes(status);
}

/**
 * Type guard to check if data has a valid status property
 */
function hasValidStatusProperty(
  data: PluginRequestData
): data is UserStatusData {
  return (
    "status" in data &&
    typeof data.status === "string" &&
    isValidUserStatus(data.status)
  );
}

/**
 * Simple API service for plugins to make REST-style API calls with localStorage persistence
 */
export const pluginApiService = {
  /**
   * Make a GET request to the plugin endpoint
   */
  async get<T>(url: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        try {
          // For user status, extract userId from URL
          if (url.startsWith(API_CONSTANTS.URL_PREFIXES.USER_STATUS)) {
            const userId = url.split("/").pop() || "";
            if (!userId) {
              reject(new PluginApiError("Invalid user ID in URL", 400));
              return;
            }

            const storageKey = `${API_CONSTANTS.STORAGE_KEYS.USER_STATUS_PREFIX}${userId}`;
            // Get from localStorage or use default
            const statusValue =
              localStorage.getItem(storageKey) || API_CONSTANTS.DEFAULT_STATUS;

            // Validate that status is one of the allowed values
            if (!isValidUserStatus(statusValue)) {
              console.warn(
                `Invalid status value in localStorage: ${statusValue}, using default`
              );
              resolve({
                status: API_CONSTANTS.DEFAULT_STATUS,
                userId,
              } as UserStatusData as unknown as T);
            } else {
              resolve({
                status: statusValue,
                userId,
              } as UserStatusData as unknown as T);
            }
          } else {
            // Default mock response for other endpoints
            resolve({
              status: API_CONSTANTS.DEFAULT_STATUS,
            } as UserStatusData as unknown as T);
          }
        } catch (err) {
          console.error("Error in pluginApiService.get:", err);
          reject(
            new PluginApiError(
              `Error getting data: ${
                err instanceof Error ? err.message : String(err)
              }`
            )
          );
        }
      }, API_CONSTANTS.RESPONSE_DELAY_MS);
    });
  },

  /**
   * Make a PUT request to the plugin endpoint
   */
  async put<T>(url: string, data: PluginRequestData): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        try {
          // For user status, save to localStorage
          if (url.startsWith(API_CONSTANTS.URL_PREFIXES.USER_STATUS)) {
            const userId = url.split("/").pop() || "";
            if (!userId) {
              reject(new PluginApiError("Invalid user ID in URL", 400));
              return;
            }

            const storageKey = `${API_CONSTANTS.STORAGE_KEYS.USER_STATUS_PREFIX}${userId}`;

            // Check if data has valid status property
            if (hasValidStatusProperty(data)) {
              const statusValue = data.status;

              // Save to localStorage
              try {
                localStorage.setItem(storageKey, statusValue);
                console.log(`Saved user status for ${userId}: ${statusValue}`);
                resolve({
                  status: statusValue,
                  userId,
                } as UserStatusData as unknown as T);
              } catch (storageErr) {
                console.error("Error saving to localStorage:", storageErr);
                reject(new PluginApiError("Error saving data to storage", 500));
              }
            } else {
              reject(
                new PluginApiError(
                  "Invalid data format: missing or invalid status property",
                  400
                )
              );
            }
          } else {
            // Default mock response for other endpoints
            if (hasValidStatusProperty(data)) {
              resolve({ status: data.status } as unknown as T);
            } else {
              resolve(data as unknown as T);
            }
          }
        } catch (err) {
          console.error("Error in pluginApiService.put:", err);
          reject(
            new PluginApiError(
              `Error updating data: ${
                err instanceof Error ? err.message : String(err)
              }`,
              500
            )
          );
        }
      }, API_CONSTANTS.RESPONSE_DELAY_MS);
    });
  },

  /**
   * Make a POST request to the plugin endpoint
   */
  async post<T>(url: string, data: PluginRequestData): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // For demo purposes, resolve with mock data
      setTimeout(() => {
        try {
          resolve(data as unknown as T);
        } catch (err) {
          console.error("Error in pluginApiService.post:", err);
          reject(
            new PluginApiError(
              `Error creating data: ${
                err instanceof Error ? err.message : String(err)
              }`,
              500
            )
          );
        }
      }, API_CONSTANTS.RESPONSE_DELAY_MS);
    });
  },

  /**
   * Make a DELETE request to the plugin endpoint
   */
  async delete<T>(url: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // For demo purposes, resolve with mock data
      setTimeout(() => {
        try {
          // For user status, remove from localStorage
          if (url.startsWith(API_CONSTANTS.URL_PREFIXES.USER_STATUS)) {
            const userId = url.split("/").pop() || "";
            if (!userId) {
              reject(new PluginApiError("Invalid user ID in URL", 400));
              return;
            }

            const storageKey = `${API_CONSTANTS.STORAGE_KEYS.USER_STATUS_PREFIX}${userId}`;
            localStorage.removeItem(storageKey);
            console.log(`Removed user status for ${userId}`);
          }

          resolve({} as unknown as T);
        } catch (err) {
          console.error("Error in pluginApiService.delete:", err);
          reject(
            new PluginApiError(
              `Error deleting data: ${
                err instanceof Error ? err.message : String(err)
              }`,
              500
            )
          );
        }
      }, API_CONSTANTS.RESPONSE_DELAY_MS);
    });
  },
};

/**
 * Plugin command parameters type
 */
export interface PluginCommandParams {
  [key: string]: string | number | boolean | object | null;
}

// Helper to get a command for a plugin operation
export function getPluginCommand(
  pluginId: string,
  operation: string,
  params: PluginCommandParams[]
): Command {
  return {
    method: `${pluginId}_${operation}`,
    params,
  };
}

// A mutation hook for executing plugin commands
export const useExecutePluginCommandMutation =
  api.endpoints.simpleMutCommand.useMutation;

// A simple API client for plugin operations
export const pluginApi = {
  execute: async (
    pluginId: string,
    operation: string,
    params: PluginCommandParams[]
  ) => {
    const command = getPluginCommand(pluginId, operation, params);
    try {
      const response = await fetch("/ipa/session/json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 0,
          method: command.method,
          params: command.params,
        }),
      });

      if (!response.ok) {
        throw new PluginApiError(
          `HTTP error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (err) {
      console.error("Error executing plugin command:", err);
      throw err instanceof PluginApiError
        ? err
        : new PluginApiError(
            `Error: ${err instanceof Error ? err.message : String(err)}`
          );
    }
  },
};
