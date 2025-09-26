import { useParams } from "react-router";
import { invariantNonNullable } from "./invariants";

export type UidParams = {
  uid: string;
};

export type CnParams = {
  cn: string;
};

type ParamsOrKey = string | Record<string, string | undefined>;

export const useSafeParams = <T extends ParamsOrKey>() => {
  const params = useParams<T>();
  invariantNonNullable(params);
  return params;
};
