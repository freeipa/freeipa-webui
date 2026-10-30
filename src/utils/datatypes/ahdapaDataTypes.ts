/**
 * TypeScript data types for ahdapa REST API entities.
 *
 * These types match the ahdapa admin REST API responses directly.
 * Unlike IPA types which use array-wrapped attributes (e.g. { cn: ['value'] }),
 * ahdapa returns direct values (e.g. { client_name: 'value' }).
 */

// ── Auth / Session ──

export interface AhdapaAuthInfo {
  display_name: string;
  realm: string;
  gssapi?: boolean;
  logo_url?: string;
  default_theme?: "light" | "dark";
}

export interface AhdapaUserProfile {
  sub: string;
  username: string;
  name?: string;
  email?: string;
  groups: string[];
  roles: string[];
  permissions: string[];
  acr: string;
  amr: string[];
  auth_time: number;
}

// ── OAuth2 Clients ──

export type AhdapaAuthMethod =
  | "none"
  | "client_secret_basic"
  | "client_secret_post"
  | "client_secret_jwt"
  | "private_key_jwt"
  | "tls_client_auth"
  | "self_signed_tls_client_auth"
  | "kerberos_client_auth";

export type AhdapaClientSource = "static" | "dynamic";

export type AhdapaIdTokenAlg =
  | "RS256"
  | "RS384"
  | "RS512"
  | "PS256"
  | "PS384"
  | "PS512"
  | "ES256"
  | "ES384"
  | "ES512"
  | "EdDSA"
  | "ML-DSA-44"
  | "ML-DSA-65"
  | "ML-DSA-87";

export interface AhdapaRegistryRepositoryGrant {
  pattern: string;
  actions: string[];
}

export interface AhdapaClient {
  client_id: string;
  client_name: string;
  redirect_uris: string[];
  scopes: string[];
  token_endpoint_auth_method: AhdapaAuthMethod;
  jwks_uri?: string;
  subject_type?: string;
  grant_types?: string[];
  tls_client_certificate_thumbprint?: string;
  tls_client_auth_subject_dn?: string;
  kerberos_principal?: string;
  kerberos_principal_pattern?: string;
  kerberos_hbac_service?: string;
  spiffe_id?: string;
  id_token_signed_response_alg?: AhdapaIdTokenAlg;
  workload_type?: string;
  allow_token_exchange_actor?: boolean;
  skip_consent?: boolean;
  localhost_only?: boolean;
  allowed_token_exchange_audiences?: string[];
  allowed_registry_repositories?: AhdapaRegistryRepositoryGrant[];
  source: AhdapaClientSource;
}

export interface AhdapaCreateClientRequest {
  client_name: string;
  redirect_uris?: string[];
  scopes?: string[];
  token_endpoint_auth_method?: AhdapaAuthMethod;
  client_secret?: string;
  jwks_uri?: string;
  subject_type?: string;
  grant_types?: string[];
  tls_client_certificate?: string;
  tls_client_auth_subject_dn?: string;
  kerberos_principal?: string;
  kerberos_principal_pattern?: string;
  kerberos_hbac_service?: string;
  spiffe_id?: string;
  id_token_signed_response_alg?: AhdapaIdTokenAlg;
  workload_type?: string;
  allow_token_exchange_actor?: boolean;
  skip_consent?: boolean;
  localhost_only?: boolean;
  allowed_token_exchange_audiences?: string[];
  allowed_registry_repositories?: AhdapaRegistryRepositoryGrant[];
}

// ── OAuth2 Scopes ──

export interface AhdapaScopeDefinition {
  name: string;
  description: string;
  claims: string[];
  is_system: boolean;
}

// ── Users / Groups ──

export interface AhdapaUser {
  username: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  groups: string[];
  source: string;
}

// ── Signing Keys ──

export interface AhdapaSigningKey {
  kid: string;
  algorithm: string;
  not_before: number;
  not_after: number;
  active: boolean;
}

// ── Cluster Nodes ──

export interface AhdapaNode {
  node_id: string;
  added_at: number;
  kem_enrolled: boolean;
  gossip_signing_enrolled: boolean;
  wrapping_key_recipient: boolean;
}

export interface AhdapaNodeStats {
  node_id: string;
  crdt_generation: number;
  counts: {
    clients: number;
    signing_keys: number;
    cluster_nodes: number;
    refresh_families: number;
    revoked_sessions: number;
    scope_definitions: number;
    ipa_idp_overrides: number;
  };
  peers: string[];
  active_signing_kid?: string;
  kem_enrolled: boolean;
  gossip_signing_enrolled: boolean;
  gossip: {
    started_at: number;
    rounds_completed: number;
    last_round_at?: number;
    peer_last_sync: Record<string, number>;
    persist_errors: number;
    wrapping_key_pull_errors: number;
  };
}

// ── Audit ──

export interface AhdapaAuditEvent {
  occurred_at: string;
  event_type: string;
  subject?: string;
  principal?: string;
  client_id?: string;
  outcome?: string;
  detail?: string;
}

// ── Refresh Families ──

export interface AhdapaRefreshFamily {
  family_id: string;
  sub: string;
  client_id: string;
  expires_at: number;
  revoked: boolean;
}

// ── Identity HBAC ──

export interface AhdapaHBACRuleInfo {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  user_count: number;
  client_count: number;
  scope_count: number;
  delegation_target_count: number;
  registry_repository_count: number;
}

