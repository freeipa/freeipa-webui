// Assembled using Python generate-param-metadata.py

import { NumberAsString } from "./primitives";

/**
 * Every parameter shares these properties no matter the type, we omit class and type, as they change depending on the parameter.
 * Most of these should be straightforward, or can be found within the API.
 */
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

// Various utility types to help with types.

type ExcludeMeta = { exclude: ["webui"] };

type NoExtraWhitespaceMeta = { noextrawhitespace: true };

type OptionGroupMeta = { option_group: string };

type MaxlengthMeta = { maxlength: number };

type MinlengthMeta = { minlength: number };

// All types below are different combinations of parameters available, they are all derived from the base ParamMetadataBase.
// To determine the exact type at runtime, it's good idea to check the class property.

export type ParamMetadataStr = ParamMetadataBase & {
  class: "Str";
  default?: string;
  pattern: string;
  pattern_errmsg: string;
  type: "str";
} & Partial<ExcludeMeta> &
  NoExtraWhitespaceMeta &
  Partial<OptionGroupMeta> &
  Partial<MaxlengthMeta> &
  Partial<MinlengthMeta>;

export type ParamMetadataStrEnum = ParamMetadataBase & {
  class: "StrEnum";
  default?: string;
  values: string[];
  type: "str";
} & Partial<ExcludeMeta> &
  Partial<OptionGroupMeta>;

export type ParamMetadataFlag = ParamMetadataBase & {
  class: "Flag";
  default?: boolean;
  truths: [1, "1", "true", "TRUE"];
  falsehoods: [0, "0", "false", "FALSE"];
  type: "bool";
} & Partial<ExcludeMeta> &
  Partial<OptionGroupMeta>;

export type ParamMetadataDNParam = ParamMetadataBase & {
  class: "DNParam";
  default?: string;
  type: "DN";
};

export type ParamMetadataIA5Str = ParamMetadataBase & {
  class: "IA5Str";
  type: "str";
} & NoExtraWhitespaceMeta;

export type ParamMetadataBytes = ParamMetadataBase & {
  class: "Bytes";
  type: "bytes";
};

export type ParamMetadataBool = ParamMetadataBase & {
  class: "Bool";
  default?: boolean;
  truths: [1, "1", "true", "TRUE"];
  falsehoods: [0, "0", "false", "FALSE"];
  type: "bool";
};

export type ParamMetadataCertificate = ParamMetadataBase & {
  class: "Certificate";
  type: "Certificate";
};

export type ParamMetadataDNSNameParam = ParamMetadataBase & {
  class: "DNSNameParam";
  default?: string;
  only_absolute: boolean;
  only_relative: boolean;
  type: "DNSName";
} & Partial<OptionGroupMeta>;

export type ParamMetadataPrincipal = ParamMetadataBase & {
  class: "Principal";
  require_service: boolean;
  type: "Principal";
};

export type ParamMetadataDateTime = ParamMetadataBase & {
  class: "DateTime";
  type: "datetime";
};

export type ParamMetadataSerialNumber = ParamMetadataBase & {
  class: "SerialNumber";
  maxlength: number;
  minlength: number;
  type: "int";
};

export type ParamMetadataDecimal = ParamMetadataBase & {
  class: "Decimal";
  minvalue: NumberAsString<number>;
  maxvalue: NumberAsString<number>;
  precision: number;
  exponential: boolean;
  numberclass: string[];
  type: "Decimal";
} & Partial<OptionGroupMeta>;

export type ParamMetadataAny = ParamMetadataBase & {
  class: "Any";
  type: "object";
};

type DNSRecord = ParamMetadataBase & {
  option_group: string;
  validatedns: boolean;
  normalizedns: boolean;
  noextrawhitespace: boolean;
};

type DNSRecordParam<C extends string> = DNSRecord & {
  class: C;
  type: "str";
};

