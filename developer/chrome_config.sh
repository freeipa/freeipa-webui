#!/bin/bash

# This file should be sourced from open-browser.sh

# shellcheck disable=SC2154
CONTAINER_PROFILE_DIR="${config_dir}/chrome/${profile_name}"

declare -a browser_cmd
if quiet command -v google-chrome
then
    browser_cmd=("google-chrome" "--user-data-dir=${CONTAINER_PROFILE_DIR}" "--no-sandbox" "--new-window")
else
    die "Cannot find google-chorome executable. Chrome flatpak is not supported."
fi
export browser_cmd

remove_profile() {
    [ -d "${CONTAINER_PROFILE_DIR}" ] && rm -rf "${CONTAINER_PROFILE_DIR}"
}

create_profile() {
    [ -d "${CONTAINER_PROFILE_DIR}" ] || mkdir -p "${CONTAINER_PROFILE_DIR}"
}
