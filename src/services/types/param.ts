// Assembled using Python generate-param-metadata.py

import { NumberAsString } from "./primitives";

// jq '[.result.objects | .. | objects | select(has("type")) | .type] | unique | sort' ./response.json
export type ParamType =
  | "Certificate"
  | "DN"
  | "DNSName"
  | "Decimal"
  | "Principal"
  | "bool"
  | "bytes"
  | "datetime"
  | "int"
  | "object"
  | "str";

// jq '[.result.objects | .. | objects | select(has("class")) | .class | strings] | unique | sort' ./response.json
export type ParamClass =
  | "A6Record"
  | "AAAARecord"
  | "AFSDBRecord"
  | "APLRecord"
  | "ARecord"
  | "Any"
  | "Bool"
  | "Bytes"
  | "CERTRecord"
  | "CNAMERecord"
  | "Certificate"
  | "DHCIDRecord"
  | "DLVRecord"
  | "DNAMERecord"
  | "DNOrURL"
  | "DNParam"
  | "DNSNameParam"
  | "DSRecord"
  | "DateTime"
  | "Decimal"
  | "Flag"
  | "HIPRecord"
  | "HostPassword"
  | "IA5Str"
  | "IPSECKEYRecord"
  | "Int"
  | "IntEnum"
  | "KEYRecord"
  | "KXRecord"
  | "LOCRecord"
  | "MXRecord"
  | "NAPTRRecord"
  | "NSECRecord"
  | "NSRecord"
  | "OTPTokenKey"
  | "PTRRecord"
  | "Password"
  | "Principal"
  | "RPRecord"
  | "RRSIGRecord"
  | "SIGRecord"
  | "SPFRecord"
  | "SRVRecord"
  | "SSHFPRecord"
  | "SerialNumber"
  | "Str"
  | "StrEnum"
  | "TLSARecord"
  | "TXTRecord"
  | "URIRecord";

type ParamMetadataBase = {
  cli_name: string;
  deprecated_cli_aliases: string[];
  label: string;
  doc: string;
  required: boolean;
  multivalue: boolean;
  primary_key: boolean;
  autofill: boolean;
  query: boolean;
  attribute: boolean;
  flags: string[];
  alwaysask: boolean;
  sortorder: number;
  cli_metavar: string;
  no_convert: boolean;
  deprecated: boolean;
  confirm: boolean;
  name: string;
};

type ExcludeMeta = { exclude: ["webui"] };

type NoExtraWhitespaceMeta = { noextrawhitespace: true };

type OptionGroupMeta = { option_group: string };

type MaxlengthMeta = { maxlength: number };

type MinlengthMeta = { minlength: number };

export type ParamMetadataStr<
  C extends ParamClass = "Str",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  default?: string;
  pattern: string;
  pattern_errmsg: string;
  type: T;
} & Partial<ExcludeMeta> &
  NoExtraWhitespaceMeta &
  Partial<OptionGroupMeta> &
  Partial<MaxlengthMeta> &
  Partial<MinlengthMeta>;

export const isStrParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataStr<ParamClass, ParamType> => {
  return param.class === "Str";
};

export type ParamMetadataStrEnum<
  C extends ParamClass = "StrEnum",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  default?: string;
  values: string[];
  type: T;
} & Partial<ExcludeMeta> &
  Partial<OptionGroupMeta>;

export const isStrEnumParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataStrEnum<ParamClass, ParamType> => {
  return param.class === "StrEnum";
};

export type ParamMetadataFlag<
  C extends ParamClass = "Flag",
  T extends ParamType = "bool",
> = ParamMetadataBase & {
  class: C;
  default?: boolean;
  truths: [1, "1", "true", "TRUE"];
  falsehoods: [0, "0", "false", "FALSE"];
  type: T;
} & Partial<ExcludeMeta> &
  Partial<OptionGroupMeta>;

export const isFlagParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataFlag<ParamClass, ParamType> => {
  return param.class === "Flag";
};

export type ParamMetadataDNParam<
  C extends ParamClass = "DNParam",
  T extends ParamType = "DN",
> = ParamMetadataBase & {
  class: C;
  default?: string;
  type: T;
};

export const isDNParamParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDNParam<ParamClass, ParamType> => {
  return param.class === "DNParam";
};

export type ParamMetadataIA5Str<
  C extends ParamClass = "IA5Str",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  type: T;
} & NoExtraWhitespaceMeta;

export const isIA5StrParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataIA5Str<ParamClass, ParamType> => {
  return param.class === "IA5Str";
};

export type ParamMetadataBytes<
  C extends ParamClass = "Bytes",
  T extends ParamType = "bytes",
