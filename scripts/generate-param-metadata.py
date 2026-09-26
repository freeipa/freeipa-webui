#!/usr/bin/env python3

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import TextIO

TYPES_MAP = {
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

FILES = {
    "aci": "aci.ts",
    "automember": "automember.ts",
    "automountkey": "automountkey.ts",
    "automountlocation": "automountlocation.ts",
    "automountmap": "automountmap.ts",
    "ca": "ca.ts",
    "caacl": "caacl.ts",
    "cert": "cert.ts",
    "certmap": "certmap.ts",
    "certmapconfig": "certmapconfig.ts",
    "certmaprule": "certmaprule.ts",
    "certprofile": "certprofile.ts",
    "class": "class.ts",
    "command": "command.ts",
    "config": "config.ts",
    "cosentry": "cosentry.ts",
    "delegation": "delegation.ts",
    "dns": "dns.ts",
    "dnsconfig": "dnsconfig.ts",
    "dnsforwardzone": "dnsforwardzone.ts",
    "dnsrecord": "dnsrecord.ts",
    "dnsserver": "dnsserver.ts",
    "dnszone": "dnszone.ts",
    "group": "group.ts",
    "hbacrule": "hbacrule.ts",
    "hbacsvc": "hbacsvc.ts",
    "hbacsvcgroup": "hbacsvcgroup.ts",
    "host": "host.ts",
    "hostgroup": "hostgroup.ts",
    "idoverridegroup": "idoverridegroup.ts",
    "idoverrideuser": "idoverrideuser.ts",
    "idp": "idp.ts",
    "idrange": "idrange.ts",
    "idview": "idview.ts",
    "krbtpolicy": "krbtpolicy.ts",
    "location": "location.ts",
    "netgroup": "netgroup.ts",
    "otpconfig": "otpconfig.ts",
    "otptoken": "otptoken.ts",
    "output": "output.ts",
    "param": "param.ts",
    "passkeyconfig": "passkeyconfig.ts",
    "pkinit": "pkinit.ts",
    "permission": "permission.ts",
    "privilege": "privilege.ts",
    "pwpolicy": "pwpolicy.ts",
    "radiusproxy": "radiusproxy.ts",
    "realmdomains": "realmdomains.ts",
    "role": "role.ts",
    "selfservice": "selfservice.ts",
    "selinuxusermap": "selinuxusermap.ts",
    "server": "server.ts",
    "service": "service.ts",
    "servicedelegationrule": "servicedelegationrule.ts",
    "servicedelegationtarget": "servicedelegationtarget.ts",
    "stageuser": "stageuser.ts",
    "subid": "subid.ts",
    "sudocmd": "sudocmd.ts",
    "sudocmdgroup": "sudocmdgroup.ts",
    "sudorule": "sudorule.ts",
    "sysaccount": "sysaccount.ts",
    "topic": "topic.ts",
    "topologysegment": "topologysegment.ts",
    "topologysuffix": "topologysuffix.ts",
    "trust": "trust.ts",
    "trustconfig": "trustconfig.ts",
    "trustdomain": "trustdomain.ts",
    "user": "user.ts",
    "vault": "vault.ts",
    "vaultconfig": "vaultconfig.ts",
    "vaultcontainer": "vaultcontainer.ts",
}


def extract_prefix(name: str) -> str:
    """
    Extract the first word till _ in the string
    """
    i = 1
    while i < len(name) and name[i] != "_":
        i += 1

    return name[:i]


def get_file_name(name: str) -> str:
    prefix = extract_prefix(name)
    return FILES.get(prefix, "utils.ts")


def convert_name(name: str) -> str:
    """
    Convert from snake_case to PascalCase.
    """
    new_name = name[0].upper()
    next_upper = False
    for char in name[1:]:
        if next_upper:
            new_name += char.upper()
            next_upper = False
        elif char == "_":
            next_upper = True
        else:
            next_upper = False
            new_name += char

    return new_name


def is_optional(param) -> bool:
    return param["required"] == False


def values(param) -> str:
    if param["class"] == "StrEnum":
        return " | ".join(f'"{value}"' for value in param["values"])
    if param["class"] == "IntEnum":
        return " | ".join(f"{value}" for value in param["values"])
    return TYPES_MAP[param["type"]]


def write_attribute(f: TextIO, name: str, args) -> None:
    f.write(f"  {name}")
    if is_optional(args):
        f.write("?")
    f.write(": ")
    f.write(values(args))
    f.write(";\n")


def write_file(file_path: Path, name: str, obj: dict) -> None:
    with open(file_path, "a") as f:
        name = convert_name(name)

        if len(obj["takes_args"]) == 0:
            f.write(f"export type {name}Args = null;\n\n")
        else:
            f.write(f"export type {name}Args = {{\n")
            for args in obj["takes_args"]:
                # For some reason env only has variables*, whatever that means...
                if type(args) == str and args == "variables*":
                    f.write(f"  variables?: string[];\n")
                    continue

                inner_name = args["name"]
                write_attribute(f, inner_name, args)

            f.write("};\n\n")

        if len(obj["takes_options"]) == 0:
            f.write(f"export type {name}Options = null;\n\n")
        else:
            f.write(f"export type {name}Options = {{\n")

            for args in obj["takes_options"]:
                inner_name = args["name"]
                write_attribute(f, inner_name, args)

            f.write("};\n\n")


@dataclass
class ProgramArguments:
    prefix: Path
    response: Path
    commands: bool


def parse_arguments() -> ProgramArguments:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--prefix",
        type=Path,
        default=Path("../src/services/requests"),
        help="The prefix folder to store the request types",
    )
    parser.add_argument(
        "response",
        type=Path,
        metavar="RESPONSE_FILE",
        help="The response file to parse, can be be obtained through json_metadata command.",
    )
    parser.add_argument(
        "-c",
        "--commands",
        action="store_true",
        default=False,
        help="Generate request types for commands instead of methods.",
    )
    return ProgramArguments(**vars(parser.parse_args()))


if __name__ == "__main__":
    program_args = parse_arguments()

    program_args.prefix.mkdir(parents=True, exist_ok=True)
    data = json.load(program_args.response.open())

    needle = "commands" if program_args.commands else "methods"
    with open(program_args.prefix / "index.ts", "a") as index_file:
        index_file.write("export type RequestMap = {\n")

        for name, obj in data["result"][needle].items():
            file_name = get_file_name(name)
            file_path = program_args.prefix / file_name

            write_file(file_path, name, obj)

            index_file.write(f"  {name}: ")
            index_file.write("{ ")
            index_file.write(f"args: {convert_name(name)}Args; ")
            index_file.write(f"options: {convert_name(name)}Options; ")
            index_file.write("};\n")

        index_file.write("};\n")
