export type KrbtpolicyModArgs = {
  uid?: string;
};

export type KrbtpolicyModOptions = {
  krbmaxticketlife?: number;
  krbmaxrenewableage?: number;
  krbauthindmaxticketlife_otp?: number;
  krbauthindmaxrenewableage_otp?: number;
  krbauthindmaxticketlife_radius?: number;
  krbauthindmaxrenewableage_radius?: number;
  krbauthindmaxticketlife_pkinit?: number;
  krbauthindmaxrenewableage_pkinit?: number;
  krbauthindmaxticketlife_hardened?: number;
  krbauthindmaxrenewableage_hardened?: number;
  krbauthindmaxticketlife_idp?: number;
  krbauthindmaxrenewableage_idp?: number;
  krbauthindmaxticketlife_passkey?: number;
  krbauthindmaxrenewableage_passkey?: number;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type KrbtpolicyResetArgs = {
  uid?: string;
};

export type KrbtpolicyResetOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};

export type KrbtpolicyShowArgs = {
  uid?: string;
};

export type KrbtpolicyShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
