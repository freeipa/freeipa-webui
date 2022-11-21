export interface User {
  userId: string;
  userLogin: string;
  firstName: string;
  lastName: string;
  status: string;
  uid: string;
  emailAddress: string;
  phone: string;
  jobTitle: string;
}

export interface UserGroup {
  name: string;
  gid: string;
  description: string;
}

export interface Netgroup {
  name: string;
  description: string;
}

export interface Roles {
  name: string;
  description: string;
}

export interface HBACRules {
  name: string;
  status: string;
  description: string;
}

export interface SudoRules {
  name: string;
  status: string;
  description: string;
}
