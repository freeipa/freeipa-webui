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

export type ParamMetadataDNParam<
  C extends ParamClass = "DNParam",
  T extends ParamType = "DN",
> = ParamMetadataBase & {
  class: C;
  default?: string;
  type: T;
};

export type ParamMetadataIA5Str<
  C extends ParamClass = "IA5Str",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  type: T;
} & NoExtraWhitespaceMeta;

export type ParamMetadataBytes<
  C extends ParamClass = "Bytes",
  T extends ParamType = "bytes",
> = ParamMetadataBase & {
  class: C;
  type: T;
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

export type ParamMetadataCertificate<
  C extends ParamClass = "Certificate",
  T extends ParamType = "Certificate",
> = ParamMetadataBase & {
  class: C;
  type: T;
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

export type ParamMetadataPrincipal<
  C extends ParamClass = "Principal",
  T extends ParamType = "Principal",
> = ParamMetadataBase & {
  class: C;
  require_service: boolean;
  type: T;
};

export type ParamMetadataDateTime<
  C extends ParamClass = "DateTime",
  T extends ParamType = "datetime",
> = ParamMetadataBase & {
  class: C;
  type: T;
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

export type ParamMetadataAny<
  C extends ParamClass = "Any",
  T extends ParamType = "object",
> = ParamMetadataBase & {
  class: C;
  type: T;
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

export type ParamMetadataAAAARecord<
  C extends ParamClass = "AAAARecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataA6Record<
  C extends ParamClass = "A6Record",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataAFSDBRecord<
  C extends ParamClass = "AFSDBRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataAPLRecord<
  C extends ParamClass = "APLRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataCERTRecord<
  C extends ParamClass = "CERTRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataCNAMERecord<
  C extends ParamClass = "CNAMERecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataDHCIDRecord<
  C extends ParamClass = "DHCIDRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataDLVRecord<
  C extends ParamClass = "DLVRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataDNAMERecord<
  C extends ParamClass = "DNAMERecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataDSRecord<
  C extends ParamClass = "DSRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataHIPRecord<
  C extends ParamClass = "HIPRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataIPSECKEYRecord<
  C extends ParamClass = "IPSECKEYRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataKEYRecord<
  C extends ParamClass = "KEYRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataKXRecord<
  C extends ParamClass = "KXRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataLOCRecord<
  C extends ParamClass = "LOCRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataMXRecord<
  C extends ParamClass = "MXRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataNAPTRRecord<
  C extends ParamClass = "NAPTRRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataNSRecord<
  C extends ParamClass = "NSRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataNSECRecord<
  C extends ParamClass = "NSECRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataPTRRecord<
  C extends ParamClass = "PTRRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataRRSIGRecord<
  C extends ParamClass = "RRSIGRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataRPRecord<
  C extends ParamClass = "RPRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataSIGRecord<
  C extends ParamClass = "SIGRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataSPFRecord<
  C extends ParamClass = "SPFRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataSRVRecord<
  C extends ParamClass = "SRVRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataSSHFPRecord<
  C extends ParamClass = "SSHFPRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataTLSARecord<
  C extends ParamClass = "TLSARecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataTXTRecord<
  C extends ParamClass = "TXTRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataURIRecord<
  C extends ParamClass = "URIRecord",
  T extends ParamType = "str",
> = DNSRecord & {
  class: C;
  type: T;
};

export type ParamMetadataHostPassword<
  C extends ParamClass = "HostPassword",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  type: T;
} & NoExtraWhitespaceMeta;

export type ParamMetadataPassword<
  C extends ParamClass = "Password",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  type: T;
} & NoExtraWhitespaceMeta &
  Partial<ExcludeMeta>;

export type ParamMetadataOTPTokenKey<
  C extends ParamClass = "OTPTokenKey",
  T extends ParamType = "str",
> = ParamMetadataBase & {
  class: C;
  type: T;
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

export type ParamMetadataDNOrURL<
  C extends ParamClass = "DNOrURL",
  T extends ParamType = "DN",
> = ParamMetadataBase & {
  class: C;
  type: T;
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
  | ParamMetadataIntEnum<C, T>
  | ParamMetadataDNOrURL<C, T>;
