#!/bin/bash

# This file should be sourced from open-browser.sh

verify_flatpak_permissions() {
    err_msg=$(echo -e "Flatpak application requires permission to write to the home directory.\n" \
                      "\033[0m\rTo provide necessary permissions, run:\n" \
		      "\033[37;1m\r\tflatpak override -u --filesystem=home ${1}")

    echo "ERR: ${err_msg}"

    flatpack_info="$(flatpak info --show-permissions "${1}")"

    grep -q "filesystems.*[;=]home[;:]" <<< "${flatpack_info}" || die "${err_msg}"
    grep -q "filesystems.*[;=]home:ro" <<< "${flatpack_info}" && die "${err_msg}"
}

MOZILLA_PROFILES="${HOME}/.mozilla/firefox/profiles.ini"
# shellcheck disable=SC2154
CONTAINER_PROFILE_DIR="$(dirname "${MOZILLA_PROFILES}")/${profile_name}"

declare -a browser_cmd
if quiet command -v firefox && [ "${FORCE_FLATPAK:-"0"}" -ne "1" ]
then
    browser_cmd=("firefox" "-P" "${profile_name}" "--new-window")
else
    flatpak_app="org.mozilla.firefox"
    quiet flatpak info "${flatpak_app}" || die "Cannot find Firefox executable"
    verify_flatpak_permissions "${flatpak_app}"
    browser_cmd=("flatpak" "run" "org.mozilla.firefox" "-P" "${profile_name}" "--new-window")
fi
export browser_cmd

create_profile() {
    [ -f "${MOZILLA_PROFILES}" ] || die "Please run Firefox once, to setup basic environment."
    [ -d "${CONTAINER_PROFILE_DIR}" ] || mkdir "${CONTAINER_PROFILE_DIR}"

    if ! grep -q "Name=${profile_name}" "${MOZILLA_PROFILES}"
    then
        next_profile=$(($(sed -n 's/\[Profile\([^\]]*\)\]/\1/p' <"${MOZILLA_PROFILES}" | sort -n | tail -n 1 ||:) + 1))

        echo "Creating Firefox Profile${next_profile}: ${profile_name}"

        local orig_profiles
        orig_profiles="$(cat "${MOZILLA_PROFILES}")"
        local new_profile
        new_profile="$(cat <<EOF
# start - Added by freeipa-webui: ${profile_name}
[Profile${next_profile}]
Name=${profile_name}
IsRelative=0
Path=${CONTAINER_PROFILE_DIR}
# end - Added by freeipa-webui: ${profile_name}

EOF
)"
        echo -e "${new_profile}\n${orig_profiles}" >"${MOZILLA_PROFILES}"
    fi
}

remove_profile() {
    sed -i "/^\# start - Added by freeipa-webui: ${profile_name}$/,/^\# end - Added by freeipa-webui: ${profile_name}/d" "${MOZILLA_PROFILES}"
    rm -rf "${CONTAINER_PROFILE_DIR}"
}
