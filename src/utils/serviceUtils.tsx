// Data types
import { Service } from "../utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "../utils/ipaObjectUtils";

// Parse the 'textInputField' data into expected data type
// - TODO: Adapt it to work with many types of data
export const asRecord = (
  // property: string,
  element: Partial<Service>,
  onElementChange: (element: Partial<Service>) => void
  // metadata: Metadata
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Service);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "dn",
  "krbcanonicalname",
  "serviceType",
  "ipauniqueid",
  "krbloginfailedcount",
  "krbpwdpolicyreference",
]);
const dateValues = new Set(["krblastpwdchange"]);

export function apiToService(apiRecord: Record<string, unknown>): Service {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Service>;
  return partialServiceToService(converted) as Service;
}

// Determines whether a given property name is a simple value or is it multivalue (Array)
//  - Returns: boolean
export const isSimpleValue = (propertyName) => {
  return simpleValues.has(propertyName);
};

export function partialServiceToService(
  partialService: Partial<Service>
): Service {
  return {
    ...createEmptyService(),
    ...partialService,
  };
}

// Covert an partial Service object into a full Sservice object
// (initializing the undefined params with default empty values)
export function createEmptyService(): Service {
  const service: Service = {
    serviceType: "",
    dn: "",
    has_keytab: false,
    ipauniqueid: "",
    krbextradata: [],
    krblastpwdchange: null,
    krbloginfailedcount: "",
    krbpwdpolicyreference: "",
    krbticketflags: [],
    krbcanonicalname: "",
    krbprincipalname: [],
    krbprincipalauthind: [],
    sshpublickey: [],
    usercertificate: [],
    ipakrbauthzdata: [],
    memberof_role: [],
    managedby_host: [],
    ipakrbrequirespreauth: false,
    ipakrbokasdelegate: false,
    ipakrboktoauthasdelegate: false,
  };

  return service;
}
