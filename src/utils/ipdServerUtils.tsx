// Data types
import { IDPServer } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "dn",
  "ipaidpauthendpoint",
  "ipaidpscope",
  "ipaidpsub",
  "ipaidptokenendpoint",
]);
const dateValues = new Set([]);

export function apiToIdpServer(apiRecord: Record<string, unknown>): IDPServer {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<IDPServer>;
  return partialIdpServerToIdpServer(converted);
}

export function partialIdpServerToIdpServer(
  partialIdpServer: Partial<IDPServer>
) {
  return {
    ...createEmptyIdpServer(),
    ...partialIdpServer,
  };
}

export function createEmptyIdpServer(): IDPServer {
  return {
    cn: "",
    dn: "",
    ipaidpauthendpoint: "",
    ipaidpclientid: [],
    ipaidpdevauthendpoint: [],
    ipaidpscope: "",
    ipaidpsub: "",
    ipaidptokenendpoint: "",
    ipaidpuserinfoendpoint: [],
  };
}
