import { Params } from "react-router";
import invariant from "tiny-invariant";

type Must<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type TupleUnion<U extends PropertyKey> = {
  [S in U]: Exclude<U, S> extends never // for each variant in the union, remove it and..
    ? [S] // ..stop recursion if it was the last variant
    : [...TupleUnion<Exclude<U, S>>, S]; // ..recur if not
}[U]; // extract all values from the object

// https://catchts.com/union-array
export function invariantNonNullable<T>(
  value: Readonly<Partial<T> | Params<string>>,
  properties: TupleUnion<keyof T>
): asserts value is Must<T> {
  invariant(
    value !== undefined && value !== null,
    "Value is null or undefined"
  );

  const objectKeys = Object.keys(value);

  invariant(
    objectKeys.length === properties.length,
    "Value does not have all properties"
  );

  invariant(
    // Keys of objects are always strings, the object is basically Object.keys()
    objectKeys.every((k) => (properties as TupleUnion<string>).includes(k)),
    "Value does not have all properties"
  );
  if (typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      invariant(
        v !== undefined && v !== null,
        `Value ${k} is null or undefined`
      );
    });
  }
}

export { invariant };