> = ParamMetadataBase & {
  class: C;
  type: T;
};

export const isBytesParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataBytes<ParamClass, ParamType> => {
  return param.class === "Bytes";
};

export type ParamMetadataBool<
  C extends ParamClass = "Bool",
  T extends ParamType = "bool",
> = ParamMetadataBase & {
  class: C;
  default?: boolean;
  truths: [1, "1", "true", "TRUE"];
  falsehoods: [0, "0", "false", "FALSE"];
  type: T;
};

export const isBoolParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataBool<ParamClass, ParamType> => {
  return param.class === "Bool";
};

export type ParamMetadataCertificate<
  C extends ParamClass = "Certificate",
  T extends ParamType = "Certificate",
> = ParamMetadataBase & {
  class: C;
  type: T;
};

export const isCertificateParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataCertificate<ParamClass, ParamType> => {
  return param.class === "Certificate";
};

export type ParamMetadataDNSNameParam<
  C extends ParamClass = "DNSNameParam",
  T extends ParamType = "DNSName",
> = ParamMetadataBase & {
  class: C;
  default?: string;
  only_absolute: boolean;
  only_relative: boolean;
  type: T;
} & Partial<OptionGroupMeta>;

export const isDNSNameParamParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDNSNameParam<ParamClass, ParamType> => {
  return param.class === "DNSNameParam";
};

export type ParamMetadataPrincipal<
  C extends ParamClass = "Principal",
  T extends ParamType = "Principal",
> = ParamMetadataBase & {
  class: C;
  require_service: boolean;
  type: T;
};

export const isPrincipalParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataPrincipal<ParamClass, ParamType> => {
  return param.class === "Principal";
};

export type ParamMetadataDateTime<
  C extends ParamClass = "DateTime",
  T extends ParamType = "datetime",
> = ParamMetadataBase & {
  class: C;
  type: T;
};

export const isDateTimeParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDateTime<ParamClass, ParamType> => {
  return param.class === "DateTime";
};

export type ParamMetadataSerialNumber<
  C extends ParamClass = "SerialNumber",
  T extends ParamType = "int",
> = ParamMetadataBase & {
  class: C;
  maxlength: number;
  minlength: number;
  type: T;
};

export const isSerialNumberParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataSerialNumber<ParamClass, ParamType> => {
  return param.class === "SerialNumber";
};

export type ParamMetadataDecimal<
  C extends ParamClass = "Decimal",
  T extends ParamType = "Decimal",
> = ParamMetadataBase & {
  class: C;
  minvalue: NumberAsString<number>;
  maxvalue: NumberAsString<number>;
  precision: number;
  exponential: boolean;
  numberclass: string[];
  type: T;
} & Partial<OptionGroupMeta>;

export const isDecimalParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDecimal<ParamClass, ParamType> => {
  return param.class === "Decimal";
};

export type ParamMetadataAny<
  C extends ParamClass = "Any",
  T extends ParamType = "object",
> = ParamMetadataBase & {
  class: C;
  type: T;
};

export const isAnyParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataAny<ParamClass, ParamType> => {
  return param.class === "Any";
};

type DNSRecord = ParamMetadataBase & {
  option_group: string;
  validatedns: boolean;
  normalizedns: boolean;
  noextrawhitespace: boolean;
} & Partial<OptionGroupMeta>;

export type ParamMetadataARecord<
  C extends ParamClass = "ARecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isARecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataARecord<ParamClass, ParamType> => {
  return param.class === "ARecord";
};

export type ParamMetadataAAAARecord<
  C extends ParamClass = "AAAARecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isAAAARecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataAAAARecord<ParamClass, ParamType> => {
  return param.class === "AAAARecord";
};

export type ParamMetadataA6Record<
  C extends ParamClass = "A6Record",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isA6RecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataA6Record<ParamClass, ParamType> => {
  return param.class === "A6Record";
};

export type ParamMetadataAFSDBRecord<
  C extends ParamClass = "AFSDBRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isAFSDBRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataAFSDBRecord<ParamClass, ParamType> => {
  return param.class === "AFSDBRecord";
};

export type ParamMetadataAPLRecord<
  C extends ParamClass = "APLRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isAPLRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataAPLRecord<ParamClass, ParamType> => {
  return param.class === "APLRecord";
};

export type ParamMetadataCERTRecord<
  C extends ParamClass = "CERTRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isCERTRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataCERTRecord<ParamClass, ParamType> => {
  return param.class === "CERTRecord";
};

export type ParamMetadataCNAMERecord<
  C extends ParamClass = "CNAMERecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isCNAMERecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataCNAMERecord<ParamClass, ParamType> => {
  return param.class === "CNAMERecord";
};

