import { DateTime, Bytes } from "../types/primitives";

type TokenType = "totp" | "hotp" | "TOTP" | "HOTP";

type IpaTokenOtpAlgorithm = "sha1" | "sha256" | "sha384" | "sha512";

export type OtptokenAddArgs = {
  ipatokenuniqueid?: string;
};

export type OtptokenAddOptions = {
  type?: TokenType;
  description?: string;
  ipatokenowner?: string;
  ipatokendisabled?: boolean;
  ipatokennotbefore?: DateTime;
  ipatokennotafter?: DateTime;
  ipatokenvendor?: string;
  ipatokenmodel?: string;
  ipatokenserial?: string;
  ipatokenotpkey?: Bytes;
  ipatokenotpalgorithm?: IpaTokenOtpAlgorithm;
  ipatokenotpdigits?: 6 | 8;
  ipatokentotpclockoffset?: number;
  ipatokentotptimestep?: number;
  ipatokenhotpcounter?: number;
  setattr?: string;
  addattr?: string;
  qrcode?: boolean;
  no_qrcode: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type OtptokenAddManagedbyArgs = {
  ipatokenuniqueid: string;
};

export type OtptokenAddManagedbyOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
};

export type OtptokenDelArgs = {
  ipatokenuniqueid: string;
};

export type OtptokenDelOptions = {
  continue: boolean;
  version?: string;
};

export type OtptokenFindArgs = {
  criteria?: string;
};

export type OtptokenFindOptions = {
  ipatokenuniqueid?: string;
  type?: TokenType;
  description?: string;
  ipatokenowner?: string;
  ipatokendisabled?: boolean;
  ipatokennotbefore?: DateTime;
  ipatokennotafter?: DateTime;
  ipatokenvendor?: string;
  ipatokenmodel?: string;
  ipatokenserial?: string;
  ipatokenotpalgorithm?: IpaTokenOtpAlgorithm;
  ipatokenotpdigits?: 6 | 8;
  ipatokentotpclockoffset?: number;
  ipatokentotptimestep?: number;
  ipatokenhotpcounter?: number;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type OtptokenModArgs = {
  ipatokenuniqueid: string;
};

export type OtptokenModOptions = {
  description?: string;
  ipatokenowner?: string;
  ipatokendisabled?: boolean;
  ipatokennotbefore?: DateTime;
  ipatokennotafter?: DateTime;
  ipatokenvendor?: string;
  ipatokenmodel?: string;
  ipatokenserial?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  rename?: string;
};

export type OtptokenRemoveManagedbyArgs = {
  ipatokenuniqueid: string;
};

export type OtptokenRemoveManagedbyOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
};

export type OtptokenShowArgs = {
  ipatokenuniqueid: string;
};

export type OtptokenShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
