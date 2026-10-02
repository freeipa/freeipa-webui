import { ParamMetadata } from "./param";

// Command to be run in the terminal, response.json is the response from the API command "json_metadata"
// jq -r '[.result.objects | to_entries[] | .value.relationships // {} | keys[]] | unique | sort[]' ./response.json
type RelationshipKey =
  | "enrolledby"
  | "ipaallowedtoperform_read_keys"
  | "ipaallowedtoperform_write_delegation"
  | "ipaallowedtoperform_write_keys"
  | "ipalocation"
  | "iparepltopomanagedsuffix"
  | "managedby"
  | "managing"
  | "member"
  | "memberhost"
  | "memberindirect"
  | "membermanager"
  | "memberof"
  | "memberofindirect"
  | "memberuser"
  | "role";

// Maps the relationship between different objects, the relationship is 1:n
// Will be edited later out!

type Relationships = {
  [K in RelationshipKey]: [string, null | string, string];
};

type AttributeMembers = {
  [K in RelationshipKey]: RelationshipKey[];
};

type ObjectMetadata<T extends string> = {
  name: T;
  takes_params: ParamMetadata[];
  methods: string[];
  primary_key: string;
};

type ComplexObjectMetadata<T extends string> = {
  parent_object: string;
  container_dn: string;
  object_name: string;
  object_name_plural: string;
  object_class: string[];
  object_class_config: null;
  default_attributes: string[];
  label: string;
  label_singular: string;
  hidden_attributes: string[];
  uuid_attribute: string;
  attribute_member: AttributeMembers;
  rdn_attribute: string;
  bindable: boolean;
  relationships: Relationships;
  aciattrs: string[];
  can_have_permissions: boolean;
} & ObjectMetadata<T>;

/**
 * Generic object record, can be either Simple or Complex.
 */
type ObjectRecord<T extends string> = {
  [K in T]: ObjectMetadata<T> | ComplexObjectMetadata<T>;
};

/**
 * Type for the methods, bound to a specific object.
 */
type MethodRecord<T extends string> = {
  [K in T]: {
    doc: string;
    NO_CLI: boolean;
    takes_options: ParamMetadata[];
  } & ObjectMetadata<T>;
};

/**
 * Check if the object is a complex object metadata.
 * Any object we receive is either Simple or Complex, we need to differentiate.
 * @param obj Object metadata
 * @returns True if the object is a complex object metadata
 */
export const isComplexObjectMetadata = <T extends string>(
  obj: ObjectMetadata<T>
): obj is ComplexObjectMetadata<T> => {
  return "can_have_permissions" in obj;
};

/**
 * When receiving data, we want to default to string, as we're unsure that the property exists.
 * But for mocking we want to ensure strict typing.
 *
 * Objects are similar to their OOP equivalent, a struct with a set of methods.
 * Methods are bound to a specific object.
 * Commands also include utilities.
 */
export type Metadata<
  T extends string = string,
  U extends string = string,
  V extends string = string,
> = {
  objects: ObjectRecord<T>;
  methods: MethodRecord<U>;
  commands: MethodRecord<V>;
};

/**
 * Use when mocking metadata, otherwise we default to string, as we're unsure that the property exists.
 * @param metadata Unpacked metadata object
 * @returns Packed metadata object with proper strict typing
 */
export const createMetadata = <
  T extends string,
  U extends string,
  V extends string,
>(
  metadata: Metadata<T, U, V>
): Metadata<T, U, V> => {
  return metadata;
};