export type ParamMetadataDHCIDRecord<
  C extends ParamClass = "DHCIDRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isDHCIDRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDHCIDRecord<ParamClass, ParamType> => {
  return param.class === "DHCIDRecord";
};

export type ParamMetadataDLVRecord<
  C extends ParamClass = "DLVRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isDLVRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDLVRecord<ParamClass, ParamType> => {
  return param.class === "DLVRecord";
};

export type ParamMetadataDNAMERecord<
  C extends ParamClass = "DNAMERecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isDNAMERecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDNAMERecord<ParamClass, ParamType> => {
  return param.class === "DNAMERecord";
};

export type ParamMetadataDSRecord<
  C extends ParamClass = "DSRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isDSRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDSRecord<ParamClass, ParamType> => {
  return param.class === "DSRecord";
};

export type ParamMetadataHIPRecord<
  C extends ParamClass = "HIPRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isHIPRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataHIPRecord<ParamClass, ParamType> => {
  return param.class === "HIPRecord";
};

export type ParamMetadataIPSECKEYRecord<
  C extends ParamClass = "IPSECKEYRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isIPSECKEYRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataIPSECKEYRecord<ParamClass, ParamType> => {
  return param.class === "IPSECKEYRecord";
};

export type ParamMetadataKEYRecord<
  C extends ParamClass = "KEYRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isKEYRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataKEYRecord<ParamClass, ParamType> => {
  return param.class === "KEYRecord";
};

export type ParamMetadataKXRecord<
  C extends ParamClass = "KXRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isKXRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataKXRecord<ParamClass, ParamType> => {
  return param.class === "KXRecord";
};

export type ParamMetadataLOCRecord<
  C extends ParamClass = "LOCRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isLOCRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataLOCRecord<ParamClass, ParamType> => {
  return param.class === "LOCRecord";
};

export type ParamMetadataMXRecord<
  C extends ParamClass = "MXRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isMXRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataMXRecord<ParamClass, ParamType> => {
  return param.class === "MXRecord";
};

export type ParamMetadataNAPTRRecord<
  C extends ParamClass = "NAPTRRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isNAPTRRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataNAPTRRecord<ParamClass, ParamType> => {
  return param.class === "NAPTRRecord";
};

export type ParamMetadataNSRecord<
  C extends ParamClass = "NSRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isNSRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataNSRecord<ParamClass, ParamType> => {
  return param.class === "NSRecord";
};

export type ParamMetadataNSECRecord<
  C extends ParamClass = "NSECRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isNSECRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataNSECRecord<ParamClass, ParamType> => {
  return param.class === "NSECRecord";
};

export type ParamMetadataPTRRecord<
  C extends ParamClass = "PTRRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isPTRRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataPTRRecord<ParamClass, ParamType> => {
  return param.class === "PTRRecord";
};

export type ParamMetadataRRSIGRecord<
  C extends ParamClass = "RRSIGRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isRRSIGRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataRRSIGRecord<ParamClass, ParamType> => {
  return param.class === "RRSIGRecord";
};

export type ParamMetadataRPRecord<
  C extends ParamClass = "RPRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isRPRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataRPRecord<ParamClass, ParamType> => {
  return param.class === "RPRecord";
};

export type ParamMetadataSIGRecord<
  C extends ParamClass = "SIGRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isSIGRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataSIGRecord<ParamClass, ParamType> => {
  return param.class === "SIGRecord";
};

export type ParamMetadataSPFRecord<
  C extends ParamClass = "SPFRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isSPFRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataSPFRecord<ParamClass, ParamType> => {
  return param.class === "SPFRecord";
};

export type ParamMetadataSRVRecord<
  C extends ParamClass = "SRVRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isSRVRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataSRVRecord<ParamClass, ParamType> => {
  return param.class === "SRVRecord";
};

export type ParamMetadataSSHFPRecord<
  C extends ParamClass = "SSHFPRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isSSHFPRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataSSHFPRecord<ParamClass, ParamType> => {
  return param.class === "SSHFPRecord";
};

export type ParamMetadataTLSARecord<
  C extends ParamClass = "TLSARecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isTLSARecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataTLSARecord<ParamClass, ParamType> => {
  return param.class === "TLSARecord";
};

export type ParamMetadataTXTRecord<
  C extends ParamClass = "TXTRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isTXTRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataTXTRecord<ParamClass, ParamType> => {
  return param.class === "TXTRecord";
};

