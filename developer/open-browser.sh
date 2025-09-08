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
usage: $(basename "$0") [-r] [-w] [-b BROWSER] [-c CONTAINER] [-p PROFILE] [URL]"

Open URL in Firefox with the given profile (defaults to 'freeipa-webui').

Options:

    -b BROWSER     browser to open {firefox, chrome}
    -p PROFILE     use the given profile name
    -c CONTAINER   Import IPA CA root from CONTAINER
    -r             remove the profile

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

while getopts ":hb:c:p:rw" option
do
    case "${option}" in
        h) usage && exit 0 ;;
        b) browser="${OPTARG}" ;;
        c) ipa_ca_node="${OPTARG}" ;;
        p) profile_name="${OPTARG}" ;;
        r) cmd="remove" ;;
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
    if [ "${use_flatpak_workaround:-}" == "YES" ]
    then
        # shellcheck disable=SC2154
        flatpak_workaround "${browser_cmd[@]}" "$@"
    else
        # shellcheck disable=SC2154
        detach podman unshare --rootless-netns "${browser_cmd[@]}" "$@"
    fi
fi
