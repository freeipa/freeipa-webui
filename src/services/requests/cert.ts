import {
  Certificate,
  CertificateSigningRequest,
  DateTime,
  DN,
  Principal,
} from "../types/primitives";

type CertificateStatus =
  | "VALID"
  | "INVALID"
  | "REVOKED"
  | "EXPIRED"
  | "REVOKED_EXPIRED";

export type CertFindArgs = {
  criteria?: string;
};

export type CertFindOptions = {
  certificate?: Certificate;
  issuer?: DN;
  revocation_reason?: number;
  cacn?: string;
  subject?: string;
  min_serial_number?: string;
  max_serial_number?: string;
  exactly?: boolean;
  validnotafter_from?: DateTime;
  validnotafter_to?: DateTime;
  validnotbefore_from?: DateTime;
  validnotbefore_to?: DateTime;
  issuedon_from?: DateTime;
  issuedon_to?: DateTime;
  revokedon_from?: DateTime;
  revokedon_to?: DateTime;
  status?: CertificateStatus;
  pkey_only?: boolean;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  no_user?: string;
  host?: string;
  no_host?: string;
  service?: Principal;
  no_service?: Principal;
};

export type CertRemoveHoldArgs = {
  serial_number: string;
};

export type CertRemoveHoldOptions = {
  cacn?: string;
  version?: string;
};

export type CertRequestArgs = {
  csr: CertificateSigningRequest;
};

export type CertRequestOptions = {
  request_type: string;
  profile_id?: string;
  cacn?: string;
  principal: Principal;
  add: boolean;
  chain: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type CertRevokeArgs = {
  serial_number: string;
};

export type CertRevokeOptions = {
  revocation_reason: number;
  cacn?: string;
  version?: string;
};

export type CertShowArgs = {
  serial_number: string;
};

export type CertShowOptions = {
  cacn?: string;
  out?: string;
  chain: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type CertStatusArgs = {
  request_id: string;
};

export type CertStatusOptions = {
  cacn?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};
