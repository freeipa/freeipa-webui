type SingleTuple<T> = [T];

export type NumberAsString<T extends number> = `${T}`;
export type StringSingleTuple = SingleTuple<string>;
export type NumberAsStringSingleTuple<T extends number> = SingleTuple<`${T}`>;

export type Certificate = string;
export type CertificateSigningRequest = string;
export type DN = string;
export type DNSName = string;
export type Decimal = number;
export type Principal = string;
export type Bytes = string;
export type DateTime = string;
export type Int = number;
