#!/bin/sh
u
# This file should be sourced from open-browser.sh

declare -a browser_cmd=("firefox" "-P" "$profile_name" "--new-window")
export browser_cmd

MOZILLA_PROFILES="${HOME}/.mozilla/firefox/profiles.ini"
CONTAINER_PROFILE_DIR="${config_dir}/firefox/${profile_name}"

create_profile() {
    [ -d "${CONTAINER_PROFILE_DIR}" ] || mkdir -p "${CONTAINER_PROFILE_DIR}"

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
}

remove_profile() {
    sed -i "/^\# start - Added by freeipa-webui: ${profile_name}$/,/^\# end - Added by freeipa-webui: ${profile_name}/d" "${MOZILLA_PROFILES}"
    rm -rf "${CONTAINER_PROFILE_DIR}"
}
