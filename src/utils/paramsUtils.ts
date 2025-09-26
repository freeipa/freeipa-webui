import { useParams } from "react-router";
import { invariantNonNullable, TupleUnion } from "./invariants";

export type UidParams = {
  uid: string;
};

export type CnParams = {
  cn: string;
};

type Params = Record<string, string | undefined>;

export const useSafeParams = <T extends Params>(
  validation: TupleUnion<keyof T>
) => {
  const params = useParams<T>();
  invariantNonNullable(params, validation);
  return params;
};
