#!/bin/bash -eux

SCRIPTDIR="$(dirname $(realpath "$0"))"
TOPDIR="$(dirname "${SCRIPTDIR}")"

die() {
    >&2 echo $*
    exit 1
}

detach() {
    nohup "$@" >/dev/null 2>&1 </dev/null &
}

usage() {
    cat <<EOF
usage: $(basename "$0") [-c CONTAINER] [-p PROFILE] [-r] [URL]"

Open URL in Firefox with the given profile (defaults to 'freeipa-webui').

Options:

    -b BRWOSER     browser to open {firefox, chrome}
    -p PROFILE     use the given profile name
    -c CONTAINER   Import IPA CA root from CONTAINER
    -r             remove the profile

EOF
}

get_default_browser() {
    if command -v xdg-settings >/dev/null
    then
        local default_browser="$(xdg-settings get default-web-browser)"
        grep -q -v "firefox" <<< "${default_browser}" \
            && echo "firefox" && return 0
        grep -q -v "chrome" <<< "${default_browser}" \
            && echo "crome" && return 0
    fi
    return 1
}

copy_certificate() {
    ipa_ca_node="${1:-}"
    CERTUTIL="$(command -v certutil)"
    if [ -n "${CERTUTIL}" ] && [ -n "${ipa_ca_node}" ]
    then
        has_container="$(podman ps -f "name=${ipa_ca_node}" --format "{{.Names}}")"
        if [ -n "${has_container}" ]
        then
            if [ ! -f "${CONTAINER_PROFILE_DIR}/cert9.db" ]
            then
                certutil -N --empty-password -d "${CONTAINER_PROFILE_DIR}"
            fi

            certificate_name="Certificate Authority - IPA dev ${profile_name}"
            if grep -q "${certificate_name}" <(certutil -L -d "${CONTAINER_PROFILE_DIR}")
            then
                certutil -D -d "${CONTAINER_PROFILE_DIR}" -n "${certificate_name}"
            fi
            podman cp ${ipa_ca_node}:/etc/ipa/ca.crt "${CONTAINER_PROFILE_DIR}/ca.crt"
            certutil -A \
                -i "${CONTAINER_PROFILE_DIR}/ca.crt" \
                -d "${CONTAINER_PROFILE_DIR}" \
                -n "${certificate_name}" \
                -t "CT,C,"
        fi
    fi
}

config_dir="${HOME}/.config/webui-dev-env"
browser="$(get_default_browser || echo "firefox")"
profile_name="webui-profile"
cmd="open"
ipa_ca_node="webui"

[ -d "${config_dir}" ] || mkdir -p "${config_dir}"

while getopts ":hb:c:p:r" option
do
    case "${option}" in
        h) usage && exit 0 ;;
        b) browser="${OPTARG}" ;;
        c) ipa_ca_node="${OPTARG}" ;;
        p) profile_name="${OPTARG}" ;;
        r) cmd="remove" ;;
        *) die -u "Invalid option: ${OPTARG}" ;;
    esac
done
shift "$((OPTIND - 1))"

[ $# -gt 1 ] && die "Only one URL can be used."

echo "Using profile ${profile_name}"
export profile_name

source "${SCRIPTDIR}/${browser}_config.sh" \
    || die "Can't find '${browser}' config script."

if [ "$cmd" == "remove" ]
then
    remove_profile
    exit
else
    create_profile
    [ -z "${ipa_ca_node:-}" ] || copy_certificate "${ipa_ca_node}"
    detach podman unshare --rootless-netns "${browser_cmd[@]}" "$@"
fi

