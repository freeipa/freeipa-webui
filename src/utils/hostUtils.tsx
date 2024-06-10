// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "src/utils/ipaObjectUtils";

// Parse the 'textInputField' data into expected data type
// - TODO: Adapt it to work with many types of data
export const asRecord = (
  element: Partial<Host>,
  onElementChange: (element: Partial<Host>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Host);
  }

  return { ipaObject, recordOnChange };
};

// Single valued string attributes
const simpleValues = new Set([
  "dn",
  "serverhostname",
  "fqdn",
  "description",
  "l",
  "ipauniqueid",
  "krbcanonicalname",
  "krbpwdpolicyreference",
  "managedby",
  "ipakrbrequirespreauth",
  "ipakrbokasdelegate",
  "ipakrboktoauthasdelegate",
  "nshostlocation",
  "userclass",
  "nsosversion",
  "nshardwardplatform",
]);
const dateValues = new Set([]);

export function apiToHost(apiRecord: Record<string, unknown>): Host {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Host>;
  return partialHostToHost(converted) as Host;
}

export function partialHostToHost(partialHost: Partial<Host>) {
  return {
    ...createEmptyHost(),
    ...partialHost,
  };
}

// Covert an partial User object into a full User object
export function createEmptyHost(): Host {
  return {
    dn: "",
    attributelevelrights: {},
    description: "",
    dnsZone: "",
    enrolledby: "",
    fqdn: "",
    ip_address: "",
    krbcanonicalname: "",
    krbprincipalname: [],
    krbpwdpolicyreference: [],
    l: "",
    managedby_host: [],
    memberof_hostgroup: [],
    memberof_netgroup: [],
    memberofindirect_hostgroup: [],
    memberofindirect_netgroup: [],
    managing_host: [],
    nshostlocation: "",
    userclass: "",
    serverhostname: "",
    sshpublickey: [],
    sshpubkeyfp: [],
    nshardwareplatform: "",
    nsosversion: "",
    macaddress: [],
    krbprincipalauthind: [],
    usercertificate: [],
    // booleans
    force: false,
    has_keytab: false,
    has_password: false,
    ipakrbrequirespreauth: false,
    ipakrbokasdelegate: false,
    ipakrboktoauthasdelegate: false,
  };
}
