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
  "userclass", // API says multivalued
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
  return objectToHost(converted) as Host;
}

// Determines whether a given property name is a simple value or is it multivalue (Array)
//  - Returns: boolean
export const isSimpleValue = (propertyName) => {
  return simpleValues.has(propertyName);
};

// Covert an partial User object into a full User object
// (initializing the undefined params with default empty values)
export const objectToHost = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partialHost: Record<string, any> | Partial<Host>,
  oldHostObject?: Partial<Host> // Optional: To override the current object values
): Host => {
  const host: Host = {
    dn: partialHost.dn || oldHostObject?.dn || "",
    attributelevelrights:
      partialHost.attributelevelrights ||
      oldHostObject?.attributelevelrights ||
      {},
    description: partialHost.description || oldHostObject?.description || "",
    dnsZone: partialHost.dnsZone || oldHostObject?.dnsZone || "",
    enrolledby: partialHost.enrolledby || oldHostObject?.enrolledby || "",
    fqdn: partialHost.fqdn || oldHostObject?.fqdn || "",
    ip_address: partialHost.ip_address || oldHostObject?.ip_address || "",
    krbcanonicalname:
      partialHost.krbcanonicalname || oldHostObject?.krbcanonicalname || "",
    krbprincipalname:
      partialHost.krbprincipalname || oldHostObject?.krbprincipalname || [],
    krbpwdpolicyreference:
      partialHost.krbpwdpolicyreference ||
      oldHostObject?.krbpwdpolicyreference ||
      [],
    l: partialHost.l || oldHostObject?.l || "",
    managedby_host:
      partialHost.managedby_host || oldHostObject?.managedby_host || [],
    memberof_hostgroup:
      partialHost.memberof_hostgroup || oldHostObject?.memberof_hostgroup || [],
    managing_host:
      partialHost.managing_host || oldHostObject?.managing_host || [],
    nshostlocation:
      partialHost.nshostlocation || oldHostObject?.nshostlocation || "",
    userclass: partialHost.userclass || oldHostObject?.userclass || "",
    serverhostname:
      partialHost.serverhostname || oldHostObject?.serverhostname || "",
    sshpublickey: partialHost.sshpublickey || oldHostObject?.sshpublickey || [],
    sshpubkeyfp: partialHost.sshpubkeyfp || oldHostObject?.sshpubkeyfp || [],
    nshardwareplatform:
      partialHost.nshardwareplatform || oldHostObject?.nshardwareplatform || "",
    nsosversion: partialHost.nsosversion || oldHostObject?.nsosversion || "",
    macaddress: partialHost.macaddress || oldHostObject?.macaddress || [],
    krbprincipalauthind:
      partialHost.krbprincipalauthind ||
      oldHostObject?.krbprincipalauthind ||
      [],
    usercertificate:
      partialHost.usercertificate || oldHostObject?.usercertificate || [],
    // booleans
    force: partialHost.force || oldHostObject?.force || false,
    has_keytab: partialHost.has_keytab || oldHostObject?.has_keytab || false,
    has_password:
      partialHost.has_password || oldHostObject?.has_password || false,
    ipakrbrequirespreauth:
      partialHost.ipakrbrequirespreauth ||
      oldHostObject?.ipakrbrequirespreauth ||
      false,
    ipakrbokasdelegate:
      partialHost.ipakrbokasdelegate ||
      oldHostObject?.ipakrbokasdelegate ||
      false,
    ipakrboktoauthasdelegate:
      partialHost.ipakrboktoauthasdelegate ||
      oldHostObject?.ipakrboktoauthasdelegate ||
      false,
  };

  return host;
};
