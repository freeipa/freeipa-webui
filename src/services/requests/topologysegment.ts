export type IpaReplTopoSegmentDirection = "both" | "left-right" | "right-left";

export type TopologysegmentAddArgs = {
  topologysuffixcn: string;
  cn: string;
};

export type TopologysegmentAddOptions = {
  iparepltoposegmentleftnode: string;
  iparepltoposegmentrightnode: string;
  iparepltoposegmentdirection: IpaReplTopoSegmentDirection;
  nsds5replicastripattrs?: string;
  nsds5replicatedattributelist?: string;
  nsds5replicatedattributelisttotal?: string;
  nsds5replicatimeout?: number;
  nsds5replicaenabled?: "on" | "off";
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TopologysegmentDelArgs = {
  topologysuffixcn: string;
  cn: string;
};

export type TopologysegmentDelOptions = {
  continue: boolean;
  version?: string;
};

export type TopologysegmentFindArgs = {
  topologysuffixcn: string;
  criteria?: string;
};

export type TopologysegmentFindOptions = {
  cn?: string;
  iparepltoposegmentleftnode?: string;
  iparepltoposegmentrightnode?: string;
  iparepltoposegmentdirection?: IpaReplTopoSegmentDirection;
  nsds5replicastripattrs?: string;
  nsds5replicatedattributelist?: string;
  nsds5replicatedattributelisttotal?: string;
  nsds5replicatimeout?: number;
  nsds5replicaenabled?: "on" | "off";
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type TopologysegmentModArgs = {
  topologysuffixcn: string;
  cn: string;
};

export type TopologysegmentModOptions = {
  nsds5replicastripattrs?: string;
  nsds5replicatedattributelist?: string;
  nsds5replicatedattributelisttotal?: string;
  nsds5replicatimeout?: number;
  nsds5replicaenabled?: "on" | "off";
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TopologysegmentReinitializeArgs = {
  topologysuffixcn: string;
  cn: string;
};

export type TopologysegmentReinitializeOptions = {
  left?: boolean;
  right?: boolean;
  stop?: boolean;
  version?: string;
};

export type TopologysegmentShowArgs = {
  topologysuffixcn: string;
  cn: string;
};

export type TopologysegmentShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
