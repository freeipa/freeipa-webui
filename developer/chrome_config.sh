#!/bin/sh

# This file should be sourced from open-browser.sh

CONTAINER_PROFILE_DIR="${config_dir}/chrome/${profile_name}"

declare -a browser_cmd=("google-chrome" "--user-data-dir=\"${CONTAINER_PROFILE_DIR}\"" "--no-sandbox" "--new-window")
export browser_cmd

remove_profile() {
    [ -d "${CONTAINER_PROFILE_DIR}" ] && rm -rf "${CONTAINER_PROFILE_DIR}"
}

create_profile() {
    [ -d "${CONTAINER_PROFILE_DIR}" ] || mkdir -p "${CONTAINER_PROFILE_DIR}"
}