export type ParamMetadataURIRecord<
  C extends ParamClass = "URIRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export const isURIRecordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataURIRecord<ParamClass, ParamType> => {
  return param.class === "URIRecord";
};

export type ParamMetadataHostPassword<
  C extends ParamClass = "HostPassword",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  type: T;
} & NoExtraWhitespaceMeta;

export const isHostPasswordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataHostPassword<ParamClass, ParamType> => {
  return param.class === "HostPassword";
};

export type ParamMetadataPassword<
  C extends ParamClass = "Password",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  type: T;
} & NoExtraWhitespaceMeta &
  Partial<ExcludeMeta>;

export const isPasswordParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataPassword<ParamClass, ParamType> => {
  return param.class === "Password";
};

export type ParamMetadataOTPTokenKey<
  C extends ParamClass = "OTPTokenKey",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  type: T;
};

export const isOTPTokenKeyParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataOTPTokenKey<ParamClass, ParamType> => {
  return param.class === "OTPTokenKey";
};

export type ParamMetadataInt<
  C extends ParamClass = "Int",
  T extends ParamType = "int",
> = ParamMetadataBase & {
  class: C;
  type: T;
  minvalue?: number;
  maxvalue?: number;
};

export const isIntParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataInt<ParamClass, ParamType> => {
  return param.class === "Int";
};

export type ParamMetadataIntEnum<
  C extends ParamClass = "IntEnum",
  T extends ParamType = "int",
> = ParamMetadataBase & {
  class: C;
  default: number;
  values: number[];
  type: T;
};

export const isIntEnumParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataIntEnum<ParamClass, ParamType> => {
  return param.class === "IntEnum";
};

export type ParamMetadataDNOrURL<
  C extends ParamClass = "DNOrURL",
  T extends ParamType = "DN",
> = ParamMetadataBase & {
  class: C;
  type: T;
};

export const isDNOrURLParam = (
  param: GenericParamMetadata<ParamClass, ParamType>
): param is ParamMetadataDNOrURL<ParamClass, ParamType> => {
  return param.class === "DNOrURL";
};

export type GenericParamMetadata<C extends ParamClass, T extends ParamType> =
  | ParamMetadataStr<C, T>
  | ParamMetadataStrEnum<C, T>
  | ParamMetadataFlag<C, T>
  | ParamMetadataDNParam<C, T>
  | ParamMetadataIA5Str<C, T>
  | ParamMetadataBytes<C, T>
  | ParamMetadataBool<C, T>
  | ParamMetadataCertificate<C, T>
  | ParamMetadataDNSNameParam<C, T>
  | ParamMetadataPrincipal<C, T>
  | ParamMetadataDateTime<C, T>
  | ParamMetadataSerialNumber<C, T>
  | ParamMetadataDecimal<C, T>
  | ParamMetadataAny<C, T>
  | ParamMetadataARecord<C, T>
  | ParamMetadataAAAARecord<C, T>
  | ParamMetadataA6Record<C, T>
  | ParamMetadataAFSDBRecord<C, T>
  | ParamMetadataAPLRecord<C, T>
  | ParamMetadataCERTRecord<C, T>
  | ParamMetadataCNAMERecord<C, T>
  | ParamMetadataDHCIDRecord<C, T>
  | ParamMetadataDLVRecord<C, T>
  | ParamMetadataDNAMERecord<C, T>
  | ParamMetadataDSRecord<C, T>
  | ParamMetadataHIPRecord<C, T>
  | ParamMetadataIPSECKEYRecord<C, T>
  | ParamMetadataKEYRecord<C, T>
  | ParamMetadataKXRecord<C, T>
  | ParamMetadataLOCRecord<C, T>
  | ParamMetadataMXRecord<C, T>
  | ParamMetadataNAPTRRecord<C, T>
  | ParamMetadataNSRecord<C, T>
  | ParamMetadataNSECRecord<C, T>
  | ParamMetadataPTRRecord<C, T>
  | ParamMetadataRRSIGRecord<C, T>
  | ParamMetadataRPRecord<C, T>
  | ParamMetadataSIGRecord<C, T>
  | ParamMetadataSPFRecord<C, T>
  | ParamMetadataSRVRecord<C, T>
  | ParamMetadataSSHFPRecord<C, T>
  | ParamMetadataTLSARecord<C, T>
  | ParamMetadataTXTRecord<C, T>
  | ParamMetadataURIRecord<C, T>
  | ParamMetadataHostPassword<C, T>
  | ParamMetadataPassword<C, T>
  | ParamMetadataOTPTokenKey<C, T>
  | ParamMetadataInt<C, T>
  | ParamMetadataIntEnum<C, T>
  | ParamMetadataDNOrURL<C, T>;
