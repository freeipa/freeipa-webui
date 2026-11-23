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

// Topology segment simple values
const topologySegmentSimpleValues = new Set([
  "cn",
  "iparepltoposegmentleftnode",
  "iparepltoposegmentrightnode",
  "iparepltoposegmentdirection",
  "nsds5replicastripattrs",
  "nsds5replicatedattributelist",
  "nsds5replicatedattributelisttotal",
  "nsds5replicaenabled",
]);

export function apiToTopologySegment(
  apiRecord: Record<string, unknown>
): TopologySegment {
  const converted = convertApiObj(
    apiRecord,
    topologySegmentSimpleValues,
    new Set()
  ) as Partial<TopologySegment>;
  return { ...createEmptyTopologySegment(), ...converted };
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
