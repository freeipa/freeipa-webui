/**
 * Short descriptions of ipa-healthcheck checks, aligned with upstream docs:
 * https://github.com/freeipa/freeipa-healthcheck
 *
 * Keys are ``source|check`` when needed for disambiguation, else ``check`` only.
 */
const HEALTHCHECK_CHECK_DOCS: Record<string, string> = {
  // ipahealthcheck.dogtag.ca
  "ipahealthcheck.dogtag.ca|DogtagCertsConfigCheck":
    "Compares the CA (and KRA, if installed) certificate values with those referenced in Dogtag CS.cfg. A mismatch can prevent the CA from starting.",
  "ipahealthcheck.dogtag.ca|DogtagCertsConnectivityCheck":
    "Runs an operation equivalent to `ipa cert-show 1` to verify basic connectivity to the CA subsystem.",

  // ipahealthcheck.ds.replication
  "ipahealthcheck.ds.replication|ReplicationConflictCheck":
    "Searches the directory for replication conflicts (entries with nsds5ReplConflict). Conflicts usually require manual cleanup.",

  // ipahealthcheck.ipa.certs
  "ipahealthcheck.ipa.certs|IPACertmongerExpirationCheck":
    "Uses certmonger’s view of each tracked certificate to warn if a cert is expiring soon (default window) or report if it has expired.",
  "ipahealthcheck.ipa.certs|IPACertfileExpirationCheck":
    "Reads certificates from PEM files or NSS databases on disk and checks expiration, in case certmonger tracking is out of sync with files.",
  "ipahealthcheck.ipa.certs|IPACAChainExpirationCheck":
    "Loads the CA chain from /etc/ipa/ca.crt and validates each certificate for expiration (including external CA chains).",
  "ipahealthcheck.ipa.certs|IPACertTracking":
    "Compares certmonger tracking requests on the system to the expected tracking configuration for IPA-managed certificates.",
  "ipahealthcheck.ipa.certs|IPACertNSSTrust":
    "Verifies NSS trust flags for certificates in NSS databases match the expected trust for IPA/Dogtag components.",
  "ipahealthcheck.ipa.certs|IPACertMatchCheck":
    "Ensures CA certificate material in LDAP and on-disk NSS stores stay consistent with /etc/ipa/ca.crt.",
  "ipahealthcheck.ipa.certs|IPADogtagCertsMatchCheck":
    "Checks that Dogtag certificates present in both the NSS DB and LDAP match between the two stores.",
  "ipahealthcheck.ipa.certs|IPANSSChainValidation":
    "Validates certificate chains for NSS-stored certs (e.g. `certutil -V`) to catch untrusted or broken chains.",
  "ipahealthcheck.ipa.certs|IPAOpenSSLChainValidation":
    "Validates PEM certificate chains using OpenSSL against the IPA CA bundle.",
  "ipahealthcheck.ipa.certs|IPARAAgent":
    "Verifies RA agent description and certificate attributes in LDAP for the IPA RA user.",
  "ipahealthcheck.ipa.certs|IPAKRAAgent":
    "Verifies KRA agent description and certificate attributes when KRA is installed.",
  "ipahealthcheck.ipa.certs|IPACertRevocation":
    "Confirms tracked IPA certificates are not revoked according to the CA.",
  "ipahealthcheck.ipa.certs|IPACertmongerCA":
    "Checks that required certmonger CA helpers (e.g. dogtag-ipa-ca-renew-agent) are configured.",

  // ipahealthcheck.ipa.dna
  "ipahealthcheck.ipa.dna|IPADNARangeCheck":
    "Reports configured DNA ID ranges and next values; intended for review alongside other DNA/placement analysis.",

  // ipahealthcheck.ipa.files
  "ipahealthcheck.ipa.files|IPAFileCheck":
    "Compares owner and mode of important IPA files to expected values from a fresh install; deviations are usually WARNING.",
  "ipahealthcheck.ipa.files|IPAFileNSSDBCheck":
    "Same as IPAFileCheck for NSS database paths used by IPA services.",
  "ipahealthcheck.ipa.files|TomcatFileCheck":
    "Validates ownership and permissions of Tomcat-related files for Dogtag.",

  // ipahealthcheck.ipa.host
  "ipahealthcheck.ipa.host|IPAHostKeytab":
    "Runs `kinit -kt /etc/krb5.keytab` to verify the host keytab can obtain credentials.",

  // ipahealthcheck.ipa.roles
  "ipahealthcheck.ipa.roles|IPACRLManagerCheck":
    "Reports whether this master is configured as the CRL generation master.",
  "ipahealthcheck.ipa.roles|IPARenewalMasterCheck":
    "Reports whether this master is the certificate renewal master.",

  // ipahealthcheck.ipa.topology
  "ipahealthcheck.ipa.topology|IPATopologyDomainCheck":
    "Equivalent in spirit to `ipa topologysuffix-verify` — validates replication topology and reports connection or agreement issues.",

  // ipahealthcheck.ipa.trust (representative)
  "ipahealthcheck.ipa.trust|IPATrustAgentCheck":
    "When configured as a trust agent, verifies SSSD settings such as `ipa_server_mode` for trust.",
  "ipahealthcheck.ipa.trust|IPATrustDomainsCheck":
    "Ensures IPA trust domains line up with domains SSSD reports.",
  "ipahealthcheck.ipa.trust|IPATrustCatalogCheck":
    "Resolves a sample AD user to validate global catalog / DC entries visible to SSSD.",
  "ipahealthcheck.ipa.trust|IPAsidgenpluginCheck":
    "Verifies the SIDGEN plugin is enabled in the Directory Server instance.",
  "ipahealthcheck.ipa.trust|IPATrustAgentMemberCheck":
    "Checks that this host is a member of the AD trust agents group in IPA.",
  "ipahealthcheck.ipa.trust|IPATrustControllerPrincipalCheck":
    "For trust controllers, verifies the host CIFS principal membership in trust agents.",
  "ipahealthcheck.ipa.trust|IPATrustControllerServiceCheck":
    "Ensures the ADTRUST service is enabled in `ipactl` on trust controllers.",
  "ipahealthcheck.ipa.trust|IPATrustControllerConfCheck":
    "Validates Samba/ldapi configuration needed for trust controller operation.",
  "ipahealthcheck.ipa.trust|IPATrustControllerGroupSIDCheck":
    "Checks the administrators group SID matches expectations for trust controllers.",
  "ipahealthcheck.ipa.trust|IPATrustPackageCheck":
    "If AD trust is enabled but this host is not a controller, warns if the trust-ad package is missing.",

  // ipahealthcheck.meta.core
  "ipahealthcheck.meta.core|MetaCheck":
    "Collects basic metadata about the run: host FQDN and IPA version information.",

  // ipahealthcheck.meta.services — check name is the service
  "ipahealthcheck.meta.services|httpd":
    "Verifies the httpd service is running; required for the IPA web UI and API.",
  "ipahealthcheck.meta.services|dirsrv":
    "Verifies the 389 Directory Server instance for IPA is running.",
  "ipahealthcheck.meta.services|pki_tomcatd":
    "Verifies Dogtag PKI (Tomcat) is running for the CA/KRA.",
  "ipahealthcheck.meta.services|krb5kdc":
    "Verifies the KDC service is running.",
  "ipahealthcheck.meta.services|named":
    "Verifies BIND (named) is running when DNS is in use.",
  "ipahealthcheck.meta.services|sssd":
    "Verifies SSSD is running.",
  "ipahealthcheck.meta.services|certmonger":
    "Verifies certmonger is running for certificate tracking and renewal.",

  // ipahealthcheck.system.filesystemspace
  "ipahealthcheck.system.filesystemspace|FileSystemSpaceCheck":
    "Checks free space and free percentage on important paths (e.g. /var/tmp, /tmp, logs, DS data). Low space can break logging and services.",

  // Fallback by check name only (same text as above) for tools that omit source
  DogtagCertsConfigCheck:
    "Compares the CA (and KRA, if installed) certificate values with those referenced in Dogtag CS.cfg. A mismatch can prevent the CA from starting.",
  IPACertmongerExpirationCheck:
    "Uses certmonger’s view of each tracked certificate to warn if a cert is expiring soon (default window) or report if it has expired.",
  FileSystemSpaceCheck:
    "Checks free space and free percentage on important paths (e.g. /var/tmp, /tmp, logs, DS data). Low space can break logging and services.",
  MetaCheck:
    "Collects basic metadata about the run: host FQDN and IPA version information.",
  IPADNARangeCheck:
    "Reports configured DNA ID ranges and next values; intended for review alongside other DNA/placement analysis.",
};

/** Upstream project home (README and issue tracker). */
export const FREEIPA_HEALTHCHECK_REPO_URL =
  "https://github.com/freeipa/freeipa-healthcheck";

/**
 * Returns a short explanation of what the check does, or ``null`` if unknown.
 * Prefer passing both ``source`` and ``check`` from the JSON payload.
 */
export function getHealthcheckCheckDocumentation(
  source: string,
  check: string
): string | null {
  const s = (source || "").trim();
  const c = (check || "").trim();
  if (!c || c === "—") {
    return null;
  }
  const composite = `${s}|${c}`;
  if (HEALTHCHECK_CHECK_DOCS[composite]) {
    return HEALTHCHECK_CHECK_DOCS[composite];
  }
  if (HEALTHCHECK_CHECK_DOCS[c]) {
    return HEALTHCHECK_CHECK_DOCS[c];
  }
  return null;
}
