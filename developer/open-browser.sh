#!/bin/bash -eu

# shellcheck disable=SC2312
SCRIPTDIR="$(dirname "$(realpath "$0")")"
# shellcheck disable=SC2034
TOPDIR="$(dirname "${SCRIPTDIR}")"

die() {
    >&2 echo -en "\033[31;1mFATAL: $*\033[0m\n"
    exit 1
}

quiet() {
    "$@" >/dev/null 2>&1
}

detach() {
    nohup "$@" >/dev/null 2>&1 </dev/null &
}

usage() {
    cat <<EOF
usage: $(basename "$0") [-r] [-w] [-k] [-b BROWSER] [-c CONTAINER] [-p PROFILE] [URL]"

Open URL in Firefox with the given profile (defaults to 'freeipa-webui').

Options:

    -b BROWSER     browser to open {firefox, chrome}
    -p PROFILE     use the given profile name
    -c CONTAINER   Import IPA CA root from CONTAINER
    -r             remove the profile
    -k             obtain a Kerberos ticket (kinit devadmin) so the browser
                   authenticates via SPNEGO automatically; without this flag
                   the browser opens without a ticket and you must log in
                   with username and password

    -w             Use Flatpak workaround (nsenter)

EOF
}

get_default_browser() {
    if command -v xdg-settings >/dev/null
    then
        local default_browser
        default_browser="$(xdg-settings get default-web-browser)"
        [[ "${default_browser}" =~ firefox ]] && echo "firefox" && return 0
        [[ "${default_browser}" =~ [Cc]hrome ]] && echo "chrome" && return 0
    fi
    return 1
}

#
# When running flatpak versions for browsers it may happen that the
# keyboard does not work if using 'podman-unshare'. The alternative
# is to use 'nsenter'. We assume this is an exception and default to
# 'podman-unshare'. To use 'nsenter', an explicit CLI option (-w)
# must be provided.
#
flatpak_workaround() {
    container_pid=$(podman inspect --format '{{.State.Pid}}' "${ipa_ca_node}")

    if [ -z "${container_pid}" ] || [ "${container_pid}" -le 0 ]; then
         die "Could not retrieve container '${ipa_ca_node}' PID. Is it running?"
    fi

    echo "Using superuser privileges to access container network."
    sudo nsenter -t "${container_pid}" --net -- \
        sudo -u "${USER}" \
        HOME="${HOME}" \
        DISPLAY="${DISPLAY:-}" \
        WAYLAND_DISPLAY="${WAYLAND_DISPLAY:-}" \
        XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-}" \
        DBUS_SESSION_BUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS:-}" \
        nohup bash -c 'exec "$@"' -- "$@" >/dev/null 2>&1 </dev/null
}

copy_certificate() {
    ipa_ca_node="${1:-}"
    local profile_dir
    # shellcheck disable=SC2154
    profile_dir="${CONTAINER_PROFILE_DIR}"
    CERTUTIL="$(command -v certutil)"
    if [ -n "${CERTUTIL}" ] && [ -n "${ipa_ca_node}" ]
    then
        has_container="$(podman ps -f "name=${ipa_ca_node}" --format "{{.Names}}")"
        if [ -n "${has_container}" ]
        then
            if [ ! -f "${profile_dir}/cert9.db" ]
            then
                certutil -N --empty-password -d "${profile_dir}"
            fi

            certificate_name="Certificate Authority - IPA dev ${profile_name}"
            if grep -q "${certificate_name}" <(certutil -L -d "${profile_dir}")
            then
                certutil -D -d "${profile_dir}" -n "${certificate_name}"
            fi
            podman cp "${ipa_ca_node}:/etc/ipa/ca.crt" "${profile_dir}/ca.crt"
            certutil -A \
                -i "${profile_dir}/ca.crt" \
                -d "${profile_dir}" \
                -n "${certificate_name}" \
                -t "CT,C,"
        fi
    else
        [ -z "${CERTUTIL}" ] && echo -e "\033[36mINFO: To trust IPA certificate, install \`certutil\`\033[0m"
        [ -z "${ipa_ca_node}" ] && echo -e "\033[33;1mWARN: IPA container name not defined\033[0m"
    fi
}

config_dir="${HOME}/.config/webui-dev-env"
[ -d "${config_dir}" ] || mkdir -p "${config_dir}"

