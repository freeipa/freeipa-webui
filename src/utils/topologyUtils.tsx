import {
  TopologySuffix,
  TopologySegment,
  TopologyDirection,
  TopologyEnabled,
} from "./datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

export const topologySuffixAsRecord = (
  element: Partial<TopologySuffix>,
  onElementChange: (element: Partial<TopologySuffix>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as TopologySuffix);
  }
  return { ipaObject, recordOnChange };
};

export const topologySegmentAsRecord = (
  element: Partial<TopologySegment>,
  onElementChange: (element: Partial<TopologySegment>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as TopologySegment);
  }
  return { ipaObject, recordOnChange };
};

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

export function createEmptyTopologySuffix(): TopologySuffix {
  return {
    cn: "",
    iparepltopoconfroot: "",
    dn: "",
  };
}

// Topology segment simple values
const topologySegmentSimpleValues = new Set([
  "cn",
  "topologysuffixcn",
  "criteria",
  "iparepltoposegmentleftnode",
  "iparepltoposegmentrightnode",
  "iparepltoposegmentdirection",
  "nsds5replicastripattrs",
  "nsds5replicatedattributelist",
  "nsds5replicatedattributelisttotal",
  "nsds5replicatimeout",
  "nsds5replicaenabled",
]);
const topologySegmentDateValues = new Set([]);

export function apiToTopologySegment(
  apiRecord: Record<string, unknown>
): TopologySegment {
  const converted = convertApiObj(
    apiRecord,
    topologySegmentSimpleValues,
    topologySegmentDateValues
  ) as Partial<TopologySegment>;
  return partialTopologySegmentToTopologySegment(converted);
}

export function partialTopologySegmentToTopologySegment(
  partialTopologySegment: Partial<TopologySegment>
): TopologySegment {
  return { ...createEmptyTopologySegment(), ...partialTopologySegment };
}

export function createEmptyTopologySegment(): TopologySegment {
  return {
    cn: "",
    iparepltoposegmentleftnode: "",
    iparepltoposegmentrightnode: "",
    iparepltoposegmentdirection: "" as TopologyDirection,
    nsds5replicastripattrs: "",
    nsds5replicatedattributelist: "",
    nsds5replicatedattributelisttotal: "",
    nsds5replicatimeout: 0,
    nsds5replicaenabled: "enabled" as TopologyEnabled,
    suffixType: "",
  };
}
