#!/usr/bin/python3
"""
OIDC login bridge: implements the /ipa/session/login_oidc API contract.

This CGI script provides the same API that the planned IPA server-side
login_oidc endpoint will offer. When IPA adds native support, this script
can be removed and the Apache ScriptAlias dropped.

Endpoints (served via Apache ScriptAlias at /ipa/session/login_oidc):

  GET  → Returns JSON with OIDC configuration:
         {authorization_endpoint, client_id, redirect_uri, scopes}

  POST → Accepts {code, code_verifier, redirect_uri} (form-urlencoded),
         exchanges the authorization code + PKCE verifier for tokens,
         obtains a Kerberos ccache from ahdapa, establishes an IPA
         session via SPNEGO, and returns the ipa_session cookie.

Configuration: /etc/ipa/oidc-bridge.json
"""

import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request


CONFIG_PATH = "/etc/ipa/oidc-bridge.json"


def load_config():
    with open(CONFIG_PATH) as f:
        return json.load(f)


def respond_json(status, data):
    body = json.dumps(data)
    sys.stdout.write(f"Status: {status}\r\n")
    sys.stdout.write("Content-Type: application/json\r\n")
    sys.stdout.write("Cache-Control: no-store\r\n")
    sys.stdout.write(f"Content-Length: {len(body)}\r\n")
    sys.stdout.write("\r\n")
    sys.stdout.write(body)
    sys.stdout.flush()


def respond_session(ipa_session):
    cookie = (
        f"ipa_session={ipa_session};"
        "path=/ipa;httponly;secure;SameSite=strict"
    )
    body = json.dumps({"status": "ok"})
    sys.stdout.write("Status: 200 OK\r\n")
    sys.stdout.write(f"Set-Cookie: {cookie}\r\n")
    sys.stdout.write("Content-Type: application/json\r\n")
    sys.stdout.write("Cache-Control: no-store\r\n")
    sys.stdout.write(f"Content-Length: {len(body)}\r\n")
    sys.stdout.write("\r\n")
    sys.stdout.write(body)
    sys.stdout.flush()


def respond_error(status, reason, message=""):
    body = json.dumps({"error": reason, "message": message})
    sys.stdout.write(f"Status: {status}\r\n")
    if reason:
        sys.stdout.write(f"X-IPA-Rejection-Reason: {reason}\r\n")
    sys.stdout.write("Content-Type: application/json\r\n")
    sys.stdout.write("Cache-Control: no-store\r\n")
    sys.stdout.write(f"Content-Length: {len(body)}\r\n")
    sys.stdout.write("\r\n")
    sys.stdout.write(body)
    sys.stdout.flush()


def handle_get():
    """Return OIDC configuration for the SPA to initiate the PKCE flow."""
    try:
        config = load_config()
    except (FileNotFoundError, json.JSONDecodeError):
        respond_error("503 Service Unavailable", "unavailable",
                       "OIDC bridge not configured")
        return

    respond_json("200 OK", {
        "authorization_endpoint": f"{config['issuer']}/authorize",
        "client_id": config["client_id"],
        "redirect_uri": config["redirect_uri"],
        "scopes": "openid profile krb5:ccache",
    })


def handle_post():
    """Exchange authorization code + PKCE verifier for an IPA session."""
    try:
        config = load_config()
    except (FileNotFoundError, json.JSONDecodeError):
        respond_error("503 Service Unavailable", "unavailable",
                       "OIDC bridge not configured")
        return

    content_length = int(os.environ.get("CONTENT_LENGTH", 0))
    if content_length <= 0:
        respond_error("400 Bad Request", "invalid-request",
                       "Missing request body")
        return

    raw_body = sys.stdin.read(content_length)
    params = urllib.parse.parse_qs(raw_body)

    code = (params.get("code") or [None])[0]
    code_verifier = (params.get("code_verifier") or [None])[0]
    redirect_uri = (params.get("redirect_uri") or [None])[0]

    if not code or not code_verifier:
        respond_error("400 Bad Request", "invalid-request",
                       "Missing code or code_verifier")
        return

    if not redirect_uri:
        redirect_uri = config["redirect_uri"]

    # Exchange authorization code for tokens
    try:
        token_body = urllib.parse.urlencode({
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": config["client_id"],
            "code_verifier": code_verifier,
        }).encode()

        req = urllib.request.Request(
            config["token_endpoint"],
            data=token_body,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        with urllib.request.urlopen(req) as resp:
            tokens = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if e.fp else ""
        respond_error("401 Unauthorized", "token-exchange-failed",
                       f"Token exchange failed ({e.code}): {body[:200]}")
        return
    except Exception as e:
        respond_error("500 Internal Server Error", "token-exchange-error",
                       str(e))
        return

    access_token = tokens.get("access_token")
    if not access_token:
        respond_error("401 Unauthorized", "no-access-token",
                       "No access_token in token response")
        return

    # Get Kerberos ccache from ahdapa
    try:
        req = urllib.request.Request(
            config["ccache_endpoint"],
            method="POST",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        with urllib.request.urlopen(req) as resp:
            ccache_data = resp.read()
    except urllib.error.HTTPError as e:
        respond_error("401 Unauthorized", "ccache-failed",
                       f"Ccache request failed ({e.code})")
        return
    except Exception as e:
        respond_error("500 Internal Server Error", "ccache-error", str(e))
        return

    if len(ccache_data) < 4:
        respond_error("401 Unauthorized", "invalid-ccache",
                       "Invalid ccache response")
        return

    # Use ccache to establish an IPA session via SPNEGO
    fd, ccache_path = tempfile.mkstemp(suffix=".ccache")
    try:
        os.write(fd, ccache_data)
        os.close(fd)

        hostname = os.environ.get("SERVER_NAME", "webui.ipa.test")
        env = dict(os.environ)
        env["KRB5CCNAME"] = ccache_path

        import re
        result = subprocess.run(
            [
                "curl", "-sk", "--negotiate", "-u:", "-D-",
                "-H", f"Referer: https://{hostname}/ipa",
                f"https://{hostname}/ipa/session/login_kerberos",
            ],
            capture_output=True,
            text=True,
            env=env,
            timeout=10,
        )

        match = re.search(r"ipa_session=([^;\s]+)", result.stdout)
        if not match:
            respond_error("401 Unauthorized", "session-failed",
                           "Failed to establish IPA session")
            return

        respond_session(match.group(1))
    except subprocess.TimeoutExpired:
        respond_error("504 Gateway Timeout", "session-timeout",
                       "IPA session request timed out")
    finally:
        try:
            os.unlink(ccache_path)
        except OSError:
            pass


def main():
    method = os.environ.get("REQUEST_METHOD", "GET").upper()

    if method == "GET":
        handle_get()
    elif method == "POST":
        handle_post()
    else:
        respond_error("405 Method Not Allowed", "method-not-allowed",
                       f"Method {method} not supported")


if __name__ == "__main__":
    main()
