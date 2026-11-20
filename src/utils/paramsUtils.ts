import { useParams } from "react-router";
import { invariantNonNullable, TupleUnion } from "./invariants";
import { decodeRouteId } from "./routeUtils";

export type UidParams = {
  uid: string;
};

export type CnParams = {
  cn: string;
};

export type IpatokenuniqueidParams = {
  ipatokenuniqueid: string;
};

export type AcinameParams = {
  aciname: string;
};

type Params = Record<string, string | undefined>;

export const useSafeParams = <T extends Params>(
  validation: TupleUnion<keyof T>
) => {
  const params = useParams<T>();
  invariantNonNullable(params, validation);
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      value === undefined ? value : decodeRouteId(value),
    ])
  ) as T;
};