browser="$(get_default_browser || echo "firefox")"
profile_name="webui-profile"
cmd="open"
ipa_ca_node="webui"

while getopts ":hb:c:p:rkw" option
do
    case "${option}" in
        h) usage && exit 0 ;;
        b) browser="${OPTARG}" ;;
        c) ipa_ca_node="${OPTARG}" ;;
        p) profile_name="${OPTARG}" ;;
        r) cmd="remove" ;;
        k) use_kerberos="YES" ;;
        w) use_flatpak_workaround="YES" ;;
        *) die -u "Invalid option: ${OPTARG}" ;;
    esac
done
shift "$((OPTIND - 1))"

[ $# -gt 1 ] && die "Only one URL can be used."

# shellcheck disable=SC1090
source "${SCRIPTDIR}/${browser}_config.sh" \
    || die "Can't find '${browser}' config script."

export profile_name

if [ "${cmd}" == "remove" ]
then
    remove_profile
    exit
else
    create_profile
    [ -z "${ipa_ca_node:-}" ] || copy_certificate "${ipa_ca_node}"

    # Set up Kerberos for SPNEGO authentication (used by ahdapa and IPA).
    # Only runs when -k is passed. Without -k the browser opens without a
    # Kerberos ticket, so the user must log in with username and password.
    # With -k, kinit devadmin obtains a TGT and the browser authenticates
    # automatically via SPNEGO (Negotiate).
    setup_kerberos() {
        local ipa_hostname ipa_realm krb5_conf krb5_ccname krb5_wrapper
        ipa_hostname="$(podman exec "${ipa_ca_node}" hostname -f 2>/dev/null)" || return 1
        ipa_realm="$(podman exec "${ipa_ca_node}" \
            python3 -c "from ipalib import api; api.bootstrap(); print(api.env.realm)" 2>/dev/null)" \
            || return 1
        krb5_conf="${config_dir}/krb5.conf"
        krb5_ccname="${config_dir}/krb5cc"
        cat > "${krb5_conf}" << EOF
[libdefaults]
default_realm = ${ipa_realm}
dns_lookup_realm = false
dns_lookup_kdc = false
rdns = false

[realms]
${ipa_realm} = {
    kdc = ${ipa_hostname}
    admin_server = ${ipa_hostname}
}

[domain_realm]
.${ipa_hostname#*.} = ${ipa_realm}
${ipa_hostname#*.} = ${ipa_realm}
EOF
        export KRB5_CONFIG="${krb5_conf}"
        export KRB5CCNAME="${krb5_ccname}"

        # Create a wrapper script that obtains a Kerberos ticket inside the
        # rootless network namespace (where the KDC is reachable) before
        # launching the browser. Uses devadmin (not admin) to keep the
        # ahdapa session cookie small enough for browsers to store.
        krb5_wrapper="${config_dir}/krb5-browser-wrapper.sh"
        cat > "${krb5_wrapper}" << 'WRAPPER'
#!/bin/bash
if command -v kinit >/dev/null 2>&1; then
    echo "Secret123" | kinit devadmin 2>/dev/null ||:
fi
exec "$@"
WRAPPER
        chmod +x "${krb5_wrapper}"
        KERBEROS_WRAPPER="${krb5_wrapper}"
    }
    if [ "${use_kerberos:-}" == "YES" ]
    then
        setup_kerberos || echo -e "\033[33;1mWARN: Could not configure Kerberos (ahdapa SPNEGO may not work)\033[0m"
    else
        # Remove leftover Kerberos credentials from a previous -k run
        # so the browser cannot accidentally authenticate via SPNEGO.
        rm -f "${config_dir}/krb5cc"
    fi

    if [ "${use_flatpak_workaround:-}" == "YES" ]
    then
        # shellcheck disable=SC2154
        flatpak_workaround "${browser_cmd[@]}" "$@"
    else
        if [ -n "${KERBEROS_WRAPPER:-}" ]
        then
            # shellcheck disable=SC2154
            detach podman unshare --rootless-netns "${KERBEROS_WRAPPER}" "${browser_cmd[@]}" "$@"
        else
            # shellcheck disable=SC2154
            detach podman unshare --rootless-netns "${browser_cmd[@]}" "$@"
        fi
    fi
fi
