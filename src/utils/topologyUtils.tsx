import { TopologySuffix, TopologySegment } from "./datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

// Topology suffix simple values
const topologySuffixSimpleValues = new Set([
  "cn",
  "iparepltopoconfroot",
  "pkeyOnly",
  "version",
]);
const topologySuffixDateValues = new Set([]);

export function apiToTopologySuffix(
  apiRecord: Record<string, unknown>
): TopologySuffix {
  const converted = convertApiObj(
    apiRecord,
    topologySuffixSimpleValues,
    topologySuffixDateValues
  ) as Partial<TopologySuffix>;
  return partialTopologySuffixToTopologySuffix(converted);
}

export function partialTopologySuffixToTopologySuffix(
  partialTopologySuffix: Partial<TopologySuffix>
): TopologySuffix {
  return { ...createEmptyTopologySuffix(), ...partialTopologySuffix };
}

function createEmptyTopologySuffix(): TopologySuffix {
  return {
    cn: "",
    iparepltopoconfroot: "",
    dn: "",
  };
}

export function createEmptyTopologySegment(): TopologySegment {
  return {
    cn: "",
    iparepltoposegmentleftnode: "",
    iparepltoposegmentrightnode: "",
    iparepltoposegmentdirection: "both",
    nsds5replicastripattrs: "",
    nsds5replicatedattributelist: "",
    nsds5replicatedattributelisttotal: "",
    nsds5replicatimeout: 0,
    nsds5replicaenabled: "on",
    suffixType: "",
  };
}
