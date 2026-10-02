const OIDC_LOGIN_URL = "/ipa/session/login_oidc";

interface OidcConfig {
  authorization_endpoint: string;
  client_id: string;
  redirect_uri: string;
  scopes: string;
}

function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateCodeVerifier(): string {
  const bytes = new Uint8Array(48);
  crypto.getRandomValues(bytes);
  return base64urlEncode(bytes.buffer);
}

async function computeCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64urlEncode(hash);
}

export async function fetchOidcConfig(): Promise<OidcConfig | null> {
  try {
    const resp = await fetch(OIDC_LOGIN_URL, {
      headers: { Referer: window.location.origin + "/ipa" },
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

let oidcLoginInFlight = false;

export async function initiateOidcLogin(): Promise<boolean> {
  if (oidcLoginInFlight) return true;
  oidcLoginInFlight = true;

  const config = await fetchOidcConfig();
  if (!config) {
    oidcLoginInFlight = false;
    return false;
  }

  const codeVerifier = generateCodeVerifier();
  const state = generateCodeVerifier();
  const codeChallenge = await computeCodeChallenge(codeVerifier);

  sessionStorage.setItem("oidc_code_verifier", codeVerifier);
  sessionStorage.setItem("oidc_state", state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    scope: config.scopes,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${config.authorization_endpoint}?${params}`;
  return true;
}

export function takeOidcCodeVerifier(
  state: string
): { verifier: string } | { error: string } {
  const savedState = sessionStorage.getItem("oidc_state");
  const codeVerifier = sessionStorage.getItem("oidc_code_verifier");

  sessionStorage.removeItem("oidc_state");
  sessionStorage.removeItem("oidc_code_verifier");

  if (!savedState || savedState !== state) {
    return { error: "invalid-state" };
  }
  if (!codeVerifier) {
    return { error: "missing-verifier" };
  }
  return { verifier: codeVerifier };
}

export function getOidcRedirectUri(): string {
  return (
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname
  );
}

export function getOidcCallbackParams(): {
  code: string;
  state: string;
} | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  if (code && state) {
    return { code, state };
  }
  return null;
}
