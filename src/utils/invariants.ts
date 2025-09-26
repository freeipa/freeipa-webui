import invariant from "tiny-invariant";

type Must<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export function invariantNonNullable<T>(
  value: Partial<T>
): asserts value is Must<T> {
  invariant(
    value !== undefined && value !== null,
    "Value is null or undefined"
  );

  if (typeof value === "object") {
    invariant(Object.keys(value).length > 0, "Value is an empty object");
    Object.entries(value).forEach(([k, v]) => {
      invariant(
        v !== undefined && v !== null,
        `Value ${k} is null or undefined`
      );
    });
  }
}

export { invariant };
