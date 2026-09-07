# Converts Python types to TypeScript types
TYPES_MAP: dict[str, str] = {
    "Certificate": "Certificate",
    "CertificateSigningRequest": "CertificateSigningRequest",
    "dict": "Record<string, unknown>",
    "DN": "DN",
    "DNSName": "DNSName",
    "Decimal": "Decimal",
    "Principal": "Principal",
    "bool": "boolean",
    "bytes": "Bytes",
    "datetime": "DateTime",
    "int": "number",
    "object": "object",
    "str": "string",
}

_FILES: set[str] = frozenset(
    "aci",
    "automember",
    "automountkey",
    "automountlocation",
    "automountmap",
    "ca",
    "caacl",
    "cert",
    "certmap",
    "certmapconfig",
    "certmaprule",
    "certprofile",
    "class",
    "command",
    "config",
    "cosentry",
    "delegation",
    "dns",
    "dnsconfig",
    "dnsforwardzone",
    "dnsrecord",
    "dnsserver",
    "dnszone",
    "group",
    "hbacrule",
    "hbacsvc",
    "hbacsvcgroup",
    "host",
    "hostgroup",
    "idoverridegroup",
    "idoverrideuser",
    "idp",
    "idrange",
    "idview",
    "krbtpolicy",
    "location",
    "netgroup",
    "otpconfig",
    "otptoken",
    "output",
    "param",
    "passkeyconfig",
    "pkinit",
    "permission",
    "privilege",
    "pwpolicy",
    "radiusproxy",
    "realmdomains",
    "role",
    "selfservice",
    "selinuxusermap",
    "server",
    "service",
    "servicedelegationrule",
    "servicedelegationtarget",
    "stageuser",
    "subid",
    "sudocmd",
    "sudocmdgroup",
    "sudorule",
    "sysaccount",
    "topic",
    "topologysegment",
    "topologysuffix",
    "trust",
    "trustconfig",
    "trustdomain",
    "user",
    "vault",
    "vaultconfig",
    "vaultcontainer",
)


def _extract_prefix(name: str) -> str:
    """
    Extract the first word till _ in the string
    """
    return name.split("_", 1)[0]


def get_file_name(name: str) -> str:
    prefix = _extract_prefix(name)
    return prefix + ".ts" if prefix in _FILES else "utils"


def convert_name(name: str) -> str:
    """
    Convert from snake_case to PascalCase.
    """
    return name.title().replace("_", "")
