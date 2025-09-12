#!/bin/bash

# This file should be sourced from open-browser.sh

verify_flatpak_permissions() {
    if ! grep -q "filesystems=home;" <(flatpak override -u --show "${1}" ||:)
    then
        die "Flatpak application requires permission for the home directory.\n" \
            "\033[0m\rTo provide necessary permissions, run:\n" \
            "\033[37;1m\r\tflatpak override -u --filesystem=home ${1}"
    fi
}

MOZILLA_PROFILES="${HOME}/.mozilla/firefox/profiles.ini"
# shellcheck disable=SC2154
CONTAINER_PROFILE_DIR="${config_dir}/firefox/${profile_name}"

declare -a browser_cmd
if quiet command -v firefox
then
    browser_cmd=("firefox" "-P" "${profile_name}" "--new-window")
else
    flatpak_app="org.mozilla.firefox"
    quiet flatpak info "${flatpak_app}" || die "Cannot find Firefox executable"
    if ! grep -q "filesystems=home;" <(flatpak override -u --show org.mozilla.firefox ||:)
    then
        flatpak_error "${flatpak_app}"
    fi
    browser_cmd=("flatpak" "run" "org.mozilla.firefox" "-P" "${profile_name}" "--new-window")
fi
export browser_cmd

create_profile() {
    [ -d "${CONTAINER_PROFILE_DIR}" ] || mkdir -p "${CONTAINER_PROFILE_DIR}"

    if ! grep -q "Name=${profile_name}" "${MOZILLA_PROFILES}"
    then
        echo "Creating Firefox profile: ${profile_name}"

        next_profile=$(($(sed -n 's/\[Profile\([^\]]*\)\]/\1/p' <<< "${MOZILLA_PROFILES}" | sort -n | tail -n 1 ||:) + 1))

        cat <<EOF | cat - "${MOZILLA_PROFILES}" | tee "${MOZILLA_PROFILES}" >/dev/null ||:
# start - Added by freeipa-webui: ${profile_name}
[Profile${next_profile}]
Name=${profile_name}
IsRelative=0
Path=${CONTAINER_PROFILE_DIR}
# end - Added by freeipa-webui: ${profile_name}

EOF
    fi
}

remove_profile() {
    sed -i "/^\# start - Added by freeipa-webui: ${profile_name}$/,/^\# end - Added by freeipa-webui: ${profile_name}/d" "${MOZILLA_PROFILES}"
    rm -rf "${CONTAINER_PROFILE_DIR}"
}
