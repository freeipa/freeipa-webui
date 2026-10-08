import { Certificate } from "../types/primitives";

export type CertmapMatchArgs = {
  certificate: Certificate;
};

export type CertmapMatchOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
