#!/bin/bash -eu

IP_LOCAL_NETWORK="192.168.56"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
REPO_DIR="$(realpath "${SCRIPT_DIR}/..")"

log() {
    echo -e "\\033[37;1m${@}\\033[0m"
}

die() {
    [ $# -gt 0 ] && msg="FATAL: $@"
    echo -e "\\033[31;1m${msg:-}\\033[0m"
    exit 1
}

usage() {
    cat <<EOF
usage: $(basename "$0") [-h] [-Bbsr]

Manage FreeIPA WebUI development container.

Options:
    -h      Show this message and exit
    -B      Build local container image and exit
    -b      Force local container image rebuild
    -f      Force fetching container image from external registry
    -r      Start development container (default)
    -s      Stop development container
EOF
}

start_container() {
    local image_id="${1:-"webui-dev:latest"}"
    local container_name="${2-"webui"}"
    log "=== Configuring network: ${IP_LOCAL_NETWORK}.0/24 ==="
    podman network create \
        --disable-dns \
        --subnet "${IP_LOCAL_NETWORK}.0/24" \
        --ignore \
        webui-net > /dev/null || die "Failed to configured network."

    log "=== Starting container for ${image_id} ==="
    podman run \
        -d \
        --rm \
        --name="${container_name}" \
        -v "${REPO_DIR}:/webui:Z" \
        --security-opt label=disable \
        --cap-add SYS_ADMIN --cap-add DAC_READ_SEARCH \
        --network=webui-net:ip="${IP_LOCAL_NETWORK}.10",alias=webui.ipa.test \
        --add-host "webui.ipa.test:${IP_LOCAL_NETWORK}.10" \
        --hostname webui.ipa.test \
        --restart no "${image_id}" > /dev/null || die
}

stop_container() {
    log "=== Stopping container: ${1:-"webui"} ==="
    podman stop "${1:-webui}" > /dev/null && echo "Container stopped."
}

build_container() {
    log "=== Building base image ==="
    # Build base image. This image can be used to deploy FreeIPA
    podman build -t webui-dev:base \
        --build-arg distro_image="fedora" \
        --build-arg distro_tag="latest" \
        -f containerfiles/fedora "${SCRIPT_DIR}"
    # Start build container
    stop_container "webui" >/dev/null 2>/dev/null ||:
    start_container "webui-dev:base"
    # Deploy FreeIPA
    log "=== Deploying FreeIPA ==="
    ansible-playbook -i "${SCRIPT_DIR}/inventory.yml" \
        "${SCRIPT_DIR}/deploy-ipaserver.yml" || die "Failed to deploy IPA"
    # Save image locally
    log "=== Tag: 'webui-dev:latest' ==="
    podman commit "webui" "webui-dev:latest"
    # Stop container
    stop_container "webui"
}

fetch_image() {
    [ -z "${1:-}" ] && return 1
    podman pull "${1}"
}

is_container_running() {
    local name="${1:-"webui"}"
    test "${name}" == "$(podman ps -f "name=${name}" --format "{{.Names}}")"
}

default_image="quay.io/ansible-freeipa/webui-dev:latest"
image_id="$(podman images -f "reference=webui-dev:latest" --format="{{ .Id }}")"
[ -z "${image_id}" ] && fetch_image="${default_image}" || fetch_image=""
action="start"

while getopts ":hBbfrs" option "$@"
do
    case "${option}" in
        "h") usage && exit ;;
        "B") build_container && exit ;;
        "b") image_id="" ; fetch_image="" ;;
        "f") fetch_image="${default_image}" ;;
        "r") action="start" ;;
        "s") action="stop" ;;
        *) die "Invalid option: ${OPTARG}" ;;
    esac
done

case "${action}" in
    "start")
        if is_container_running "webui"
        then
            log "Container is already running."
        else
            if [ -n "${fetch_image}" ]
            then
                fetch_image "${fetch_image}" && image_id="$(basename "${fetch_image}")"
            fi
            [ -z "${image_id}" ] && build_container
            start_container "${image_id:-"webui-dev:latest"}"
        fi
        ;;
    "stop") is_container_running "webui" && stop_container "webui" ;;
    *) die "Invalid action: $action" ;;  # there's a bug in the code
esac
