export type PwpolicyAddArgs = {
  cn: string;
};

export type PwpolicyAddOptions = {
  krbmaxpwdlife?: number;
  krbminpwdlife?: number;
  krbpwdhistorylength?: number;
  krbpwdmindiffchars?: number;
  krbpwdminlength?: number;
  cospriority: number;
  krbpwdmaxfailure?: number;
  krbpwdfailurecountinterval?: number;
  krbpwdlockoutduration?: number;
  ipapwdmaxrepeat?: number;
  ipapwdmaxsequence?: number;
  ipapwddictcheck?: boolean;
  ipapwdusercheck?: boolean;
  ipapwddcredit?: number;
  ipapwducredit?: number;
  ipapwdlcredit?: number;
  ipapwdocredit?: number;
  passwordgracelimit?: number;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type PwpolicyDelArgs = {
  cn: string;
};

export type PwpolicyDelOptions = {
  continue: boolean;
  version?: string;
};

export type PwpolicyFindArgs = {
  criteria?: string;
};

export type PwpolicyFindOptions = {
  cn?: string;
  krbmaxpwdlife?: number;
  krbminpwdlife?: number;
  krbpwdhistorylength?: number;
  krbpwdmindiffchars?: number;
  krbpwdminlength?: number;
  cospriority?: number;
  krbpwdmaxfailure?: number;
  krbpwdfailurecountinterval?: number;
  krbpwdlockoutduration?: number;
  ipapwdmaxrepeat?: number;
  ipapwdmaxsequence?: number;
  ipapwddictcheck?: boolean;
  ipapwdusercheck?: boolean;
  ipapwddcredit?: number;
  ipapwducredit?: number;
  ipapwdlcredit?: number;
  ipapwdocredit?: number;
  passwordgracelimit?: number;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type PwpolicyModArgs = {
  cn?: string;
};

export type PwpolicyModOptions = {
  krbmaxpwdlife?: number;
  krbminpwdlife?: number;
  krbpwdhistorylength?: number;
  krbpwdmindiffchars?: number;
  krbpwdminlength?: number;
  cospriority?: number;
  krbpwdmaxfailure?: number;
  krbpwdfailurecountinterval?: number;
  krbpwdlockoutduration?: number;
  ipapwdmaxrepeat?: number;
  ipapwdmaxsequence?: number;
  ipapwddictcheck?: boolean;
  ipapwdusercheck?: boolean;
  ipapwddcredit?: number;
  ipapwducredit?: number;
  ipapwdlcredit?: number;
  ipapwdocredit?: number;
  passwordgracelimit?: number;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type PwpolicyShowArgs = {
  cn?: string;
};

export type PwpolicyShowOptions = {
  rights: boolean;
  user?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};
