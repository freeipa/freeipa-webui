import { RequestMap } from "./requests";

type ObjectValueTuple<T> = {
  [K in keyof T]-?: (x: T[K], ...args: ObjectValueTuple<Omit<T, K>>) => void;
} extends (x: infer V, ...args: infer R) => void
  ? [V, ...R]
  : [];

type ArgsAsArray<T extends object | null> = T extends null
  ? []
  : ObjectValueTuple<T>;

type RequestMethod = <const T extends keyof RequestMap>(
  methodName: T,
  args: ArgsAsArray<RequestMap[T]["args"]>,
  options: RequestMap[T]["options"]
) => Promise<object>; // TODO: Replace with typed response once we generate responses
