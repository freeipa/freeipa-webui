import { IpaServer, TopologySuffix } from "./datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "iparepltopomanagedsuffix",
  "iparepltopomanagedsuffix_topologysuffix",
  "ipamindomainlevel",
  "ipamaxdomainlevel",
  "ipalocation_location",
  "ipaserviceweight",
  "service_relative_weight",
  "enabled_role_servrole",
  "dn",
]);
const dateValues = new Set([]);

export function apiToIpaServer(apiRecord: Record<string, unknown>): IpaServer {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<IpaServer>;
  return partialIpaServerToIpaServer(converted);
}

export function partialIpaServerToIpaServer(
  partialIpaServer: Partial<IpaServer>
): IpaServer {
  return { ...createEmptyIpaServer(), ...partialIpaServer };
}

export function createEmptyIpaServer(): IpaServer {
  return {
    cn: "",
    iparepltopomanagedsuffix: [],
    iparepltopomanagedsuffix_topologysuffix: [] as TopologySuffix[],
    ipamindomainlevel: 0,
    ipamaxdomainlevel: 0,
    ipalocation_location: "",
    ipaserviceweight: 0,
    service_relative_weight: "",
    enabled_role_servrole: [],
    dn: "",
  };
}
