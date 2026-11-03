export type CertprofileDelArgs = {
  cn: string;
};

export type CertprofileDelOptions = {
  continue: boolean;
  version?: string;
};

export type CertprofileFindArgs = {
  criteria?: string;
};

export type CertprofileFindOptions = {
  cn?: string;
  description?: string;
  ipacertprofilestoreissued?: boolean;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type CertprofileImportArgs = {
  cn: string;
};

export type CertprofileImportOptions = {
  description: string;
  ipacertprofilestoreissued: boolean;
  file: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type CertprofileModArgs = {
  cn: string;
};

export type CertprofileModOptions = {
  description?: string;
  ipacertprofilestoreissued?: boolean;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  file?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type CertprofileShowArgs = {
  cn: string;
};

export type CertprofileShowOptions = {
  rights: boolean;
  out?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};
