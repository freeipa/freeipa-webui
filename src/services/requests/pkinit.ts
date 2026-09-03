export type PkinitStatusArgs = {
  criteria?: string;
};

export type PkinitStatusOptions = {
  server_server?: string;
  status?: "enabled" | "disabled";
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
};