export type ParamMetadataARecord = DNSRecordParam<"ARecord">;
export type ParamMetadataAAAARecord = DNSRecordParam<"AAAARecord">;
export type ParamMetadataA6Record = DNSRecordParam<"A6Record">;
export type ParamMetadataAFSDBRecord = DNSRecordParam<"AFSDBRecord">;
export type ParamMetadataAPLRecord = DNSRecordParam<"APLRecord">;
export type ParamMetadataCERTRecord = DNSRecordParam<"CERTRecord">;
export type ParamMetadataCNAMERecord = DNSRecordParam<"CNAMERecord">;
export type ParamMetadataDHCIDRecord = DNSRecordParam<"DHCIDRecord">;
export type ParamMetadataDLVRecord = DNSRecordParam<"DLVRecord">;
export type ParamMetadataDNAMERecord = DNSRecordParam<"DNAMERecord">;
export type ParamMetadataDSRecord = DNSRecordParam<"DSRecord">;
export type ParamMetadataHIPRecord = DNSRecordParam<"HIPRecord">;
export type ParamMetadataIPSECKEYRecord = DNSRecordParam<"IPSECKEYRecord">;
export type ParamMetadataKEYRecord = DNSRecordParam<"KEYRecord">;
export type ParamMetadataKXRecord = DNSRecordParam<"KXRecord">;
export type ParamMetadataLOCRecord = DNSRecordParam<"LOCRecord">;
export type ParamMetadataMXRecord = DNSRecordParam<"MXRecord">;
export type ParamMetadataNAPTRRecord = DNSRecordParam<"NAPTRRecord">;
export type ParamMetadataNSRecord = DNSRecordParam<"NSRecord">;
export type ParamMetadataNSECRecord = DNSRecordParam<"NSECRecord">;
export type ParamMetadataPTRRecord = DNSRecordParam<"PTRRecord">;
export type ParamMetadataRRSIGRecord = DNSRecordParam<"RRSIGRecord">;
export type ParamMetadataRPRecord = DNSRecordParam<"RPRecord">;
export type ParamMetadataSIGRecord = DNSRecordParam<"SIGRecord">;
export type ParamMetadataSPFRecord = DNSRecordParam<"SPFRecord">;
export type ParamMetadataSRVRecord = DNSRecordParam<"SRVRecord">;
export type ParamMetadataSSHFPRecord = DNSRecordParam<"SSHFPRecord">;
export type ParamMetadataTLSARecord = DNSRecordParam<"TLSARecord">;
export type ParamMetadataTXTRecord = DNSRecordParam<"TXTRecord">;
export type ParamMetadataURIRecord = DNSRecordParam<"URIRecord">;

export type ParamMetadataHostPassword = ParamMetadataBase & {
  class: "HostPassword";
  type: "str";
} & NoExtraWhitespaceMeta;

export type ParamMetadataPassword = ParamMetadataBase & {
  class: "Password";
  type: "str";
} & NoExtraWhitespaceMeta &
  Partial<ExcludeMeta>;

export type ParamMetadataOTPTokenKey = ParamMetadataBase & {
  class: "OTPTokenKey";
  type: "str";
};

export type ParamMetadataInt = ParamMetadataBase & {
  class: "Int";
  type: "int";
  minvalue?: number;
  maxvalue?: number;
};

export type ParamMetadataIntEnum = ParamMetadataBase & {
  class: "IntEnum";
  default: number;
  values: number[];
  type: "int";
};

export type ParamMetadataDNOrURL = ParamMetadataBase & {
  class: "DNOrURL";
  type: "DN";
};

/**
 * When we receive a response from the API, we need to narrow down the type to the exact type.
 */
export type ParamMetadata =
  | ParamMetadataStr
  | ParamMetadataStrEnum
  | ParamMetadataFlag
  | ParamMetadataDNParam
  | ParamMetadataIA5Str
  | ParamMetadataBytes
  | ParamMetadataBool
  | ParamMetadataCertificate
  | ParamMetadataDNSNameParam
  | ParamMetadataPrincipal
  | ParamMetadataDateTime
  | ParamMetadataSerialNumber
  | ParamMetadataDecimal
  | ParamMetadataAny
  | ParamMetadataARecord
  | ParamMetadataAAAARecord
  | ParamMetadataA6Record
  | ParamMetadataAFSDBRecord
  | ParamMetadataAPLRecord
  | ParamMetadataCERTRecord
  | ParamMetadataCNAMERecord
  | ParamMetadataDHCIDRecord
  | ParamMetadataDLVRecord
  | ParamMetadataDNAMERecord
  | ParamMetadataDSRecord
  | ParamMetadataHIPRecord
  | ParamMetadataIPSECKEYRecord
  | ParamMetadataKEYRecord
  | ParamMetadataKXRecord
  | ParamMetadataLOCRecord
  | ParamMetadataMXRecord
  | ParamMetadataNAPTRRecord
  | ParamMetadataNSRecord
  | ParamMetadataNSECRecord
  | ParamMetadataPTRRecord
  | ParamMetadataRRSIGRecord
  | ParamMetadataRPRecord
  | ParamMetadataSIGRecord
  | ParamMetadataSPFRecord
  | ParamMetadataSRVRecord
  | ParamMetadataSSHFPRecord
  | ParamMetadataTLSARecord
  | ParamMetadataTXTRecord
  | ParamMetadataURIRecord
  | ParamMetadataHostPassword
  | ParamMetadataPassword
  | ParamMetadataOTPTokenKey
  | ParamMetadataInt
  | ParamMetadataIntEnum
  | ParamMetadataDNOrURL;
