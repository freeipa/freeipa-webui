// Data types
import { RadiusServer } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: Partial<RadiusServer>,
  onElementChange: (element: Partial<RadiusServer>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as RadiusServer);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "cn",
  "description",
  "ipatokenradiusserver",
  "ipatokenradiussecret",
  "ipatokenradiustimeout",
  "ipatokenusermapattribute",
  "dn",
]);
const dateValues = new Set<string>([]);

export function apiToRadiusServer(
  apiRecord: Record<string, unknown>
): RadiusServer {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<RadiusServer>;

  return {
    ...createEmptyRadiusServer(),
    ...converted,
  };
}

export function partialRadiusServerToRadiusServer(
  partial: Partial<RadiusServer>
): RadiusServer {
  return {
    ...createEmptyRadiusServer(),
    ...partial,
  };
}

export function createEmptyRadiusServer(): RadiusServer {
  return {
    cn: "",
    description: "",
    ipatokenradiusserver: "",
    ipatokenradiussecret: "",
    ipatokenradiustimeout: 0,
    ipatokenusermapattribute: "",
    dn: "",
  };
}
