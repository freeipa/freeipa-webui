export type RealmdomainsModArgs = null;

export type RealmdomainsModOptions = {
  associateddomain?: string;
  add_domain?: string;
  del_domain?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  force: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type RealmdomainsShowArgs = null;

export type RealmdomainsShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
