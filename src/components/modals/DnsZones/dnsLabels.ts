// Error message
export const SKIP_OVERLAP_CHECK_MESSAGE =
  "Force DNS forward zone creation even if it will overlap with an existing forward zone.";

export const REVERSE_ZONE_IP_ERROR_MESSAGE =
  "Not a valid network address (examples: 2001:db8::/64, 192.0.2.0/24)";

const REVERSE_ZONE_IP_REGEX =
  /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/\d{1,2})$/;

export const isValidReverseZoneIp = (value: string): boolean => {
  // Regular expression to validate format. Examples: 2001:db8::/64, 192.0.2.0/24, etc.
  return REVERSE_ZONE_IP_REGEX.test(value);
};
