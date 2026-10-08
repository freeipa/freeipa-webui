export type TrustconfigModArgs = null;

export type TrustconfigModOptions = {
  ipantfallbackprimarygroup?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  trust_type: "ad";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TrustconfigShowArgs = null;

export type TrustconfigShowOptions = {
  rights: boolean;
  trust_type: "ad";
  all: boolean;
  raw: boolean;
  version?: string;
};