export interface AhdapaHBACRuleDetail {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  users: string[];
  user_groups: string[];
  user_category: boolean;
  hosts: string[];
  host_groups: string[];
  host_category: boolean;
  services: string[];
  service_groups: string[];
  service_category: boolean;
  clients: string[];
  client_groups: string[];
  client_category: boolean;
  allowed_scopes: string[];
  scope_category: boolean;
  source_networks: string[];
  network_category: boolean;
  device_groups: string[];
  device_category: boolean;
  mfa_bypass: boolean;
  required_acr: string | null;
  delegation_targets: string[];
  delegation_target_category: boolean;
  registry_repositories: string[];
  registry_repository_category: boolean;
  registry_actions: string[];
  registry_action_category: boolean;
}

export interface AhdapaHBACPatchRequest {
  name?: string;
  description?: string;
  enabled?: boolean;
  add_users?: string[];
  remove_users?: string[];
  user_category?: boolean;
  add_user_groups?: string[];
  remove_user_groups?: string[];
  add_hosts?: string[];
  remove_hosts?: string[];
  host_category?: boolean;
  add_host_groups?: string[];
  remove_host_groups?: string[];
  add_services?: string[];
  remove_services?: string[];
  service_category?: boolean;
  add_service_groups?: string[];
  remove_service_groups?: string[];
  add_clients?: string[];
  remove_clients?: string[];
  client_category?: boolean;
  add_client_groups?: string[];
  remove_client_groups?: string[];
  add_scopes?: string[];
  remove_scopes?: string[];
  scope_category?: boolean;
  add_networks?: string[];
  remove_networks?: string[];
  network_category?: boolean;
  add_device_groups?: string[];
  remove_device_groups?: string[];
  device_category?: boolean;
  mfa_bypass?: boolean;
  required_acr?: string | null;
  add_delegation_targets?: string[];
  remove_delegation_targets?: string[];
  delegation_target_category?: boolean;
  add_registry_repositories?: string[];
  remove_registry_repositories?: string[];
  registry_repository_category?: boolean;
  add_registry_actions?: string[];
  remove_registry_actions?: string[];
  registry_action_category?: boolean;
}

// ── Federation ──

export interface AhdapaFederatedAccount {
  id: number;
  upstream_iss: string;
  upstream_sub: string;
  local_sub: string;
  linked_at: number;
}

export interface AhdapaCreateFederatedAccountRequest {
  upstream_iss: string;
  upstream_sub: string;
  local_sub: string;
}

export interface AhdapaFederationPolicy {
  key: string;
  upstream_iss: string;
  subject_pattern: string;
  local_sub: string;
  scopes?: string[];
  priority: number;
}

export interface AhdapaCreateFederationPolicyRequest {
  upstream_iss: string;
  subject_pattern: string;
  local_sub: string;
  scopes?: string[];
  priority?: number;
}

// ── IPA Upstream IdPs ──

export interface AhdapaIpaIdp {
  id: string;
  display_name: string;
  issuer: string;
  client_id: string;
  scopes: string[];
  callback_path: string;
  default_acr: string | null;
  default_amr: string[];
  source: "ipa";
}

export interface AhdapaIpaIdpOverrideRequest {
  default_acr: string | null;
  default_amr: string[];
}

// ── SPIFFE ──

export interface AhdapaSpiffeEntry {
  id: string;
  spiffe_id: string;
  selectors: string[];
  node_constraint: string | null;
  ttl_seconds: number;
}

export interface AhdapaSpiffeEntryRequest {
  spiffe_id: string;
  selectors: string[];
  node_constraint?: string | null;
  ttl_seconds?: number;
}

export interface AhdapaSpiffeStatus {
  trust_domain: string | null;
  ca_algorithm: string;
  bundle_sequence: number;
  refresh_hint: number;
  entry_count: number;
  workload_socket: string;
  hsm_backed: boolean;
}

export interface AhdapaSpiffeFederationRelationship {
  trust_domain: string;
  bundle_endpoint_url: string;
  bundle_endpoint_profile: string;
  endpoint_spiffe_id: string | null;
  has_cached_bundle: boolean;
}

export interface AhdapaSpiffeFederationRequest {
  trust_domain: string;
  bundle_endpoint_url: string;
  bundle_endpoint_profile: string;
  endpoint_spiffe_id?: string | null;
}

// ── SAML2 ──

export interface AhdapaCertificateInfo {
  subject: string;
  issuer: string;
  not_before: string;
  not_after: string;
  algorithm: string;
  fingerprint_sha256: string;
}

export interface AhdapaSaml2Sp {
  entity_id: string;
  acs_urls: string[];
  slo_url?: string;
  name_id_format?: string;
  want_assertions_signed: boolean;
  has_certificate: boolean;
  certificate?: AhdapaCertificateInfo;
}

export interface AhdapaCreateSaml2SpRequest {
  entity_id: string;
  acs_urls: string[];
  slo_url?: string;
  name_id_format?: string;
  certificate_pem?: string;
  want_assertions_signed?: boolean;
}

export interface AhdapaSaml2Idp {
  entity_id: string;
  local_id: string;
  sso_url: string;
  slo_url?: string;
  name_id_format?: string;
  preferred_binding: string;
  default_groups: string[];
  certificate_count: number;
  certificates: AhdapaCertificateInfo[];
}

export interface AhdapaCreateSaml2IdpRequest {
  entity_id: string;
  local_id: string;
  sso_url: string;
  slo_url?: string;
  certificates_pem?: string[];
  name_id_format?: string;
  preferred_binding?: string;
  default_groups?: string[];
}

// ── Lookup helpers ──

export interface AhdapaLookupEntry {
  value: string;
  label: string;
}

// ── Registration Tokens ──

export interface AhdapaRegistrationToken {
  jti: string;
  issued_at: number;
  expires_at: number;
  one_time: boolean;
  used_at: number | null;
  expired: boolean;
}

// ── Formatting helpers ──

export function formatUnixTimestamp(ts: number): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString();
}

export function formatIsoTimestamp(ts: string): string {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}
