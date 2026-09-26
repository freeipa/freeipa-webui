export type TopicFindArgs = {
  criteria?: string;
};

export type TopicFindOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type TopicShowArgs = {
  full_name: string;
};

export type TopicShowOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
