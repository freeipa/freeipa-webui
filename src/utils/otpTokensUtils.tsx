import { OtpToken } from "./datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: OtpToken,
  onElementChange: (element: OtpToken) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as OtpToken);
  }
  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "ipatokenuniqueid",
  "type",
  "description",
  "ipatokenowner",
  "managedby_user",
  "ipatokendisabled",
  "ipatokenvendor",
  "ipatokenmodel",
  "ipatokenserial",
  "ipatokenotpalgorithm",
  "ipatokenotpdigits",
  "ipatokentotpclockoffset",
  "ipatokentotptimestep",
  "ipatokenhotpcounter",
  "uri",
]);
const dateValues = new Set(["ipatokennotbefore", "ipatokennotafter"]);
const complexValues = new Map([["ipatokenotpkey", "__base64__"]]);

export function apiToOtpToken(apiRecord: Record<string, unknown>): OtpToken {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues,
    complexValues
  ) as Partial<OtpToken>;

  // As `convertApiObj` converts the value to a string,
  //  we need to convert it back to a boolean
  converted.ipatokendisabled =
    converted.ipatokendisabled?.toString() === "true";

  return partialOtpTokenToOtpToken(converted);
}

export function partialOtpTokenToOtpToken(
  partialOtpToken: Partial<OtpToken>
): OtpToken {
  return {
    ...createEmptyOtpToken(),
    ...partialOtpToken,
  };
}

export function createEmptyOtpToken(): OtpToken {
  return {
    ipatokenuniqueid: "",
    type: "totp",
    description: "",
    ipatokenowner: "",
    managedby_user: "",
    ipatokendisabled: false,
    ipatokennotbefore: "",
    ipatokennotafter: "",
    ipatokenvendor: "",
    ipatokenmodel: "",
    ipatokenserial: "",
    ipatokenotpkey: "",
    ipatokenotpalgorithm: "sha1",
    ipatokenotpdigits: "6",
    ipatokentotpclockoffset: 0,
    ipatokentotptimestep: 30,
    ipatokenhotpcounter: 0,
    uri: "",
  };
}
