export type ParamFindArgs = {
  metaobjectfull_name: string;
  criteria?: string;
};

export type ParamFindOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type ParamShowArgs = {
  metaobjectfull_name: string;
  name: string;
};

export type ParamShowOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
