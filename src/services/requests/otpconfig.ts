export type OtpconfigModArgs = null;

export type OtpconfigModOptions = {
  ipatokentotpauthwindow?: number;
  ipatokentotpsyncwindow?: number;
  ipatokenhotpauthwindow?: number;
  ipatokenhotpsyncwindow?: number;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type OtpconfigShowArgs = null;

export type OtpconfigShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
