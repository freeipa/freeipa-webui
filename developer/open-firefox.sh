#!/bin/bash

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

    -p PROFILE     use the given profile name
    -c CONTAINER   Import IPA CA root from CONTAINER
    -r             remove the profile

EOF
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
                echo "Removing CERT"
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


MOZILLA_PROFILES="${HOME}/.mozilla/firefox/profiles.ini"

profile_name="webui-profile"
cmd="open"
ipa_ca_node="webui"

while getopts ":hc:p:r" option
do
    case "${option}" in
        h) usage && exit 0 ;;
        c) ipa_ca_node="${OPTARG}" ;;
        p) profile_name="${OPTARG}" ;;
        r) cmd="remove" ;;
        *) die -u "Invalid option: ${OPTARG}" ;;
    esac
done
shift "$((OPTIND - 1))"

[ $# -gt 1 ] && die "Only one URL can be used. (Didn't you forgot '-p'?)"

echo "Using profile ${profile_name}"

CONTAINER_PROFILE_DIR="${HOME}/.mozilla/firefox/${profile_name}"

if [ "$cmd" == "remove" ]
then
    sed -i "/^\# start - Added by freeipa-webui: ${profile_name}$/,/^\# end - Added by freeipa-webui: ${profile_name}/d" "${MOZILLA_PROFILES}"
    rm -rf "${CONTAINER_PROFILE_DIR}"
    exit
fi

[ -d "${CONTAINER_PROFILE_DIR}" ] || mkdir "${CONTAINER_PROFILE_DIR}"
[ -z "${ipa_ca_node:-}" ] || copy_certificate "${ipa_ca_node}"

if ! grep -q "Name=${profile_name}" "${MOZILLA_PROFILES}"
then
    echo "Creating Firefox profile: ${profile_name}"

    next_profile=$(echo $(($(cat "${MOZILLA_PROFILES}" | sed -n 's/\[Profile\([^\]]*\)\]/\1/p' | sort -n | tail -n 1) + 1)))

    cat <<EOF | cat - "${MOZILLA_PROFILES}" | tee "${MOZILLA_PROFILES}" >/dev/null
# start - Added by freeipa-webui: ${profile_name}
[Profile${next_profile}]
Name=${profile_name}
IsRelative=0
Path=${CONTAINER_PROFILE_DIR}
# end - Added by freeipa-webui: ${profile_name}

EOF

fi

[ -z "$@" ] || detach podman unshare --rootless-netns firefox -P "$profile_name" --new-window "$@"
